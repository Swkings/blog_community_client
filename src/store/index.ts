import { createStore } from "vuex";

import userInfo from "./modules/userInfo";
import loginState from "./modules/loginState";
import searchKeyword from "./modules/searchKeyword";

export default createStore({
	modules: {
		userInfo,
		loginState,
		searchKeyword,
	},
});
