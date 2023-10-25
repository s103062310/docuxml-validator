let _xml = ''

/**
 * trigger when user uploading xml file
 */
$('#upload-input').on('change', ({ target }) => {
  const file = target.files[0]
  $(target).val('') // clear uploaded file
  getDataFromXmlFile(file)
})

/**
 * extract data from uploaded file
 * @param {File} file uploaded xml file
 */
const getDataFromXmlFile = (file) => {
  const reader = new FileReader()
  reader.onload = ({ target: { result } }) => {
    _xml = result
  }
  reader.readAsText(file)
}

/**
 * add a row in status block
 * @param {string} status loading / success / error
 * @param {string} text custom message
 */
const addStatusRow = ({ status = 'loading', text = '驗證中...' } = {}) => {
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  const style = isLoading ? '' : `style="color: var(--color--${status});"`

  const icon = isLoading 
    ? '<div class="spinner-grow" aria-hidden="true"></div>' 
    : `<i class="bi bi-${ isSuccess ? 'check' : 'x' }-circle-fill"></i>`

  const html = `
    <div class="status-row" ${style}>
      ${icon}
      <div>${text}</div>
    </div>
  `

  $('#status').append(html)
}