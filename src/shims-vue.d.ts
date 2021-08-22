/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 将v-md-editor声明为module
declare module '@kangc/v-md-editor/lib/theme/github.js';

declare module '@kangc/v-md-editor';
declare module 'codemirror';
declare module '@kangc/v-md-editor/lib/plugins/line-number/index';
declare module '@kangc/v-md-editor/lib/plugins/katex/cdn';

declare module 'vue3-json-viewer';
