/**
 * @typedef {Object} ServiceCategory
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {ServiceSubcategory[]} subcategories
 */

/**
 * @typedef {Object} ServiceSubcategory
 * @property {string} id
 * @property {string} name
 * @property {ServiceProvider[]} providers
 */

/**
 * @typedef {Object} ServiceProvider
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} experience
 * @property {number} rating
 * @property {string} description
 * @property {string} pricing
 * @property {Review[]} reviews
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
 * @typedef {Object} ServiceHistory
 * @property {string} id
 * @property {string} providerId
 * @property {string} providerName
 * @property {string} serviceId
 * @property {string} serviceName
 * @property {string} date
 * @property {'Completed' | 'Pending' | 'Cancelled'} status
 * @property {string} amount
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} avatar
 * @property {Address[]} addresses
 * @property {PaymentMethod[]} paymentMethods
 */

/**
 * @typedef {Object} Address
 * @property {string} id
 * @property {string} type
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} PaymentMethod
 * @property {string} id
 * @property {'Credit Card' | 'PayPal' | 'Bank Account'} type
 * @property {string} lastFour
 * @property {string} [expiryDate]
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} date
 * @property {string} amount
 * @property {string} description
 * @property {'Completed' | 'Pending' | 'Failed'} status
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} senderName
 * @property {string} senderAvatar
 * @property {string} content
 * @property {string} timestamp
 * @property {boolean} isRead
 * @property {Attachment[]} [attachments]
 */

/**
 * @typedef {Object} Attachment
 * @property {'image' | 'document'} type
 * @property {string} url
 * @property {string} name
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id
 * @property {string} participantId
 * @property {string} participantName
 * @property {string} participantAvatar
 * @property {string} lastMessage
 * @property {string} lastMessageTime
 * @property {number} unreadCount
 * @property {Message[]} messages
 */
