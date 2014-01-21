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
    var ERR_SEPARATOR_IN_KEY = '"'+SEPARATOR+'" is not allowed in key due it is used as namespace separator';
    /**
     * Collection of jQuery event listeners for each storage
     * @type {{localStorage: (jQuery), sessionStorage: (jQuery)}}
     */
    var eventHandlers = { localStorage: $({}), sessionStorage: $({}) };

    /**
     * Validates key
     * @throws Exception
     * @returns {undefined}
     */
    function validateKey(key){
        if (!key.indexOf(SEPARATOR) < 0) throw ERR_SEPARATOR_IN_KEY;
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
     * @param {Array} args
     * @returns {Array}
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
            var i;
            for (i = 0; i < win[storage].length; i++){
                var key = win[storage].key(i);
                if (key.indexOf(namespace + SEPARATOR) == 0) keysToRemove.push(key);
            }
            for (i = 0; i < keysToRemove.length; i++){
                win[storage].removeItem(keysToRemove[i]);
            }
        } else {
            win[storage].clear();
        }
    }

    /**
     * Binds a function for the specified events (jQuery like)
     * @param {string} stor
     * @param {string} evt
     * @param {function} fn
     */
    function on(stor, evt, fn){
        eventHandlers[stor].on(evt, fn);
    }

    /**
     * Unbinds a function for the specified events (jQuery like)
     * @param {string} stor
     * @param {string} evt
     * @param {function} [fn]
     */
    function off(stor, evt, fn){
        eventHandlers[stor].off(evt, fn);
    }

    /**
     * Binds a function for the specified events once (jQuery like)
     * @param {string} stor
     * @param {string} evt
     * @param {function} [fn]
     */
    function one(stor, evt, fn){
        eventHandlers[stor].one(evt, fn);
    }

    /**
     * Calls all bound event handlers for the specified events (jQuery like)
     * @param {string} stor
     * @param {string} evt
     * @param {*} [data]
     */
    function trigger(stor, evt, data){
        eventHandlers[stor].trigger(evt, data);
    }


    // If dependencies are met setup all available functions
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
            },
            on: function(evt, fn){
                on.apply(null, buildArgs('sessionStorage', arguments));
            },
            off: function(evt, fn){
                off.apply(null, buildArgs('sessionStorage', arguments));
            },
            one: function(evt, fn){
                one.apply(null, buildArgs('sessionStorage', arguments));
            },
            trigger: function(evt, data){
                trigger.apply(null, buildArgs('sessionStorage', arguments));
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
            },
            on: function(evt, fn){
                on.apply(null, buildArgs('localStorage', arguments));
            },
            off: function(evt, fn){
                off.apply(null, buildArgs('localStorage', arguments));
            },
            one: function(evt, fn){
                one.apply(null, buildArgs('localStorage', arguments));
            },
            trigger: function(evt, data){
                trigger.apply(null, buildArgs('localStorage', arguments));
            }
        };

    }

    // If dependencies are not met, register empty functions to not break the rest of the code
    else {

        $.sessionStorage = $.localStorage = {
            get: function(){ return null; },
            set: $.noop,
            del: $.noop,
            clear: $.noop,
            on: $.noop,
            off: $.noop,
            one: $.noop,
            trigger: $.noop
        };

    }

    // Alias
    $.webStorage = {
        session: $.sessionStorage,
        local: $.localStorage
    };

    // Catch native storage event and trigger the plug-in's ones
    $(win).on('storage', function(evt){
        // @todo add IE workaround
        $.localStorage.trigger({
            type: 'storage',
            originalEvent: evt.originalEvent
        });
    });

})(jQuery, window);
