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
      // TODO: check remaining string
      break
    } else {
      // check string between last label and this label
      const value = _xml.substring(_validateIndex, _validateIndex + result.index)
      if (checkText(value)) return
    }

    // parse label
    const labelStr = result[0].slice(1, -1).trim() // remove '<' & '>'
    const label = parseLabel(labelStr)
    const { labelType, labelName } = label
    if (checkLabel(label)) return

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
 * check if there are illegal symbols in string
 * @param {string} value checked target
 * @returns {boolean} true if string has illegal symbols
 */
const checkText = (value) => {
  const highlights = findAllByRegex({ value, regex: _illegalSymbolRegex })
  if (highlights.length > 0) {
    _errorNum += 1
    _stopInfo = { value, highlights }
    stopValidation({ status: 'error', text: '偵測到特殊符號' })
    showDetectSymbol()
  }
  return highlights.length > 0
}

/**
 * check if label is DocuXML label
 * @param {Label} label checked target
 * @returns {boolean} true if label is not DocuXML label
 */
const checkLabel = (label) => {
  // TODO: check attribute?
  const isDocuLabel = _allDocuLabel.reduce((flag, docuLabel) => {
    const regex = new RegExp(docuLabel)
    return regex.test(label.labelName) || flag
  }, false)

  if (!isDocuLabel) {
    _errorNum += 1
    _stopInfo = { label, highlights: [{}] }
    stopValidation({
      status: 'error',
      text: `無法辨識標籤 ${_symbol['<']}${label.labelName}${_symbol['>']}`,
    })
    showCannotIdentifyLabel()
    return true
  }

  return false
}

// For finishing error

const handleFinishDetectSymbol = () => {
  const isModifyAll = _stopInfo.highlights.reduce(
    (result, { decision }) => result && Boolean(decision),
    true,
  )

  if (!isModifyAll) {
    const error = errorElement({ text: '請修正完錯誤再繼續' })
    $(`#error-${_errorNum}__fin`).append(error)
  } else {
    const actions = []

    // update xml
    _stopInfo.highlights.forEach(({ index, decision, result }) => {
      const position = _validateIndex + index
      const beforeStr = _xml.substring(0, position)
      const afterStr = _xml.substring(position + 1)
      _xml = beforeStr + result + afterStr
      if (!actions.includes(decision)) {
        actions.push(decision)
      }
    })

    continueValidation(actions)
  }
}

const handleFinishCannotIdentifyLabel = () => {
  // TODO: hint modal
  // ignore label
  // _xmlArchitecture[_stopInfo.parentLabelName].push(_stopInfo.labelName)

  continueValidation(['略過'])
}
