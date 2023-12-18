/**
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
            ? `<button class="btn" onclick="${handleContinue}" onblur="handleBlurContinue()">繼續</button>`
            : ''
        }        
        <button class="btn btn-outline" onclick="endValidate()">結束</button>
      </div>
    </div>
  `
  $('#content').append(`<div class="detail">${html}</div>`)
}

const addErrorInFinish = () => {
  const error = errorElement({ text: '請修正完錯誤再繼續' })
  $(`#error-${_errorNum}__fin`).append(error)
}

/**
 * @param {string[]} texts label text
 */
const addActionLabelsAndCollapse = (texts) => {
  const statusRows = $('.status-row__text')
  const labels = texts.map((text) => `<span class="label label--action">${text}</span>`).join('')
  const collapse = `<i id="error-${_errorNum}-toggle" class="collapse-btn bi bi-chevron-compact-down" onclick="handleCollapse(${_errorNum})"></i>`
  $(statusRows[statusRows.length - 1]).append(labels + collapse)
  $(`#error-${_errorNum}`).toggle() // close finished error detail
}

// Elements

/**
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
 * @param {Object} input
 * @param {string} input.attr target attribute in stop info
 * @param {number} input.index target index in attribute's symbol array of stop info
 * @param {string} input.text text which will be displayed in highlight label
 * @param {boolean} [input.isSolved] highlight style, normal or solved
 * @param {boolean} [input.isFinish] is this highlight in processing or finished
 * @returns {string} html of highlight block
 */
const highlightElement = ({ attr, index, text, isSolved = false, isFinish = false }) => {
  // html need prevent '\n'
  const modifyBtn = `<button class="btn" onclick="handleShowModify('${attr}', ${index})">修改</button>`
  const deleteBtn = `<button class="btn" onclick="handleDelete('${attr}', ${index})">刪除</button>`
  const keepBtn = `<button class="btn" onclick="handleKeep('${attr}', ${index})">保留</button>`
  const resetBtn = `<button class="btn" onclick="handleReset('${attr}', ${index})">重設</button>`
  const btns = isSolved ? resetBtn : modifyBtn + deleteBtn + keepBtn
  const choices = `<div class="choices" style="display: none">${btns}</div>`
  const ID = `error-${_errorNum}__${attr}${index}`
  const onclick = `onclick="$(this).find('.choices').toggle()"`
  const className = `highlight ${isSolved || isFinish ? 'solved' : ''}`
  return isFinish
    ? `<div id="${ID}" class="${className} finished">${text}</div>`
    : `<div id="${ID}" class="${className}" ${onclick}>${text}${choices}</div>`
}

/**
 * @param {Object} input
 * @param {string} input.attr target attribute in stop info
 * @param {number} input.index target index in attribute's symbol array of stop info
 * @returns {string} html of modify ui
 */
const modifyElement = ({ attr, index }) => {
  const ID = `error-${_errorNum}__${attr}${index}`
  const input = `
    <input 
      id="${ID}__input" 
      class="form-control modify" 
      type="text" 
      value="${_stopInfo.highlights[attr][index].target}" 
      onChange="handleChangeModifyInput('${attr}', ${index})"
    >
  `
  const finBtn = `<button class="btn modify" onclick="handleModify('${attr}', ${index})">確定</button>`
  const cancelBtn = `<button class="btn btn-outline modify" onclick="handleCancelModify('${attr}', ${index})">取消</button>`
  const modify = `<div class="modify-group">${input}${finBtn}${cancelBtn}</div>`
  return `<div id="${ID}" class="field">${modify}</div>`
}

/**
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

/**
 * @returns html of modification tool bar
 */
const toolBarElement = () => `
    ${Object.keys(_symbol).join(
      '、',
    )} 為 xml 格式中用來辨認標籤的符號，請使用工具列或者點擊以下文本中標示出的符號做更改：
    <div id="error-${_errorNum}__tools" class="group" style="margin-top: 0.75rem">
      <button class="btn" onclick="handleAll(handleDelete)">全部刪除</button>
      <button class="btn" onclick="handleAll(handleKeep)">全部保留</button>
      <button class="btn" onclick="handleAll(handleReset)">重設</button>
    </div>
    <div class="line"></div>
  `
