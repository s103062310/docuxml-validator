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
  }

  reader.readAsText(file)
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
