<template>
	<div id="wrapper">
		<div id="myHeader">
			<Header></Header>
		</div>

		<!-- <router-view />
		<router-link to="/login">登录</router-link>
		<router-link :to="{ name: 'About', params: { id: 11 } }"
			>关于</router-link
		> -->
		<div id="myMain" class="scoll-top">
			<el-backtop target=".scoll-top">
				<i class="el-icon-caret-top"></i>
			</el-backtop>

			<router-view v-if="isRouteAlive" />
		</div>

		<!-- <h3>User: {{ user }}</h3>
		<h3>GetUser1: {{ getU }}</h3>
		<h3>GetUser2: {{ U.U3 }}</h3>
		<h3>
			SetUser:
			<i @click="setUser(U.U1)">{{ $store.state.userInfo.user }}</i>
		</h3>
		<h3>
			asyncSetUser:
			<i @click="asyncSetUser(U.U2)">{{ $store.state.userInfo.user }}</i>
		</h3> -->
		<div id="myFooter">
			<Footer></Footer>
		</div>
	</div>
</template>

<script lang="ts">
	// @ is an alias to /src
	import { computed, defineComponent, nextTick, provide, reactive, ref } from "vue";
	import Footer from "../components/Footer.vue";
	import Header from "../components/Header.vue";
	import { mapActions, mapGetters, mapMutations, mapState, useStore } from "vuex";

	export default defineComponent({
		name: "Home",
		components: {
			Header,
			Footer,
		},
		setup(props, context) {
			const U = reactive({
				U1: { id: 1, username: 2, avatar: 3, taken: 4 },
				U2: { id: 2, username: 3, avatar: 4, taken: 5 },
				U3: {},
			});
			let isRouteAlive = ref(true);
			const store = useStore();
			// store.commit("setUser", U1);
			// store.dispatch("asyncSetUser", U2);
			const setUser = (parm: object) => {
				store.commit("setUser", parm);
			};
			const asyncSetUser = (parm: object) => {
				store.dispatch("asyncSetUser", parm);
			};
			U.U3 = computed(() => store.state.userInfo);

			// 为子组件提供刷新路由的方法
			const routeReload: Function = () => {
				isRouteAlive.value = false;
				nextTick(() => {
					isRouteAlive.value = true;
				});
			};
			provide("routeReload", routeReload);
			return {
				U,
				setUser,
				asyncSetUser,
				isRouteAlive,
			};
		},
		computed: {
			...mapState({
				user: "userInfo",
			}),
			// ...mapGetters("userInfo", {
			// 	getU: "getUser",
			// }),
			...mapGetters({
				getU: "getUser",
			}),
		},
		methods: {
			// ...mapMutations(["setId", "setUser"]),
			// ...mapActions(["asyncSetId", "asyncSetUser"]),
			// ...mapMutations({
			// 	setU: "userInfo/setUser",
			// }),
			// ...mapActions({
			// 	asyncSetU: "userInfo/asyncSetUser",
			// }),
		},
	});
</script>

<style lang="less" scoped>
	.scoll-top {
		height: 100vh;
		overflow-x: hidden;
	}
	#wrapper {
		margin: 0 auto;
		min-height: 100%;
		height: 100%;
		#myHeader {
			height: 60px; /*58px为footer的高度+margin*/
			// background-color: rgb(138, 27, 27);
		}
		#myMain {
			min-height: calc(100% - 60px - 80px); /*58px为footer的高度+margin*/
			// min-height: 200px; /*58px为footer的高度+margin*/
			// background-color: rgb(62, 143, 89);
		}
		#myFooter {
			height: 80px;
			// background-color: rgb(29, 27, 138);
		}
	}
</style>
