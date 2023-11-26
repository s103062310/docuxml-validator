/**
 * trigger when user uploading xml file
 * @param {JQuery.ChangeEvent} event
 */
$('#upload-input').on('change', (event) => {
  const inputElement = /** @type {HTMLInputElement} */ (event.target)
  const file = inputElement.files[0]
  getDataFromXmlFile(file)
  _filename = file.name

  // reset ui
  $(inputElement).val('') // clear uploaded file
  $('#upload-btn').hide()
  $('#download-btn').hide()
  $('#content').empty()
})

/**
 * extract data from uploaded file
 * @param {File} file
 */
const getDataFromXmlFile = (file) => {
  const reader = new FileReader()

  /**
   * callback after loading: save result into _xml and start validating
   * @param {ProgressEvent<FileReader>} event
   */
  reader.onload = (event) => {
    _xml = /** @type {string} */ (event.target.result)
    _validateIndex = _xml.indexOf('<ThdlPrototypeExport', 0)
    _labelNameStack = []
    addStatusRow()
    validate()
  }

  reader.readAsText(file)
}

/**
 * download validated result DocuXML
 */
const downloadResult = () => {
  const textFileAsBlob = new Blob([_xml], { type: 'text/xml' })
  const downloadLink = document.createElement('a')
  downloadLink.download = _filename.replace('.xml', '_validated.xml')
  downloadLink.innerHTML = 'Download File'

  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
  } else {
    /**
     * delete element
     * @param {Event} event
     */
    const destroyClickedElement = (event) => {
      const targetNode = /** @type {Node} */ (event.target)
      document.body.removeChild(targetNode)
    }

    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob)
    downloadLink.onclick = destroyClickedElement
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
  }

  downloadLink.click()
}
