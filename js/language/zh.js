const _zh = {
  title: '建庫檔(DocuXML) 檢測工具',
  description: '這個工具提供 DocuXML 的合法性檢測，快速找出無法建庫的原因並修正。',
  note1:
    '為避免一再轉出包含錯誤的檔案，請務必記得將在本工具中做的修改，同步到原始檔案中（excel 表格、txt 文本等）。',
  note2_1: '若無法順利建庫，請螢幕截圖錯誤訊息並附上 xml 檔案，來信',
  note2_2: '由專人協助。',
  navLanguage: '選擇語言',
  navDB: '我的資料庫',
  upload: '上傳 XML 檔案',
  download: '下載已修正成果',
  statusIng: '驗證中...',
  statusSuccess: '驗證成功！',
  statusSymbol: '偵測到特殊符號',
  statusSymbolAttr: '偵測到標籤屬性中有特殊符號',
  statusNested: '標籤沒有正確嵌套',
  statusRedundant: '偵測到多餘的內容',
  errorDetailSymbol: `${Object.keys(_symbol).join(
    '、',
  )} 為 xml 格式中用來辨認標籤的符號，請使用工具列或者點擊以下文本中標示出的符號做更改：`,
  errorDetailSymbolAttrName: '標籤名稱：',
  errorDetailSymbolAttrValue: '標籤屬性：',
  errorDetailNested1: '偵測到未閉合標籤',
  errorDetailNested2: '，請根據實際需求修改 XML 內容：',
  errorDetailNestedNote1: `標籤是由特殊符號 ${_symbol['<']} 與 ${_symbol['>']} 夾起來的內容
  ，例：${_symbol['<']}LabelName${_symbol['>']}。`,
  errorDetailNestedNote2: `若此段文字不需要標籤，請修改所有 ${_symbol['<']} 和 ${_symbol['>']} 避免使用。`,
  errorDetailNestedNote3: `若此段文字有標籤需求，請確認標籤有正確嵌套，意即每個起始標籤皆需配對到一個結束標籤 
  (${_symbol['<']}LabelName${_symbol['>']}...${_symbol['<']}/LabelName${_symbol['>']})，
  或者自行閉合 (${_symbol['<']}LabelName /${_symbol['>']})，且標籤之間沒有交錯。`,
  errorDetailNestedNote4: '此類錯誤涉及 XML 編碼，若有修改困難，請來信尋求協助。',
  errorDetailDeleteEnd: '缺少起始標籤，將自動刪除。',
  errorDetailAddEnd: '缺少結束標籤，將自動補在文件尾端。',
  errorDetailRedundant: '在標籤外偵測到多餘的文字，將自動刪除該內容。',
  errorSymbol: `請勿使用 ${Object.keys(_symbol).join('、')} 等符號`,
  errorRequired: '必填',
  errorDoSth: '請修正完錯誤再繼續',
  modify: '修改',
  sure: '確定',
  cancel: '取消',
  delete: '刪除',
  keep: '保留',
  reset: '重設',
  deleteAll: '全部刪除',
  keepAll: '全部保留',
  resetAll: '全部重設',
  continue: '繼續',
  finish: '結束',
  unfinished: '未完成',
}