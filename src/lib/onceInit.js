// onceInit.js
/**
 * Envolve uma função assíncrona de inicialização para que, não importa
 * quantas vezes seja chamada (mesmo concorrentemente), o trabalho real
 * só aconteça uma vez. Chamadas subsequentes reutilizam a mesma Promise.
 * @param {() => Promise<any>} initFn
 * @returns {() => Promise<any>}
 */
export function createOnceInitializer(initFn) {
  let initPromise = null;

  return function ensureInitialized() {
    if (!initPromise) {
      initPromise = initFn();
    }
    return initPromise;
  };
}
