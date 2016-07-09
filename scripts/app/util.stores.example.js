util.namespace('util.stores.modal');

/**
 * Example store - supporting some theortic modal.
 * @module util.stores.modal
 * @requires jQuery
 */
util.stores.modal = ($ => {

  let _default_state = {
    title: '',
    showing: false
  };

  return {

    /**
     * Store handler to execute store actions.
     * @param {object} state - The store state.
     * @param {object} action - The action to execute.
     * @param {string} action.type - The type of action to execute.
     * @return {object} state - The new state object.
     */
    handle(state = _default_state, action) {

      // Clone state for ghetto immutability.
      state = $.extend(true, {}, state);

      switch (action.type) {

        case 'open':
          state.showing = true;
          break;

        case 'close':
          state.showing = false;
          break;

        case 'title':
          state.title = action.value;
          break;

      }

      return state;
    },

    getDefaultState() {
      return _default_state;
    }
  }
})(window.jQuery);
