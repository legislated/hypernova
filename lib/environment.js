require('airbnb-js-shims');

function uncache(moduleName) {
  var path = require.resolve(moduleName);
  var module = require.cache[path];

  delete require.cache[path];

  return function () {
    require.cache[path] = module;
    return module;
  };
}

// grab a fresh copy of bluebird since this script mutates it, and other
// modules may depend on it
/* eslint func-names:0 no-extra-parens:0  */
var restore = uncache('bluebird');
var Promise = require('bluebird');

restore();

var es6methods = ['then', 'catch', 'constructor'];
var es6StaticMethods = ['all', 'race', 'resolve', 'reject', 'cast'];

function isNotMethod(name) {
  return !(es6methods.includes(name) || es6StaticMethods.includes(name) || name.charAt(0) === '_');
}

function del(obj) {
  /* eslint no-param-reassign: 0 */
  return function (key) {
    delete obj[key];
  };
}

function toFastProperties(obj) {
  (function () {}).prototype = obj;
}

Object.keys(Promise.prototype).filter(isNotMethod).forEach(del(Promise.prototype));
Object.keys(Promise).filter(isNotMethod).forEach(del(Promise));
toFastProperties(Promise);
toFastProperties(Promise.prototype);

global.Promise = Promise;