<template>
	<div id="nav">
		<div class="flexDiv">
			<div class="search">
				<input
					type="text"
					placeholder="search"
					v-model="keyword"
					@keydown.enter="doSearch"
				/>
				<!-- <el-input
					type="text"
					v-model="searchText"
					placeholder="search"
					@keydown.enter="doSearch"
				></el-input> -->
				<!-- <i class="iconfont icon-search-b" @click="doSearch"></i> -->
				<i class="icon-search el-icon-search" @click="doSearch"></i>
			</div>
			<nav>
				<ul>
					<router-link to="/home" tag="li" class="link-li">首页</router-link>
					<router-link to="/tsp-solver" tag="li" class="link-li">TSP Solver</router-link>
					<router-link to="/blog" tag="li" class="link-li">博客</router-link>
					<router-link to="/community" tag="li" class="link-li">社区</router-link>
					<router-link to="/message" tag="li" class="link-li">消息</router-link>
					<li v-if="loginState.isSign" class="loginState">
						<el-dropdown>
							<span class="el-dropdown-link">
								<img
									class="userImg"
									:src="loginState.user.headerUrl"
									:alt="loginState.user.username"
								/>
								{{ loginState.user.username }}
								<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item class="iconfont icon-user-b"
										><el-link
											:underline="false"
											href="/userCenter"
											class="userCenter"
										>
											&emsp; 个人中心</el-link
										></el-dropdown-item
									>
									<el-dropdown-item class="iconfont icon-poweroff-b">
										<el-button type="text" @click="logout" class="logout">
											&emsp; 注销</el-button
										>
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</li>
					<li v-else>
						<el-dropdown>
							<span class="el-dropdown-link">
								Sign<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item icon="el-icon-user"
										><el-link :underline="false" href="/login">Sign In</el-link>
									</el-dropdown-item>
									<el-dropdown-item icon="el-icon-user-solid"
										><el-link :underline="false" href="/register"
											>Sign Up</el-link
										></el-dropdown-item
									>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</li>
				</ul>
			</nav>
		</div>
		<div class="container" v-if="false">
			<img src="@/assets/img/bgImg.jpg" alt="bgimage" class="bgImage" />
			<div :class="headline.animation" id="title">
				{{ headline.content }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, inject, reactive, ref } from "vue";
	import { useStore } from "vuex";
	import service from "../utils/http/service";
	import urls from "../api/urls";
	import { useRouter } from "vue-router";
	import { I_ResponseData } from "@/types";
	import { successMessage } from "@/utils/message";
	import { toRaw } from "@vue/reactivity";
	import { isBlank } from "@/utils/tools";
	export default defineComponent({
		name: "Header",
		components: {},
		setup() {
			const store = useStore();
			const router = useRouter();
			const keyword = ref("");
			keyword.value = store.state.searchKeyword.keyword;
			const routeReload: Function | undefined = inject("routeReload");

			// const loginState = reactive({
			// 	isSign: false,
			// 	username: "",
			// });
			// const loginState = computed(() => store.state.loginState);
			let headline = reactive({
				content: "青青子衿  悠悠我心",
				animation: "",
			});
			const logout = async () => {
				const resData: I_ResponseData = await service.post(urls.logout);
				localStorage.removeItem("loginState");
				if (resData.success) {
					if (resData.message != undefined && resData.message != "") {
						successMessage(resData.message);
					}
				}
				window.location.reload();
			};
			const doSearch = () => {
				if (isBlank(keyword.value)) return;
				store.commit("searchKeyword/setKeyword", keyword);

				if (routeReload instanceof Function) {
					routeReload();
				}
				router.push("/search");
			};

			return {
				keyword,
				headline,
				// loginState,
				loginState: computed(() => store.state.loginState),
				logout,
				doSearch,
			};
		},
	});
</script>

<style lang="less" scoped>
	#nav {
		height: 100%;
		// position: relative;
		margin-left: 0%;
		margin-right: 0%;
		padding: 0%;
		.userImg {
			width: 16px;
		}
		.flexDiv {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap-reverse;
			background: rgb(255, 255, 255);
			width: 100%;
			.search {
				margin-top: 10px;
				margin-left: 20px;
				position: relative;
				// width: calc(100%-20px);
				width: 20%;
				input {
					// color: #fff;
					outline: none;
					background: transparent;
					width: 90%;
					height: 60%;
					line-height: 80%;
					border-radius: 20px;
					font-size: 1.125rem;
					padding-left: 2%;
					border: 0.125rem solid #cccccc;
				}
				.icon-search {
					cursor: pointer;
					font-size: 1.5rem;
					color: #0c0a0a;
					position: absolute;
					left: 80%;
					top: 5px;
				}
			}
			nav {
				width: 60%;
				height: 100%;
				// height: 3.125rem;
				margin-right: 5%;
				font-size: 1.25rem;
				ul {
					color: white;
					display: flex;
					flex-wrap: nowrap;
					justify-content: space-around;
					list-style: none;
					width: 100%;
					.link-li {
						color: #303133;
						// width: 15%;
						// font-size: 1.5rem;
						text-align: center;
						// margin-right: 2%;
						height: 80%;
						// line-height: 3.3125rem;
						text-decoration: none;
						cursor: pointer;
						border-bottom: 0.2rem solid transparent;
						&:hover {
							border-bottom: 0.1rem solid rgb(52, 56, 56);
							transition: all 0.8s;
						}
						// &.router-link-active {
						// 	border-bottom: 0.1875rem solid rgb(129, 216, 208);
						// }
					}
					.userState {
						text-align-last: justify;
						text-align: justify;
						text-justify: distribute-all-lines;
						.router-link-active {
							text-decoration: none;
						}
					}
				}
			}
		}
		.container {
			overflow: hidden;
			width: 100%;
			// height: 37.5rem;
			height: 100%;
		}
		.bgImage {
			display: block;
			width: 100%;
			// height: 37.5rem;
			height: 100%;
			height: 37.5rem;
			transform: perspective(62.5rem) translateZ(0);
			transition: 8s;
			&:hover {
				transform: perspective(62.5rem) translateZ(6.25rem);
				transition: 8s;
			}
		}
		#title {
			font-family: Georgia, "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", serif;
			color: #fff;
			text-align: center;
			font-size: 3.125rem;
			width: 31.25rem;
			height: 3.125rem;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -0.625rem;
			margin-left: -15.625rem;
		}
	}
	@media screen and (max-width: 980px) {
		nav {
			width: 60% !important;
		}
	}
	@media screen and (max-width: 440px) {
		.container,
		.bgImage {
			height: 18rem !important;
		}
		#title {
			font-size: 2rem !important;
		}
		nav {
			width: 100% !important;
			ul {
				width: 100% !important;
				padding-left: 0 !important;
				li {
					font-size: 0.9rem !important;
					margin-right: 0 !important;
				}
			}
		}
		.search {
			z-index: 2;
			position: absolute !important;
			top: 3.2rem;
			left: 50%;
			margin-left: -8.125rem !important;
		}
	}
	.userCenter,
	.logout,
	.el-button--text {
		color: #909399;
		:hover {
			color: #409eff;
		}
	}
</style>
