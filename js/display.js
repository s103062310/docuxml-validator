const showDetectSymbol = () => {
  // TODO: 段落資訊
  const text = highlightValue('value', _stopInfo.value)
  const content = `
    ${toolBarElement()}
    ${text.replace(/\n/g, '<br/>')}
  `
  addErrorDetail({
    content,
    handleContinue: `handleFinishDetectSymbol()`,
  })
}

const showDetectAttributeSymbol = () => {
  // TODO: 段落資訊
  const content = `
    ${toolBarElement()}
    標籤名稱：<span class="label">${_stopInfo.label.labelName}</span>
    <br/>
    標籤屬性：
    <br/>
    ${Object.entries(_stopInfo.label.attributes)
      .map(([key, value]) => {
        let text = value
        if (key in _stopInfo.highlights) text = highlightValue(key, value)
        return `<span class="label">${key}</span>${text}`
      })
      .join('<br/>')}
  `
  addErrorDetail({
    content,
    handleContinue: `handleFinishDetectAttributeSymbol()`,
  })
}

const showDeleteEndLabel = () => {
  // TODO: 段落資訊
  const content = `標籤 ${_symbol['<']}${_stopInfo.label.labelName}${_symbol['>']} 缺少起始標籤，將自動刪除。`
  addErrorDetail({ content, handleContinue: 'handleFinishDeleteEndLabel()' })
}

const showModifyNotClosingLabel = () => {
  // TODO: 段落資訊
  const labels = _stopInfo.extra.map((name) => `${_symbol['<']}${name}${_symbol['>']}`).join('、')
  const content = `
    偵測到未閉合標籤 ${labels}，請根據實際需求修改 XML 內容：
    <ul style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--color--gray);">
      <li>
        標籤是由特殊符號 ${_symbol['<']} 與 ${_symbol['>']} 夾起來的內容
        ，例：${_symbol['<']}LabelName${_symbol['>']}。
      </li>
      <li>若此段文字不需要標籤，請修改所有 ${_symbol['<']} 和 ${_symbol['>']} 避免使用。</li>
      <li>
        若此段文字有標籤需求，請確認標籤有正確嵌套，意即每個起始標籤皆需配對到一個結束標籤 
        (${_symbol['<']}LabelName${_symbol['>']}...${_symbol['<']}/LabelName${_symbol['>']})，
        或者自行閉合 (${_symbol['<']}LabelName /${_symbol['>']})，且標籤之間沒有交錯。
      </li>
      <li>此類錯誤涉及 XML 編碼，若有修改困難，請來信尋求協助。</li>
    </ul>
    <div class="line"></div>
    <textarea id="error-${_errorNum}__textarea" class="form-control">${_stopInfo.value}</textarea>
  `
  addErrorDetail({ content, handleContinue: 'handleFinishModifyNotClosingLabel()' })
}

const showDeleteRedundant = () => {
  const content = `
    在標籤外偵測到多餘的文字，將自動刪除該內容。
    <div class="line"></div>
    ${_stopInfo.value.replace(/\n/g, '<br/>')}
  `
  addErrorDetail({ content, handleContinue: 'handleFinishDeleteRedundant()' })
}

const showAddClosingLabels = () => {
  const labels = _labelNameStack
    .map((name) => `${_symbol['<']}${name}${_symbol['>']}`)
    .reverse()
    .join('、')
  const content = `${labels} 缺少結束標籤，將自動補在文件尾端。`
  addErrorDetail({ content, handleContinue: 'handleFinishAddClosingLabels()' })
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
    handleContinue: 'handleFinishCannotIdentifyLabel()',
  })
  addModal({
    id: 'ignore',
    title: `忽略標籤 ${_symbol['<']}${_stopInfo.label.labelName}${_symbol['>']} 的錯誤`,
    content: `本工具將暫時支援辨識標籤 ${_symbol['<']}${_stopInfo.label.labelName}${_symbol['>']}，但不包含其下的其他標籤。`,
    handleClick: 'handleIgnoreLabel',
  })
}
