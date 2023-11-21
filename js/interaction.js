/**
 * toggle corresponded error detail
 * @param {number} id error id / index
 */
const handleCollapse = (id) => {
  $(`#error-${id}`).toggle()
  $(`#error-${id}-toggle`).toggleClass('bi-chevron-compact-up')
  $(`#error-${id}-toggle`).toggleClass('bi-chevron-compact-down')
}

/**
 * clean error message of continue button in error detail
 */
const handleBlurContinue = () => {
  $(`#error-${_errorNum}-fin .error-msg`).remove()
}

// For highlight choices

/**
 * trigger when user choose to modify the specific symbol in text
 * @param {number} index target index in symbol array of stop info
 */
const handleShowModify = (index) => {
  const modify = modifyElement(index)
  $(`#error-${_errorNum}__highlight-${index}`).replaceWith(modify)
}

/**
 * trigger when user choose to delete the specific symbol in text
 * @param {number} index target index in symbol array of stop info
 */
const handleDelete = (index) => {
  _stopInfo.symbol[index].decision = '刪除'
  _stopInfo.symbol[index].result = ''
  const highlight = highlightElement({ index, text: '&emsp;', isSolved: true })
  $(`#error-${_errorNum}__highlight-${index}`).replaceWith(highlight)
}

/**
 * trigger when user choose to keep the specific symbol in text
 * @param {number} index target index in symbol array of stop info
 */
const handleKeep = (index) => {
  const result = _symbol[_stopInfo.symbol[index].target]
  _stopInfo.symbol[index].decision = '保留'
  _stopInfo.symbol[index].result = result
  const highlight = highlightElement({ index, text: result, isSolved: true })
  $(`#error-${_errorNum}__highlight-${index}`).replaceWith(highlight)
}

// For modify ui

/**
 * trigger when user edit in modify input
 * clear previous error message
 * @param {number} index target index in symbol array of stop info
 */
const handleChangeModifyInput = (index) => {
  $(`#modify-${index}__input`).removeClass('error')
  $(`#modify-${index} .error-msg`).remove()
}

/**
 * trigger when user cancel the modify procedure
 * @param {number} index target index in symbol array of stop info
 */
const handleCancelModify = (index) => {
  const text = _stopInfo.symbol[index].target
  const highlight = highlightElement({ index, text })
  $(`#modify-${index}`).replaceWith(highlight)
}

/**
 * trigger when user finish the modify procedure
 * @param {number} index target index in symbol array of stop info
 */
const handleModify = (index) => {
  const id = `#modify-${index}`
  const inputId = `#modify-${index}__input`
  const value = /** @type {string} */ ($(inputId).val())
  if (_illegalSymbolRegex.test(value)) {
    const error = errorElement({
      text: `請勿使用 ${Object.keys(_symbol).join('、')} 等符號`,
      iconStyle: 'margin-left: 0.25rem',
    })
    $(inputId).addClass('error')
    $(id).append(error)
  } else if (value === '') {
    const error = errorElement({
      text: '必填',
      iconStyle: 'margin-left: 0.25rem',
    })
    $(inputId).addClass('error')
    $(id).append(error)
  } else {
    _stopInfo.symbol[index].decision = '修改'
    _stopInfo.symbol[index].result = value
    const highlight = highlightElement({ index, text: value, isSolved: true })
    $(id).replaceWith(highlight)
  }
}
