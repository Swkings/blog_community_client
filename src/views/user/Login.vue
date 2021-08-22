<template>
	<!-- 登录模块 -->
	<div class="loginContainer">
		<h3 class="loginTitle">登录</h3>
		<!-- 表单区域 -->
		<el-form
			class="login-form"
			:model="loginForm"
			:rules="rules"
			ref="loginFormRef"
			label-position="right"
		>
			<!-- 用户名 -->
			<el-form-item prop="username">
				<el-input
					type="text"
					v-model="loginForm.username"
					prefix-icon="el-icon-user"
					placeholder="用户名"
					autocomplete="off"
				>
				</el-input>
			</el-form-item>
			<!-- 密码 -->
			<el-form-item prop="password">
				<el-input
					type="password"
					v-model="loginForm.password"
					prefix-icon="el-icon-key"
					placeholder="密码"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<!-- 验证码 -->
			<el-form-item class="captchaBox">
				<el-row :gutter="20">
					<el-col :span="16">
						<el-input
							class="captchaCode"
							type="text"
							v-model="loginForm.captchaCode"
							prefix-icon="el-icon-success"
							placeholder="验证码"
							autocomplete="off"
						></el-input>
					</el-col>
					<el-col :span="8">
						<img :src="loginForm.captchaUrl" @click="updataCaptcha" alt="验证码" />
					</el-col>
				</el-row>
			</el-form-item>
			<!-- Remember -->
			<div class="loginStatus">
				<el-checkbox v-model="loginForm.remember" class="rememberme">记住我</el-checkbox>
				<el-link type="info" target="_blank" @click="forgetPassword">忘记密码</el-link>
			</div>
			<!-- 按钮 -->
			<div class="btns">
				<el-button type="primary" @click="submitLogin()">登录</el-button>
				<el-button type="info" @click="resetLogin()">重置</el-button>
			</div>
			<div class="goRegister">
				<router-link type="info" to="/register" style="text-align: center"
					>没有账号？快速注册</router-link
				>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, toRefs, ref, onBeforeMount, toRef } from "vue";
	import service from "@/utils/http/service";
	import urls from "@/api/urls";
	import { useRouter, onBeforeRouteUpdate } from "vue-router";
	import { errorMessage, successMessage } from "@/utils/message/index";
	import { I_ResponseData } from "@/types";
	import { useStore } from "vuex";

	export default defineComponent({
		name: "Login",
		components: {},
		props: {
			isSign: Boolean,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const loginFormRef = ref();
			/**
			 * 定义数据
			 */
			const loginForm = reactive({
				username: "",
				password: "",
				captchaCode: "",
				remember: false,
				captchaUrl: process.env.VUE_APP_BASE_API + "/captcha?time=" + new Date().getTime(),
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
						password: [
							{
								required: true,
								message: "密码不能为空",
								trigger: "blur",
							},
							{
								min: 2,
								message: "密码长度必须大于2位",
								trigger: "blur",
							},
						],
						captchCode: [
							{
								required: true,
								message: "请输入验证码",
								trigger: "blur",
							},
						],
					};
				})()
			);
			/**
			 * 定义方法
			 */
			const updataCaptcha = () => {
				loginForm.captchaUrl =
					process.env.VUE_APP_BASE_API + "/captcha?time=" + new Date().getTime();
				console.log("验证码Url：" + loginForm.captchaUrl);
			};
			const submitLogin = () => {
				loginFormRef.value.validate(async (valid: boolean) => {
					if (valid) {
						console.log("loginForm: ", loginForm);
						const resData: I_ResponseData = await service.post(urls.login, loginForm);

						console.log("resData: ", resData);
						console.log("resData.data: ", resData.data);
						console.log("resData.success: ", resData.success);
						if (resData.success) {
							if (resData.message != undefined && resData.message != "") {
								successMessage(resData.message);
							}
							store.commit("loginState/setLoginState", {
								isSign: true,
								user: resData.data.user,
								expiredTime: new Date().getTime() + 3600 * 12 * 1000,
							});
							localStorage.loginState = JSON.stringify(store.state.loginState);
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

			const resetLogin = () => {
				loginFormRef.value.resetFields();
			};
			const forgetPassword = () => {
				router.push({ name: "forget" });
			};
			// // 如果离开搜索页面，清除搜索框的关键字
			// onBeforeRouteUpdate((to, from) => {
			// 	console.log("from:", from.path, " to:", to.path);

			// 	if (store.state.loginState.isSign) {
			// 		router.push("/home");
			// 	}

			// 	return true;
			// });
			/**
			 * 返回数据
			 */
			return {
				loginFormRef,
				loginForm,
				rules,
				updataCaptcha,
				submitLogin,
				resetLogin,
				forgetPassword,
				router,
			};
		},
	});
</script>

<style lang="less" scoped>
	.loginContainer {
		width: 400px;
		// height: 300px;
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

		.loginTitle {
			margin: 0 auto 40px;
			text-align: center;
		}
		.loginStatus {
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
		.goRegister {
			display: flex;
			justify-content: center;
			padding-top: 10px;
			margin-bottom: 2px;
		}
	}
</style>
