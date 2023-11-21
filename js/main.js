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
    const { labelType, labelName } = parseLabel(labelStr)

    if (labelType === 'start') {
      const stackLength = _labelNameStack.length
      const parentLabelName = stackLength > 0 ? _labelNameStack[stackLength - 1] : 'root'

      // check label is a DocuXml label
      if (parentLabelName in _xmlArchitecture) {
        // check label is a valid child of parent
        const isLegal = _xmlArchitecture[parentLabelName].reduce((flag, label) => {
          const regex = new RegExp(label)
          return regex.test(labelName) || flag
        }, false)

        if (!isLegal) {
          _errorNum += 1
          _stopInfo = { parentLabelName, labelName }
          stopValidation({
            status: 'error',
            text: `無法辨識標籤 ${_symbol['<']}${labelName}${_symbol['>']}`,
          })
          showCannotIdentifyLabel()
          return
        }
      } else {
        // check for parent label not in _xmlArchitecture
        if (labelName === 'a') {
          // only custom metadata can have link
          if (_labelNameStack[stackLength - 2] !== 'xml_metadata') {
            // TODO: error
            console.log(_labelNameStack)
            return
          }
        } else {
          _errorNum += 1
          _stopInfo = { parentLabelName }
          stopValidation({
            status: 'error',
            text: `標籤 ${_symbol['<']}${parentLabelName}${_symbol['>']} 內不應存在其他標籤`,
          })
          // TODO: detail
          return
        }
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
    _validateIndex = _validateIndex + result.index + result[0].length
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
 * end the whole validate procedure
 */
const endValidate = () => {
  // reset ui
  $('#content .group').remove()
  $('#upload-btn').show()

  // download result
  $('#download-btn').show()
  // downloadResult()
}

// For checking

/**
 * check if there are illegal symbols in string
 * @param {string} value checked target
 * @returns {boolean} is error or not
 */
const checkText = (value) => {
  const symbol = findAllByRegex({ value, regex: _illegalSymbolRegex })
  if (symbol.length > 0) {
    _errorNum += 1
    _stopInfo = { value, symbol }
    stopValidation({ status: 'error', text: '偵測到特殊符號' })
    showDetectSymbol()
  }
  return symbol.length > 0
}

// For error "Cannot Identify Label"

/**
 * trigger when user decide to ignore this error
 * and continue validate from recorded stop point
 */
const handleIgnoreUnknownLabel = () => {
  // TODO: hint modal
  // ignore label
  _xmlArchitecture[_stopInfo.parentLabelName].push(_stopInfo.labelName)

  // reset ui
  $('#content .group').remove()
  addActionLabelsAndCollapse(['略過'])
  addStatusRow()

  // restart
  validate()
}

// For error "Detect Specific Symbol"

/**
 * trigger when user click finish button in the end of this error section
 */
const handleSymbolFinish = () => {
  const isModifyAll = _stopInfo.symbol.reduce(
    (result, { decision }) => result && Boolean(decision),
    true,
  )

  if (!isModifyAll) {
    $(`#error-${_errorNum}-fin`).append(errorElement({ text: '請修正完錯誤再繼續' }))
  } else {
    const actions = []

    // update xml
    _stopInfo.symbol.forEach(({ index, decision, result }) => {
      const position = _validateIndex + index
      const beforeStr = _xml.substring(0, position)
      const afterStr = _xml.substring(position + 1)
      _xml = beforeStr + result + afterStr
      if (!actions.includes(decision)) {
        actions.push(decision)
      }
    })

    // reset ui
    $('#content .group').remove()
    addActionLabelsAndCollapse(actions)
    addStatusRow()

    // restart
    validate()
  }
}
