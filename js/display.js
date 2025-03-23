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
    ${getText('errorDetailSymbolAttrName')}<span class="label">${_stopInfo.label.labelName}</span>
    <br/>
    ${getText('errorDetailSymbolAttrValue')}
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

const showModifyNoStartLabel = () => {
  // TODO: 段落資訊
  const labels = _stopInfo.extra.map((name) => `${_symbol['<']}${name}${_symbol['>']}`).join('、')
  const rowNum = _stopInfo.value.split('\n').length
  const content = `
    ${getText('errorDetailNested0')} ${labels}${getText('errorDetailNested2')}
    <ul style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--color--gray);">
      <li>${getText('errorDetailNestedNote1')}</li>
      <li>${getText('errorDetailNestedNote2')}</li>
      <li>${getText('errorDetailNestedNote3')}</li>
      <li>${getText('errorDetailNestedNote4')}</li>
    </ul>
    <div class="line"></div>
    <div class="textarea__container">
      <textarea id="error-${_errorNum}__textarea" class="form-control" rows="${rowNum}">
        ${_stopInfo.value}
      </textarea>
      <div class="textarea__backdrop" style="height: ${rowNum * 24}px">
        <div class="textarea__mark"></div>
      </div>
    </div>
  `
  addErrorDetail({ content, handleContinue: 'handleFinishModifyLabel()' })

  // textarea marks: https://codersblock.com/blog/highlight-text-inside-a-textarea/
  const textarea = $(`#error-${_errorNum}__textarea`)
  const handleInput = () => {
    const text = /** @type {string} */ (textarea.val())
    let markedText = text
      .replace(/</g, _symbol['<'])
      .replace(/>/g, _symbol['>'])
      .replace(/\n$/g, '\n\n')
    _stopInfo.extra.forEach((name) => {
      let result
      const regex = new RegExp(
        `${_symbol['<']}\s*/\s*${name}[^${_symbol['>']}]*${_symbol['>']}`,
        'g',
      )
      while ((result = regex.exec(markedText)) !== null) {
        const beforeStr = markedText.substring(0, result.index)
        const afterStr = markedText.substring(result.index + result[0].length)
        markedText = `${beforeStr}<mark>${result[0]}</mark>${afterStr}`
      }
    })
    $('.textarea__mark').html(markedText)
  }
  const handleScroll = () => {
    var scrollTop = textarea.scrollTop()
    $('.textarea__backdrop').scrollTop(scrollTop)
  }
  textarea.on({
    input: handleInput,
    scroll: handleScroll,
  })
  handleInput()
}

const showModifyNotClosingLabel = () => {
  // TODO: 段落資訊
  const labels = _stopInfo.extra.map((name) => `${_symbol['<']}${name}${_symbol['>']}`).join('、')
  const rowNum = _stopInfo.value.split('\n').length
  const content = `
    ${getText('errorDetailNested1')} ${labels}${getText('errorDetailNested2')}
    <ul style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--color--gray);">
      <li>${getText('errorDetailNestedNote1')}</li>
      <li>${getText('errorDetailNestedNote2')}</li>
      <li>${getText('errorDetailNestedNote3')}</li>
      <li>${getText('errorDetailNestedNote4')}</li>
    </ul>
    <div class="line"></div>
    <div class="textarea__container">
      <textarea id="error-${_errorNum}__textarea" class="form-control" rows="${rowNum}">
        ${_stopInfo.value}
      </textarea>
      <div class="textarea__backdrop" style="height: ${rowNum * 24}px">
        <div class="textarea__mark"></div>
      </div>
    </div>
  `
  addErrorDetail({ content, handleContinue: 'handleFinishModifyLabel()' })

  // textarea marks: https://codersblock.com/blog/highlight-text-inside-a-textarea/
  const textarea = $(`#error-${_errorNum}__textarea`)
  const handleInput = () => {
    const text = /** @type {string} */ (textarea.val())
    let markedText = text
      .replace(/</g, _symbol['<'])
      .replace(/>/g, _symbol['>'])
      .replace(/\n$/g, '\n\n')
    _stopInfo.extra.forEach((name) => {
      let result
      const regex = new RegExp(`${_symbol['<']}\s*${name}[^${_symbol['>']}]*${_symbol['>']}`, 'g')
      while ((result = regex.exec(markedText)) !== null) {
        const beforeStr = markedText.substring(0, result.index)
        const afterStr = markedText.substring(result.index + result[0].length)
        markedText = `${beforeStr}<mark>${result[0]}</mark>${afterStr}`
      }
    })
    $('.textarea__mark').html(markedText)
  }
  const handleScroll = () => {
    var scrollTop = textarea.scrollTop()
    $('.textarea__backdrop').scrollTop(scrollTop)
  }
  textarea.on({
    input: handleInput,
    scroll: handleScroll,
  })
  handleInput()
}

const showDeleteRedundant = () => {
  const content = `
    ${getText('errorDetailRedundant')}
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
  const content = `${labels} ${getText('errorDetailAddEnd')}`
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
