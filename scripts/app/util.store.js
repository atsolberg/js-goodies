util.namespace('util.store');

/**
 * Module to create data stores.
 * @module util.store
 * @requires util.stores
 */
util.store = (($) => {
  
  let module = {};
  
  let _css = {
    bold: 'font-weight: bold;',
    normal: 'font-weight: normal;',
    gray: 'color: #9E9E9E;',
    blue: 'color: #03A9F4;',
    green: 'color: #4CAF50;',
    red: 'color: #F20404;'
  };
  
  let _styles = {
    value: `${_css.normal}${_css.blue}`,
    label: `${_css.bold}${_css.gray}`
  };
  
  /**
   * Create a 'ghetto redux wannabe' store.
   * @param {string} name - The name of the store handler this store uses, must exist in `util.stores`.
   * @param {object} [initial] - Initial state value.
   * @returns {object} - The store.
   */
  module.create = (name, initial) => {
    
    let state;
    let logging = util.devMode;
    let listeners = [];
    let handler = util.stores[name];
    
    state = $.extend(true, {}, handler.getDefaultState(), (initial || {}));
    
    /** Retrieve the current state of the store. */
    const getState = () => state;
    
    /** Toggle the logging of state before and after changes. */
    const toggleLogging = () => logging = !logging;
    
    /**
     * Dispatch an action or actions to the action handler,
     * then notify all store listeners.
     * @param {object|object[]} action - The action or array of actions to dispatch.
     */
    const dispatch = (action) => {
      
      let before, after;
      let multi = Array.isArray(action);
      if (logging) before = $.extend(true, {}, state);
      
      if (multi) {
        if (!action.length) return;
        action.forEach(a => { state = handler.handle(state, a); });
      } else {
        state = handler.handle(state, action);
      }
      
      if (logging) {
        
        after = $.extend(true, {}, state);
        let time = util.format.time(new Date());
        let grouper = console.groupCollapsed || console.info;
        let type = multi ? action.map(a => a.type).join(', ') : action.type;
        
        grouper.apply(console, [
          `${time} %cstore: %c${name} %caction${multi ? 's' : ''}: %c${type}`,
          `${_styles.label}`, `${_styles.value}`, `${_styles.label}`, `${_styles.value}`
        ]);
        console.info('%cBefore', `${_css.gray}`, before);
        console.info(`%cAction${multi ? 's' : ''}`, `${_css.blue}`, action);
        console.info('%cAfter', `${_css.green}`, after);
        if (console.groupEnd) console.groupEnd();
      }
      
      listeners.forEach(listener => listener());
    };
    
    /**
     * Returns an event handler function to dispatch actions with a `type` and `value` property.
     * If the first argument is an event, the `value` is pulled from the  event's current target,
     * otherwise the first argument is used as the `value`.
     *
     * Any additional arguments are also included in the action.
     * Useful for creating `onClick` or `onChange` handlers.
     *
     * @param {string} type - The action type.
     * @returns {function()} - The dom event callback.
     */
    const change = function (type) {
      
      let args = [].slice.apply(arguments);
      
      return arg => {
        
        let value = (typeof arg === 'object' && arg.currentTarget ? arg.currentTarget.value : arg);
        let action = {type, value};
        
        if (args.length > 1) {
          let remaining = args.slice(1);
          action = Object.assign(action, { params: remaining });
        }
        
        dispatch(action);
      }
    };
    
    /**
     * Helper method that returns a dom callback just like #change
     * but for react bootstraps' `onSelect` handlers.
     * @param {string} type - The action type.
     * @returns {function(e, value)} - The dom event callback.
     */
    const select = function (type) {
      
      let args = [].slice.apply(arguments);
      
      return (e, value) => {
        
        let action = {type, value};
        if (args.length > 1) action = Object.assign(action, { params: args.slice(1) });
        
        dispatch(action);
      }
    };
    
    /**
     * Register a listener callback to the store.
     * Listeners callbacks are fired after actions are dispatched in the
     * order they were registered.
     * @param {function} listener - The listener callback to register.
     * @returns {function} - A function to unregister the listener.
     */
    const subscribe = (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    };
    
    dispatch({});
    
    let store = {
      name,
      getState,
      subscribe,
      dispatch, change, select,
      toggleLogging
    };
    
    // Add optional store functionality.
    if (util.isFunc(handler, 'getData')) store.getData = handler.getData;
    if (util.prop(handler, 'utils')) store.utils = handler.utils;
    
    return store;
  };
  
  return module;
  
})(jQuery);