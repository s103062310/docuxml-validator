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
