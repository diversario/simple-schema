var validate = require('../')
  , assert = require('assert');


describe('validate', function () {
  it('Passes valid types', function () {
    var errors;

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
    };

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
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, 0);
  });

  it('Supports dot-notation', function () {
    var errors;

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
      'ERROR.nester.property': {
        'required': true,
        'type': 'string',
        'error': {'code': 500, 'message': 'five hundred'}
      }
    };

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
        'nested': ['property']
      }
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 500);
    assert.strictEqual(errors[0].message, 'five hundred');
  });

  it('Handles invalid property spec', function () {
    var errors;

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
    };

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
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, 2);
    assert.strictEqual(errors[0].code, 1);
    assert.strictEqual(errors[0].message, 'one');
  });
  
  it('Inline function receives object being validated as `this`', function () {
    var errors;

    function isYes(prop) {return this[prop] == 'yes';}

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
    };

    var obj = {
      'a': 'yes',
      'b': 'not yes'
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 2);
    assert.strictEqual(errors[0].message, 'two');
  });

  it('Inline function works with optional properties', function () {
    var errors;

    function ifAthenB(prop) {
      if (this.a) {
        if (this.b) return true
      }
      
      return false;
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
    };

    var obj = {
      'a': 'yes'
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, 2);
    assert.strictEqual(errors[0].code, 1);
    assert.strictEqual(errors[1].code, 2);
    assert.strictEqual(errors[0].message, 'one');
    assert.strictEqual(errors[1].message, 'two');
  });

  it('Supports multiple types', function () {
    var errors;

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
    };

    errors = validate({
        'prop1': new Date()
      , 'prop2': 'string'
      , 'prop3': {}
    }, schema);
    assert.equal(errors.length, 0);
  });
  
  it('Handles function exceptions', function () {
    var errors;

    function isYes(prop) {return prop == iForgotToDeclareThis;}

    var schema = {
      'a': {
        'required': true,
        'type': 'string',
        'function': isYes,
        'error': {'code': 1, 'message': 'one'}
      }
    };

    var obj = {
      'a': 'yes'
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, 1);
    assert.strictEqual(errors[0].code, 1);
    assert.strictEqual(errors[0].message, 'one');
  });

  it('detects invalid date', function () {
    var errors;

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
    };

    errors = validate({
        'prop1': new Date('wrong!')
      , 'prop2': new Date('oops')
      , 'prop3': new Date()
    }, schema);
    assert.equal(errors.length, 2);
    
    assert(errors.every(function (err) {
      return [111,222].indexOf(err.code) !== -1  
    }))
  });
  
  it('returns error(s) for min violation', function () {
    var errors;

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
    };

    var obj = {
      'shortName': '12',
      'small number': 99,
      'short array': [1,2]
    } ;
    
    errors = validate(obj, schema);
    assert.equal(errors.length, Object.keys(obj).length);

    assert(errors.every(function (err) {
      return [1,2,3].indexOf(err.code) !== -1
    }))    
  });

  it('returns error(s) for max violation', function () {
    var errors;

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
    };

    var obj = {
      'shortName': '1234',
      'small number': 101,
      'short array': [1,2,3,4]
    } ;

    errors = validate(obj, schema);
    assert.equal(errors.length, Object.keys(obj).length);
    assert(errors.every(function (err) {
      return [1,2,3].indexOf(err.code) !== -1
    }))
  });

  it('Returns error(s) for type violation', function () {
    var errors;

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
    };

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
    };

    errors = validate(obj, schema);
    assert.strictEqual(errors.length, Object.keys(obj).length);
    assert(errors.every(function (err) {
      return [1,2,3,4,5,6,7,8,9,10].indexOf(err.code) !== -1
    }))
  });
  
  it('returns error(s) for invalid data object', function () {
    var errors;
    
    var schema = {
      'startDate': {
        'required': true,
        'type': ['number', 'date'],
        'errorCode': 1
      },
      'endDate': {
        'required': true,
        'type': ['number', 'date'],
        'errorCode': 2
      },
      'property': {
        'required': true,
        'type': ['number', 'date'],
        'errorCode': 3
      }
    };
    
    errors = validate(undefined, schema);
    assert.equal(errors.length, 1);
    assert(errors.every(function (err) {
      return ['ENODATA'].indexOf(err.code) !== -1
    }))

    errors = validate(null, schema);
    assert.equal(errors.length, 1);
    assert(errors.every(function (err) {
      return ['ENODATA'].indexOf(err.code) !== -1
    }))

    errors = validate({}, schema);
    assert.equal(errors.length, 3);
    assert(errors.every(function (err) {
      return ['EGENERIC'].indexOf(err.code) !== -1 &&
             /failed to validate/.test(err.message)
    }))

    errors = validate([{}], schema);
    assert.equal(errors.length, 3);
    assert(errors.every(function (err) {
      return ['EGENERIC'].indexOf(err.code) !== -1 &&
             /failed to validate/.test(err.message)
    }))

    errors = validate('', schema);
    assert.equal(errors.length, 3);
    assert(errors.every(function (err) {
      return ['EGENERIC'].indexOf(err.code) !== -1 &&
             /failed to validate/.test(err.message)
    }))
    
    errors = validate(1, schema);
    assert.equal(errors.length, 3);
    assert(errors.every(function (err) {
      return ['EGENERIC'].indexOf(err.code) !== -1 &&
             /failed to validate/.test(err.message)
    }))

    errors = validate(function(){}, schema);
    assert.equal(errors.length, 3);
    assert(errors.every(function (err) {
      return ['EGENERIC'].indexOf(err.code) !== -1 &&
             /failed to validate/.test(err.message)
    }))

    errors = validate(/a/, schema);
    assert.equal(errors.length, 3);
    assert(errors.every(function (err) {
      return ['EGENERIC'].indexOf(err.code) !== -1 &&
             /failed to validate/.test(err.message)
    }))
  });
  
  it('returns error for empty type array', function () {
    var errors;

    var schema = {
      'prop': {
        'required': true,
        'type': [],
        'error': {code: 1}
      }
    };

    errors = validate({'prop': true}, schema);
    assert.equal(errors.length, 1);
    assert.strictEqual(errors[0].code, 1);
    assert.strictEqual(errors[0].message, '');
  });
  
  it('ignores missing optional properties', function () {
    var errors;

    var schema = {
      'prop': {
        'required': false,
        'type': "string",
        'error': {'code': 1, 'message': 'err'}
      }
    };

    errors = validate({'not_prop': true}, schema);
    assert.equal(errors.length, 0);

    schema = {
      'prop.more': {
        'required': false,
        'type': "string",
        'error': {'code': 1, 'message': 'err'}
      }
    };

    errors = validate({'not_prop': true}, schema);
    assert.equal(errors.length, 0);
  });

  it('validates optional properties when present', function () {
    var errors;

    var schema = {
      'prop': {
        'required': false,
        'type': "string",
        'error': {'code': 1, 'message': 'err'}
      }
    };

    errors = validate({'prop': "string"}, schema);
    assert.equal(errors.length, 0);

    schema = {
      'prop': {
        'required': false,
        'type': "string",
        'error': {'code': 2, 'message': 'err'}
      }
    };

    errors = validate({'prop': false}, schema);
    assert.equal(errors.length, 1);
    assert.strictEqual(errors[0].code, 2);
  });
});
