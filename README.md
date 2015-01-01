jquery-webstorage ![Build Status](https://travis-ci.org/bluemoehre/jquery-webstorage.svg?branch=master)
=================

The goal of this plugin is to simplify the use of webstorages (further known as sessionStorage and localStorage):

- you can store any kind of data types and don't care about conversion
- you can use namespaces
- you can use storage events across different tabs/windows (also on IE =)


Requirements
------------

- jQuery 1.4+
- JSON-Support (nativly on Internet Explorer 8+, Firefox 3.1+, Safari 4+, Chrome 3+, Opera 10.5+)
- Webstorage-Support (nativly on Internet Explorer 8+, Firefox 3.5+, Safari 4+, Chrome 4+, Opera 10.5+)


Upcoming
--------

- Event handlers based on namespaces


How to use
----------

All examples are given with `sessionStorage` and can be used in the same way with `localStorage`.
Remember that `localStorage` will store kinda forever while `sessionStorage` will forget its data when the browser's tab was closed.

Additionally there are aliases for both storages: `$.webStorage.local` and `$.webStorage.session`.

```javascript
// --- store data ---

// store a boolean
$.sessionStorage.set('myTruth', true);

// store a string
$.sessionStorage.set('myText', 'theString');

// store an array
$.sessionStorage.set('myList', [1,2,3]);

// store an object
$.sessionStorage.set('myObject', {foo:'bar'});

// store an object with namespace
$.sessionStorage.set('myNamespace', 'myObject', {bar:'foo'});

// store a boolean with namespace
$.sessionStorage.set('theirNamespace', 'theirTruth', false);


// --- retrieve data ---

$.sessionStorage.get('myNotDefined');
// will output: null

$.sessionStorage.get('myTruth');
// will output: true

$.sessionStorage.get('myText');
// will output: "theString"

$.sessionStorage.get('myList');
// will output: [1,2,3]

$.sessionStorage.get('myObject');
// will output: {foo:'bar'}

$.sessionStorage.get('myNamespace', 'myObject');
// will output: {bar:'foo'}


// --- remove data ---

// remove a single value
$.sessionStorage.del('myList');
// or
$.sessionStorage.set('myList', null);

// remove a single value from namespace
$.sessionStorage.del('myNamespace', 'myObject');
// or
$.sessionStorage.set('myNamespace', 'myObject', null);

// remove a complete namespace and everything inside
$.sessionStorage.clear('theirNamespace');

// remove everything in the storage
$.sessionStorage.clear();
```


The use of the localStorage will trigger events on other tabs/windows on the same domain which is quite comfortable if
you need to update local data in intervals. You only need to do one query per browser instead of one per tab/window.

```javascript
// bind event listener
$.localStorage.on('storage', function(event){
    // do something

    // event.originalEvent.key contains the modified storage key (defaults to "key" or "namespace:key")
    // event.originalEvent.oldValue contains the old value for key (null|JSON)
    // event.originalEvent.newValue contains the new value for key (null|JSON)
    // event.originalEvent.storageArea contains the complete dataset of the storage
}

// trigger event from another tab
$.localStorage.set('test', {foo: 'bar'});

// Result:
// event.originalEvent: {
//     key: "test"
//     newValue: "1"
//     oldValue: null
//     storageArea: {
//         test: "{"foo":"bar"}"
//     }
//     ...
// }
