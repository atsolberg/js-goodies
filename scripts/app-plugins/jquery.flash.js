/** 
 * Flash an element's background with a color for a duration.
 * @param {object} [options] - Options hash containing color and duration.
 * @param {number} [options.duration=1500] - The duration in milliseconds the animation will last. Default 1500.
 * @param {string} [options.color=#fff288] - The color to flash the background. Default #fff288 (yellowish).
 */
$.fn.flash = function (options) {
    return this.each(function () {
        
      let me = $(this);
      let prev = me.data('previousColor') ? me.data('previousColor') : me.css('background-color');
      
      options = $.extend({ color: '#fff288', duration: 1500 }, options || {});
      me.data('previousColor', prev);
      me.stop(true)
      .css({ backgroundColor: options.color })
      .animate({ backgroundColor: prev }, options.duration);
  });
};