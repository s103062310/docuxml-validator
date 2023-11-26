/**
 * add a modal
 * @param {Object} input
 * @param {string} input.id modal id
 * @param {string} input.title modal title
 * @param {string} input.content modal body
 * @param {string} input.handleClick click function
 */
const addModal = ({ id, title, content, handleClick }) => {
  const modal = `
    <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}__title" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="${id}__title">${title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">${content}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn" onclick="${handleClick}()">確定</button>
          </div>
        </div>
      </div>
    </div>
  `
  $('#modals').append(modal)
}

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
 * add error detail information in status block
 * @param {Object} input
 * @param {string} input.content error detail
 * @param {string} [input.handleContinue] continue function name
 */
const addErrorDetail = ({ content, handleContinue }) => {
  const html = `
    <div id="error-${_errorNum}" class="msg-board">${content}</div>
    <div id="error-${_errorNum}__fin" class="field">
      <div class="group">
        ${
          handleContinue
            ? `<button class="btn" onclick="${handleContinue}()" onblur="handleBlurContinue()">繼續</button>`
            : ''
        }        
        <button class="btn btn-outline" onclick="endValidate()">結束</button>
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
 * generate html of service email link
 * @param {Object} input
 * @param {string} [input.text] link displayed text
 * @param {string} [input.title] email subject
 * @returns {string} html of service email
 */
const serviceElement = ({ text, title = '問題諮詢' } = {}) => {
  const email = 'docusky.contact@gmail.com'
  const subject = `【DocuXML 驗證工具】${title}`
  const body =
    '感謝您使用 DocuSky，為了能夠更迅速地協助您建庫，請盡可能詳細地描述操作過程與遇到的問題，並提供發生錯誤的螢幕截圖與 xml 檔案。'
  return `<a href="mailto:${email}?subject=${subject}&body=${body}">${text || email}</a> `
}

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

// For errors

const showDetectSymbol = () => {
  // TODO: 段落資訊
  // TODO: 仔細思考工具列的功能
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
    )} 為 xml 格式中用來辨認標籤的符號，請使用工具列或者點擊以下文本中標示出的符號做更改：
    <div id="error-${_errorNum}__tools" class="group" style="margin-top: 0.75rem">
      <button class="btn" onclick="handleDeleteAll()">全部刪除</button>
      <button class="btn" onclick="handleKeepAll()">全部保留</button>
      <button class="btn" onclick="handleReset()">重設</button>
    </div>
    <div class="line"></div>
    ${text.replace(/\n/g, '<br/>')}
  `
  addErrorDetail({
    content,
    handleContinue: 'handleFinishDetectSymbol',
  })
}

const showCannotIdentifyLabel = () => {
  const labelStr = `${_symbol['<']}${_stopInfo.label.string}${_symbol['>']}`
  const service = serviceElement({ text: '需要協助嗎？', title: '遇到無法辨識的標籤' })
  const content = `
    <div class="help-msg">
      <span>請選擇一種處理方式：</span>
      ${service}
    </div>
    <div class="group">
      <button class="btn" data-bs-toggle="modal" data-bs-target="#ignore">
        我確定這是 DocuXML 標籤
      </button>
      <button class="btn" onclick="">刪除此標籤與其包含的內容</button>
      <button class="btn" onclick="">修改標籤原文</button>
    </div>
    <div class="line"></div>
    <div>標籤原文：</div>
    <textarea class="form-control" disabled style="width: 100%; margin-top: .75rem;">${labelStr}</textarea>
  `
  addErrorDetail({
    content,
    handleContinue: 'handleFinishCannotIdentifyLabel',
  })
  addModal({
    id: 'ignore',
    title: `忽略標籤 ${_symbol['<']}${_stopInfo.label.labelName}${_symbol['>']} 的錯誤`,
    content: `本工具將暫時支援辨識標籤 ${_symbol['<']}${_stopInfo.label.labelName}${_symbol['>']}，但不包含其下的其他標籤。`,
    handleClick: 'handleIgnoreLabel',
  })
}
