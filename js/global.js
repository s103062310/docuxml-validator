/** @type {Object.<string, string>} specific symbol mapping */
const _symbol = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
}

/** @type {string} name of xml file */
let _filename = 'validated'

/** @type {string} xml before validation */
let _originXml = ''

/** @type {string} xml after validation */
let _xml = ''

/** @type {string[]} stack which is used to check well-form structure */
let _labelNameStack = []

/** @type {number} validation progress */
let _validateIndex = 0

/** @type {any} error information when validation is interrupted */
let _stopInfo = {}

// self defined data structure

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
