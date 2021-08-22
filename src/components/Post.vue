<template>
	<div class="post" v-for="(postUser, i) in postUserList" :key="i">
		<!-- <h2 class="title">{{ postUser.post.title }}</h2> -->
		<h2 class="title" v-html="postUser.post.title"></h2>
		<div class="info">
			<span class="username">
				<img
					class="headerImg"
					:src="postUser.user.headerUrl"
					:alt="postUser.user.username"
				/>
				&thinsp;
				{{ postUser.user.username }}
			</span>
			<el-divider direction="vertical"></el-divider>
			<span class="time">
				<i class="el-icon-time"></i>
				&thinsp;
				{{ formatTime(postUser.post.createTime) }}
			</span>
			<el-divider direction="vertical"></el-divider>
			<span class="like">
				<i class="iconfont icon-like-b"></i>
				&thinsp;
				{{ postUser.likeCount }}
			</span>
		</div>

		<p class="content" v-html="postUser.post.content"></p>
		<div
			class="more"
			@click="getMore(postUser.post.id)"
			v-if="postUser.post.id != state.showPostDetailId"
		>
			<div>more <i class="el-icon-arrow-down"></i></div>
		</div>
		<div class="commentContainer" v-if="postUser.post.id == state.showPostDetailId">
			<comment :comments="state.commentsData.comments"> </comment>

			<div class="scollup" @click="scollup()">
				<div>scollup <i class="el-icon-arrow-up"></i></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		I_ResponseData,
		I_Pagination,
		I_Post,
		I_PostUser,
		I_CommentsData,
		I_CommentContainer,
		I_User,
	} from "@/types";
	import { defineComponent, reactive } from "vue";
	import { formatTime } from "@/utils/tools/index";
	import service from "@/utils/http/service";
	import urls from "@/api/urls";
	import Comment from "@/components/Comment.vue";
	export default defineComponent({
		name: "Post",
		components: {
			Comment,
		},
		props: {
			postUserList: {
				default: [] as Array<I_PostUser>,
			},
		},
		setup() {
			const state = reactive({
				commentsData: {
					comments: [] as Array<I_CommentContainer>,
					pagination: {} as I_Pagination,
					post: {} as I_Post,
					likeCount: 0,
					likeStatus: 0,
					user: {} as I_User,
				} as I_CommentsData,
				showPostDetailId: -1,
			});
			const getMore = async (postId: number) => {
				const resData: I_ResponseData | any = await service.get(
					urls.postDetail + "/" + postId
				);
				state.commentsData = resData.data;
				state.showPostDetailId = postId;
			};
			const scollup = () => {
				state.showPostDetailId = -1;
			};
			return {
				formatTime,
				state,
				getMore,
				scollup,
			};
		},
	});
</script>

<style scoped lang="less">
	.headerImg {
		width: 16px;
	}
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
</style>
