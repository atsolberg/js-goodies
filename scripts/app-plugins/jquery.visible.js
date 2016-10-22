/** Set visibility to visible */
$.fn.visible = function () {
  return this.each(function () {
    $(this).css('visibility', 'visible');
  });
};

/** Set visibility to hidden */
$.fn.invisible = function () {
  return this.each(function () {
    $(this).css('visibility', 'hidden');
  });
};

/** Toggle visibility */
$.fn.visibilityToggle = function () {
  return this.each(function () {
    $(this).css('visibility', function (i, v) {
      return (v === 'visible') ? 'hidden' : 'visible';
    });
  });
};