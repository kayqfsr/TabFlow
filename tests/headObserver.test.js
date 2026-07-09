/**
 * @jest-environment jsdom
 */
const { waitForHead } = require('../src/lib/headObserver.cjs');

describe('waitForHead', () => {
  test('invokes the callback immediately when <head> already exists', () => {
    const callback = jest.fn();
    waitForHead(document, callback);
    expect(callback).toHaveBeenCalledWith(document.head);
  });

  test('waits for <head> to be inserted before invoking the callback', () => {
    document.documentElement.removeChild(document.head);
    const callback = jest.fn();

    waitForHead(document, callback);
    expect(callback).not.toHaveBeenCalled();

    const head = document.createElement('head');
    document.documentElement.appendChild(head);

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(head);
        resolve();
      }, 0);
    });
  });

  test('falls back to DOMContentLoaded when <html> itself does not exist yet', () => {
    const fakeDoc = {
      head: null,
      documentElement: null,
      listeners: {},
      addEventListener(type, handler) {
        this.listeners[type] = handler;
      },
      removeEventListener(type) {
        delete this.listeners[type];
      },
    };
    const callback = jest.fn();

    waitForHead(fakeDoc, callback);
    expect(callback).not.toHaveBeenCalled();

    fakeDoc.documentElement = document.createElement('html');
    fakeDoc.head = document.createElement('head');
    fakeDoc.listeners.DOMContentLoaded();

    expect(callback).toHaveBeenCalledWith(fakeDoc.head);
  });

  test('only invokes the callback once even if <head> mutates further', () => {
    document.documentElement.removeChild(document.head);
    const callback = jest.fn();

    waitForHead(document, callback);
    const head = document.createElement('head');
    document.documentElement.appendChild(head);
    document.documentElement.appendChild(document.createElement('body'));

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        resolve();
      }, 0);
    });
  });
});
