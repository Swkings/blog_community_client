// 公共state对象，存储所有组件的状态
const state = {
	user: {
		id: "",
		username: "",
		avatar: "",
		taken: "",
	},
};

// 唯一取值的方法
const getters = {
	getUser(state: Object | any) {
		return state.user;
	},
};

// 唯一可以修改state值的方法，同步阻塞
const mutations = {
	setUser(state: Object | any, user: Object | any) {
		state.user = user;
	},
	setId(state: Object | any, id: String) {
		state.user.id = id;
	},
};

// actions
const actions = {
	asyncSetId(context: Object | any, id: String) {
		context.commit("setUser", id);
	},
	asyncSetUser(context: Object | any, user: Object | any) {
		context.commit("setUser", user);
	},
	// asyncSetUser({ commit, state }, user) {
	// 	commit("setUser", user);
	// },
};

export default {
	// namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
