import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "./assets/css/global.css";
// Markdown
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
// highlightjs
import hljs from "highlight.js";
// codemirror 编辑器的相关资源
import Codemirror from "codemirror";
// mode
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/vue/vue";
// edit
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
// placeholder
import "codemirror/addon/display/placeholder";
// active-line
import "codemirror/addon/selection/active-line";
// scrollbar
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";
// style
import "codemirror/lib/codemirror.css";
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/cdn";

VMdEditor.Codemirror = Codemirror;

// json-viewer
import JsonViewer from "vue3-json-viewer";

import VueCookies from "vue-cookies";

import myCharts from "echarts";

VMdEditor.use(githubTheme, {
	Hljs: hljs,
});
VMdEditor.use(createLineNumbertPlugin());
VMdEditor.use(createKatexPlugin());

const Vue = createApp(App);

Vue.config.globalProperties.$cookies = VueCookies;
// Vue.use(VueCookies);

Vue.use(store);

Vue.use(router);
Vue.use(ElementPlus);
Vue.use(VMdEditor);

Vue.use(JsonViewer);
Vue.use(myCharts);

Vue.mount("#app");
