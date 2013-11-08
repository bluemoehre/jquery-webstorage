jquery-webstorage
=================

The goal of this plugin is to simplify the use of webstorages (further known as sessionStorage and localStorage):
- you can store any kind of data types and don't care about conversion
- you can use namespaces without affecting the storage event's


Requirements
------------

- jQuery 1.4+
- JSON-Support (nativly on Internet Explorer 8+, Firefox 3.1+, Safari 4+, Chrome 3+, Opera 10.5+)
- Webstorage-Support (nativly on Internet Explorer 8+, Firefox 3.5+, Safari 4+, Chrome 4+, Opera 10.5+)


How to use
----------

All Examples are given with `sessionStorage` and can be used the same way with `localStorage`.
Remember that `localStorage` will store kinda forever while `sessionStorage` will forget its data when the browser's tab was closed.

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

// is the same like
$.sessionStorage.set('myList', null);

// remove a complete namespace
$.sessionStorage.clear('theirNamespace');

// remove everything in the storage
$.sessionStorage.clear();
```


Important
---------

Firefox still raises an exception when using `set()` in private mode. So please use a try-catch block!
```javascript
try {
	$.sessionStorage.set('namespace', 'key', 'value');
} catch (e){
	// do nothing
}
```