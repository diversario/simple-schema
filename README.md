# simple-schema

  Simple object validation framework with no dependencies.

  [![Build Status](https://secure.travis-ci.org/diversario/simple-schema.png?branch=master)](http://travis-ci.org/diversario/simple-schema)
  [![Coverage Status](https://coveralls.io/repos/diversario/simple-schema/badge.png?branch=master)](https://coveralls.io/r/diversario/simple-schema?branch=master)
  [![Dependency Status](https://david-dm.org/diversario/simple-schema.png)](https://david-dm.org/diversario/simple-schema)
  [![NPM version](https://badge.fury.io/js/simple-schema.png)](http://badge.fury.io/js/simple-schema)

## Installation

via npm:

    $ npm install simple-schema

## Usage

Property declarations can specify a property name or a path to a property using dot-notation (`nested.object.prop2`). If part of the path is an array - validator will treat the rest of the path as elements of objects in that array. E.g., `array.prop1` will validate property `prop1` on every object in array `array`. Nested array are supported as well.

Supported property options:

* `required`: _Boolean_ If this field is required
* `type`: _String, Array_ A lower*cased constructor name, 'null' and 'undefined'. Setting this property to an array of values will look for one of the values. Possible values are:
    - `object`
    - `regexp`
    - `array`
    - `function`
    - `string`
    - `number`
    - `date`
    - `boolean`
* `regexp`: _RegExp_ Regular expression to run on property value. Array of expressions is supported as well and validation will pass if at least one regular expression passes.
* `regexpAll`: _RegExp_ Regular expression to run on property value. Array of expressions is supported as well and validation will pass only if all expressions pass.
* `function`: _Function, String_ Function to run with `this` being the object and property name as first argument. This parameter can also be specified as a string if you want to point to a function in the global scope (defined as `global.fn = myFunc`)
* `min`, `max`: _Number_ Depending on property type these options can specify:
  * string length
  * numeric range
  * array length
* `error`: _Object_ Optional error properties. Validator does not use this property, it's purely for convenience.
  * `code`: _Any_ Error code
  * `message`: _Any_ Error message

Running validation returns an array of violated rules, as such:


```javascript
[
    {
        property: 'prop1',
        value: 'Value of prop1',
        rule: { /* rule as defined in the schema */ }
    }
]
```

 e.g. an empty array means success.

## Example
```javascript

var validate = require('simple-schema')
  , assert = require('assert')

var schema = {
  prop1: {
    required: true,
    type: 'string',
    error: {
      code: 'NOTASTRING',
      message: 'It is not a string'
    }
  },
  'nested.object.prop2': {
    required: false
  }
}

var myObject = {
  prop1: 'str',
  nested: {
    object: {} // missing prop2 here
  }
}

// validationResult will hold an array of violated rules or an empty array
var validationResult = validate(myObject, schema)
assert(validationResult.length === 0) // validation succeeded
```

## Tests

You need `mocha`.

    make test

You can check code coverage report by running

    make coverage
    
Coverage report will be in `reports/lcov-report/index.html` file.


## License 

(The MIT License) 


Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

© Ilya Shaisultanov, 2013
