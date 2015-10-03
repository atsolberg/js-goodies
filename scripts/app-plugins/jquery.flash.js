/** 
 * Flash an element's background with a color for a duration.
 * @param {object} [options] - Options hash containing color and duration.
 * @param {number} [duration=1500] - The duration in milliseconds the animation will last. Default 1500. 
 * @param {string} [color=#fff288] - The color to flash the background. Default #fff288 (yellowish).
 */
$.fn.flash = function (options) {
    return this.each(function () {
        
        options = $.extend({ color: '#fff288', duration: 1500 }, options || {});
        
        var me = $(this),
            prev = me.data('previousColor') ? me.data('previousColor') : me.css('background-color');
            me.data('previousColor', prev);
            
        me.stop(true)
        .css({ backgroundColor: options.color })
        .animate({ backgroundColor: prev }, options.duration);
    });
};