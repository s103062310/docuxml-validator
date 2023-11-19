/**
 * add a row in status block
 * @param {StatusRow} row row data which is going to display
 */
const addStatusRow = ({ status = 'loading', text = '驗證中...' } = {}) => {
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const style = isLoading ? '' : `style="color: var(--color--${status});"`
  const icon = isLoading
    ? '<div class="spinner-grow" aria-hidden="true"></div>'
    : `<i class="bi bi-${isSuccess ? 'check' : 'x'}-circle-fill"></i>`
  const html = `
    <div class="status-row" ${style}>
      ${icon}
      <div class="status-row__text">${text}</div>
    </div>
  `
  $('#content').append(html)
}

/**
 * add labels adn collapse button at the end of the last status row
 * @param {string[]} texts label text
 */
const addActionLabelsAndCollapse = (texts) => {
  const statusRows = $('.status-row__text')
  const labels = texts.map((text) => `<span class="label">${text}</span>`).join('')
  const collapse = `<i id="error-${_errorNum}-btn" class="collapse-btn bi bi-chevron-compact-down" onclick="handleCollapse(${_errorNum})"></i>`
  $(statusRows[statusRows.length - 1]).append(labels + collapse)
  $(`#error-${_errorNum}`).toggle() // close finished error detail
}

/**
 * toggle corresponded error detail
 * @param {number} id error id / index
 */
const handleCollapse = (id) => {
  $(`#error-${id}`).toggle()
  $(`#error-${id}-btn`).toggleClass('bi-chevron-compact-up')
  $(`#error-${id}-btn`).toggleClass('bi-chevron-compact-down')
}

// For error "Cannot Identify Label"

/**
 * message section
 */
const showCannotIdentifyLabel = () => {
  const email = 'docusky.contact@gmail.com'
  const subject = '【DocuXML 驗證工具】遇到無法辨識的標籤'
  const body =
    '感謝您使用 DocuSky，為了能夠更迅速地協助您建庫，請盡可能詳細地描述操作過程與遇到的問題，並提供發生錯誤的螢幕截圖與 xml 檔案。'
  const html = `
    <div id="error-${_errorNum}" class="msg-board">
      若無法順利建庫，請螢幕截圖錯誤訊息並附上 xml 檔案，來信 
      <a href="mailto:${email}?subject=${subject}&body=${body}">${email}</a> 
      由專人協助。
    </div>
    <div class="group">
      <button class="btn" onclick="handleIgnoreUnknownLabel()">略過並繼續</button>
      <button class="btn" onclick="endValidate()">結束</button>
    </div>
  `
  $('#content').append(`<div class="detail">${html}</div>`)
}

// For error "Detect Specific Symbol"

/**
 * generate html of highlight block of specific symbol
 * @param {object} input
 * @param {string} input.id target index in symbol array of stop info
 * @param {string} input.text text which will be displayed in highlight label
 * @param {boolean} [input.isSolved] highlight style, normal or solved
 * @returns {string} html of highlight block
 */
const highlightElement = ({ id, text, isSolved = false }) => {
  const modifyBtn = `<button class="btn" onclick="showModifyUI(${id})">修改</button>`
  const deleteBtn = `<button class="btn" onclick="handleDelete(${id})">刪除</button>`
  const keepBtn = `<button class="btn" onclick="handleKeep(${id})">保留</button>`
  const choices = `<div id="choices-${id}" class="choices" style="display: none">${modifyBtn}${deleteBtn}${keepBtn}</div>`
  const highlight = `<div id="highlight-${id}" class="highlight${isSolved ? ' solved' : ''}" ${
    isSolved ? '' : `onclick="$('#choices-${id}').toggle()"`
  }>${text}${isSolved ? '' : choices}</div>`
  return highlight
}

/**
 * message section
 */
const showDetectSymbol = () => {
  // TODO: 段落資訊
  // TODO: 重設
  let text = _stopInfo.value
  _stopInfo.symbol.forEach(({ index, target }, id) => {
    const beforeStr = text.substring(0, index)
    const afterStr = text.substring(index + 1)
    const highlight = highlightElement({ id, text: _symbol[target] })
    text = `${beforeStr}${highlight}${afterStr}`
  })
  const html = `
    <div id="error-${_errorNum}" class="msg-board">
      ${Object.values(_symbol).join(
        '、',
      )} 為 xml 格式中用來辨認標籤的符號，請點擊以下文本中標示出的符號做更改：
      <div class="line"></div>
      ${text.replace(/\n/g, '<br/>')}
    </div>
    <div id="symbol-fin" class="field">
      <div class="group">
        <button class="btn" onclick="handleSymbolFinish()" onblur="handleSymbolBlur()">修正完成並繼續</button>
        <button class="btn" onclick="endValidate()">結束</button>
      </div>
    </div>
  `
  $('#content').append(`<div class="detail">${html}</div>`)
}

/**
 * trigger when user choose to modify the specific symbol in text
 * it will replace highlight block to modify ui
 * @param {string} id target index in symbol array of stop info
 */
const showModifyUI = (id) => {
  const index = parseInt(id)
  const input = `<input id="modify-input-${id}" type="text" class="form-control modify" value="${_stopInfo.symbol[index].target}" onChange="handleChangeModifyInput(${id})">`
  const finBtn = `<button class="btn modify" onclick="handleModify(${id})">確定</button>`
  const cancelBtn = `<button class="btn btn-outline modify" onclick="handleCancelModify(${id})">取消</button>`
  const modify = `<div class="modify-group">${input}${finBtn}${cancelBtn}</div>`
  $(`#highlight-${id}`).replaceWith(`<div id="modify-${id}" class="field">${modify}</div>`)
}

/**
 * generate html of error message
 * @param {object} input
 * @param {string} input.text error message which will be displayed
 * @param {string} [input.iconStyle] custom style for icon
 * @returns html of error message
 */
const errorElement = ({ text, iconStyle }) => `
  <div class="error-msg">
    <i class="bi bi-x-circle-fill" style="${iconStyle}"></i>
    ${text}
  </div>
`
