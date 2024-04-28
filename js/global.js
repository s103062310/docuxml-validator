/** @type {Object.<string, string>} specific symbol mapping */
const _symbol = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&apos;',
  '"': '&quot;',
}

/** @type {RegExp} regular expression of global illegal symbol  */
const _illegalSymbolRegex = new RegExp(/<|>|"|&(?!(lt|gt|amp|apos|quot);)([^;]+;)?/g)

/** @type {RegExp} regular expression of label */
const _labelRegex = new RegExp(/<\s*\/?\s*[a-zA-Z0-9_.]+(\s+[a-zA-Z0-9_]+="[^"]+")*\s*\/?\s*>/g)

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
  label: {}, // the label which contains errors
  value: '', // the whole substring which contains errors
  highlights: /** @type {Object.<string, HighlightInfo>} */ ({}), // info for each highlights
  extra: undefined, // extra info needs to be recorded
}

// language
const { searchParams } = new URL(location.href)
const _lang = searchParams.get('l') || 'zh'

// self defined data structure

/**
 * @typedef {Object} Label
 * @property {('start' | 'end' | 'single')} labelType
 * @property {string} labelName
 * @property {string} [string]
 * @property {Object.<string, string>} [attributes]
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

/**
 * @typedef {Object} HighlightInfo
 * @property {number} index index of target in original string
 * @property {string} target found target which matches pattern
 * @property {string} decision action of the error target
 * @property {string} result modified string of target
 */
