util.namespace('util.example.modal');

/**
 * Example app using a store.
 * @module util.example.modal
 * @requires jQuery
 */
util.example.modal = (($, React, ReactDOM) => {
  
  // PRIVATE VARS
  let _initialized = false;
  
  /** Redux style data store. */
  let _store;
  
  /**
   * Stateless function component as the app root element.
   * @private
   */
  let _view = (props) => {
    
    let {model, dispatch} = props;
    let {title, showing} = model;
    
    let show = (e) => {
      let action = { type: showing ? 'close' : 'open' };
      dispatch(action);
    };
    
    return (
      <div>
        <div className={!showing ? 'hide' : ''}>
          <h1>{title}</h1>
        </div>
        <button onClick={show}>Toggle Header</button>
      </div>
    );
  };
  
  // PUBLIC API
  let mod = {};
  
  /**
   * Initialize our app:
   * - create store with initial state
   * - subscribe to store
   * - render
   */
  mod.init = () => {
    
    if (_initialized) return;
    
    let initial = { title: 'My Awesome Modal' };
    
    _store = util.store.create('example', initial);
    
    // Function to render the app.
    let render = () => {
      let model = _store.getState();
      let dispatch = _store.dispatch;
      
      ReactDOM.render(<_view model={model} dispatch={dispatch}/>, document.getElementById('my-react-app'));
    };
    
    // Subscribe to store changes with our render function.
    _store.subscribe(render);
    render(); // Render the app initially.
    
    _initialized = true;
  };
  
  /**
   * Returns the app store.
   */
  mod.getStore = () => {
    return _store;
  };
  
  return mod;
  
})(window.jQuery, React, ReactDOM);

// Initialize our app
util.example.modal.init();


