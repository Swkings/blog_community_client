// 公共state对象，存储所有组件的状态
// const state =
// 	localStorage.loginState != undefined
// 		? JSON.parse(localStorage.loginState)
// 		: {
// 				isSign: false,
// 				username: "",
// 		  };

import { I_User } from "@/types";

const state =
	localStorage.loginState != undefined
		? JSON.parse(localStorage.loginState)
		: {
				isSign: false,
				user: {} as I_User,
				expiredTime: -1,
		  };

// const storage = localStorage.loginState != undefined ? JSON.parse(localStorage.loginState) : undefined;
// const state1 =
// 	storage != undefined && new Date().getTime() > storage.expiredTime
// 		? storage
// 		: {
// 				isSign: false,
// 				user: {} as I_User,
// 				expiredTime: -1,
// 		  };

// 唯一取值的方法
const getters = {
	getIsSign(state: Object | any) {
		return state.isSign;
	},
	getUser(state: Object | any) {
		return state.user;
	},
	getExpiredTime(state: Object | any) {
		return state.expiredTime;
	},
};

// 唯一可以修改state值的方法，同步阻塞
const mutations = {
	setLoginState(state: Object | any, loginState: Object | any) {
		state.isSign = loginState.isSign;
		state.user = loginState.user;
	},
	setIsSign(state: Object | any, isSign: Boolean) {
		state.isSign = isSign;
	},
	setExpiredTime(state: Object | any, expiredTime: number) {
		state.expiredTime = expiredTime;
	},
	reset(state: Object | any) {
		state = {
			isSign: false,
			user: {} as I_User,
			expiredTime: -1,
		};
	},
};

// actions
const actions = {
	asyncSetLoginState(context: Object | any, loginState: Object | any) {
		context.commit("setLoginState", loginState);
	},
	asyncSetIsSign(context: Object | any, isSign: Boolean) {
		context.commit("setIsSign", isSign);
	},
	asyncSetExpiredTim(context: Object | any, expiredTime: number) {
		context.commit("setExpiredTime", expiredTime);
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
