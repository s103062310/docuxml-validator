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
      <div>${text}</div>
    </div>
  `

  $('#status').append(html)
}

const showCannotIdentifyLabel = () => {
  const email = 'docusky.contact@gmail.com'
  const subject = '【DocuXML 驗證工具】遇到無法辨識的標籤'
  const body =
    '感謝您使用 DocuSky，為了能夠更迅速地協助您建庫，請盡可能詳細地描述操作過程與遇到的問題，並提供發生錯誤的螢幕截圖與 xml 檔案。'
  const html = `
    <div class="msg-board">
      若無法順利建庫，請螢幕截圖錯誤訊息並附上 xml 檔案，來信 
      <a href="mailto:${email}?subject=${subject}&body=${body}">${email}</a> 
      由專人協助。
    </div>
    <div class="group">
      <button class="btn" onclick="continueValidate()">略過並繼續</button>
      <button class="btn">結束</button>
    </div>
  `
  $('#detail').append(html)
}
