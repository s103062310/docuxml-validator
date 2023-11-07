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

    if (labelType === 'start') {
      const stackLength = _labelNameStack.length
      const parentLabelName = stackLength > 0 ? _labelNameStack[stackLength - 1] : 'root'

      // check label is a valid child of parent
      if (!_xmlArchitecture[parentLabelName].includes(labelName)) {
        _stopInfo.parentLabelName = parentLabelName
        _stopInfo.labelName = labelName
        _stopInfo.index = labelEndIndex + 1
        stopValidation({ status: 'error', text: `無法辨識標籤 &lt;${labelName}&gt;` })
        showCannotIdentifyLabel()
        return
      }

      if (labelName in _xmlArchitecture) {
        // label have children
        _labelNameStack.push(labelName)
        _validateIndex = labelEndIndex + 1
      } else {
        // label is leaf
        // find end label
        const endLabelIndex = findEndLabel({ label: labelName, index: labelEndIndex + 1 })

        // cannot find end label
        if (endLabelIndex === -1) {
          console.log('error')
        }

        const value = _originXml.substring(labelEndIndex + 1, endLabelIndex).trim()
        // TODO: check value string
        _validateIndex = endLabelIndex + 1
        console.log(endLabelIndex, value)
      }
    } else if (labelType === 'end') {
      const topLabelName = _labelNameStack.pop()
      if (topLabelName !== labelName) {
        // TODO: handle error
        console.log('error!')
      }
      _validateIndex = labelEndIndex + 1
    } else {
      _validateIndex = labelEndIndex + 1
    }
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
  addStatusRow()

  // ignore label
  _xmlArchitecture[_stopInfo.parentLabelName].push(_stopInfo.labelName)

  // find end label as start index of validation
  const endLabelIndex = findEndLabel({ label: _stopInfo.labelName, index: _stopInfo.index + 1 })
  _validateIndex = endLabelIndex + 1

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
}
