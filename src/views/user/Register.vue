<template>
	<!-- 注册模块 -->
	<div class="registerContainer">
		<h3 class="registerTitle">注册</h3>
		<!-- 表单区域  label-width="90px"-->
		<el-form
			class="register-form"
			:model="registerForm"
			:rules="rules"
			ref="registerFormRef"
			label-position="right"
		>
			<!-- 用户名 -->
			<el-form-item prop="username">
				<el-input
					type="text"
					v-model="registerForm.username"
					prefix-icon="iconfont icon-user-b"
					placeholder="username"
					autocomplete="off"
				>
				</el-input>
			</el-form-item>
			<!-- 邮箱 -->
			<el-form-item prop="email">
				<el-input
					v-model="registerForm.email"
					prefix-icon="iconfont icon-email-b"
					placeholder="email"
					autocomplete="off"
				>
				</el-input>
			</el-form-item>
			<!-- 密码 -->
			<el-form-item prop="password">
				<el-input
					type="password"
					v-model="registerForm.password"
					prefix-icon="iconfont icon-key-b"
					placeholder="password"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<!-- 确认密码 -->
			<el-form-item prop="checkPassword">
				<el-input
					type="password"
					prefix-icon="iconfont icon-key-a"
					v-model="checkPassword"
					placeholder="repeat password"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<!-- 按钮 -->
			<div class="btns">
				<el-button type="primary" @click="submitRegister()">注册</el-button>
				<el-button type="info" @click="resetRegister()">重置</el-button>
			</div>
			<div class="goLogin">
				<router-link to="/login" style="text-align: center">已有账号？快速登录</router-link>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, toRefs, ref, onBeforeMount, computed } from "vue";
	import service from "@/utils/http/service";
	import { useRouter } from "vue-router";
	import urls from "@/api/urls";
	import { errorMessage, successMessage } from "@/utils/message/index";
	import { I_ResponseData } from "@/types";

	export default defineComponent({
		name: "Register",
		components: {},
		setup() {
			const router = useRouter();
			const registerFormRef = ref();
			const checkPassword = ref("");
			const registerForm = reactive({
				username: "",
				email: "",
				password: "",
			});
			const rules = reactive(
				(function() {
					return {
						username: [
							{
								required: true,
								message: "用户名不能为空",
								trigger: "blur",
							},
						],
						email: [
							{
								required: true,
								message: "请输入邮箱地址",
								trigger: "blur",
							},
							{
								type: "email",
								message: "请输入正确的邮箱地址",
								trigger: ["blur", "change"],
							},
						],
						password: [
							{
								min: 2,
								message: "密码长度必须大于6位",
								trigger: "blur",
							},
						],
					};
				})()
			);
			const submitRegister = () => {
				registerFormRef.value.validate(async (valid: boolean) => {
					if (registerForm.password != checkPassword.value) {
						errorMessage("密码不一致");
						return false;
					}
					console.log("valid: " + valid);
					if (valid) {
						const resData: I_ResponseData = await service.post(
							urls.register,
							registerForm
						);
						if (resData.success) {
							if (resData.message != undefined && resData.message != "") {
								successMessage(resData.message);
							}

							router.push("/home");
						} else {
							if (resData.message != undefined && resData.message != "") {
								errorMessage(resData.message);
							}
						}
					} else {
						errorMessage("请输入用户名和密码");
						return false;
					}
				});
			};
			const resetRegister = () => {
				registerFormRef.value.resetFields();
			};
			return {
				checkPassword,
				registerForm,
				registerFormRef,
				rules,
				submitRegister,
				resetRegister,
				router,
			};
		},
	});
</script>

<style lang="less" scoped>
	.registerContainer {
		width: 400px;
		/* height: 300px; */
		background-clip: padding-box;
		// margin: 10% auto;
		padding: 15px 35px 15px 35px;
		border-radius: 15px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		.registerTitle {
			margin: 0 auto 20px;
			text-align: center;
		}
		.captchBox {
			width: 250px;
			margin-right: 5px;
		}
		.registerStatus {
			display: flex;
			justify-content: space-between;
			padding-left: 20%;
			padding-right: 20%;
			padding-bottom: 5%;
		}
		.btns {
			display: flex;
			justify-content: center;
			margin-bottom: 1%;
		}
		.goLogin {
			display: flex;
			justify-content: center;
			padding-top: 10px;
			margin-bottom: 2px;
		}
	}
</style>
