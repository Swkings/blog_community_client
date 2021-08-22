<template>
	<div id="searchContainer">
		<div
			class="loading"
			v-if="state.loading"
			v-loading="state.loading"
			element-loading-text="加载中..."
		></div>
		<div v-if="!state.loading">
			<!-- <json-viewer
				:value="state.searchData.postUserList"
				:expand-depth="5"
				copyable
				boxed
			></json-viewer> -->
			<div class="search-list">
				<post :postUserList="state.searchData.postUserList"> </post>
			</div>
			<div class="pagination">
				<el-pagination
					background
					layout="prev, pager, next"
					:total="state.searchData.pagination.rows"
					:page-size="state.searchData.pagination.limit"
					:page-count="state.searchData.pagination.total"
					@current-change="handleCurrentChange"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		defineComponent,
		reactive,
		toRefs,
		ref,
		onBeforeMount,
		toRef,
		onMounted,
		computed,
	} from "vue";
	import service from "@/utils/http/service";
	import urls from "@/api/urls";
	import { useRouter, onBeforeRouteLeave } from "vue-router";
	import { errorMessage, successMessage } from "@/utils/message/index";
	import { I_ResponseData, I_Pagination, I_PostUser, I_CommunityData } from "@/types";
	import { useStore } from "vuex";
	import { toRaw } from "@vue/reactivity";
	import Post from "@/components/Post.vue";
	import { isBlank } from "@/utils/tools/index";

	export default defineComponent({
		name: "Search",
		components: {
			Post,
		},

		setup() {
			const store = useStore();
			const router = useRouter();
			const state = reactive({
				searchData: {
					pagination: {} as I_Pagination,
					postUserList: [] as Array<I_PostUser>,
				} as I_CommunityData,
				loading: true,
			});
			const keyword = store.state.searchKeyword.keyword;
			console.log("keyword:", keyword);
			const handleSearch = async (): Promise<void> => {
				localStorage.searchKeyword = JSON.stringify(store.state.searchKeyword);
				// if (isBlank(keyword)) return;
				const resData: I_ResponseData = await service.get(urls.search, {
					params: { keyword: keyword },
				});
				if (resData.success) {
					state.searchData = resData.data;
					if (state.searchData.postUserList.length == 0) {
						errorMessage("没有搜索到数据");
					} else {
						state.loading = false;
					}
				} else {
					if (resData.message != undefined && resData.message != "") {
						errorMessage(resData.message);
					} else {
						errorMessage("请求错误！");
					}
				}
			};
			onMounted(() => {
				handleSearch();
			});

			const handleCurrentChange = async (currentPageNum: string) => {
				if (isBlank(keyword)) return;
				const resData: I_ResponseData | any = await service.get(urls.search, {
					params: { keyword: keyword, current: currentPageNum },
				});
				state.searchData = resData.data;
				if (resData.success) {
					state.searchData = resData.data;
					if (state.searchData.postUserList.length == 0) {
						errorMessage("没有搜索到数据");
					} else {
						state.loading = false;
					}
				} else {
					if (resData.message != undefined && resData.message != "") {
						errorMessage(resData.message);
					} else {
						errorMessage("请求错误！");
					}
				}
			};
			// 如果离开搜索页面，清除搜索框的关键字
			onBeforeRouteLeave((to, from) => {
				console.log("from:", from.path, " to:", to.path);
				if (to.path != from.path) {
					localStorage.removeItem("searchKeyword");
					store.commit("searchKeyword/reset");
				}
				return true;
			});
			return {
				state,
				handleSearch,
				handleCurrentChange,
				keyword,
			};
		},
	});
</script>

<style lang="less" scoped>
	.pagination {
		width: 50%;
		margin: 0 auto;
		padding-top: 2%;
		padding-bottom: 2%;
		.el-pagination {
			width: 50%;
			margin: 0 auto;
		}
	}
</style>
