elopts.js
=========

> Collects parameters from a dom element and merges them with other objects

Elopts.js is a simple javascript module that helps you in gathering information about a dom-element, such as data-attributes, the src-attribute's query-params or json from a cdata-section. 
This is useful when implementing js-plugins or 3rd-party js-applications. 

Some of the tasks implemented by elopts.js could be also done with jquery or any other js-library. The benefit of elopts.js is not only that it combines all in a single method, but to serve as the entry-point of a javascript-application in the main place.
For example, elopts.js could be embedded in a standalone-widget or utilized to bootstrap a [requirejs](http://requirejs.org/)-application in conjuction with the [requirejs-initscript](http://github.com/benignware/requirejs-initscript) plugin .

Basic Usage
-----------

```html
<script id="test" 
  src="a.js?param1=test4&param2=test4" 
  data-option="test1" 
  data-json="['test2']">
  <![CDATA[{
    "result": "test3"
  }]]>
</script>
```

```js
var element = document.getElementById('test');
var options = elopts(element);
// print result
console.log(JSON.stringify(options, null, 2));
```

This will print out the following:
```js
log: {
  "param1": "test4",
  "param2": "test4",
  "option": "test1",
  "json": [
    "test2"
  ],
  "data": {
    "result": "test3"
  }
}
```

#### Merge default options into the result
You can set multiple arguments to merge objects into the result.
```js
var options = elopts(element, {
  def: 'default', 
  option: 'default'
});
```

Configuration
-------------
You may want to disable certain features by setting up a custom config before calling elopts itself:
```js
elopts.options = {
  json: false, 
  dataset: false, 
  cdata: false, 
  params: false
};
var options = elopts(element);
```

If you need multiple setups, you can create a new instance of elopts like this:
```js
var options = elopts.newInstance({
  json: false, 
  dataset: false, 
  cdata: false, 
  params: false
})(element, {
  // defaults go here
});
```

### Options

#### options.dataset
Type: `Boolean`
Default value: `true`

Specify whether data-attributes should be collected or not.

#### options.json
Type: `Boolean`
Default value: `true`

Specify whether string values should be parsed as json or not.

#### options.params
Type: `Boolean`
Default value: `true`

Specify whether query-params should be parsed and merged into the result if the element has a 'src'-attribute.

#### options.cdata
Type: `Boolean`
Default value: `true`

Specify whether a single cdata-section should be parsed as json and stored as 'data'-property into the result. 

#### options.cdataName
Type: `String`
Default value: `data`

Specify the name of the property to which json from a cdata-section is stored. 

