/**
 * main validation loop
 */
const validate = () => {
  while (_validateIndex < _xml.length) {
    // find label
    _labelRegex.lastIndex = 0
    const remainXml = _xml.substring(_validateIndex)
    const result = _labelRegex.exec(remainXml)

    if (result === null) {
      // cannot find anymore label
      // TODO: stack not empty
      if (_labelNameStack.length > 0) {
        _errorNum += 1
        stopValidation({
          status: 'error',
          text: '標籤沒有正確嵌套',
        })
        addErrorDetail({ content: '此部分尚在開發中，請洽專人協助。' })
        return
      }

      // TODO: check remaining string
      const finalString = _xml.substring(_validateIndex).trim()
      if (finalString) {
        _errorNum += 1
        stopValidation({
          status: 'error',
          text: '偵測到多餘的內容',
        })
        const content = `
          在 DocuXML 標籤外偵測到多餘的文字，工具將自動刪除該內容。
          <div class="line"></div>
          ${finalString.replace(/\n/g, '<br/>')}
        `
        addErrorDetail({ content, handleContinue: 'handleFinishRedundant()' })
        return
      }
      break
    } else {
      // check string between last label and this label
      const value = _xml.substring(_validateIndex, _validateIndex + result.index)
      if (checkText(value)) return
    }

    // parse label
    const label = parseLabel(result[0])
    const { labelType, labelName } = label
    if (checkLabel(label, result.index)) return

    if (labelType === 'start') {
      // const stackLength = _labelNameStack.length
      // const parentLabelName = stackLength > 0 ? _labelNameStack[stackLength - 1] : 'root'

      // // check label is a DocuXml label
      // if (parentLabelName in _xmlArchitecture) {
      //   // check label is a valid child of parent
      //   const isLegal = _xmlArchitecture[parentLabelName].reduce((flag, label) => {
      //     const regex = new RegExp(label)
      //     return regex.test(labelName) || flag
      //   }, false)

      //   if (!isLegal) {
      //     _errorNum += 1
      //     _stopInfo = { parentLabelName, labelName }
      //     stopValidation({
      //       status: 'error',
      //       text: `無法辨識標籤 ${_symbol['<']}${labelName}${_symbol['>']}`,
      //     })
      //     showCannotIdentifyLabel()
      //     return
      //   }
      // } else {
      //   // check for parent label not in _xmlArchitecture
      //   if (labelName === 'a') {
      //     // only custom metadata can have link
      //     if (_labelNameStack[stackLength - 2] !== 'xml_metadata') {
      //       // TODO: error
      //       console.log(_labelNameStack)
      //       return
      //     }
      //   } else {
      //     _errorNum += 1
      //     _stopInfo = { parentLabelName }
      //     stopValidation({
      //       status: 'error',
      //       text: `標籤 ${_symbol['<']}${parentLabelName}${_symbol['>']} 內不應存在其他標籤`,
      //     })
      //     // TODO: detail
      //     return
      //   }
      // }

      _labelNameStack.push(labelName)
    } else if (labelType === 'end') {
      if (checkLabelClose(label, result.index)) return
      _labelNameStack.pop()
    } else {
      // TODO: single label
    }

    // update
    _validateIndex = _validateIndex + result.index + result[0].length
  }

  stopValidation({ status: 'success', text: '驗證成功！' })
  endValidate()
}

/**
 * interrupt validation procedure
 * @param {StatusRow} row row data which is going to replace loading
 */
const stopValidation = (row) => {
  $('.status-row:last-child').remove()
  addStatusRow(row)
}

/**
 * continue validation procedure from break point
 * @param {string[]} actions action labels text
 */
const continueValidation = (actions) => {
  // reset ui
  $(`#error-${_errorNum}__tools`).remove()
  $(`#error-${_errorNum}__fin`).remove()
  addActionLabelsAndCollapse(actions)
  addStatusRow()

  // restart
  validate()
}

/**
 * end the whole validate procedure
 */
const endValidate = () => {
  $(`#error-${_errorNum}__tools`).remove()
  $(`#error-${_errorNum}__fin`).remove()
  $('#upload-btn').show()

  // 驗證成功才顯示下載按鈕
  if ($('.status-row:last-child').length > 0) {
    $('#download-btn').show()
  }
}

// For checking

/**
 * @param {string} value checked target
 * @returns {boolean} true if string has illegal symbols
 */
const checkText = (value) => {
  const highlights = findAllByRegex({ value, regex: _illegalSymbolRegex })
  if (highlights.length > 0) {
    _errorNum += 1
    _stopInfo = { value, highlights: { value: highlights } }
    stopValidation({ status: 'error', text: '偵測到特殊符號' })
    showDetectSymbol()
  }
  return highlights.length > 0
}

/**
 * @param {Label} label checked target
 * @param {number} index local index of checked target
 * @returns {boolean} true if detect symbol in label attribute
 */
const checkLabel = (label, index) => {
  // TODO: check attribute

  const highlights = {}

  for (let key in label.attributes) {
    const value = label.attributes[key]
    const result = findAllByRegex({ value, regex: _illegalSymbolRegex })
    if (result.length > 0) {
      highlights[key] = result
    }
  }

  if (Object.keys(highlights).length > 0) {
    _errorNum += 1
    _stopInfo = { label, value: index, highlights }
    stopValidation({ status: 'error', text: '偵測到標籤屬性中有特殊符號' })
    showDetectAttributeSymbol()
    return true
  }

  // const isDocuLabel = _allDocuLabel.reduce((flag, docuLabel) => {
  //   const regex = new RegExp(docuLabel)
  //   return regex.test(label.labelName) || flag
  // }, false)

  // if (!isDocuLabel) {
  //   _errorNum += 1
  //   _stopInfo = { label, highlights: [{}] }
  //   stopValidation({
  //     status: 'error',
  //     text: `無法辨識標籤 ${_symbol['<']}${label.labelName}${_symbol['>']}`,
  //   })
  //   showCannotIdentifyLabel()
  //   return true
  // }

  return false
}

/**
 * @param {Label} label checked end label
 * @param {number} index local index of checked end label
 * @returns {boolean} true if label is not well form
 */
const checkLabelClose = (label, index) => {
  const { labelName } = label
  const topLabelName = _labelNameStack[_labelNameStack.length - 1]

  if (topLabelName !== labelName) {
    _errorNum += 1
    stopValidation({
      status: 'error',
      text: '標籤沒有正確嵌套',
    })

    const stackIndex = _labelNameStack.indexOf(labelName)
    if (stackIndex >= 0) {
      // have not closed label

      // find start label of the end label
      const beforeStr = _xml.substring(0, _validateIndex)
      const regex = new RegExp(`<\s*${label.labelName}[^>]*>`, 'g')
      let start, result
      while ((result = regex.exec(beforeStr)) !== null) {
        start = result.index + result[0].length // last matched label of before string
      }

      // content of the label
      const end = _validateIndex + index
      const value = _xml.substring(start, end)

      // roll back progress
      while (_labelNameStack.length > stackIndex + 1) _labelNameStack.pop()
      _validateIndex = start

      _stopInfo = { value }
      showModifyNoEndLabel(stackIndex)
    } else {
      // have no start label
      _stopInfo = { label, value: index }
      showDeleteEndLabel()
    }

    return true
  }

  return false
}

// For finishing error

const handleFinishDetectSymbol = () => {
  const isModifyAll = checkAllHighlightModified()
  if (!isModifyAll) {
    const error = errorElement({ text: '請修正完錯誤再繼續' })
    $(`#error-${_errorNum}__fin`).append(error)
  } else {
    const oriValueLength = _stopInfo.value.length
    const beforeStr = _xml.substring(0, _validateIndex)
    const afterStr = _xml.substring(_validateIndex + oriValueLength)
    const actions = updateStopInfo()
    _xml = beforeStr + _stopInfo.value + afterStr
    continueValidation(actions)
  }
}

const handleFinishDetectAttributeSymbol = () => {
  const isModifyAll = checkAllHighlightModified()
  if (!isModifyAll) {
    const error = errorElement({ text: '請修正完錯誤再繼續' })
    $(`#error-${_errorNum}__fin`).append(error)
  } else {
    const oriValueLength = _stopInfo.label.string.length
    const labelIndex = _validateIndex + _stopInfo.value
    const beforeStr = _xml.substring(0, labelIndex)
    const afterStr = _xml.substring(labelIndex + oriValueLength)
    const actions = updateStopInfo()
    _xml = beforeStr + generateLabelString(_stopInfo.label) + afterStr
    continueValidation(actions)
  }
}

const handleFinishDeleteEndLabel = () => {
  const oriValueLength = _stopInfo.label.string.length
  const labelIndex = _validateIndex + _stopInfo.value
  const beforeStr = _xml.substring(0, labelIndex)
  const afterStr = _xml.substring(labelIndex + oriValueLength)
  _xml = beforeStr + afterStr
  continueValidation(['刪除'])
}

const handleFinishModifyNoEndLabel = () => {
  const value = /** @type {string} */ ($(`#error-${_errorNum}__textarea`).val())

  // check value is well-form
  let result
  const stack = []
  _labelRegex.lastIndex = 0
  while ((result = _labelRegex.exec(value)) !== null) {
    const label = parseLabel(result[0])
    const { labelType, labelName } = label
    if (labelType === 'start') {
      stack.push(labelName)
    } else if (labelType === 'end') {
      const top = stack.pop()
      if (top !== labelName) {
        const error = errorElement({ text: '請修正完錯誤再繼續' })
        $(`#error-${_errorNum}__fin`).append(error)
        return
      }
    }
  }
  if (stack.length > 0) {
    const error = errorElement({ text: '請修正完錯誤再繼續' })
    $(`#error-${_errorNum}__fin`).append(error)
    return
  }

  // update
  const oriValueLength = _stopInfo.value.length
  const beforeStr = _xml.substring(0, _validateIndex)
  const afterStr = _xml.substring(_validateIndex + oriValueLength)
  _xml = beforeStr + value + afterStr
  continueValidation(['修改'])
}

const handleFinishCannotIdentifyLabel = () => {
  // TODO: hint modal
  // ignore label
  // _xmlArchitecture[_stopInfo.parentLabelName].push(_stopInfo.labelName)

  continueValidation(['略過'])
}

const handleFinishRedundant = () => {
  _xml = _xml.substring(0, _validateIndex)
  continueValidation(['刪除'])
}
