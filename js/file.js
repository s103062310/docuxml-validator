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
