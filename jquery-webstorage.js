/**
 * @license GNU General Public License v2 http://www.gnu.org/licenses/gpl-2.0
 * @author BlueMöhre <bluemoehre@gmx.de>
 * @copyright 2013 BlueMöhre
 * @link http://www.github.com/bluemoehre
 */

// use window as local variable due to performance improvement
(function($, win, undefined) {

    'use strict';

    var SEPARATOR = ':';
    var ERR_SEPERATOR_IN_KEY = '"'+SEPARATOR+'" is not allows as key due it is used as namespace separator';
    var noop = { get: function(){ return null; }, set: $.noop, del: $.noop, clear: $.noop };
    var debug = new Debug('jQuery.webstorage');
    debug.level = Debug.DEBUG_LOG;

    /**
     * Validates key
     * @throws Exception
     * @returns void
     */
    function validateKey(key){
        if (!key.indexOf(SEPARATOR) < 0) throw ERR_SEPERATOR_IN_KEY;
    }

    /**
     * Prepends namespace string to key if present
     * @returns String
     */
    function prefixKey(key, namespace){
        return (namespace ? namespace + SEPARATOR : '') + key;
    }

    /**
     * Merge storage and arguments to an array
     * @returns array
     */
    function buildArgs(stor,args){
        return [stor].concat(Array.prototype.slice.call(args, 0));
    }

    /**
     * Returns a value from a storage
     * @param String storage
     * @param String namespace (optional)
     * @param String key
     * @returns Mixed
     */
    function get(){
        debug.log('get called with', arguments);
        var storage = arguments[0];
        var key = arguments[arguments.length-1];
        var namespace = arguments.length > 2 ? arguments[arguments.length-2] : null;
        validateKey(key);
        return JSON.parse(win[storage].getItem(prefixKey(key,namespace)));
    }

    /**
     * Saves a value to a storage
     * @param String storage
     * @param String namespace (optional)
     * @param String key
     * @param Mixed value
     * @returns void
     */
    function set(){
        debug.log('set called with', arguments);
        var storage = arguments[0];
        var val = arguments[arguments.length-1];
        var key = arguments[arguments.length-2];
        var namespace = arguments.length > 3 ? arguments[arguments.length-3] : null;
        validateKey(key);
        if (val === null) return win[storage].removeItem(prefixKey(key,namespace));
        win[storage].setItem(prefixKey(key,namespace), JSON.stringify(val));
    }

    /**
     * Removes a value from a storage
     * @param String storage
     * @param String namespace (optional)
     * @param String key
     * @returns void
     */
    function del(){
        debug.log('del called with', arguments);
        var storage = arguments[0];
        var key = arguments[arguments.length-1];
        var namespace = arguments.length > 2 ? arguments[arguments.length-2] : null;
        validateKey(key);
        win[storage].removeItem(prefixKey(key,namespace));
    }

    /**
     * Clears the complete storage or just a namespace
     * @param storage
     * @param namespace (optional)
     */
    function clear(storage, namespace){
        debug.log('clear called with', arguments);
        if (namespace){
            for (var i=0; i < win[storage].length; i++){
                var key = win[storage].key(i);
                if (key.indexOf(namespace) == 0) win[storage].removeItem(key);
            }
        } else {
            win[storage].clear();
        }
    }



    if ('sessionStorage' in window && 'localStorage' in window && 'JSON' in window){
        $.sessionStorage = {
            set: function(){
                set.apply(null, buildArgs('sessionStorage', arguments));
            },
            get: function(){
                return get.apply(null, buildArgs('sessionStorage', arguments));
            },
            del: function(){
                del.apply(null,  buildArgs('sessionStorage', arguments));
            },
            clear: function(){
                return clear.apply(null,  buildArgs('sessionStorage', arguments));
            }
        };

        $.localStorage = {
            set: function(){
                set.apply(null, buildArgs('localStorage', arguments));
            },
            get: function(){
                return get.apply(null, buildArgs('localStorage', arguments));
            },
            del: function(){
                del.apply(null, buildArgs('localStorage', arguments));
            },
            clear: function(){
                return clear.apply(null, buildArgs('localStorage', arguments));
            }
        };
    }
    else {
        $.sessionStorage = $.localStorage = noop;
    }

})(jQuery, window);