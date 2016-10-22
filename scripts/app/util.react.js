util.namespace('util.react');

/**
 * Module to house common react components and functionality.
 *
 * @module util.react
 * @requires jQuery
 * @requires classNames
 * @requires React
 * @requires ReactDOM
 * @requires ReactBootstrap
 */
util.react = (function ($, i18n, cx, R, RD, bs) {
  
  let mod = {}; // The module's public API
  
  let PNU = i18n.phonenumbers.PhoneNumberUtil.getInstance();
  let PNF = i18n.phonenumbers.PhoneNumberFormat;
  
  let {Modal, Button} = bs;
  
  let _cc = R.createClass;
  let PropTypes = R.PropTypes;
  
  let _common_text_input_props = {
    label: PropTypes.any,
    id: PropTypes.string,
    
    name: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    
    classes: PropTypes.string,
    wrapperClasses: PropTypes.string
  };
  
  
  /* COMPONENTS
   --------------------------------------------------------------- */
  
  mod.AddressFields = _cc({
    
    displayName: 'AddressFields',
    
    propTypes: {
      address: PropTypes.object.isRequired,
      property: PropTypes.string.isRequired,
      actions: PropTypes.object.isRequired,
      states: PropTypes.array.isRequired
    },
    
    render() {
      
      let {TextInput, ZipInput, PhoneInput} = mod;
      
      let prop = this.props.property;
      let {address, actions} = this.props;
      let {change, dispatch} = actions;
      let states = this.props.states.map((state) => {
        return <option key={state.isocode} value={state.isocode}>{state.name}</option>;
      });
      
      let checkEmail = mod.validators.email(`${prop}.email.error`, dispatch);
      
      return (
          <div>
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <TextInput label="First Name" name="firstName" onChange={change(`${prop}.firstName`)}
                           value={address.firstName.value} error={address.firstName.error}/>
              </div>
              <div className="col-xs-12 col-sm-6">
                <TextInput label="Last Name" name="lastName" onChange={change(`${prop}.lastName`)}
                           value={address.lastName.value} error={address.lastName.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12">
                
                <TextInput label="Address" name="streetAddress" onChange={change(`${prop}.streetAddress`)}
                           value={address.streetAddress.value} error={address.streetAddress.error}/>
                
                <TextInput label="Apt / Suite" desc="(optional)" name="aptOption" onChange={change(`${prop}.aptOption`)}
                           value={address.aptOption.value} error={address.aptOption.error}/>
                
                <TextInput label="City" name="city" onChange={change(`${prop}.city`)}
                           value={address.city.value} error={address.city.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <div className="form-group">
                  <label className="control-label">State</label>
                  <select className="form-control" onChange={change(`${prop}.state`)}
                          value={address.state.value}>{states}</select>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <ZipInput name="zip" onChange={change(`${prop}.zip`)}
                          value={address.zip.value} error={address.zip.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12">
                <TextInput type="email" label="Email" name="email"
                           onChange={change(`${prop}.email`)} onBlur={checkEmail}
                           value={address.email.value} error={address.email.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <PhoneInput name="phone" onChange={change(`${prop}.phone`)}
                            value={address.phone.value} error={address.phone.error}/>
              </div>
            </div>
          </div>
      );
    }
  });
  
  /**
   * A section container with a header and the option for a control
   * to expand the content to full width. Use the `controls` prop
   * to pass your own control components.
   */
  mod.Section = _cc({
    
    displayName: 'Section',
    
    propTypes: {
      title: PropTypes.any.isRequired,
      id: PropTypes.string,
      expandable: PropTypes.bool,
      controls: PropTypes.any
    },
    
    getInitialState() { return { wide: false }; },
    
    toggle() {
      this.setState({ wide: !this.state.wide });
    },
    
    render() {
      
      let {title, id, expandable, controls, children} = this.props,
          {wide} = this.state,
          icon = cx('fa', {
            'fa-expand': !this.state.wide,
            'fa-compress': this.state.wide
          }),
          headerProps = {};
      
      if (id) headerProps.id = id;
      
      return (
          <div>
            <div className="container">
              <h2 {...headerProps}>{title}
                <div className="dib pull-right">
                  {controls}
                  {expandable && (
                      <button type="button" className="btn btn-link" onClick={this.toggle}>
                        <i className={icon}/>
                      </button>
                  )}
                </div>
              </h2>
              <hr className="rule-xs"/>
            </div>
            <div className={cx({ container: !expandable || !wide })}>
              {children}
            </div>
          </div>
      );
    }
    
  });
  
  /**
   * A component that renders a bootstrap form group with a text input.
   * Supports error/validation visualization.
   */
  mod.TextInput = _cc({
    
    displayName: 'TextInput',
    
    propTypes: Object.assign({}, _common_text_input_props, {
      pattern: PropTypes.string,
      autoFocus: PropTypes.string,
      maxLength: PropTypes.string,
      desc: PropTypes.string
    }),
    
    getDefaultProps() {
      return { type: 'text' };
    },
    
    render() {
      
      let {label, classes, wrapperClasses, desc, id, placeholder, autoFocus, pattern, maxLength} = this.props;
      let {type, name, value, onChange, onBlur, onFocus, onKeyUp, error} = this.props;
      let msg = <div className="text-danger" style={{ marginTop: '5px' }}>{error}</div>;
      let inputProps = { onChange, value, ref: 'input' };
      let labelProps = {};
      
      if (id) {
        inputProps.id = id;
        labelProps.htmlFor = id;
      }
      if (name) inputProps.name = name;
      if (onBlur) inputProps.onBlur = onBlur;
      if (onFocus) inputProps.onFocus = onFocus;
      if (onKeyUp) inputProps.onKeyUp = onKeyUp;
      if (placeholder) inputProps.placeholder = placeholder;
      if (pattern) inputProps.pattern = pattern;
      if (maxLength) inputProps.maxLength = maxLength;
      if (autoFocus) inputProps.autoFocus = autoFocus;
      
      return (
          <div className={cx('form-group', { 'has-error' : error }, wrapperClasses)}>
            {label && (<label className="control-label" {...labelProps}>{label}</label>)}
            {desc && (<span className="control-desc"> {desc}</span>)}
            <input type={type} className={cx('form-control', classes)} {...inputProps}
                   onChange={onChange} value={value}/>
            {error && msg}
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap form group with a zip code number input.
   * Supports error/validation visualization.
   */
  mod.ZipInput = _cc({
    
    displayName: 'ZipInput',
    
    propTypes: _common_text_input_props,
    
    render() {
      
      let {label, id, classes, wrapperClasses, placeholder, autoFocus} = this.props;
      let {name, value, onChange, onBlur, onKeyUp, error} = this.props;
      let msg = <div className="text-danger" style={{ marginTop: '5px' }}>{error}</div>;
      let inputProps = { onChange, value, ref: 'input' };
      let labelProps = {};
      
      if (id) {
        inputProps.id = id;
        labelProps.htmlFor = id;
      }
      if (name) inputProps.name = name;
      if (onKeyUp) inputProps.onKeyUp = onKeyUp;
      if (onBlur) inputProps.onBlur = onBlur;
      if (placeholder) inputProps.placeholder = placeholder;
      if (autoFocus) inputProps.autoFocus = autoFocus;
      
      label = label || 'Zip';
      
      return (
          <div className={cx('form-group', { 'has-error' : error }, wrapperClasses)}>
            <label className="control-label" {...labelProps}>{label}</label>
            <input type="text" className={cx('form-control', classes)} {...inputProps}/>
            {error && msg}
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap form group with a phone number input.
   * Supports error/validation visualization.
   */
  mod.PhoneInput = _cc({
    
    displayName: 'PhoneInput',
    
    propTypes: _common_text_input_props,
    
    change(e) {
      
      let {phone} = this.refs;
      try {
        let formatted = PNU.format(PNU.parse(phone.value, 'US'), PNF.NATIONAL);
        phone.value = formatted || '';
      } catch (error) {/* Ignore errors as they type. */}
      
      this.props.onChange(e);
    },
    
    render() {
      
      let {label, id, classes, wrapperClasses, name, value, error, placeholder, autoFocus} = this.props;
      let msg = <div className="text-danger" style={{ marginTop: '5px' }}>{error}</div>;
      let inputProps = { onChange: this.change, value };
      let labelProps = {};
      
      if (id) {
        inputProps.id = id;
        labelProps.htmlFor = id;
      }
      if (name) inputProps.name = name;
      if (autoFocus) inputProps.autoFocus = autoFocus;
      
      label = label || 'Phone';
      
      inputProps.placeholder = placeholder || '';
      
      return (
          <div className={cx('form-group', { 'has-error' : error }, wrapperClasses)}>
            <label className="control-label" {...labelProps}>{label}</label>
            <input ref="phone" type="tel" className={cx('form-control', classes)} {...inputProps}/>
            {error && msg}
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap two button toggle driven by
   * two radio button inputs.
   */
  mod.ToggleInput = _cc({
    
    displayName: 'ToggleInput',
    
    propTypes: {
      label: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      name: PropTypes.string
    },
    
    render() {
      
      let {label, name, value, onChange} = this.props;
      let inputProps = {onChange};
      
      if (name) inputProps.name = name;
      
      return (
          <div className="form-group">
            <label className="control-label">{label}</label>
            <div className="btn-group db clearfix">
              <label className={'btn btn-default' + (value == true  ? ' active' : '')}>
                <input type="radio" value={true} checked={value == true} {...inputProps}/>
                <span className={value == true ? 'text-success' : ''}>Yes</span>
              </label>
              <label className={'btn btn-default' + (value != true  ? ' active' : '')}>
                <input type="radio" value={false} checked={value != true} {...inputProps}/>
                <span className={value != true ? 'text-danger' : ''}>No</span>
              </label>
            </div>
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap looking range input.
   */
  mod.RangeInput = _cc({
    
    displayName: 'RangeInput',
    
    propTypes: {
      id: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      onChange: PropTypes.func,
      decorator: PropTypes.any,
      bsStyle: PropTypes.string,
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      step: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    
    getDefaultProps() {
      return {
        decorator: '%',
        bsStyle: 'primary',
        min: 0,
        max: 100,
        step: 10
      };
    },
    
    render() {
      
      let {id, name, value, onChange, decorator, bsStyle, min, max, step} = this.props,
          inputProps = {};
      
      if (id) inputProps.id = id;
      if (name) inputProps.name = name;
      inputProps.value = value;
      if (onChange) {
        inputProps.onChange = onChange;
        inputProps.onMouseMove = onChange;
      }
      
      return (
          <div className={`range range-${bsStyle}`}>
            <input className="form-control" type="range"
                   min={min} max={max} step={step} value={value} {...inputProps}/>
            <output>{value}{decorator}</output>
          </div>
      );
      
    }
    
  });
  
  /**
   * Produces a table header with sorting indicator.
   * An action is fired on header click.
   * The action type will be `sort` or `<table>.sort` if the
   * `table` prop was provided. `table` prop should be provided when
   * multiple sorting tables are used.
   */
  mod.SortingHeader = _cc({
    
    displayName: 'SortingHeader',
    
    propTypes: {
      label: PropTypes.string.isRequired,
      property: PropTypes.string.isRequired,
      sorting: PropTypes.object.isRequired,
      events: PropTypes.object,
      actions: PropTypes.object,
      table: PropTypes.string
    },
    
    sort() {
      
      let {events, actions, table, property, sorting} = this.props,
          dir = sorting.dir;
      
      if (sorting.by === property) {
        dir = (sorting.dir === 'asc' ? 'desc' : 'asc');
      }
      
      if (actions) {
        // Newer redux style apps
        actions.dispatch({
          type: (table ? table + '.' : '') + 'sort',
          sorting: { by: property, dir: dir }
        });
      } else {
        // Older event based apps
        $(events).trigger(events.NEW, {
          option: (table ? table + '.' : '') + 'sort',
          sorting: { by: property, dir: dir }
        });
      }
    },
    
    render() {
      
      let {label, property, sorting} = this.props,
          classes = ['sorting-header'],
          sorterClasses = ['fa'],
          sorter;
      
      if (sorting.by === property) classes.push('sorting-header--active');
      sorterClasses.push('fa-angle-' + (sorting.dir === 'asc' ? 'up' : 'down'));
      sorter = (<i className={sorterClasses.join(' ')}/>);
      
      return <th className={classes.join(' ')} onClick={this.sort}>{sorter} {label}</th>;
    }
    
  });
  
  /**
   * Iframe component for react. Slightly modified to do some resizing.
   * @see https://github.com/ryanseddon/react-frame-component
   */
  mod.Frame = R.createClass({
    
    displayName: 'Frame',
    
    // React warns when you render directly into the body since browser extensions
    // also inject into the body and can mess up React. For this reason
    // initialContent is expected to have a div inside of the body
    // element that we render react into.
    propTypes: {
      style: PropTypes.object,
      head:  PropTypes.node,
      initialContent:  PropTypes.string
    },
    
    getDefaultProps() {
      return {
        initialContent: '<!DOCTYPE html><html><head></head><body><div></div></body></html>'
      };
    },
    
    originalError: console.error,
    
    // Rendering a <head> into a body is technically invalid although it
    // works. We swallow React's validateDOMNesting warning if that is the
    // message to avoid confusion.
    swallowInvalidHeadWarning() {
      console.error = (msg) => {
        if (/<head>/.test(msg)) return;
        this.originalError.call(console, msg);
      };
    },
    
    resetWarnings() {
      console.error = this.originalError;
    },
    
    render() {
      // The iframe isn't ready so we drop children from props here. #12, #17
      return R.createElement('iframe', Object.assign({}, this.props, {children: undefined}));
    },
    
    componentDidMount() {
      this._isMounted = true;
      this.renderFrameContents();
      setTimeout(() => {
        let frame = RD.findDOMNode(this);
        frame.height = (frame.contentWindow.document.body.scrollHeight + 'px');
      }, 100);
    },
    
    renderFrameContents() {
      if (!this._isMounted) {
        return;
      }
      
      var doc = RD.findDOMNode(this).contentDocument;
      if(doc && doc.readyState === 'complete') {
        var contents = R.createElement('div',
            undefined,
            this.props.head,
            this.props.children
        );
        
        if (!this._setInitialContent) {
          doc.clear();
          doc.open();
          doc.write(this.props.initialContent);
          doc.close();
          this._setInitialContent = true;
        }
        
        this.swallowInvalidHeadWarning();
        // unstable_renderSubtreeIntoContainer allows us to pass this component as
        // the parent, which exposes context to any child components.
        RD.unstable_renderSubtreeIntoContainer(this, contents, doc.body.children[0]);
        this.resetWarnings();
      } else {
        setTimeout(this.renderFrameContents, 0);
      }
    },
    
    componentDidUpdate() {
      this.renderFrameContents();
      setTimeout(() => {
        let frame = RD.findDOMNode(this);
        frame.height = (frame.contentWindow.document.body.scrollHeight + 'px');
      }, 100);
    },
    
    componentWillUnmount() {
      this._isMounted = false;
      
      var doc = RD.findDOMNode(this).contentDocument;
      if (doc) {
        RD.unmountComponentAtNode(doc.body);
      }
    }
  });
  
  /**
   * A generic confirmation modal.
   */
  mod.Confirm = _cc({
    
    displayName: 'Confirm',
    
    propTypes: {
      confirmAction: PropTypes.func.isRequired,
      cancelAction: PropTypes.func.isRequired,
      showing: PropTypes.bool.isRequired,
      classes: PropTypes.string,
      title: PropTypes.string,
      message: PropTypes.any,
      confirmBtnText: PropTypes.string,
      cancelBtnText: PropTypes.string
    },
    
    render() {
      
      let {confirmAction, cancelAction} = this.props;
      let {showing, classes, title, message} = this.props;
      let {confirmBtnText, cancelBtnText} = this.props;
      
      classes = (classes || 'theme-default');
      title = (title || 'Confirm');
      message = (message || 'Are you sure');
      confirmBtnText = (confirmBtnText || 'OK');
      cancelBtnText = (cancelBtnText || 'CANCEL');
      
      return (
          <Modal className={classes} show={showing} onHide={cancelAction}>
            <Modal.Header closeButton={true}>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="padded">{message}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={cancelAction} className="btn-link">{cancelBtnText}</Button>
              <Button onClick={confirmAction} bsStyle="primary">{confirmBtnText}</Button>
            </Modal.Footer>
          </Modal>
      );
    }
    
  });
  
  mod.icons = {
    loaders: {
      Circle1: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
                <path opacity="0.2" fill="#000"
                      d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                       s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                       c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
                <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                                   C22.32,8.481,24.301,9.057,26.013,10.047z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
        );
      },
      
      Circle2: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 50 50" enable-background="new 0 0 50 50">
                <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
        );
      },
      
      Circle3: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 50 50" enable-background="new 0 0 50 50">
                <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
        );
      },
      
      Bars1: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 24" enable-background="new 0 0 50 50">
                <rect x="0" y="0" width="4" height="7" fill="#333">
                  <animateTransform  attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="0" width="4" height="7" fill="#333">
                  <animateTransform  attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="0" width="4" height="7" fill="#333">
                  <animateTransform  attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars2: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars3: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="13" width="4" height="5" fill="#333">
                  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite"/>
                  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="13" width="4" height="5" fill="#333">
                  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite"/>
                  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="13" width="4" height="5" fill="#333">
                  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite"/>
                  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars4: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="7" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="14" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars5: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
        );
      }
    }
  };
  
  
  
  /* METHODS
   --------------------------------------------------------------- */
  
  mod.text = {
    
    /**
     * Weave <br>'s in between each string in an array of strings.
     * Each string in the original array is wrapped in a span to apply a key.
     * @param {String[]} text - The array of strings to weave <br>'s into.
     */
    'break': (text) => {
      return text.reduce((prev, curr, i) => {
        prev.push(<span key={`t-${i}`}>{curr}</span>);
        if (i < text.length -1) prev.push(<br key={`b-${i}`}/>);
        return prev;
      }, []);
    }
    
  };
  
  mod.validators = {
    
    /**
     * Returns a dom event handler (usually for `onBlur`)
     * that dispatches an action if the value is not a valid email.
     * @param {string} type - The action type.
     * @param {function} dispatch - The store dispatcher.
     * @param {string} [msg] - The Error message.
     * @returns {function} - The dom event handler.
     */
    email: (type, dispatch, msg) => {
      return (e) => {
        let {value} = e.target;
        msg = msg || 'Please enter a valid email address.';
        if (!util.validate.email(value)) dispatch({type, value: msg});
      };
    },
    
    /**
     * Returns a dom event handler that dispatches an action value is empty.
     * @param {string} type - The action type.
     * @param {function} dispatch - The store dispatcher.
     * @param {string} [msg] - The Error message.
     * @returns {function} - The dom event handler.
     */
    required: (type, dispatch, msg) => {
      return (e) => {
        let {value} = e.target;
        msg = msg || 'Required';
        if (!value || !value.trim()) dispatch({type, value: msg});
      };
    }
    
  };
  
  return mod;
  
})(jQuery, i18n, classNames, React, ReactDOM, ReactBootstrap);