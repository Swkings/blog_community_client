<template>
	<div id="communityContainer">
		<div
			class="loading"
			v-if="state.loading"
			v-loading="state.loading"
			element-loading-text="加载中..."
		></div>
		<div class="sideContainer" v-if="!state.loading && loginState.isSign">
			<div class="ball"></div>
			<div id="sideItems" class="sideItems">
				<div class="item">
					<el-popover
						placement="right"
						:width="state.popover.width"
						trigger="click"
						:offset="state.popover.offset"
						:show-arrow="state.popover.showArrow"
						:visible="state.popover.visible && state.popover.showId == 1"
					>
						<template #reference>
							<el-button class="btn" @click="popoverShow(1)">我的帖子</el-button>
						</template>
						<SendPost @hidenPopover="hidenPopover"></SendPost>
					</el-popover>
				</div>
				<div class="item">
					<el-popover
						placement="right"
						:width="state.popover.width"
						trigger="click"
						:offset="state.popover.offset"
						:show-arrow="state.popover.showArrow"
						:visible="state.popover.visible && state.popover.showId == 2"
					>
						<template #reference>
							<el-button class="btn" @click="popoverShow(2)">我要发帖</el-button>
						</template>
						<SendPost @hidenPopover="hidenPopover"></SendPost>
					</el-popover>
				</div>
			</div>
		</div>
		<div v-if="!state.loading">
			<div class="post-list">
				<div
					class="post"
					v-for="postUser in state.communityData.postUserList"
					:key="postUser.post.id"
				>
					<div class="postContainer" v-if="postUser.post.status != 2">
						<h2 class="title">{{ postUser.post.title }}</h2>
						<div class="info">
							<span class="username">
								<!-- <i class="el-icon-user"></i> -->
								<img
									class="headerImg"
									:src="postUser.user.headerUrl"
									:alt="postUser.user.username"
								/>

								{{ postUser.user.username }}:{{ postUser.user.id }}
							</span>
							<!-- &thinsp; -->
							<el-divider direction="vertical"></el-divider>
							<!-- &thinsp; -->
							<span class="time">
								<i class="el-icon-time"></i>
								{{ formatTime(postUser.post.createTime) }}
							</span>
							<!-- &thinsp; -->
							<el-divider direction="vertical"></el-divider>
							<!-- &thinsp; -->
							<span class="like">
								<i class="iconfont icon-like-b"></i>
								{{ postUser.likeCount }}
							</span>
							<!-- &thinsp; -->
							<el-divider direction="vertical"></el-divider>
							<!-- &thinsp; -->
							<span class="like">
								<i class="el-icon-chat-line-round"></i>
								{{ postUser.post.commentCount }}
							</span>
						</div>
						<div class="content">
							<p>
								{{ postUser.post.content }}
								: id
								{{ postUser.post.id }}
							</p>
						</div>
						<div class="operator">
							<el-button
								type="info"
								icon="el-icon-caret-top"
								circle
								@click="setTop(postUser.post)"
								v-if="loginState.user.type == 2"
								>{{ postUser.post.type == 0 ? "置顶" : "取消置顶" }}</el-button
							>

							<el-button
								type="warning"
								icon="el-icon-star-off"
								circle
								@click="setWonderful(postUser.post)"
								v-if="loginState.user.type == 2"
								>{{ postUser.post.status == 0 ? "加精" : "取消加精" }}</el-button
							>
							<el-button
								type="danger"
								icon="el-icon-delete"
								circle
								@click="setDelete(postUser.post)"
								v-if="loginState.user.type == 1"
								>删除</el-button
							>
						</div>
						<div
							class="more"
							@click="getMore(postUser.post.id)"
							v-if="postUser.post.id != state.showPostDetailId"
						>
							<div>more <i class="el-icon-arrow-down"></i></div>
						</div>
						<div
							class="commentContainer"
							v-if="postUser.post.id == state.showPostDetailId"
						>
							<comment
								:comments="state.commentsData.comments"
								:postUser="postUser"
								:pagination="state.commentsData.pagination"
							>
							</comment>

							<div class="scollup" @click="scollup()">
								<div>scollup <i class="el-icon-arrow-up"></i></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="pagination">
				<el-pagination
					background
					layout="prev, pager, next"
					:total="state.communityData.pagination.rows"
					:page-size="state.communityData.pagination.limit"
					:page-count="state.communityData.pagination.total"
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
		inject,
	} from "vue";
	import service from "@/utils/http/service";
	import urls from "@/api/urls";
	import { useRouter } from "vue-router";
	import { errorMessage, messageHandle, successMessage } from "@/utils/message/index";
	import { formatTime } from "@/utils/tools/index";
	import {
		I_ResponseData,
		I_Pagination,
		I_Post,
		I_CommunityData,
		I_PostUser,
		I_CommentsData,
		I_CommentContainer,
		I_User,
	} from "@/types";
	import { useStore } from "vuex";
	import Comment from "@/components/Comment.vue";
	import SendPost from "@/views/community/SendPost.vue";

	export default defineComponent({
		name: "Community",
		components: {
			Comment,
			SendPost,
		},
		setup() {
			const store = useStore();
			const state = reactive({
				communityData: {
					pagination: {} as I_Pagination,
					postUserList: [] as Array<I_PostUser>,
				} as I_CommunityData,
				commentsData: {
					comments: [] as Array<I_CommentContainer>,
					pagination: {} as I_Pagination,
					post: {} as I_Post,
					likeCount: 0,
					likeStatus: 0,
					user: {} as I_User,
				} as I_CommentsData,
				showPostDetailId: -1,
				loading: true,
				popover: {
					visible: false,
					offset: 60,
					width: 400,
					showId: -1,
					showArrow: false,
				},
			});
			const handleLoadCommunity = async (current: string): Promise<void> => {
				const resData: I_ResponseData | any = await service.get(urls.community, {
					params: { current: current },
				});
				state.communityData = resData.data;
				state.loading = false;
			};

			onMounted(() => {
				handleLoadCommunity("1");
			});
			const handleCurrentChange = (currentPageNum: string) => {
				console.log(currentPageNum);
				console.log("handleCurrentChange");
				handleLoadCommunity(currentPageNum);
			};

			const getMore = async (postId: number) => {
				const resData: I_ResponseData | any = await service.get(
					urls.postDetail + "/" + postId
				);
				console.log("resData:", resData);
				state.commentsData = resData.data;
				state.showPostDetailId = postId;
				console.log("commentsData:", state.commentsData);
			};
			const scollup = () => {
				state.showPostDetailId = -1;
			};

			const hidenPopover = () => {
				state.popover.visible = false;
			};
			const popoverShow = (showID: number): void => {
				state.popover.visible = true;
				state.popover.showId = showID;
				let communityContainer: HTMLElement | null = document.getElementById(
					"communityContainer"
				);
				let sideItems: HTMLElement | null = document.getElementById("sideItems");
				if (communityContainer !== null && sideItems !== null) {
					let pageWidth = communityContainer.clientWidth;
					let sideWidth = sideItems.clientWidth;

					state.popover.width = pageWidth / 4;
					state.popover.offset = pageWidth / 2 + (pageWidth / 4 - sideWidth) / 2;
				}
			};
			const routeReload: Function | any = inject("routeReload");
			const setTop = async (post: I_Post) => {
				const resData: I_ResponseData = await service.post(urls.setTop, { id: post.id });
				console.log("resData: ", resData);
				messageHandle(resData, post.type == 0 ? "置顶" : "取消置顶");
				// 不用重载路由，无痕刷新图标文字
				if (resData.success) {
					post.type = post.type ^ 1;
				}

				// routeReload();
			};
			const setWonderful = async (post: I_Post) => {
				const resData: I_ResponseData = await service.post(urls.setWonderful, {
					id: post.id,
				});
				console.log("resData: ", resData);
				messageHandle(resData, post.status == 0 ? "加精" : "取消加精");
				if (resData.success) {
					post.status = post.status ^ 1;
				}
			};
			const setDelete = async (post: I_Post) => {
				const resData: I_ResponseData = await service.post(urls.setDelete, { id: post.id });
				console.log("resData: ", resData);
				messageHandle(resData, "删除");
				if (resData.success) {
					post.status = 2;
				}
			};
			return {
				state,
				handleCurrentChange,
				formatTime,
				getMore,
				scollup,
				hidenPopover,
				popoverShow,
				loginState: computed(() => store.state.loginState),
				setTop,
				setWonderful,
				setDelete,
			};
		},
	});
</script>

<style lang="less" scoped>
	#communityContainer {
		position: relative;
		.headerImg {
			width: 16px;
		}
		.loading {
			width: 50%;
			margin: 0 auto;
			padding-top: 30%;
		}

		.sideContainer {
			position: fixed;
			border: 1px solid rgb(203, 197, 211);
			height: 80%;
			width: 15%;
			top: 10%;
			left: 5%;
			border-radius: 15px;
			.ball {
				background-color: rgb(158, 152, 145);
				border: 1px solid red;
				box-shadow: 0 0 25px #cac6c6;
				border-radius: 50%;
				width: 60px;
				height: 60px;
			}
			.sideItems {
				width: 100%;
				margin-top: 4em;
				.item {
					text-align: center;
					width: 100%;
					// margin-top: 2em;
					background: #eaeaea;
					height: 3.5em;
					position: relative;
					&:hover {
						background: #b1aeae;
					}
					.btn {
						position: absolute;
						text-align: center;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 100%;
						font-size: 1.5em;
					}
				}
			}
		}
		.post-list {
			width: 100%;
			.post {
				width: 50%;
				margin: 0 auto;
				margin-top: 10px;
				border: 1px solid #eaeaea;
				box-shadow: 0 0 25px #cac6c6;
				border-radius: 15px;
				.title {
					text-align: center;
				}
				.info {
					text-align: center;
				}
				.content {
					text-indent: 2em;
					padding-left: 2em;
					padding-right: 2em;
				}
				.operator {
					margin-top: 15px;
					display: flex;
					justify-content: center;
					.el-button {
						margin-right: 10px;
					}
				}
				.more,
				.scollup {
					width: 100%;
					margin-top: 2em;
					background: #fdfdfd;
					height: 3em;
					border-radius: 0px 0px 15px 15px;
					position: relative;
					&:hover {
						background: #eaeaea;
					}

					div {
						position: absolute;
						text-align: center;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
				.commentContainer {
					margin-top: 5em;
					.comment {
						.userInfo {
							padding-left: 2em;
						}
						.contentContainer {
							.content {
								padding-top: 1em;
							}
							.interactive {
								display: flex;
								justify-content: space-between;
								padding-top: 1em;
								padding-bottom: 2em;
								padding-left: 2em;
								padding-right: 2em;
							}
						}
						.replys {
							margin-left: 5em;
							.contentContainer {
								margin-bottom: 2em;
							}
						}
					}
				}
			}
		}
		.pagination {
			width: 50%;
			margin: 0 auto;
			padding-top: 2%;
			padding-bottom: 2%;
			.el-pagination {
				display: flex;
				justify-content: center;
				.btn-prev,
				.btn-next {
					text-align: center;
					margin: 0 auto;
				}
			}
		}
	}
</style>
