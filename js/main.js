/**
 * main validation loop
 */
const validate = () => {
  while (_validateIndex < _xml.length) {
    // find label
    // BUG: 若文本含有 < > 可能無法分辨是否真的為 label
    const labelStartIndex = _xml.indexOf('<', _validateIndex)
    const labelEndIndex = _xml.indexOf('>', labelStartIndex)

    if (labelStartIndex === -1 || labelEndIndex === -1) {
      // cannot find anymore label
      // TODO: check remaining string
      break
    } else {
      // check string between last label and this label
      const value = _xml.substring(_validateIndex, labelStartIndex)
      const symbol = []
      let result

      while ((result = _illegalSymbol.exec(value)) !== null) {
        symbol.push({ index: _illegalSymbol.lastIndex - 1, target: result[0] })
      }

      if (symbol.length > 0) {
        // invalid
        symbol.reverse()
        _stopInfo = { value, symbol }
        stopValidation({
          status: 'error',
          text: `偵測到特殊符號。${Object.values(_symbol).join(
            '、',
          )} 為 xml 格式中用來辨認標籤的符號，請點擊以下文本中標示出的符號做更改。`,
        })
        showDetectSymbol()
        return
      } else {
        // valid
      }
    }

    // parse label
    const labelStr = _xml.substring(labelStartIndex + 1, labelEndIndex).trim() // remove '<' & '>'
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

// For error "Cannot Identify Label"

/**
 * trigger when user decide to ignore this error
 * and continue validate from recorded stop point
 */
const handleIgnoreUnknownLabel = () => {
  // ignore label
  _xmlArchitecture[_stopInfo.parentLabelName].push(_stopInfo.labelName)

  // reset ui
  $('#detail').empty()
  addActionLabel('略過')
  addStatusRow()

  // restart
  validate()
}

// For error "Detect Specific Symbol"

/**
 * trigger when user edit in modify input
 * @param {string} id target index in symbol array of stop info
 */
const handleChangeModifyInput = (id) => {
  $(`#modify-input-${id}`).removeClass('error')
  $(`#modify-${id} > .error-msg`).remove()
}

/**
 * trigger when user finish the modify procedure
 * @param {string} id target index in symbol array of stop info
 */
const handleModify = (id) => {
  const value = /** @type {string} */ ($(`#modify-input-${id}`).val())
  if (_illegalSymbol.test(value)) {
    $(`#modify-input-${id}`).addClass('error')
    $(`#modify-${id}`).append(
      errorElement({
        text: `請勿使用 ${Object.keys(_symbol).join('、')} 等符號`,
        iconStyle: 'margin-left: 0.25rem',
      }),
    )
  } else if (value === '') {
    $(`#modify-input-${id}`).addClass('error')
    $(`#modify-${id}`).append(
      errorElement({
        text: '必填',
        iconStyle: 'margin-left: 0.25rem',
      }),
    )
  } else {
    const index = parseInt(id)
    _stopInfo.symbol[index].decision = '修改'
    _stopInfo.symbol[index].result = value
    $(`#modify-${id}`).replaceWith(highlightElement({ id, text: value, isSolved: true }))
  }
}

/**
 * trigger when user cancel the modify procedure
 * @param {string} id target index in symbol array of stop info
 */
const handleCancelModify = (id) => {
  const target = _stopInfo.symbol[id].target
  const text = _symbol[target]
  $(`#modify-${id}`).replaceWith(highlightElement({ id, text }))
}

/**
 * trigger when user choose to delete the specific symbol in text
 * @param {string} id target index in symbol array of stop info
 */
const handleDelete = (id) => {
  const index = parseInt(id)
  _stopInfo.symbol[index].decision = '刪除'
  _stopInfo.symbol[index].result = ''
  $(`#highlight-${id}`).remove()
}

/**
 * trigger when user choose to keep the specific symbol in text
 * @param {string} id target index in symbol array of stop info
 */
const handleKeep = (id) => {
  const index = parseInt(id)
  _stopInfo.symbol[index].decision = '保留'
  _stopInfo.symbol[index].result = _symbol[_stopInfo.symbol[index].target]
  $(`#highlight-${id}`).addClass('solved')
  $(`#highlight-${id}`).prop('onclick', null).off('click')
  $(`#choices-${id}`).remove()
}

/**
 * trigger when user click finish button in the end of this error section
 */
const handleSymbolFinish = () => {
  const isModifyAll = _stopInfo.symbol.reduce(
    (result, { decision }) => result && Boolean(decision),
    true,
  )
  if (!isModifyAll) {
    $('#symbol-fin').append(errorElement({ text: '請修正完錯誤再繼續' }))
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
    $('#detail').empty()
    actions.forEach((action) => addActionLabel(action))
    addStatusRow()

    // restart
    validate()
  }
}

/**
 * clean error message of finish button
 */
const handleSymbolBlur = () => {
  $('#symbol-fin .error-msg').remove()
}
