var validate = require('../')
  , assert = require('assert')


describe('Simple-schema', function () {
  describe('Type validation', function () {
    it('Passes valid types', function () {
      var errors
  
      var schema = {
        'some string': {
          'required': true,
          'type': 'string',
          'error': {code: 1, message: 'one'}
        },
        'some number': {
          'required': true,
          'type': 'number',
          'error': {code: 2, message: 'two'}
        },
        'some array': {
          'required': true,
          'type': 'array',
          'error': {code: 3, message: 'three'}
        },
        'some function': {
          'required': true,
          'type': 'function',
          'error': {code: 4, message: 'four'}
        },
        'some regexp': {
          'required': true,
          'type': 'regexp',
          'error': {code: 5, message: 'five'}
        },
        'some date': {
          'required': true,
          'type': 'date',
          'error': {code: 6, message: 'six'}
        },
        'some null': {
          'required': true,
          'type': 'null',
          'error': {code: 7, message: 'seven'}
        },
        'some undefined': {
          'required': true,
          'type': 'undefined',
          'error': {code: 8, message: 'eight'}
        },
        'some object': {
          'required': true,
          'type': 'object',
          'error': {code: 9, message: 'nine'}
        },
        'some boolean': {
          'required': true,
          'type': 'boolean',
          'error': {code: 10, message: 'ten'}
        }
      }
  
      var obj = {
        'some string': 'sdf',
        'some number': 42,
        'some array': [],
        'some function': function () {},
        'some regexp': /yay regexp/,
        'some date': new Date(),
        'some null': null,
        'some undefined': undefined,
        'some object': {},
        'some boolean': false
      }
  
      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 0)
    })

    it('No type is OK', function () {
      var errors

      var schema = {
        'some string': {
          'required': true,
          'error': {code: 1, message: 'one'}
        },
        'some number': {
          'required': true,
          'error': {code: 2, message: 'two'}
        },
        'some array': {
          'required': true,
          'error': {code: 3, message: 'three'}
        },
        'some function': {
          'required': true,
          'error': {code: 4, message: 'four'}
        },
        'some regexp': {
          'required': true,
          'error': {code: 5, message: 'five'}
        },
        'some date': {
          'required': true,
          'error': {code: 6, message: 'six'}
        },
        'some null': {
          'required': true,
          'error': {code: 7, message: 'seven'}
        },
        'some undefined': {
          'required': true,
          'error': {code: 8, message: 'eight'}
        },
        'some object': {
          'required': true,
          'error': {code: 9, message: 'nine'}
        },
        'some boolean': {
          'required': true,
          'error': {code: 10, message: 'ten'}
        }
      }

      var obj = {
        'some string': 'sdf',
        'some number': 42,
        'some array': [],
        'some function': function () {},
        'some regexp': /yay regexp/,
        'some date': new Date(),
        'some null': null,
        'some undefined': undefined,
        'some object': {},
        'some boolean': false
      }

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 0)
    })

    it('Issue #4: Required fields of type "undefined" are not reported but they should be', function () {
      var errors

      var schema = {
        'undefined field': {
          'required': true
        }
      }

      var obj = {}

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 1)
      assert(Object.prototype.hasOwnProperty.call(errors[0], 'value'))
      assert.strictEqual(errors[0].value, undefined)
    })
    
    it('Supports multiple types', function () {
      var errors

      var schema = {
        'prop1': {
          'required': true,
          'type': ['string', 'date'],
          'error': {'code': 1, 'message': 'one'}
        },
        'prop2': {
          'required': true,
          'type': ['number', 'string'],
          'error': {'code': 2, 'message': 'two'}
        },
        'prop3': {
          'required': true,
          'type': ['object', 'array'],
          'error': {'code': 3, 'message': 'three'}
        }
      }

      errors = validate({
        'prop1': new Date()
        , 'prop2': 'string'
        , 'prop3': {}
      }, schema)
      assert.equal(errors.length, 0)
    })

    it('Returns error(s) for type violation', function () {
      var errors

      var schema = {
        'some string': {
          'required': true,
          'type': 'string',
          'error': {'code': 1, 'message': 'err'}
        },
        'some number': {
          'required': true,
          'type': 'number',
          'error': {'code': 2, 'message': 'err'}
        },
        'some array': {
          'required': true,
          'type': 'array',
          'error': {'code': 3, 'message': 'err'}
        },
        'some function': {
          'required': true,
          'type': 'function',
          'error': {'code': 4, 'message': 'err'}
        },
        'some regexp': {
          'required': true,
          'type': 'regexp',
          'error': {'code': 5, 'message': 'err'}
        },
        'some date': {
          'required': true,
          'type': 'date',
          'error': {'code': 6, 'message': 'err'}
        },
        'some null': {
          'required': true,
          'type': 'null',
          'error': {'code': 7, 'message': 'err'}
        },
        'some undefined': {
          'required': true,
          'type': 'undefined',
          'error': {'code': 8, 'message': 'err'}
        },
        'some object': {
          'required': true,
          'type': 'object',
          'error': {'code': 9, 'message': 'err'}
        },
        'some boolean': {
          'required': true,
          'type': 'boolean',
          'error': {'code': 10, 'message': 'err'}
        }
      }

      var obj = {
        'some string': 1,
        'some number': '42',
        'some array': {},
        'some function': [],
        'some regexp': new Date(),
        'some date': /yay regexp/,
        'some null': undefined,
        'some undefined': false,
        'some object': null,
        'some boolean': function(){}
      }

      errors = validate(obj, schema)
      
      assert.strictEqual(errors.length, Object.keys(obj).length)
      assert(errors.every(function (err) {
        return [1,2,3,4,5,6,7,8,9,10].indexOf(err.rule.error.code) !== -1 && Object.prototype.hasOwnProperty.call(err, 'value')
      }))
      
      assert.strictEqual(errors[0].value, 1)
      assert.strictEqual(errors[1].value, '42')
      assert.strictEqual(errors[2].value.toString(), {}.toString())
      assert.strictEqual(errors[3].value.toString(), [].toString())
      assert.strictEqual(errors[4].value.constructor.name, 'Date')
      assert.strictEqual(errors[5].value.toString(), /yay regexp/.toString())
      assert.strictEqual(errors[6].value, undefined)
      assert.strictEqual(errors[7].value, false)
      assert.strictEqual(errors[8].value, null)
      assert.strictEqual(errors[9].value.toString(), function(){}.toString())
    })
    
    it('detects invalid date', function () {
      var errors

      var schema = {
        'prop1': {
          'required': true,
          'type': ['string', 'date'],
          'error': {'code': 111, 'message': 'oneoneone'}
        },
        'prop2': {
          'required': true,
          'type': ['string', 'number', 'regexp', 'date'],
          'error': {'code': 222, 'message': 'twotwotwo'}
        },
        'prop3': {
          'required': true,
          'type': ['string', 'number', 'regexp', 'date'],
          'error': {'code': 333, 'message': 'threethreethree'}
        }
      }

      errors = validate({
        'prop1': new Date('wrong!')
        , 'prop2': new Date('oops')
        , 'prop3': new Date()
      }, schema)
      assert.equal(errors.length, 2)

      assert(errors.every(function (err) {
        return [111,222].indexOf(err.rule.error.code) !== -1
      }))
    })
  })
  
  
  
  
  describe('Schema definition', function () {
    it('Supports dot-notation', function () {
      var errors
  
      var schema = {
        'nested.property.rule': {
          'required': true,
          'type': 'string',
          'error': {'code': 1, 'message': 'one'}
        },
        'boolean.nested.property': {
          'required': true,
          'type': 'boolean',
          'error': {'code': 2, 'message': 'two'}
        },
        'optional.nested.property': {
          'required': false,
          'type': 'boolean',
          'error': {'code': 3, 'message': 'three'}
        },
        'undefined.nested.property': {
          'required': true,
          'type': 'undefined',
          'error': {'code': 4, 'message': 'four'}
        },
        'null.nested.property': {
          'required': true,
          'type': 'null',
          'error': {'code': 5, 'message': 'five'}
        },
        'ERROR.nested.property': {
          'required': true,
          'type': 'string',
          'error': {'code': 500, 'message': 'five hundred'}
        },
        'ERROR.another.nested.propertyOfWrongType': {
          'required': true,
          'type': 'string',
          'error': {'code': 600, 'message': 'six hundred'}
        }
      }
  
      var obj = {
        'nested': {
          'property': {
            'rule': 'str'
          }
        },
        'boolean': {
          'nested': {
            'property': false
          }
        },
        //'optional': { not here }
        'undefined': {
          'nested': {
            'property': undefined
          }
        },
        'null': {
          'nested': {
            'property': null
          }
        },
        'ERROR': {
          'nested': ['property'],
          'another': {
            'nested': {
              'propertyOfWrongType': 123
            }
          }
        }
      }
  
      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 2)
      
      assert.strictEqual(errors[0].rule.error.code, 500)
      assert.strictEqual(errors[0].rule.error.message, 'five hundred')
      assert.strictEqual(errors[0].value, undefined)
      
      assert.strictEqual(errors[1].rule.error.code, 600)
      assert.strictEqual(errors[1].rule.error.message, 'six hundred')
      assert.strictEqual(errors[1].value, 123)
    })
  
    it('Handles invalid property spec', function () {
      var errors
  
      var schema = {
        '.': {
          'required': true,
          'type': 'string',
          'error': {'code': 1, 'message': 'one'}
        },
        '...': {
          'required': true,
          'type': 'string',
          'error': {'code': 2, 'message': 'two'}
        }
      }
  
      var obj = {
        '.': {
          'property': {
            'rule': 'str'
          }
        },
        '...': {
          'property': {
            'rule': 'str'
          }
        },
        '.....': {
          'property': {
            'rule': 'str'
          }
        }
      }
  
      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 2)
      assert.strictEqual(errors[0].rule.error.code, 1)
      assert.strictEqual(errors[0].rule.error.message, 'one')
    })
    
    it('returns error(s) for invalid data object', function () {
      var errors

      var schema = {
        'startDate': {
          'required': true,
          'type': ['number', 'date']
        },
        'endDate': {
          'required': true,
          'type': ['number', 'date']
        },
        'property': {
          'required': true,
          'type': ['number', 'date']
        }
      }

      try {
        validate(undefined, schema)
      } catch(e) {
        assert(e.code == 'ENODATA')
      }

      try {
        validate(null, schema)
      } catch(e) {
        assert(e.code == 'ENODATA')
      }
      
      errors = validate({}, schema)
      assert.equal(errors.length, 3)
      assert(errors.every(function (err) {
        return ['property', 'startDate', 'endDate'].indexOf(err.property) !== -1
      }))

      errors = validate('', schema)
      assert.equal(errors.length, 3)
      assert(errors.every(function (err) {
        return ['property', 'startDate', 'endDate'].indexOf(err.property) !== -1
      }))
      
      errors = validate(1, schema)
      assert.equal(errors.length, 3)
      assert(errors.every(function (err) {
        return ['property', 'startDate', 'endDate'].indexOf(err.property) !== -1
      }))
      
      errors = validate(function(){}, schema)
      assert.equal(errors.length, 3)
      assert(errors.every(function (err) {
        return ['property', 'startDate', 'endDate'].indexOf(err.property) !== -1
      }))

      errors = validate(/a/, schema)
      assert.equal(errors.length, 3)
      assert(errors.every(function (err) {
        return ['property', 'startDate', 'endDate'].indexOf(err.property) !== -1
      }))

    })

    it('returns error for empty type array', function () {
      var errors

      var schema = {
        'prop': {
          'required': true,
          'type': [],
          'error': {code: 1}
        }
      }

      errors = validate({'prop': true}, schema)
      assert.equal(errors.length, 1)
      assert.strictEqual(errors[0].rule.error.code, 1)
    })

    it('ignores missing optional properties', function () {
      var errors

      var schema = {
        'prop': {
          'required': false,
          'type': "string",
          'error': {'code': 1, 'message': 'err'}
        }
      }

      errors = validate({'not_prop': true}, schema)
      assert.equal(errors.length, 0)

      schema = {
        'prop.more': {
          'required': false,
          'type': "string",
          'error': {'code': 1, 'message': 'err'}
        }
      }

      errors = validate({'not_prop': true}, schema)
      assert.equal(errors.length, 0)
    })

    it('validates optional properties when present', function () {
      var errors

      var schema = {
        'prop': {
          'required': false,
          'type': "string",
          'error': {'code': 1, 'message': 'err'}
        }
      }

      errors = validate({'prop': "string"}, schema)
      assert.equal(errors.length, 0)

      schema = {
        'prop': {
          'required': false,
          'type': "string",
          'error': {'code': 2, 'message': 'err'}
        }
      }

      errors = validate({'prop': false}, schema)
      assert.equal(errors.length, 1)
      assert.strictEqual(errors[0].rule.error.code, 2)
    })

    it('always pass when schema is missing', function () {
      var errors = validate({'prop': "string"}, null)
      assert.equal(errors.length, 0)
    })
  })

  
  
  
  describe('Function validator', function () {

    it('Inline function receives object being validated as `this`', function () {
      var errors

      function isYes(prop) {return this[prop] == 'yes'}

      var schema = {
        'a': {
          'required': true,
          'type': 'string',
          'function': isYes,
          'error': {'code': 1, 'message': 'one'}
        },
        'b': {
          'required': true,
          'type': 'string',
          'function': isYes,
          'error': {'code': 2, 'message': 'two'}
        }
      }

      var obj = {
        'a': 'yes',
        'b': 'not yes'
      }

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 1)
      assert.strictEqual(errors[0].rule.error.code, 2)
      assert.strictEqual(errors[0].rule.error.message, 'two')
    })

    it('Inline function works with optional properties', function () {
      var errors

      function ifAthenB(prop) {
        if (this.a) {
          if (this.b) return true
        }

        return false
      }

      var schema = {
        'a': {
          'required': false,
          'type': 'string',
          'function': ifAthenB,
          'error': {'code': 1, 'message': 'one'}
        },
        'b': {
          'required': false,
          'type': 'string',
          'function': ifAthenB,
          'error': {'code': 2, 'message': 'two'}
        }
      }

      var obj = {
        'a': 'yes'
      }

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 2)
      assert.strictEqual(errors[0].rule.error.code, 1)
      assert.strictEqual(errors[1].rule.error.code, 2)
      assert.strictEqual(errors[0].rule.error.message, 'one')
      assert.strictEqual(errors[1].rule.error.message, 'two')
    })

    it('Handles function exceptions', function () {
      var errors

      function isYes(prop) {return prop == iForgotToDeclareThis}

      var schema = {
        'a': {
          'required': true,
          'type': 'string',
          'function': isYes,
          'error': {'code': 1, 'message': 'one'}
        }
      }

      var obj = {
        'a': 'yes'
      }

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 1)
      assert.strictEqual(errors[0].rule.error.code, 1)
      assert.strictEqual(errors[0].rule.error.message, 'one')
    })

    it('Support global function reference', function () {
      var errors
        , fnName = '__simple_schema_fn'
  
      global[fnName] = function (prop) {
        return this.a === '1'
      }
  
      var schema = {
        'a': {
          'required': false,
          'type': 'string',
          'function': fnName,
          'error': {'code': 1, 'message': 'one'}
        },
        'b': {
          'required': false,
          'type': 'string',
          'function': fnName,
          'error': {'code': 2, 'message': 'two'}
        }
      }
  
      var obj = {
        'a': 1
      }
  
      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 2)
      assert.strictEqual(errors[1].rule.error.code, 2)
      assert.strictEqual(errors[1].rule.error.message, 'two')
      
      delete global[fnName]
    })

    it('Missing global function => invalid', function () {
      var errors
        , fnName = '__simple_schema_missing_fn'

      var schema = {
        'a': {
          'required': false,
          'type': 'string',
          'function': fnName,
          'error': {'code': 1, 'message': 'one'}
        },
        'b': {
          'required': false,
          'type': 'string',
          'function': fnName,
          'error': {'code': 2, 'message': 'two'}
        }
      }

      var obj = {
        'a': 1
      }

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 2)
      assert.strictEqual(errors[0].rule.error.code, 1)
      assert.strictEqual(errors[1].rule.error.code, 2)
      assert.strictEqual(errors[0].rule.error.message, 'one')
      assert.strictEqual(errors[1].rule.error.message, 'two')

      delete global[fnName]
    })

    it('Value is neither a function nor string', function () {
      var errors
        , fnName = {}

      var schema = {
        'a': {
          'required': false,
          'type': 'string',
          'function': fnName,
          'error': {'code': 1, 'message': 'one'}
        },
        'b': {
          'required': false,
          'type': 'string',
          'function': fnName,
          'error': {'code': 2, 'message': 'two'}
        }
      }

      var obj = {
        'a': 1
      }

      errors = validate(obj, schema)
      assert.strictEqual(errors.length, 2)
      assert.strictEqual(errors[0].rule.error.code, 1)
      assert.strictEqual(errors[1].rule.error.code, 2)
      assert.strictEqual(errors[0].rule.error.message, 'one')
      assert.strictEqual(errors[1].rule.error.message, 'two')

      delete global[fnName]
    })
  })

  
  
  
  describe('Regular expression validation', function () {
    it('fails when regexp does not match', function () {
      var errors

      var schema = {
        'prop1': {
          'required': true,
          'type': 'string',
          'regexp': /fail/,
          'error': {'code': 1, 'message': 'one'}
        }
      }

      errors = validate({
        'prop1': 'epic fa1l'
      }, schema)
      assert.equal(errors.length, 1)

      assert(errors.every(function (err) {
        return [1].indexOf(err.rule.error.code) !== -1
      }))
    })
    
    it('supports array of regexps', function () {
      var errors

      var schema = {
        'prop1': {
          'required': true,
          'type': 'string',
          'regexp': [/don't/, /fail/],
          'error': {'code': 1, 'message': 'one'}
        }
      }

      errors = validate({
        'prop1': 'don\'t fail'
      }, schema)
      assert.equal(errors.length, 0)
    })
    
    it('if any regexp in regexpAll array fails - fail validation', function () {
      var errors

      var schema = {
        'prop1': {
          'required': true,
          'type': 'string',
          'regexpAll': [/please/, /fail/],
          'error': {'code': 1, 'message': 'one'}
        }
      }

      errors = validate({
        'prop1': 'don\'t fail'
      }, schema)
      assert.equal(errors.length, 1)
      
      assert(errors.every(function (err) {
        return [1].indexOf(err.rule.error.code) !== -1
      }))
    })

    it('if at least one regexp in regexpAll array passes - pass validation', function () {
      var errors

      var schema = {
        'prop1': {
          'required': true,
          'type': 'string',
          'regexp': [/won't/, /fail/],
          'error': {'code': 1, 'message': 'one'}
        }
      }

      errors = validate({
        'prop1': 'don\'t fail'
      }, schema)
      assert.equal(errors.length, 0)
    })
  })
  
  
  
  
  describe('Min/max validation', function () {
    it('returns error(s) for min violation', function () {
      var errors
  
      var schema = {
        'shortName': {
          'required': true,
          'type': 'string',
          'min': 3,
          'error': {'code': 1, 'message': 'one'}
        },
        'small number': {
          'required': true,
          'type': 'number',
          'min': 100,
          'error': {'code': 2, 'message': 'two'}
        },
        'short array': {
          'required': true,
          'type': 'array',
          'min': 3,
          'error': {'code': 3, 'message': 'three'}
        }
      }
  
      var obj = {
        'shortName': '12',
        'small number': 99,
        'short array': [1,2]
      } 
      
      errors = validate(obj, schema)
      assert.equal(errors.length, Object.keys(obj).length)
  
      assert(errors.every(function (err) {
        return [1,2,3].indexOf(err.rule.error.code) !== -1
      }))    
    })
  
    it('returns error(s) for max violation', function () {
      var errors
  
      var schema = {
        'shortName': {
          'required': true,
          'type': 'string',
          'max': 3,
          'error': {'code': 1, 'message': 'one'}
        },
        'small number': {
          'required': true,
          'type': 'number',
          'max': 100,
          'error': {'code': 2, 'message': 'two'}
        },
        'short array': {
          'required': true,
          'type': 'array',
          'max': 3,
          'error': {'code': 3, 'message': 'three'}
        }
      }
  
      var obj = {
        'shortName': '1234',
        'small number': 101,
        'short array': [1,2,3,4]
      } 
  
      errors = validate(obj, schema)
      assert.equal(errors.length, Object.keys(obj).length)
      assert(errors.every(function (err) {
        return [1,2,3].indexOf(err.rule.error.code) !== -1
      }))
    })

    it('array is too long', function () {
      var errors

      var schema = {
        'too long array': {
          'required': true,
          'type': 'array',
          'max': 3,
          'error': {'code': 3, 'message': 'three'}
        }
      }

      var obj = {
        'too long array': [1,2,3,4]
      }

      errors = validate(obj, schema)
      assert.equal(errors.length, Object.keys(obj).length)
      assert(errors.every(function (err) {
        return [3].indexOf(err.rule.error.code) !== -1
      }))
    })
    
    it('unsupported value type', function () {
      var errors

      var schema = {
        'shortName': {
          'required': true,
          'type': 'object',
          'min': 1,
          'error': {'code': 1, 'message': 'one'}
        },
        'small number': {
          'required': true,
          'type': 'null',
          'max': 100,
          'error': {'code': 2, 'message': 'two'}
        },
        'short array': {
          'required': true,
          'type': 'regexp',
          'max': 100,
          'error': {'code': 3, 'message': 'three'}
        }
      }

      var obj = {
        'shortName': {not: 'right'},
        'small number': null,
        'short array': /yeah, right/
      }

      errors = validate(obj, schema)
      assert.equal(errors.length, Object.keys(obj).length)
      assert(errors.every(function (err) {
        return [1,2,3].indexOf(err.rule.error.code) !== -1
      }))
    })
  })
  
  describe('Array introspection', function () {
    it('validates array elements', function () {
      var errors

      var schema = {
        'arr': {
          'required': true,
          'type': 'array',
          'error': {'code': 1, 'message': 'one'}
        },
        'arr.prop1': {
          'required': true,
          'type': 'string',
          'error': {'code': 2, 'message': 'two'}
        },
        'arr.prop2': {
          'required': true,
          'type': 'number',
          'error': {'code': 3, 'message': 'three'}
        },
        'arr.prop3.prop4': {
          'required': true,
          'type': 'function',
          'error': {'code': 4, 'message': 'four'}
        }
      }

      errors = validate({
        arr: [
          {
            'prop1': 'yes',
            'prop2': 2,
            'prop3': [{
              'prop4': function(){}
            }]
          },
          {
            'prop1': 'no',
            'prop2': 5,
            'prop3': [{
              'prop4': function(){}
            }]
          }
        ]
      }, schema)
      assert.equal(errors.length, 0)
    })
    
    it('reports errors correctly', function () {
      var errors

      var schema = {
        'str': {
          'required': true,
          'type': 'string',
          'error': {'code': 0.5, 'message': 'half'}          
        },
        'arr': {
          'required': true,
          'type': 'array',
          'error': {'code': 1, 'message': 'one'}
        },
        'arr.prop1': {
          'required': true,
          'type': 'string',
          'error': {'code': 2, 'message': 'two'}
        },
        'arr.prop2': {
          'required': true,
          'type': 'number',
          'error': {'code': 3, 'message': 'three'}
        },
        'arr.prop3': {
          'required': true,
          'type': 'array',
          'error': {'code': 5, 'message': 'V'}
        },
        'arr.prop3.prop4.prop5.prop6': {
          'required': true,
          'type': 'function',
          'error': {'code': 4, 'message': 'four'}
        }
      }

      errors = validate({
        str: 2,
        arr: [
          {
            'prop1': 'yes',
            'prop2': {},
            'prop3': [{
              'prop4': function(){}
            }]
          },
          {
            'prop1': 'no',
            'prop2': 5,
            'prop3': [{
              'prop4': {
                'prop5': [
                  {'prop6': function(){}}
                ]
              }
            }]
          },
          {
            'prop1': 'maybe',
            'prop2': {},
            'prop3': [{
              'prop4': {
                'prop5': [
                  {'prop6': 1}
                ]
              }
            }]
          }
        ]
      }, schema)
      
      assert.equal(errors.length, 3)
      assert(errors.every(function (err) {
        return [0.5, 3, 4].indexOf(err.rule.error.code) !== -1
      }))      
    })
  })

})
