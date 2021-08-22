<template>
	<div id="blogContainer">
		<div class="topContainer">
			<div class="title">
				<input placeholder="请输入文章标题" v-model="state.article.title" />
			</div>
			<div class="action">
				<div class="status-text">
					<div>文章将自动保存至草稿箱</div>
				</div>
				<el-button type="info" class="draft">草稿箱</el-button>
				<el-button type="primary" class="publish">发布</el-button>
			</div>
		</div>
		<div class="mdEditor">
			<v-md-editor
				v-model="state.article.content"
				:height="state.VMdEditorAttr.height"
			></v-md-editor>
		</div>
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, reactive, ref } from "vue";
	export default defineComponent({
		name: "Blog",
		components: {},
		setup() {
			const mdContent = ref("");
			const state = reactive({
				article: {
					title: "",
					content: "",
				},
				VMdEditorAttr: {
					height: "400px",
				},
			});

			const getEditorHeight = () => {
				let wrapperE: HTMLElement | null = document.getElementById("wrapper");
				let mainE = document.getElementById("myMain");
				let headerE = document.getElementById("myHeader");
				let footerE = document.getElementById("myFooter");
				if (wrapperE !== null && headerE !== null && footerE !== null) {
					return (
						wrapperE.clientHeight - footerE.clientHeight - headerE.clientHeight + "px"
					);
				}
				return "400px";
			};

			const setEditorHeight = () => {
				state.VMdEditorAttr.height = getEditorHeight();
			};

			onMounted(() => {
				setEditorHeight();
				window.onresize = () => {
					setEditorHeight();
				};
			});

			return {
				state,
			};
		},
	});
</script>

<style lang="less" scoped>
	#blogContainer {
		margin-top: 1%;
		.topContainer {
			margin-left: 0;
			display: flex;
			justify-content: space-around;
			.title {
				width: 50%;
				input {
					width: 100%;
					height: 100%;
					-webkit-box-flex: 1;
					flex: 1 1 auto;
					border: none;
					outline: none;
					margin: 0;
					padding: 0;
					font-family: 楷体;
					font-size: 1.5em;
				}
			}
			.action {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.status-text {
					margin-left: 8px;
					margin-right: 8px;
					div {
						font-size: 1.2em;
						border: none;
						outline: none;
						box-shadow: none;
						opacity: 0.5;
					}
					border: none;
					outline: none;
					box-shadow: none;
				}
				margin-right: 1.5%;
				border: none;
			}
		}
	}
</style>
