/**
 * parse xml label from original string
 * @param {string} string string of a xml label
 * @returns {Label} parsed label data
 */
const parseLabel = (string) => {
  const labelStr = string.slice(1, -1).trim() // remove '<' & '>'
  const result = labelStr.split(/\s/)
  const type =
    labelStr[labelStr.length - 1] === '/' ? 'single' : labelStr[0] === '/' ? 'end' : 'start'
  const name = result[0].replace('/', '')

  // parse attributes
  const attributes = /** @type {Object.<string, string>} */ ({})
  result.forEach((segment) => {
    const segmentResult = /(.+)="(.+)"/.exec(segment.trim())
    if (segmentResult !== null) {
      attributes[segmentResult[1]] = segmentResult[2].trim()
    }
  })

  return { labelType: type, labelName: name, string, attributes }
}

/**
 * generate label string from parsed label object
 * @param {Label} label parsed label data
 * @returns {string} string of a xml label
 */
const generateLabelString = (label) => {
  const { labelType: type, labelName: name, attributes = {} } = label
  const frontSlash = type === 'end' ? '/' : ''
  const endSlash = type === 'single' ? ' /' : ''
  const attributesStr = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('')
  return `<${frontSlash}${name}${attributesStr}${endSlash}>`
}

/**
 * get now parent label
 * @returns {string} parent label name
 */
const getParentLabel = () => {
  const stackLength = _labelNameStack.length
  const parentLabelName = stackLength > 0 ? _labelNameStack[stackLength - 1] : 'root'
  return parentLabelName
}

/**
 * find all targets in string with pattern
 * @param {Object} input
 * @param {string} input.value string which will be searched
 * @param {RegExp} input.regex target pattern which is wanted
 * @returns {SearchResult[]} targets array
 */
const findAllByRegex = ({ value, regex }) => {
  const targets = []
  let result
  while ((result = regex.exec(value)) !== null) {
    targets.push({ index: result.index, target: result[0] })
  }
  targets.reverse()
  return targets
}

/**
 *
 * @param {string} str original string
 * @returns {string} symbol replaced string
 */
const replaceSymbol = (str) =>
  Object.entries(_symbol).reduce(
    (result, [key, value]) => result.replace(new RegExp(key, 'g'), value),
    str,
  )

/**
 * highlight targets in giving value
 * @param {string} key key of highlight information
 * @param {string} value original string
 * @returns {string} html of highlighted value
 */
const highlightValue = (key, value) => {
  let text = value
  _stopInfo.highlights[key].forEach(({ index, target }, i) => {
    const beforeStr = text.substring(0, index)
    const afterStr = text.substring(index + target.length)
    const highlight = highlightElement({ attr: key, index: i, text: replaceSymbol(target) })
    text = `${beforeStr}${highlight}${afterStr}`
  })
  return text
}
