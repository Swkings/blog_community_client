import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import NProgress from "nprogress";
import { ElMessage } from "element-plus";
import { I_ResponseData } from "@/types/index";

// 创建axios，赋给service
// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_TEST);
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/api";
// const BASEURL = '/api';
// const BASEURL = '';
let service: AxiosInstance | any = axios.create({
	baseURL: BASEURL,
	timeout: 10000, //10秒超时
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
	},
	withCredentials: true,
});

// 添加请求拦截器
service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		NProgress.start(); // 每次切换页面时，调用进度条
		// 在发送请求前 do something
		return config;
	},
	(error: any) => {
		// 请求错误时 do something
		ElMessage({
			message: "请求失败!",
			type: "error",
		});
		return Promise.reject(error);
	}
);

// 添加响应拦截器
// AxiosResponse<T = any> {
// 	data: T;
// 	status: number;
// 	statusText: string;
// 	headers: any;
// 	config: AxiosRequestConfig;
// 	request?: any;
// }

service.interceptors.response.use(
	(res: AxiosResponse) => {
		// console.log("res: ", res);
		// 对响应数据 do something
		NProgress.done();

		const resData: I_ResponseData = res.data;
		if (res.status === 200) {
			return resData;
		} else {
			ElMessage({
				message: "网络错误!",
				type: "error",
			});
			return Promise.reject(resData);
		}
	},
	(error: any) => Promise.reject(error)
);

export default service;
