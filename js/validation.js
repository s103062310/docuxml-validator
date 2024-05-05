/**
 * @param {string} value checked target
 * @returns {boolean} true if string has illegal symbols
 */
const checkText = (value) => {
  const highlights = findAllByRegex({ value, regex: _illegalSymbolRegex })
  if (highlights.length > 0) {
    _errorNum += 1
    _stopInfo = { value, highlights: { value: highlights } }
    stopValidation({ status: 'error', text: getText('statusSymbol') })
    showDetectSymbol()
    return true
  }
  return false
}

/**
 * @param {Label} label checked target
 * @param {number} index local index of checked target
 * @returns {boolean} true if detect illegal symbol in label attributes
 */
const checkLabel = (label, index) => {
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
    _stopInfo = { label, highlights, extra: index }
    stopValidation({ status: 'error', text: getText('statusSymbolAttr') })
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
 * @param {Label} label checked target
 * @param {number} index local index of checked target
 * @returns {boolean} true if label is not correctly closed
 */
const checkLabelClose = (label, index) => {
  const { labelName } = label
  const topLabelName = _labelNameStack[_labelNameStack.length - 1]

  if (topLabelName !== labelName) {
    _errorNum += 1
    stopValidation({
      status: 'error',
      text: getText('statusNested'),
    })

    const stackIndex = _labelNameStack.indexOf(labelName)
    if (stackIndex >= 0) {
      // have not closed label

      // find start label of the end label
      const beforeStr = _xml.substring(0, _validateIndex)
      const regex = new RegExp(`<\s*${labelName}[^>]*>`, 'g')
      let start, result
      while ((result = regex.exec(beforeStr)) !== null) {
        start = result.index + result[0].length // last matched label of before string
      }

      // content of the label
      const end = _validateIndex + index
      const value = _xml.substring(start, end)

      _stopInfo = { value, extra: _labelNameStack.slice(stackIndex + 1) }
      showModifyNotClosingLabel()

      // roll back progress
      while (_labelNameStack.length > stackIndex + 1) _labelNameStack.pop()
      _validateIndex = start
    } else {
      // have no start label
      _stopInfo = { label, extra: index }
      showDeleteEndLabel()
    }

    return true
  }

  return false
}

/**
 * @returns {boolean} true if there is redundant text in the end of xml
 */
const checkRedundant = () => {
  const finalString = _xml.substring(_validateIndex).trim()
  if (finalString) {
    _errorNum += 1
    _stopInfo = { value: finalString }
    stopValidation({ status: 'error', text: getText('statusRedundant') })
    showDeleteRedundant()
    return true
  }
  return false
}

/**
 * @returns {boolean} true if there is remaining label in stack
 */
const checkStack = () => {
  if (_labelNameStack.length > 0) {
    _errorNum += 1
    stopValidation({ status: 'error', text: getText('statusNested') })
    showAddClosingLabels()
    return true
  }
  return false
}
