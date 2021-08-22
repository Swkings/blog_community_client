<template>
	<div class="post-action">
		<span class="like" @click="like('post', postUser)">
			<i
				:class="`iconfont ` + (postUser.likeStatus == 0 ? `icon-like-b` : `icon-like-a`)"
				style="font-size:20px"
			></i>
		</span>
		<el-divider direction="vertical"></el-divider>
		<span class="reply">
			<el-popover
				placement="right"
				:width="state.popover.width"
				trigger="click"
				:offset="state.popover.offset"
				:show-arrow="state.popover.showArrow"
				:visible="state.popover.visible && state.popover.showId == postUser.post.id"
			>
				<template #reference>
					<span type="primary" @click="popoverShow(postUser.post.id)">
						<i class="iconfont icon-comment-a" style="font-size:16.8px"></i>
					</span>
				</template>
				<div class="replyBody">
					<h3 class="title">评论{{ postUser.user.username }}: {{ postUser.user.id }}</h3>
					<el-input type="textarea" v-model="state.replyComment.content"></el-input>
					<div
						class="btns"
						style="display: flex;
										justify-content: center;
										margin-top:3px"
					>
						<el-button size="mini" type="info" @click="hidenPopover()">取消</el-button>
						<el-button
							size="mini"
							type="primary"
							@click="reply(1, postUser.post.id, postUser.post.userId, postUser)"
							>评论</el-button
						>
					</div>
				</div>
			</el-popover>
		</span>
	</div>
	<!-- <json-viewer :value="state.comments"></json-viewer> -->
	<div class="comment" v-for="(commentContainer, i) in state.comments" :key="i">
		<el-divider
			><el-tag>{{ pagination.offset + (i + 1) }}#</el-tag></el-divider
		>
		<div class="userInfo">
			<img
				class="headerImg"
				:src="commentContainer.user.headerUrl"
				:alt="commentContainer.user.username"
			/>
			&thinsp;
			<i>
				{{ commentContainer.user.username }}
				:
				{{ commentContainer.user.id }}
			</i>
		</div>
		<div class="contentContainer">
			<div class="content">
				{{ commentContainer.comment.content }}
				: id
				{{ commentContainer.comment.id }}
			</div>
			<div class="interactive">
				<div class="time">
					<i class="el-icon-time">发表于</i>
					&thinsp;
					{{ formatTime(commentContainer.comment.createTime) }}
				</div>
				<div class="action" v-if="commentContainer.comment.id">
					<span class="like" @click="like('comment', commentContainer)">赞</span>
					<span>({{ commentContainer.likeCount }})</span>
					<el-divider direction="vertical"></el-divider>
					<span class="reply">
						<el-popover
							placement="right"
							:width="state.popover.width"
							trigger="click"
							:offset="state.popover.offset"
							:show-arrow="state.popover.showArrow"
							:visible="state.popover.visible && state.popover.showId == i"
						>
							<template #reference>
								<span type="primary" @click="popoverShow(i)">回复</span>
							</template>
							<div class="replyBody">
								<h3 class="title">
									回复{{ commentContainer.user.username }}:{{
										commentContainer.user.id
									}}
								</h3>
								<el-input
									type="textarea"
									v-model="state.replyComment.content"
								></el-input>
								<div
									class="btns"
									style="display: flex;
										justify-content: center;
										margin-top:3px"
								>
									<el-button size="mini" type="info" @click="hidenPopover()"
										>取消</el-button
									>
									<el-button
										size="mini"
										type="primary"
										@click="
											reply(
												2,
												commentContainer.comment.id,
												0,
												commentContainer
											)
										"
										>回复</el-button
									>
								</div>
							</div>
						</el-popover>
					</span>

					<span>({{ commentContainer.replyCount }})</span>
				</div>
			</div>
		</div>
		<div class="replys" v-if="commentContainer.replyCount != 0">
			<div class="reply" v-for="(replyContainer, j) in commentContainer.replys" :key="j">
				<!-- <json-viewer :value="replyContainer"></json-viewer> -->
				<div class="userInfo">
					<img
						class="headerImg"
						:src="replyContainer.user.headerUrl"
						:alt="replyContainer.user.username"
					/>

					{{ replyContainer.user.username }}
					:
					{{ replyContainer.user.id }}
					<span v-if="replyContainer.target !== null">
						回复
						<img
							class="headerImg"
							:src="replyContainer.target.headerUrl"
							:alt="replyContainer.target.username"
						/>
						{{ replyContainer.target.username }}
						:
						{{ replyContainer.target.id }}
					</span>
				</div>
				<div class="contentContainer">
					<div class="content">
						{{ replyContainer.reply.content }}
						: id
						{{ replyContainer.reply.id }}
					</div>
					<div class="interactive">
						<div class="time">
							<i class="el-icon-time">回复于</i>
							&thinsp;
							{{ formatTime(replyContainer.reply.createTime) }}
						</div>
						<div class="action" v-if="replyContainer.reply.id">
							<span class="like" @click="like('reply', replyContainer)">赞</span>
							<span>({{ replyContainer.likeCount }})</span>
							<el-divider direction="vertical"></el-divider>
							<span class="reply">
								<el-popover
									placement="right"
									:width="state.popover.width"
									trigger="click"
									:offset="state.popover.offset"
									:show-arrow="state.popover.showArrow"
									:visible="
										state.popover.visible &&
											state.popover.showId == replyContainer.reply.id
									"
								>
									<template #reference>
										<span
											type="primary"
											@click="popoverShow(replyContainer.reply.id)"
											>回复</span
										>
									</template>
									<div class="replyBody">
										<h3 class="title">
											回复{{ replyContainer.user.username }}
											:
											{{ replyContainer.user.id }}
										</h3>
										<el-input
											type="textarea"
											v-model="state.replyComment.content"
										></el-input>
										<div
											class="btns"
											style="display: flex;
										justify-content: center;
										margin-top:3px"
										>
											<el-button
												size="mini"
												type="info"
												@click="hidenPopover()"
												>取消</el-button
											>
											<el-button
												size="mini"
												type="primary"
												@click="
													reply(
														2,
														replyContainer.reply.id,
														replyContainer.user.id,
														commentContainer
													)
												"
												>回复</el-button
											>
										</div>
									</div>
								</el-popover>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="pagination">
		<el-pagination
			background
			layout="prev, pager, next"
			:total="state.pagination.rows"
			:page-size="state.pagination.limit"
			:page-count="state.pagination.total"
			@current-change="handleCurrentChange"
		>
		</el-pagination>
	</div>
</template>

<script lang="ts">
	import {
		I_CommentContainer,
		I_Comment,
		I_Post,
		I_PostUser,
		I_ResponseData,
		I_ReplyContainer,
		I_Pagination,
	} from "@/types";
	import { defineComponent, getCurrentInstance, reactive } from "vue";
	import { formatTime, isBlank } from "@/utils/tools/index";
	import service from "@/utils/http/service";
	import urls from "@/api/urls";
	import { messageHandle } from "@/utils/message";
	export default defineComponent({
		name: "Comment",
		components: {},
		props: {
			comments: {
				default: [] as Array<I_CommentContainer>,
			},
			postUser: {
				default: {} as I_PostUser,
			},
			pagination: {
				default: {} as I_Pagination,
			},
		},
		setup(props) {
			const state = reactive({
				popover: {
					visible: false,
					offset: 30,
					width: 300,
					showId: -1,
					showArrow: false,
				},
				replyComment: {} as I_Comment,
				comments: props.comments as Array<I_CommentContainer>,
				pagination: props.pagination as I_Pagination,
			});
			const hidenPopover = () => {
				state.popover.visible = false;
			};
			const popoverShow = (showID: number): void => {
				state.popover.visible = true;
				if (showID != state.popover.showId) {
					state.replyComment.content = "";
				}
				state.popover.showId = showID;
			};
			type T_CPR = (I_CommentContainer & I_PostUser & I_ReplyContainer) | any;
			const like = async (entityType: string, CPR: T_CPR) => {
				console.log("CPR: ", CPR);
				const params = {
					entityType: 0,
					entityId: 0,
					entityUserId: 0,
					postId: 0,
				};
				if (entityType == "post") {
					// this,1,${post.id},${post.userId},${post.id}
					params.entityType = 1;
					params.entityId = CPR.post.id;
					params.entityUserId = CPR.post.userId;
				} else {
					// this,2,${cvo.comment.id},${cvo.comment.userId},${post.id}
					// this,2,${rvo.reply.id},${rvo.reply.userId},${post.id}
					params.entityType = 2;
					if (entityType == "comment") {
						params.entityId = CPR.comment.id;
						params.entityUserId = CPR.comment.userId;
					} else {
						params.entityId = CPR.reply.id;
						params.entityUserId = CPR.reply.userId;
					}
				}
				params.postId = props.postUser.post.id;
				console.log("params: ", params);

				const resData: I_ResponseData = await service.post(urls.like, params);
				console.log("resData: ", resData);
				// 不用重载路由，无痕刷新图标文字
				if (resData.success) {
					if (CPR.likeStatus == 0) {
						CPR.likeStatus = 1;
						CPR.likeCount++;
					} else {
						CPR.likeStatus = 0;
						CPR.likeCount--;
					}
				}
			};

			const reply = async (
				entityType: number,
				entityId: number,
				targetId: number,
				CPR: T_CPR
			) => {
				// <input type="hidden" name="entityType" value="2">
				// <input type="hidden" name="entityId" th:value="${cvo.comment.id}">
				// <input type="hidden" name="targetId" th:value="${rvo.user.id}">
				state.replyComment.entityType = entityType;
				state.replyComment.entityId = entityId;
				state.replyComment.targetId = targetId;

				console.log("state.replyComment: ", state.replyComment);
				const resData: I_ResponseData = await service.post(
					urls.addComment + "/" + props.postUser.post.id,
					state.replyComment
				);
				console.log("resData: ", resData);
				messageHandle(resData, "回复");
				if (resData.success) {
					CPR.replyCount++;
					state.popover.visible = false;
					if (entityType == 1) {
						const comment = {
							replyCount: 0,
							replys: [] as Array<I_ReplyContainer>,
							comment: resData.data.reply,
							likeCount: resData.data.likeCount,
							likeStatus: resData.data.likeStatus,
							user: resData.data.user,
						} as I_CommentContainer;
						state.comments.push(comment);
					} else {
						CPR.replys.push(resData.data);
					}

					if (entityType == 1) {
						state.pagination.rows += 1;
						if (
							state.pagination.rows >
							state.pagination.limit * state.pagination.total
						) {
							state.pagination.total += 1;
						}
					}
				}
			};

			const handleCurrentChange = async (currentPageNum: string) => {
				const resData: I_ResponseData | any = await service.get(
					urls.postDetail + "/" + props.postUser.post.id,
					{
						params: { current: currentPageNum },
					}
				);
				state.comments = resData.data.comments;
			};
			return {
				state,
				formatTime,
				hidenPopover,
				popoverShow,
				like,
				reply,
				handleCurrentChange,
			};
		},
	});
</script>

<style scoped lang="less">
	.post-action {
		.like,
		.reply {
			&:hover {
				color: #63a4e0;
				text-decoration-line: underline;
			}
		}
		text-align: center;
	}
	.comment {
		.headerImg {
			width: 16px;
		}
		.userInfo {
			padding-left: 2em;
		}

		.contentContainer {
			.content {
				padding-top: 1em;
				text-indent: 2em;
				padding-left: 2em;
				padding-right: 2em;
			}
			.interactive {
				display: flex;
				justify-content: space-between;
				padding-top: 1em;
				padding-bottom: 2em;
				padding-left: 2em;
				padding-right: 2em;
				.action {
					.like,
					.reply {
						&:hover {
							color: #63a4e0;
							text-decoration-line: underline;
						}
					}
				}
			}
		}
		.replys {
			margin-left: 5em;
			.contentContainer {
				margin-bottom: 2em;
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
</style>
