/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {Subcategory[]} subcategories
 */

/**
 * @typedef {Object} Subcategory
 * @property {string} id
 * @property {string} name
 * @property {ServiceProvider[]} providers
 */

/**
 * @typedef {Object} ServiceProvider
 * @property {string} id
 * @property {string} name
 * @property {number} experience
 * @property {number} rating
 * @property {string} description
 * @property {string} image
 * @property {Review[]} reviews
 * @property {Pricing[]} pricing
 */

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} userImage
 * @property {number} rating
 * @property {string} comment
 * @property {string} date
 */

/**
 * @typedef {Object} Pricing
 * @property {string} id
 * @property {string} serviceName
 * @property {number} price
 * @property {string} unit
 */
