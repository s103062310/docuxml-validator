/**
 * parse xml label from original string
 * @param {string} labelStr string of a xml label
 * @return {Label} parsed label data
 */
const parseLabel = (labelStr) => {
  const result = labelStr.split(/\s/)
  const labelType =
    labelStr[labelStr.length - 1] === '/' ? 'single' : labelStr[0] === '/' ? 'end' : 'start'
  const labelName = result[0].replace('/', '')
  return { labelType, labelName, string: labelStr }
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
