const state =
	localStorage.searchKeyword != undefined
		? JSON.parse(localStorage.searchKeyword)
		: {
				keyword: "",
		  };

// 唯一取值的方法
const getters = {
	getKeyword(state: Object | any) {
		return state.keyword;
	},
};

// 唯一可以修改state值的方法，同步阻塞
const mutations = {
	setKeyword(state: Object | any, keyword: String) {
		state.keyword = keyword;
	},
	reset(state: Object | any) {
		state.keyword = "";
	},
};

// actions
const actions = {
	asyncSetKeyword(context: Object | any, keyword: String) {
		context.commit("setKeyword", keyword);
	},
	asyncReset(context: Object | any) {
		context.commit("reset");
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
