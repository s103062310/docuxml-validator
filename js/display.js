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

const addErrorDetail = ({ content }) => {
  const html = `
    <div id="error-${_errorNum}" class="msg-board">${content}</div>
    <div id="error-${_errorNum}__fin" class="field">
      <div class="group">
        <button class="btn" onclick="handleFinishDetectSymbol()" onblur="handleBlurContinue()">修正完成並繼續</button>
        <button class="btn" onclick="endValidate()">結束</button>
      </div>
    </div>
  `
  $('#content').append(`<div class="detail">${html}</div>`)
}

/**
 * add labels adn collapse button at the end of the last status row
 * @param {string[]} texts label text
 */
const addActionLabelsAndCollapse = (texts) => {
  const statusRows = $('.status-row__text')
  const labels = texts.map((text) => `<span class="label">${text}</span>`).join('')
  const collapse = `<i id="error-${_errorNum}-toggle" class="collapse-btn bi bi-chevron-compact-down" onclick="handleCollapse(${_errorNum})"></i>`
  $(statusRows[statusRows.length - 1]).append(labels + collapse)
  $(`#error-${_errorNum}`).toggle() // close finished error detail
}

// Components

/**
 * generate html of highlight block of specific symbol
 * @param {Object} input
 * @param {number} input.index target index in symbol array of stop info
 * @param {string} input.text text which will be displayed in highlight label
 * @param {boolean} [input.isSolved] highlight style, normal or solved
 * @returns {string} html of highlight block
 */
const highlightElement = ({ index, text, isSolved = false }) => {
  // html need prevent '\n'
  const modifyBtn = `<button class="btn" onclick="handleShowModify(${index})">修改</button>`
  const deleteBtn = `<button class="btn" onclick="handleDelete(${index})">刪除</button>`
  const keepBtn = `<button class="btn" onclick="handleKeep(${index})">保留</button>`
  const choices = `<div class="choices" style="display: none">${modifyBtn}${deleteBtn}${keepBtn}</div>`
  const id = `error-${_errorNum}__highlight-${index}`
  const onclick = `onclick="$(this).find('.choices').toggle()"`
  return isSolved
    ? `<div id="${id}" class="highlight solved">${text}</div>`
    : `<div id="${id}" class="highlight" ${onclick}>${text}${choices}</div>`
}

/**
 * generate html of modify ui for highlight target
 * @param {number} index target index in symbol array of stop info
 * @returns {string} html of modify ui
 */
const modifyElement = (index) => {
  const input = `
    <input 
      id="modify-${index}__input" 
      class="form-control modify" 
      type="text" 
      value="${_stopInfo.highlights[index].target}" 
      onChange="handleChangeModifyInput(${index})"
    >
  `
  const finBtn = `<button class="btn modify" onclick="handleModify(${index})">確定</button>`
  const cancelBtn = `<button class="btn btn-outline modify" onclick="handleCancelModify(${index})">取消</button>`
  const modify = `<div class="modify-group">${input}${finBtn}${cancelBtn}</div>`
  return `<div id="modify-${index}" class="field">${modify}</div>`
}

/**
 * generate html of error message
 * @param {Object} input
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
 * message section
 */
const showDetectSymbol = () => {
  // TODO: 段落資訊
  // TODO: 重設、全部刪除、全部保留
  let text = _stopInfo.value
  _stopInfo.highlights.forEach(({ index, target }, i) => {
    const beforeStr = text.substring(0, index)
    const afterStr = text.substring(index + 1)
    const highlight = highlightElement({ index: i, text: target })
    text = `${beforeStr}${highlight}${afterStr}`
  })
  const content = `
    ${Object.keys(_symbol).join(
      '、',
    )} 為 xml 格式中用來辨認標籤的符號，請點擊以下文本中標示出的符號做更改：
    <div class="line"></div>
    ${text.replace(/\n/g, '<br/>')}
  `
  addErrorDetail({ content })
}
