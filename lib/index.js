/**
 * Schema validator.
 *
 *  Property declarations can specify a property or a path to a property
 *  using dot-notation (nested.object.prop2).
 *
 *  Supported property options:
 *    * required: true/false
 *    * type: a lower-cased constructor name ('object', 'regexp', 'array' etc.) and
 *      also 'null' and 'undefined'
 *    * regexp: regular expression to run on property value
 *    * function: function to run with `this` being the object and property name as first argument
 *    * min/max: depending on property type these options can specify:
 *      * string length
 *      * numeric range
 *      * array length
 *
 * Example:
 *
 *  var schema = {
 *    prop1: {
 *      required: true,
 *      type: 'string',
 *      errorCode: 123
 *    },
 *    nested.object.prop2: {
 *      required: false
 *    }
 *  }
 *
 *  Valid object for this schema would look like so:
 *
 *  {
 *    prop1: 'str',
 *    nested: {
 *      'object': {} // missing prop2 here
 *    }
 *  }
 *
 *
 * @param {Object} data Object to validate against schema
 * @param {Object} schema Schema to use for validation
 * @return {Array} Array of errors. Empty array indicates no errors.
 */
module.exports = function propertyValidation(data, schema) {
  function validate(property, rules, data) {
    var propertyValue

    /*
     Function
     */
    if (rules.function) {
      var funcToRun

      if (typeof rules.function == 'string') { // use a function defined in global scope (global.fn = function(){})
        if (!global[rules.function] || typeof global[rules.function] !== 'function') return false
        funcToRun = global[rules.function]
      } else if (typeof rules.function == 'function') {
        funcToRun = rules.function
      } else return false

      try {
        if (!funcToRun.call(data, property)) return false
      } catch(e) {
        return false
      }
    }

    /*
     Required check
     */
    try {
      propertyValue = getPropertyValue(property, data)
    } catch(e) {
      return !rules.required // property is not there, nothing to test further
    }

    if (!rules.required && propertyValue === undefined) return true

    /*
     Type check
     */
    if (rules.type) {
      var propertyType = Object.prototype.toString.call(propertyValue).toLowerCase()

      if (Array.isArray(rules.type)) {
        if (!rules.type.some(function (type) {
          return propertyType === '[object ' + type + ']'
        })) {
          return false
        }
      } else if (propertyType !== '[object ' + rules.type + ']') {
        return false
      }

      // additional check for date objects
      if (rules.type == 'date' || ~rules.type.indexOf('date')) {
        if (isNaN(propertyValue)) return false
      }
    }

    /*
     Value limits
     */
    if (rules.min || rules.max) {
      if (!propertyValue || !propertyValue.constructor || !propertyValue.constructor.name) {
        return false
      }

      var type = propertyValue.constructor.name.toLowerCase()

      switch(type) {
        case 'string':
        case 'array':
          if (Object.prototype.hasOwnProperty.call(rules, 'min') && propertyValue.length < rules.min) return false
          if (Object.prototype.hasOwnProperty.call(rules, 'max') && propertyValue.length > rules.max) return false
          break

        case 'number':
          if (Object.prototype.hasOwnProperty.call(rules, 'min') && propertyValue < rules.min) return false
          if (Object.prototype.hasOwnProperty.call(rules, 'max') && propertyValue > rules.max) return false
          break

        default: return false
      }
    }

    /*
     Regular expression
     */
    if (rules.regexp && !rules.regexp.test(propertyValue)) return false

    return true
  }

  function getPropertyValue(path, data) {
    var chunks = Array.isArray(path) ? path : path.split('.')

    if (chunks.length === 0) {
      throw new Error('Invalid path ' + path)
    }

    if (chunks.length === 1) {
      return data[path]
    }

    var prop = chunks.shift()

    if (!data[prop] || data[prop].constructor.name !== 'Object') {
      throw new Error('Missing property ' + prop + '.')
    }

    return getPropertyValue(chunks, data[prop])
  }

  function isInArray(path, data) {
    var chunks = Array.isArray(path) ? path : path.split('.')

    if (chunks.length === 0) {
      throw new Error('Invalid path ' + path)
    }
    
    return Array.isArray(data[chunks[0]]) && chunks.length > 1
  }

  function runValidator(path, rule, value, results) {
    var chunks = path.split('.')
      , property = chunks.shift()
      , results = results || []
    
    if (isInArray(path, value)) {
      var result = value[property].map(function(el, i) {
        var valid = runValidator(chunks.join('.'), rule, el, results)
        
        if (!valid || Array.isArray(valid) && valid.length > 0) {
          return {
            valid: false,
            errors: valid,
            index: i,
            path: path,
            rule: rule
          }
        } else {
          return {
            valid: true
          }
        }
      }).filter(function(el) {
        return !el.valid
      })
      
      return results.concat(result)
    }
    
    return validate(path, rule, value)
  }
  
  var errors = []
  
  if (schema) {
    if (data == null) {
      errors.push(makeError('ENODATA', 'Validation subject is missing'))
    } else {
      Object.keys(schema).forEach(function (property) {
        var propertyRule = schema[property]
        var valid = runValidator(property, propertyRule, data)

        if (Array.isArray(valid) && valid.length > 0) {
          valid.forEach(function(e) {
            if (e.rule.error) {
              errors.push(makeError(e.rule.error.code, e.rule.error.message))
            } else {
              errors.push(makeError('EGENERIC', 'Property ' + property + ' failed to validate'))
            }
          })
        } else if (!valid) {
          if (propertyRule.error) {
            errors.push(makeError(propertyRule.error.code, propertyRule.error.message))
          } else {
            errors.push(makeError('EGENERIC', 'Property ' + property + ' failed to validate'))
          }
        }
      })
    }

    return errors
  }

  return errors
}

function makeError(code, message) {
  var e = new Error(message || '')
  e.code = code
  return e
}