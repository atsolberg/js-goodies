util.namespace('util.hidy');

/**
 * Module to get/set section container collapsed state in a cookie.
 * @module util.hidy
 * @requires jQuery
 * @requires Cookies
 */
util.hidy = (function($, JSON, Cookies) {

  'use strict';

  let _cookie = 'util-hidy';

  // Public API of this module.
  let module = {};

  /**
   * Returns all section container's collapsed state
   * as an object with keys as the section identifier.
   * @returns {*}
   */
  module.all = () => {

    let value = Cookies.get(_cookie);
    if (!value) {
      value = JSON.stringify({});
      Cookies.set(_cookie, value);
    }

    return JSON.parse(value);
  };

  /**
   * Returns true if the section's collapsed state has ever
   * been stored before.
   * @param {string} name - The section identifier.
   * @param {string} [url] - The page this section is on. Default is `location.pathname`.
   * @returns {boolean} - `true` if section's collapsed state has ever been stored before.
   */
  module.has = (name, url) => {

    url = (url || location.pathname);

    let all = module.all(),
        key = `${url}::${name}`;

    return all.hasOwnProperty(key);
  };

  /**
   * Returns the collapsed state of the section.
   * Defaults to false if not specified.
   * @param {string} name - The section identifier.
   * @param {string} [url] - The page this section is on. Default is `location.pathname`.
   * @returns {boolean}
   */
  module.get = (name, url) => {

    url = (url || location.pathname);

    let all = module.all(),
        key = `${url}::${name}`;

    let collapsed = all[key];

    return collapsed || false;
  };

  /**
   * Sets the collapsed state of the section.
   * @param {string} name - The section identifier.
   * @param {boolean} collapsed
   * @param {string} [url] - The page this section is on. Default is `location.pathname`.
   */
  module.set = (name, collapsed, url) => {

    url = (url || location.pathname);

    let all = module.all(),
        key = `${url}::${name}`;

    all[key] = collapsed;

    Cookies.set(_cookie, all);
  };

  return module;

})(jQuery, JSON, Cookies);
