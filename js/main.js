let _originXml = ''

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
    addStatusRow()
    validate()
  }

  reader.readAsText(file)
}

const validate = () => {
  let i = 0
  while (i < _originXml.length) {
    // find label
    const labelStartIndex = _originXml.indexOf('<', i)
    const labelEndIndex = _originXml.indexOf('>', labelStartIndex)

    // cannot find anymore label
    if (labelStartIndex === -1 || labelEndIndex === -1) {
      break
    }

    const labelStr = _originXml.substring(labelStartIndex + 1, labelEndIndex).trim() // remove '<' & '>'
    const label = parseLabel(labelStr)
    console.log(label)
    i = labelEndIndex + 1
  }

  stopValidation({ status: 'success', text: '完成！' })
}

/**
 * @typedef {Object} Label
 * @property {string} type start / end / single
 * @property {string} name label name
 */

/**
 * parse xml label from original string
 * @param {string} labelStr string of a xml label
 * @return {Label} parsed label data
 */
const parseLabel = (labelStr) => {
  const result = labelStr.split(/\s/)
  const type =
    labelStr[labelStr.length - 1] === '/' ? 'single' : labelStr[0] === '/' ? 'end' : 'start'
  const name = result[0].replace('/', '')
  return { type, name }
}

/**
 * @typedef {Object} StatusRow
 * @property {string} [status] loading / success / error
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
