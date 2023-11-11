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
