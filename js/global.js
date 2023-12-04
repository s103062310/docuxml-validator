/** @type {Object.<string, string>} specific symbol mapping */
const _symbol = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
}

/** @type {RegExp} regular expression of global illegal symbol  */
const _illegalSymbolRegex = new RegExp(/<|>|"|&(?!(?:amp|gt|lt|quot);)/g)

/** @type {RegExp} regular expression of label */
const _labelRegex = new RegExp(/<\s*\/?\s*[a-zA-Z0-9_]+(\s+[a-zA-Z0-9_]+="[^"]+")*\s*\/?\s*>/g)

/** @type {string} name of xml file */
let _filename = 'validated'

/** @type {string} xml string */
let _xml = ''

/** @type {string[]} stack which is used to check well-form structure */
let _labelNameStack = []

/** @type {number} validation progress */
let _validateIndex = 0

/** @type {number} accumulated error number */
let _errorNum = 0

/** @type {any} error information when validation is interrupted */
let _stopInfo = {
  label: {},
  value: '', // the whole substring which contains errors
  highlights: {}, // info for each highlights
}

// self defined data structure

/**
 * @typedef {Object} Label
 * @property {('start' | 'end' | 'single')} labelType
 * @property {string} labelName
 * @property {string} string
 * @property {Object.<string, string>} attributes
 */

/**
 * @typedef {Object} StatusRow
 * @property {('loading' | 'success' | 'error')} [status] displayed type of the row
 * @property {string} [text] custom message
 */

/**
 * @typedef {Object} SearchResult
 * @property {number} index index of target in original string
 * @property {string} target found target which matches pattern
 */
