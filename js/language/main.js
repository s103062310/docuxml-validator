const switchLanguage = (lang) => {
  const l = lang in _langSet ? lang : 'zh'
  const getText = (field) => _langSet[l][field]
  _lang = l
}
