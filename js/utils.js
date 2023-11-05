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
  return { labelType, labelName }
}

/**
 * find start index of end label search from giving index
 * @param {object} input
 * @param {string} input.label label name
 * @param {number} input.index start searching index
 * @return {number} found index
 */
const findEndLabel = ({ label, index }) => {
  const str = _originXml.slice(index)
  const indexInSlice = str.search(`<\\s*\/\\s*${label}\\s*>`)
  return indexInSlice + index
}
