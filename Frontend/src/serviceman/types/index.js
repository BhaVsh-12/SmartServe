/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 * @property {string} serviceCategory
 * @property {string} subCategory
 * @property {string} location
 * @property {number} pricing
 * @property {'Premium' | 'Average' | 'Low'} membershipType
 */

/**
 * @typedef {Object} Request
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} userAvatar
 * @property {string} service
 * @property {'pending' | 'accepted' | 'completed' | 'cancelled'} status
 * @property {string} date
 * @property {number} amount
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} receiverId
 * @property {string} content
 * @property {string} timestamp
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} userId
 * @property {number} amount
 * @property {'completed' | 'pending' | 'failed'} status
 * @property {string} date
 * @property {string} description
 */

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} userAvatar
 * @property {number} rating
 * @property {string} comment
 * @property {string} date
 */

/**
 * @typedef {Object} MembershipPlan
 * @property {'Premium' | 'Average' | 'Low'} type
 * @property {number} price
 * @property {string[]} features
 * @property {boolean} recommended
 */
