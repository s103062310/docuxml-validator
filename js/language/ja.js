const _ja = {
  title: 'DocuXML 検証ツール',
  description:
    'このツールは、ライブラリファイル（DocuXML）のバリデーションを行い、ライブラリを作成できない理由の特定とその修正を容易にするためのものです。',
  note1:
    'エラーを含んだファイルが繰り返しエクスポートされるのを避けるため、このツールで行った修正は、元のファイル（Excelのテーブルやtxtファイルなど）に必ず反映させてください。',
  note2_1:
    'データベースの作成に失敗した場合は、エラーメッセージのスクリーンショットと、そのXMLファイルを添付して、',
  note2_2: '宛てにご相談ください。',
  navLanguage: '選擇語言',
  navDB: 'マイデータベース',
  upload: 'XMLファイルをアップロード',
  download: '修正済みXMLファイルをダウンロード',
  statusIng: '驗證中...',
  statusSuccess: '検証が完了しました！',
  statusSymbol: '特殊な記号を検出しました',
  statusSymbolAttr: '偵測到標籤屬性中有特殊符號',
  statusNested: '標籤沒有正確嵌套',
  statusRedundant: '偵測到多餘的內容',
  errorDetailSymbol: `${Object.keys(_symbol).join(
    ',',
  )} は、XMLフォーマットでタグを識別するために使用される記号です。 修正には、ツールバーを使用するか、以下のテキストでマークされた記号をクリックしてください：`,
  errorDetailSymbolAttrName: '標籤名稱：',
  errorDetailSymbolAttrValue: '標籤屬性：',
  errorDetailNested1: '閉じられていないタグが検出されました',
  errorDetailNested2: '，実際のニーズに応じてXMLのコンテンツを修正してください：',
  errorDetailNestedNote1: `タグとは特殊な記号 ${_symbol['<']} と ${_symbol['>']} で挟まれた部分です。例：${_symbol['<']}LabelName${_symbol['>']}。`,
  errorDetailNestedNote2: `この段落でタグが不要な場合は、${_symbol['<']} と ${_symbol['>']} をすべて修正し、タグを取り除いて下さい。`,
  errorDetailNestedNote3: `このテキストにタグが必要な場合は、タグが正しく入れ子状になっていることを確認してください。それぞれの開始タグは終了タグと対になっている必要があります。例：${_symbol['<']}LabelName${_symbol['>']}...${_symbol['<']}/LabelName${_symbol['>']}。または、タグで挟まずにセルフクロージングタグを使う場合は ${_symbol['<']}LabelName /${_symbol['>']}のようになります。`,
  errorDetailNestedNote4:
    'この種のエラーにはXMLエンコーディングが関係しています。修正が難しい場合は、メールでご相談ください。',
  errorDetailDeleteEnd: '開始タグがないため、自動的に削除されます。',
  errorDetailAddEnd: '終了タグがない場合は、ドキュメントの最後に自動的に追加されます。',
  errorDetailRedundant: 'タグの外側に余分な単語が検出された場合、その内容は自動的に削除されます。',
  errorSymbol: `請勿使用 ${Object.keys(_symbol).join('、')} 等符號`,
  errorRequired: '必填',
  errorDoSth: '請修正完錯誤再繼續',
  modify: '修正する',
  sure: '確定',
  cancel: '取消',
  delete: '削除する',
  keep: '保留する',
  reset: '重設',
  deleteAll: 'すべて削除する',
  keepAll: 'すべて保留する',
  resetAll: 'すべてリセットする',
  continue: '続ける',
  finish: '終了する',
  unfinished: '未完成',
}
