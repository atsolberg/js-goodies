util.namespace('util.ui');

/**
 * Module to house common ui behavior for the site.
 * @module util.ui
 * @requires jQuery
 */
util.ui = (function($) {
  
  'use strict';
  
  // Public API of this module.
  let module = {};
  
  /** Scroll a container to an element. */
  module.scrollTo = function (target /*, container */) {
    
    target = $(target);
    let container = $(arguments[1] || 'html, body');
    let to = target.offset().top - container.offset().top + container.scrollTop();
    
    container.animate({ scrollTop: to }, util.const.timing.scroll);
  };
  
  /** Hookup some common event handlers for all pages. */
  module.autowire = function () {
    
    /** Follow the [data-href] value on clicks of elements with this attribute. */
    $(document).on('click', '[data-href]', function (e) {
      e.preventDefault();
      window.location.href = $(this).data('href');
      return false;
    });
    
    /** Scroll To - Handle clicks on [data-scroll-to] elements. */
    $(document).on('click', '[data-scroll-to]', function () {
      
      let trigger = $(this);
      let target = $(trigger.data('scrollTo'));
      let container = $(trigger.data('scrollToContainer'));
      
      module.scrollTo(target, container);
    });
    
    /**
     * Simple Toggle List - Hide/show list items of '.js-toggle-list' list.
     * Listen only on '.js-toggle' elements to allow for other clickable elements
     * inside the list items.
     */
    $(document).on('click touch', '.js-toggle-list .js-toggle', function () {
      
      let toggle = $(this);
      let item = toggle.closest('.js-toggle-item');
      if (!item.length) item = toggle.closest('li');
      
      item.toggleClass('collapsed');
    });
    
  };
  
  return module;
  
})(window.jQuery);

$(function () { util.ui.autowire(); });