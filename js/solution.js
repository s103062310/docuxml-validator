/**
 * @returns {boolean} is all errors modified or not
 */
const checkAllHighlightModified = () => {
  /**
   * @param {HighlightInfo[]} highlight a record in _stopInfo.highlights[key]
   * @returns {boolean} is all errors in one attribute modified or not
   */
  const checkHighlightModified = (highlight) =>
    highlight.reduce((result, { decision }) => result && Boolean(decision), true)

  const isModifyAll = Object.values(_stopInfo.highlights).reduce(
    (result, highlight) => result && checkHighlightModified(highlight),
    true,
  )

  return isModifyAll
}

/**
 * get keeping string from original xml
 * @param {'value' | 'label'} mode
 * @returns {{ beforeStr: string, afterStr: string}}
 */
const getKeepingString = (mode) => {
  const oriVal = mode === 'value' ? _stopInfo.value : _stopInfo.label.string
  const oriValLength = oriVal.length
  const splitIndex = mode === 'value' ? _validateIndex : _validateIndex + _stopInfo.extra
  const beforeStr = _xml.substring(0, splitIndex)
  const afterStr = _xml.substring(splitIndex + oriValLength)
  return { beforeStr, afterStr }
}

/**
 * update information according to modification
 * @returns {string[]} array of action labels
 */
const updateStopInfo = () => {
  const actions = []

  Object.entries(_stopInfo.highlights).forEach(([key, highlight]) => {
    let text = key === 'value' ? _stopInfo.value : _stopInfo.label.attributes[key]
    highlight.forEach(({ index, decision, result }) => {
      const beforeStr = text.substring(0, index)
      const afterStr = text.substring(index + 1)
      text = beforeStr + result + afterStr
      if (!actions.includes(decision)) {
        actions.push(decision)
      }
    })
    if (key === 'value') {
      _stopInfo.value = text
    } else {
      _stopInfo.label.attributes[key] = text
    }
  })

  return actions
}

// Solution of Each Error

const handleFinishDetectSymbol = () => {
  const isModifyAll = checkAllHighlightModified()
  if (!isModifyAll) {
    addErrorInFinish()
  } else {
    const { beforeStr, afterStr } = getKeepingString('value')
    const actions = updateStopInfo()
    _xml = beforeStr + _stopInfo.value + afterStr
    continueValidation(actions)
  }
}

const handleFinishDetectAttributeSymbol = () => {
  const isModifyAll = checkAllHighlightModified()
  if (!isModifyAll) {
    addErrorInFinish()
  } else {
    const { beforeStr, afterStr } = getKeepingString('label')
    const actions = updateStopInfo()
    _xml = beforeStr + generateLabelString(_stopInfo.label) + afterStr
    continueValidation(actions)
  }
}

const handleFinishDeleteEndLabel = () => {
  const { beforeStr, afterStr } = getKeepingString('label')
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
        addErrorInFinish()
        return
      }
    }
  }
  if (stack.length > 0) {
    addErrorInFinish()
    return
  }

  // update
  const { beforeStr, afterStr } = getKeepingString('value')
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
