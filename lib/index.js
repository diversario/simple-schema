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
module.exports = function (data, schema) {
  function validate(property, rules, data) {
    var propertyValue

    /*
     Function
     */
    if (rules.function) {
      var funcToRun

      if (typeof rules.function == 'string') { // use a function defined in global scope (global.fn = function(){})
        if (!global[rules.function] || typeof global[rules.function] !== 'function') return {valid: false, value: data[property]}
        funcToRun = global[rules.function]
      } else if (typeof rules.function == 'function') {
        funcToRun = rules.function
      } else return {valid: false}

      try {
        if (!funcToRun.call(data, property)) return {valid: false, value: data[property]}
      } catch(e) {
        return {valid: false, value: data[property]}
      }
    }

    /*
     Required check
     */
    try {
      propertyValue = data[property]
    } catch(e) {
      return {valid: !rules.required, value: undefined} // property is not there, nothing to test further
    }

    var validationFailed = {valid: false, value: propertyValue};
    
    if (rules.required && !Object.prototype.hasOwnProperty.call(data, property)) return validationFailed
    if (!rules.required && propertyValue === undefined) return {valid: true}

    /*
     Type check
     */
    if (rules.type) {
      var propertyType = Object.prototype.toString.call(propertyValue).toLowerCase()

      if (Array.isArray(rules.type)) {
        if (!rules.type.some(function (type) {
          return propertyType === '[object ' + type + ']'
        })) {
          return validationFailed
        }
      } else if (propertyType !== '[object ' + rules.type + ']') {
        return validationFailed
      }

      // additional check for date objects
      if (rules.type == 'date' || ~rules.type.indexOf('date')) {
        if (isNaN(propertyValue)) return validationFailed
      }
    }

    /*
     Value limits
     */
    if (rules.min || rules.max) {
      if (!propertyValue || !propertyValue.constructor || !propertyValue.constructor.name) {
        return validationFailed
      }

      var type = propertyValue.constructor.name.toLowerCase()

      switch(type) {
        case 'string':
        case 'array':
          if (Object.prototype.hasOwnProperty.call(rules, 'min') && propertyValue.length < rules.min) return validationFailed
          if (Object.prototype.hasOwnProperty.call(rules, 'max') && propertyValue.length > rules.max) return validationFailed
          break

        case 'number':
          if (Object.prototype.hasOwnProperty.call(rules, 'min') && propertyValue < rules.min) return validationFailed
          if (Object.prototype.hasOwnProperty.call(rules, 'max') && propertyValue > rules.max) return validationFailed
          break

        default: return validationFailed
      }
    }

    /*
     Regular expression
     */
    if (rules.regexp) {
      if (Array.isArray(rules.regexp)) {
        if (!rules.regexp.some(function(regexp) {return regexp.test(propertyValue)})) {
          return validationFailed
        }
      } else if (!rules.regexp.test(propertyValue)) {
        return validationFailed
      }
    }

    if (rules.regexpAll) {
      if (Array.isArray(rules.regexpAll)) {
        if (!rules.regexpAll.every(function(regexp) {return regexp.test(propertyValue)})) {
          return validationFailed
        }
      } else if (!rules.regexpAll.test(propertyValue)) {
        return validationFailed
      }
    }
    
    return {valid: true}
  }
  
  function runValidator(path, rule, obj) {
    var chunks = path.split('.')
      , next = chunks.shift()
    
    if (chunks.length === 0 || typeof obj == 'undefined' || typeof obj[next] == 'undefined') return validate(next, rule, obj)
    
    if (Array.isArray(obj[next])) {
      return runValidator(chunks.join('.'), rule, obj[next][0])
    }
    
    return runValidator(chunks.join('.'), rule, obj[next])
  }
  
  var errors = []
  
  if (schema) {
    if (data == null) {
      var e = new Error('Validation subject is missing')
      e.code = 'ENODATA'
      throw e
    } else {
      Object.keys(schema).forEach(function (property) {
        var propertyRule = schema[property]
        var result = runValidator(property, propertyRule, data)

        if (!result.valid) errors.push({property: property, value: result.value, rule: propertyRule})
      })
    }

    return errors
  }

  return errors
}