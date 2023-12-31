module.exports = {
  // Config for EMEA DEMO NS
  APP_ID: "LBSI0E7ZA4",
  API_KEY: "08673f37d38ef76646b8e359a706646f",
  INDICES: [
    {
      name: 'sku-en-gb_test_keyword',
      label: 'Keyword',
      alpha: 0,
    },
    {
      name: 'sku-en-gb_test',
      label: 'USE',
      alpha: 0.75,
    },
    {
      name: 'sku-en-gb_test_miniLM',
      label: 'miniLM',
      alpha: 0.75,
    },
  ],
  HIT_URL_REF:
    "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton---",
  HIT_PER_PAGE: 25,
  TYPO_TOLERANCE: "min",
};
