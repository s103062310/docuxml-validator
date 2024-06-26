/** @type {string[]} */
const _metadata = [
  'corpus',
  'filename',
  'title',
  'author',
  'book_code',
  'compilation_name',
  'compilation_order',
  'compilation_vol',
  'doc_attachment',
  'doc_attachment_caption',
  'doc_category_l1',
  'doc_category_l2',
  'doc_category_l3',
  'doc_seq_number',
  'doc_source',
  'doc_topic_l1',
  'doc_topic_l2',
  'doc_topic_l3',
  'docclass',
  'docclass_aux',
  'doctype',
  'doctype_aux',
  'geo_level1',
  'geo_level2',
  'geo_level3',
  'geo_longitude',
  'geo_latitude',
  'time_orig_str',
  'time_varchar',
  'time_norm_year',
  'era',
  'time_norm_kmark',
  'year_for_grouping',
  'time_dynasty',
  'timeseq_not_before',
  'timeseq_not_after',
]

/** @type {Object.<string, string[]>} */
const _xmlArchitecture = {
  root: ['xml', 'ThdlPrototypeExport'],
  ThdlPrototypeExport: ['corpus', 'documents'],
  corpus: ['metadata_field_settings', 'feature_analysis', 'PageParameters'],
  metadata_field_settings: [..._metadata],
  feature_analysis: ['spotlight', 'tag'],
  PageParameters: ['MaxCueItems', 'CorpusTrees', 'HideCueDisplayBeforeSymbol', 'CueSeparator'],
  MaxCueItems: ['Spotlight'],
  CorpusTrees: ['CatTree'],
  documents: ['document'],
  document: [..._metadata, 'xml_metadata', 'doc_content'],
  xml_metadata: [..._metadata, 'Udef_.+'],
  doc_content: ['Paragraph', 'MetaTags'],
  MetaTags: ['Udef_.+'],
}

/** @type {string[]} */
const _allDocuLabel = (() => {
  const allLabel = /** @type {string[]} */ (['a'])
  Object.values(_xmlArchitecture).forEach((labels) => {
    labels.forEach((label) => {
      if (!allLabel.includes(label)) {
        allLabel.push(label)
      }
    })
  })
  return allLabel
})()
