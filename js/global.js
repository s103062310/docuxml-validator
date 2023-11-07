/** @type {string} */
let _originXml = ''

/** @type {string[]} */
let _labelNameStack = []

/** @type {number} */
let _validateIndex = 0

let _stopInfo = {}

/**
 * @typedef {Object} Label
 * @property {('start' | 'end' | 'single')} labelType
 * @property {string} labelName
 */

/**
 * @typedef {Object} StatusRow
 * @property {('loading' | 'success' | 'error')} [status] displayed type of the row
 * @property {string} [text] custom message
 */
