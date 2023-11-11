/**
 * main validation loop
 */
const validate = () => {
  while (_validateIndex < _originXml.length) {
    // find label
    // BUG: 若文本含有 < > 可能無法分辨是否真的為 label
    const labelStartIndex = _originXml.indexOf('<', _validateIndex)
    const labelEndIndex = _originXml.indexOf('>', labelStartIndex)

    if (labelStartIndex === -1 || labelEndIndex === -1) {
      // cannot find anymore label
      // TODO: check remaining string
      break
    } else {
      // check string between last label and this label
      const value = _originXml.substring(_validateIndex, labelStartIndex)
      const illegalSymbol = RegExp('[<>&"]', 'g')
      const symbol = []
      let result

      while ((result = illegalSymbol.exec(value)) !== null) {
        symbol.push({ index: illegalSymbol.lastIndex - 1, target: result[0] })
      }

      if (symbol.length > 0) {
        // invalid
        _stopInfo = { value, symbol }
        stopValidation({
          status: 'error',
          text: `偵測到特殊符號。${Object.values(_symbol).join(
            '、',
          )} 為 xml 格式中用來辨認標籤的符號，請修改文本避免使用。`,
        })
        showDetectSymbol()
        return
      } else {
        // valid
        _xml += value
      }
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
        _stopInfo = { parentLabelName, labelName }
        stopValidation({
          status: 'error',
          text: `無法辨識標籤 ${_symbol['<']}${labelName}${_symbol['>']}`,
        })
        showCannotIdentifyLabel()
        return
      }

      _labelNameStack.push(labelName)
    } else if (labelType === 'end') {
      const topLabelName = _labelNameStack.pop()

      // TODO: handle error
      if (topLabelName !== labelName) {
        console.log('error!', labelName)
        return
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
  // reset ui
  $('#detail').empty()
  $('#upload-btn').show()

  // download result
  $('#download-btn').show()
  downloadResult()
}
