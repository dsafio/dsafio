/**
 * Filters undesired properties of a given object.
 *
 * @param {Object} object The object to be filtered.
 * @param {Array} properties A list of desired properties.
 * @return {Object} A new object containing only values preset in desired properties.
 */
module.exports = function propertyFilter (object, properties) {
  if (properties !== undefined && (!Array.isArray(properties) || !properties.length)) {
    throw new Error('propertyFilter() accepts an array of strings as second arguments')
  }

  if (!properties) {
    return object
  }

  return properties.reduce((subset, key) => {
    if (!object.hasOwnProperty(key)) {
      throw new Error(`Invalid challenge key '${key}'`)
    }

    return Object.assign(subset, { [key]: object[key] })
  }, {})
}

module.exports = propertyFilter
