/**
 * main validation loop
 */
const validate = () => {
  while (_validateIndex <= _xml.length) {
    // find label
    _labelRegex.lastIndex = 0
    const remainXml = _xml.substring(_validateIndex)
    const result = _labelRegex.exec(remainXml)

    if (result === null) {
      // cannot find anymore label
      if (checkRedundant()) return // remaining string exist
      if (checkStack()) return // stack not empty
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
  resetUIForValidation()
  addActionLabelsAndCollapse(actions)
  addStatusRow()
  validate()
}

/**
 * end the whole validate procedure
 */
const endValidate = () => {
  resetUIForValidation()
  $('#upload-btn').show()

  if ($('.status-row:last-child').length > 0) {
    // validation success
    $('#download-btn').show()
  } else {
    addActionLabelsAndCollapse(['未完成'])
  }
}

const resetUIForValidation = () => {
  $(`#error-${_errorNum}__fin`).remove()

  // specific symbol
  $(`#error-${_errorNum}__tools`).remove()
  Object.entries(_stopInfo.highlights || {}).forEach(([attr, highlightsArr]) => {
    highlightsArr.forEach(({ target, decision, result }, index) => {
      const isSolved = Boolean(decision)
      const text = isSolved ? result || '&emsp;' : target
      const finishedHighlight = highlightElement({ attr, index, text, isSolved, isFinish: true })
      $(`#error-${_errorNum}__${attr}${index}`).replaceWith(finishedHighlight)
    })
  })

  // not well form
  $(`#error-${_errorNum}__textarea`).attr('disabled', 'disabled')
}
