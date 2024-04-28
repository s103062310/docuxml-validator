const _langSet = { zh: _zh, en: _en }

const getText = (field) => {
  const l = _lang in _langSet ? _lang : 'zh'
  return _langSet[l][field]
}

const switchLanguage = () => {
  // title
  const title = getText('title')
  $('title').text(title)
  $('#title').text(title)
  $('[property="og:title"]').text(title)

  // nav
  $('#nav-language').text(getText('navLanguage'))
  $('#nav-db').text(getText('navDB'))

  // header
  $('#description').text(getText('description'))
  $('#note1').text(getText('note1'))
  $('#note2-1').text(getText('note2_1'))
  $('#note2-2').text(getText('note2_2'))
  $('#btn1').text(getText('upload'))
  $('#btn2').text(getText('download'))
}
