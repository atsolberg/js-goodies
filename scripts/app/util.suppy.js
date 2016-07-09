util.namespace('util.suppy');

/**
 * Module to <sup> special characters.
 * @mod util.suppy
 * @requires jQuery
 */
util.suppy = ($ => {

  'use strict';

  let mod = {};

  let _marker = '.js-sup';
  let {specials} = util.const;
  let _chars = Object.keys(specials).map(k => specials[k].value).join('');

  mod.regex = new RegExp(`([${_chars}])`, 'g');

  /**
   * Wrap some characters in <sup> tags.
   * @param {string} text - The text to process.
   * @return {string} result - The resulting text with special chars <sup>'d.
   */
  mod.replace = (text) => text.replace(mod.regex, '<sup>$1</sup>');

  /**
   * Gets the inner text of the targeted element and adds a surrounding
   * <sup> tag to any special characters we normally want <sup>'d,
   * then puts it back as the inner html.
   * @param {string | Element} elem - CSS selector or DOM element to <sup>.
   */
  mod.sup = (elem) => {
    elem = $(elem);
    let text = elem.text();
    text = mod.replace(text);
    elem.html(text);
  };

  mod.all = () => {
    // Sup all suppable nodes.
    let suppable = $(_marker);
    suppable.each((idx, elem) => { mod.sup(elem); });
  };

  mod.init = () => {
    mod.all();
  };

  return mod;

})(jQuery);

// Initialize on dom ready.
$(() => { util.suppy.init(); });
