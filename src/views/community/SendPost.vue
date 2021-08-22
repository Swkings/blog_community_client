<template>
	<div class="sendPostContainer">
		<h3 class="formTitle">发帖</h3>
		<el-form class="post-form" :model="state.postForm" ref="postFormRef">
			<el-form-item>
				<el-input
					type="text"
					placeholder="标题"
					autocomplete="off"
					v-model="state.postForm.title"
				>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-input
					type="textarea"
					placeholder="正文"
					:rows="4"
					v-model="state.postForm.content"
				></el-input>
			</el-form-item>
			<div class="btns">
				<el-button type="info" @click="cancel()">取消</el-button>
				<el-button type="primary" @click="sendPost()">发布</el-button>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts">
	import urls from "@/api/urls";
	import { I_Post, I_ResponseData } from "@/types";
	import service from "@/utils/http/service";
	import { warnMessage, successMessage, errorMessage } from "@/utils/message/index";
	import { isBlank } from "@/utils/tools";
	import { defineComponent, inject, reactive } from "vue";
	export default defineComponent({
		name: "SendPost",
		components: {},

		setup(props, ctx) {
			const state = reactive({
				postForm: {
					title: "",
					content: "",
				} as I_Post,
			});
			const cancel = () => {
				ctx.emit("hidenPopover");
			};
			const routeReload: Function | any = inject("routeReload");
			const sendPost = async () => {
				console.log("%c⧭", "color: #aa00ff", state.postForm.title);
				if (isBlank(state.postForm.title)) {
					warnMessage("标题不能为空哦~");
					return;
				}
				console.log("%c⧭", "color: #e50000", state.postForm.content);
				if (isBlank(state.postForm.content)) {
					warnMessage("内容不能为空哦~");
					return;
				}
				const resData: I_ResponseData = await service.post(urls.sendPost, state.postForm);
				if (resData.success) {
					if (resData.message != undefined && resData.message != "") {
						successMessage(resData.message);
					} else {
						successMessage("发布成功");
					}
					cancel();
					routeReload();
				} else {
					if (resData.message != undefined && resData.message != "") {
						errorMessage(resData.message);
					} else {
						errorMessage("发布失败");
					}
				}
				console.log("send post!");
			};
			return {
				state,
				cancel,
				sendPost,
			};
		},
	});
</script>

<style scoped lang="less">
	.sendPostContainer {
		.formTitle {
			margin: 0 auto 40px;
			text-align: center;
		}
		.post-form {
			.btns {
				display: flex;
				justify-content: center;
				margin-bottom: 1%;
			}
		}
	}
</style>
