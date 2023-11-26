/**
 * parse xml label from original string
 * @param {string} string string of a xml label
 * @return {Label} parsed label data
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
 * @return {SearchResult[]} targets array
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
