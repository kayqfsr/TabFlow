const { TabHistoryManager } = require('../src/lib/historyLogic.cjs');

describe('TabHistoryManager', () => {
  let manager;

  beforeEach(() => {
    manager = new TabHistoryManager(3);
  });

  test('should add new tab to the beginning of history', () => {
    manager.activateTab(1);
    expect(manager.getHistory()).toEqual([1]);
  });

  test('should move existing tab to the beginning when activated', () => {
    manager.activateTab(1);
    manager.activateTab(2);
    manager.activateTab(1); // Ativar 1 novamente
    expect(manager.getHistory()).toEqual([1, 2]);
  });

  test('should respect max size limit', () => {
    manager.activateTab(1);
    manager.activateTab(2);
    manager.activateTab(3);
    manager.activateTab(4); // Deve remover 1
    expect(manager.getHistory()).toEqual([4, 3, 2]);
  });

  test('should return correct position', () => {
    manager.activateTab(1);
    manager.activateTab(2);
    manager.activateTab(3);
    expect(manager.getPosition(3)).toBe(0); // Mais recente
    expect(manager.getPosition(2)).toBe(1);
    expect(manager.getPosition(1)).toBe(2);
    expect(manager.getPosition(4)).toBe(-1); // Não existe
  });

  test('should calculate opacity correctly', () => {
    expect(manager.calculateOpacity(0)).toBe(1.0); // 100%
    expect(manager.calculateOpacity(1)).toBe(0.75); // 75%
    expect(manager.calculateOpacity(2)).toBe(0.5); // 50%
    expect(manager.calculateOpacity(3)).toBe(0.5); // Mínimo 50%
    expect(manager.calculateOpacity(-1)).toBe(1); // Sem bolinha
  });

  test('should update max size and trim history if necessary', () => {
    manager.activateTab(1);
    manager.activateTab(2);
    manager.activateTab(3);
    manager.activateTab(4);
    expect(manager.getHistory()).toEqual([4, 3, 2]); // Limite 3

    manager.setMaxSize(2);
    expect(manager.getHistory()).toEqual([4, 3]); // Cortou para 2
  });

  test('should hydrate history from saved state', () => {
    const savedHistory = [10, 20, 30];
    manager.hydrate(savedHistory);
    expect(manager.getHistory()).toEqual([10, 20, 30]);
  });

  test('should respect max size when hydrating', () => {
    const savedHistory = [10, 20, 30, 40, 50];
    manager.hydrate(savedHistory);
    expect(manager.getHistory()).toEqual([10, 20, 30]); // Limite 3
  });

  test('should handle invalid input in hydrate', () => {
    manager.activateTab(1);
    manager.hydrate(null);
    expect(manager.getHistory()).toEqual([1]); // Não muda se input inválido

    manager.hydrate('invalid');
    expect(manager.getHistory()).toEqual([1]); // Não muda se input inválido
  });
});
