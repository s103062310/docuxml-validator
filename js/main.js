/**
 * main validation loop
 */
const validate = () => {
  while (_validateIndex < _originXml.length) {
    // find label
    const labelStartIndex = _originXml.indexOf('<', _validateIndex)
    const labelEndIndex = _originXml.indexOf('>', labelStartIndex)

    if (labelStartIndex === -1 || labelEndIndex === -1) {
      // cannot find anymore label
      // TODO: check remaining string
      break
    } else {
      // TODO: check string between last label and this label
      const value = _originXml.substring(_validateIndex, labelStartIndex)
      _xml += value
    }

    // parse label
    const labelStr = _originXml.substring(labelStartIndex + 1, labelEndIndex).trim() // remove '<' & '>'
    const { labelType, labelName } = parseLabel(labelStr)

    if (labelType === 'start') {
      const stackLength = _labelNameStack.length
      const parentLabelName = stackLength > 0 ? _labelNameStack[stackLength - 1] : 'root'

      // check label is a valid child of parent
      // label not in _xmlArchitecture means that any label can be its children
      if (
        parentLabelName in _xmlArchitecture &&
        !_xmlArchitecture[parentLabelName].includes(labelName)
      ) {
        _stopInfo.parentLabelName = parentLabelName
        _stopInfo.labelName = labelName
        _stopInfo.index = labelEndIndex + 1
        stopValidation({ status: 'error', text: `無法辨識標籤 &lt;${labelName}&gt;` })
        showCannotIdentifyLabel()
        return
      }

      _labelNameStack.push(labelName)
    } else if (labelType === 'end') {
      const topLabelName = _labelNameStack.pop()

      // TODO: handle error
      if (topLabelName !== labelName) {
        console.log('error!')
      }
    } else {
      // TODO: single label
    }

    // update
    _xml += `<${labelStr}>`
    _validateIndex = labelEndIndex + 1
  }

  stopValidation({ status: 'success', text: '完成！' })
  endValidate()
}

/**
 * stop validation
 * @param {StatusRow} row row data which is going to replace loading
 */
const stopValidation = (row) => {
  $('.status-row:last-child').remove()
  addStatusRow(row)
}

/**
 * continue validate from recorded stop point
 */
const continueValidate = () => {
  // reset ui
  $('#detail').empty()
  addActionLabel('略過')
  addStatusRow()

  // ignore label
  _xmlArchitecture[_stopInfo.parentLabelName].push(_stopInfo.labelName)

  // restart
  validate()
}

/**
 * end the whole validate procedure
 */
const endValidate = () => {
  // reset data
  _originXml = ''
  _labelNameStack = []
  _validateIndex = 0
  _stopInfo = {}

  // reset ui
  $('#detail').empty()
  $('#upload-btn').show()

  // download result
  $('#download-btn').show()
  downloadResult()
}
