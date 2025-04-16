
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 46321, hash: '3ff01050bccd38ecbe5a7e013494fd7f06bfcbe8edc1d40ba67d5b7c68bd4587', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 34460, hash: '616f6cb87a0837b3ce029c44530b55843729c60add93b4de8e5c233fe287dba5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PDSANYCN.css': {size: 12563, hash: '9tBq6FU2asA', text: () => import('./assets-chunks/styles-PDSANYCN_css.mjs').then(m => m.default)}
  },
};
