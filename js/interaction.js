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
  $(`#error-${_errorNum}__fin .error-msg`).remove()
}

// For highlight choices

/**
 * trigger when user choose to modify the specific symbol in text
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleShowModify = (attr, index) => {
  const modify = modifyElement({ attr, index })
  $(`#error-${_errorNum}__highlight-${attr}${index}`).replaceWith(modify)
}

/**
 * trigger when user choose to delete the specific symbol in text
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleDelete = (attr, index) => {
  _stopInfo.highlights[attr][index].decision = '刪除'
  _stopInfo.highlights[attr][index].result = ''
  const highlight = highlightElement({ attr, index, text: '&emsp;', isSolved: true })
  $(`#error-${_errorNum}__highlight-${attr}${index}`).replaceWith(highlight)
}

/**
 * trigger when user choose to keep the specific symbol in text
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleKeep = (attr, index) => {
  const result = _symbol[_stopInfo.highlights[attr][index].target]
  _stopInfo.highlights[attr][index].decision = '保留'
  _stopInfo.highlights[attr][index].result = result
  const highlight = highlightElement({ attr, index, text: result, isSolved: true })
  $(`#error-${_errorNum}__highlight-${attr}${index}`).replaceWith(highlight)
}

/**
 * trigger when user choose to reset the highlight
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleReset = (attr, index) => {
  delete _stopInfo.highlights[attr][index].decision
  delete _stopInfo.highlights[attr][index].result
  const text = _stopInfo.highlights[attr][index].target
  const highlight = highlightElement({ attr, index, text })
  $(`#error-${_errorNum}__highlight-${attr}${index}`).replaceWith(highlight)
}

// For modify ui

/**
 * trigger when user edit in modify input
 * clear previous error message
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleChangeModifyInput = (attr, index) => {
  $(`#modify-${attr}${index}__input`).removeClass('error')
  $(`#modify-${attr}${index} .error-msg`).remove()
}

/**
 * trigger when user cancel the modify procedure
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleCancelModify = (attr, index) => {
  const text = _stopInfo.highlights[attr][index].target
  const highlight = highlightElement({ attr, index, text })
  $(`#modify-${attr}${index}`).replaceWith(highlight)
}

/**
 * trigger when user finish the modify procedure
 * @param {string} attr target attribute in stop info
 * @param {number} index target index in attribute's symbol array of stop info
 */
const handleModify = (attr, index) => {
  const id = `#modify-${attr}${index}`
  const inputId = `#modify-${attr}${index}__input`
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
    _stopInfo.highlights[attr][index].decision = '修改'
    _stopInfo.highlights[attr][index].result = value
    const highlight = highlightElement({ attr, index, text: value, isSolved: true })
    $(id).replaceWith(highlight)
  }
}

// For detect symbol tools

/**
 * trigger when user click handle all tool buttons
 * @param {Function} func handle function
 */
const handleAll = (func) => {
  Object.keys(_stopInfo.highlights).forEach((attr) => {
    _stopInfo.highlights[attr].forEach((_, index) => {
      func(attr, index)
    })
  })
}

// For cannot identify choices

const handleIgnore = () => {
  // _stopInfo.highlights[0].decision = '忽略'
  // $(`#error-${_errorNum}__highlight-${index}`).replaceWith(highlight)
}
