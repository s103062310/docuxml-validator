/** @type {string} */
let _originXml = ''

/** @type {string[]} */
const _labelNameStack = []

/** @type {number} */
let _validateIndex = 0

/**
 * trigger when user uploading xml file
 * @param {JQuery.ChangeEvent} event
 */
$('#upload-input').on('change', (event) => {
  const inputElement = /** @type {HTMLInputElement} */ (event.target)
  const file = inputElement.files[0]
  $(inputElement).val('') // clear uploaded file
  getDataFromXmlFile(file)
})

/**
 * extract data from uploaded file
 * @param {File} file
 */
const getDataFromXmlFile = (file) => {
  const reader = new FileReader()

  /**
   * callback after loading: save result into _originXml and start validating
   * @param {ProgressEvent<FileReader>} event
   */
  reader.onload = (event) => {
    _originXml = /** @type {string} */ (event.target.result)
    _validateIndex = _originXml.indexOf('<ThdlPrototypeExport', 0)
    addStatusRow()
    validate()
  }

  reader.readAsText(file)
}

const validate = () => {
  while (_validateIndex < _originXml.length) {
    // find label
    const labelStartIndex = _originXml.indexOf('<', _validateIndex)
    const labelEndIndex = _originXml.indexOf('>', labelStartIndex)

    // cannot find anymore label
    if (labelStartIndex === -1 || labelEndIndex === -1) {
      break
    }

    const labelStr = _originXml.substring(labelStartIndex + 1, labelEndIndex).trim() // remove '<' & '>'
    const { labelType, labelName } = parseLabel(labelStr)

    if (!checkDocuXmlLabel(labelName)) {
      console.log('illegal', labelName)
      stopValidation({ status: 'error', text: `無法辨識標籤 &lt;${labelName}&gt;` })
      return
    }

    if (labelType === 'start') {
      _labelNameStack.push(labelName)
    } else if (labelType === 'end') {
      const topLabelName = _labelNameStack.pop()
      if (topLabelName !== labelName) {
        // TODO: handle error
        console.log('error!')
      }
    }

    _validateIndex = labelEndIndex + 1
  }

  stopValidation({ status: 'success', text: '完成！' })
}

const checkDocuXmlLabel = (labelName) => {
  const stackLength = _labelNameStack.length
  const parentLabelName = stackLength > 0 ? _labelNameStack[stackLength - 1] : 'root'
  const isLegal = _xmlArchitecture[parentLabelName].includes(labelName)
  return isLegal
}

/**
 * @typedef {Object} Label
 * @property {('start' | 'end' | 'single')} labelType
 * @property {string} labelName
 */

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
 * @typedef {Object} StatusRow
 * @property {('loading' | 'success' | 'error')} [status] displayed type of the row
 * @property {string} [text] custom message
 */

/**
 * stop validation
 * @param {StatusRow} row row data which is going to replace loading
 */
const stopValidation = (row) => {
  $('.status-row:last-child').remove()
  addStatusRow(row)
}

/**
 * add a row in status block
 * @param {StatusRow} row row data which is going to display
 */
const addStatusRow = ({ status = 'loading', text = '驗證中...' } = {}) => {
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  const style = isLoading ? '' : `style="color: var(--color--${status});"`

  const icon = isLoading
    ? '<div class="spinner-grow" aria-hidden="true"></div>'
    : `<i class="bi bi-${isSuccess ? 'check' : 'x'}-circle-fill"></i>`

  const html = `
    <div class="status-row" ${style}>
      ${icon}
      <div>${text}</div>
    </div>
  `

  $('#status').append(html)
}
