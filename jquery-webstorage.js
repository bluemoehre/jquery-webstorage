/**
 * @license GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0
 * @author BlueMöhre <bluemoehre@gmx.de>
 * @copyright 2013 BlueMöhre
 * @link http://www.github.com/bluemoehre
 */

// use window and document as local variables due to performance improvement
(function($, win) {

    'use strict';

    /**
     * Separator between namespace and key
     * You can change it to whatever u need
     * @type {string}
     */
    var SEPARATOR = ':';
    /**
     * Error for separator conflict in key name
     * @type {string}
     */
    var ERR_SEPERATOR_IN_KEY = '"'+ SEPARATOR +'" is not allows as key due it is used as namespace separator';

    /**
     * Validates key
     * @throws Exception
     * @returns {undefined}
     */
    function validateKey(key){
        if (!key.indexOf(SEPARATOR) < 0) throw ERR_SEPERATOR_IN_KEY;
    }

    /**
     * Prepends namespace string to key if present
     * @param {string} key
     * @param {string} namespace
     * @returns {string}
     */
    function prefixKey(key, namespace){
        return (namespace ? namespace + SEPARATOR : '') + key;
    }

    /**
     * Merge storage and arguments to an array
     * @param {string} stor
     * @param {array} args
     * @returns {array}
     */
    function buildArgs(stor, args){
        return [stor].concat(Array.prototype.slice.call(args, 0));
    }

    /**
     * Returns a value from a storage
     * @param {string} storage
     * @param {string} [namespace]
     * @param {string} key
     * @returns {*}
     */
    function get(storage, namespace, key){
        storage = arguments[0];
        key = arguments[arguments.length-1];
        namespace = arguments.length > 2 ? arguments[arguments.length-2] : null;
        validateKey(key);
        return JSON.parse(win[storage].getItem(prefixKey(key,namespace)));
    }

    /**
     * Saves a value to a storage
     * @param {string} storage
     * @param {string} [namespace]
     * @param {string} key
     * @param {*} value
     * @returns {undefined}
     */
    function set(storage, namespace, key, value){
        storage = arguments[0];
        value = arguments[arguments.length-1];
        key = arguments[arguments.length-2];
        namespace = arguments.length > 3 ? arguments[arguments.length-3] : null;
        validateKey(key);
        if (value === null) return win[storage].removeItem(prefixKey(key, namespace));
        win[storage].setItem(prefixKey(key, namespace), JSON.stringify(value));
    }

    /**
     * Removes a value from a storage
     * @param {string} storage
     * @param {string} [namespace]
     * @param {string} key
     * @returns {undefined}
     */
    function del(storage, namespace, key){
        storage = arguments[0];
        key = arguments[arguments.length-1];
        namespace = arguments.length > 2 ? arguments[arguments.length-2] : null;
        validateKey(key);
        win[storage].removeItem(prefixKey(key, namespace));
    }

    /**
     * Clears the complete storage or just a namespace
     * @param {string} storage
     * @param {string} [namespace]
     */
    function clear(storage, namespace){
        if (namespace){
          var keysToRemove = [];
            for (var i=0; i < win[storage].length; i++){
                var key = win[storage].key(i);
                if (key.indexOf(namespace + SEPARATOR) == 0) keysToRemove.push(key);
            }
            for (var i=0; i < keysToRemove.length; i++){
              win[storage].removeItem(keysToRemove[i]);
            }
        } else {
            win[storage].clear();
        }
    }


    // If dependencies are not met register empty functions to not break the rest of the code
    if ('sessionStorage' in win && 'localStorage' in win && 'JSON' in win){
        $.sessionStorage = {
            get: function(){
                return get.apply(null, buildArgs('sessionStorage', arguments));
            },
            set: function(){
                set.apply(null, buildArgs('sessionStorage', arguments));
            },
            del: function(){
                del.apply(null, buildArgs('sessionStorage', arguments));
            },
            clear: function(){
                clear.apply(null, buildArgs('sessionStorage', arguments));
            }
        };

        $.localStorage = {
            get: function(){
                return get.apply(null, buildArgs('localStorage', arguments));
            },
            set: function(){
                set.apply(null, buildArgs('localStorage', arguments));
            },
            del: function(){
                del.apply(null, buildArgs('localStorage', arguments));
            },
            clear: function(){
                clear.apply(null, buildArgs('localStorage', arguments));
            }
        };
    }
    else {
        $.sessionStorage = $.localStorage = {
            get: function(){ return null; },
            set: $.noop,
            del: $.noop,
            clear: $.noop
        };
    }

    // Alias
    $.webStorage = {
        session: $.sessionStorage,
        local: $.localStorage
    };

})(jQuery, window);
