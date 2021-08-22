import { ElMessage, ElMessageBox } from "element-plus";

import { I_ResponseData } from "@/types";

// 消息
const Message = (message: string): any => {
	return ElMessage({
		showClose: true,
		message,
	});
};

// 成功
const successMessage = (message: string): any => {
	return ElMessage({
		showClose: true,
		message,
		type: "success",
	});
};

// 警告
const warnMessage = (message: string): any => {
	return ElMessage({
		showClose: true,
		message,
		type: "warning",
	});
};

// 失败
const errorMessage = (message: string): any => {
	return ElMessage({
		showClose: true,
		message,
		type: "error",
	});
};

const messageHandle = (resData: I_ResponseData, opearator?: string): any => {
	if (resData.message != undefined && resData.message != "") {
		if (resData.success) {
			successMessage(resData.message);
		} else {
			errorMessage(resData.message);
		}
	} else {
		if (resData.success) {
			successMessage(opearator + "成功");
		} else {
			errorMessage(opearator + "失败");
		}
	}
};

const messageConfirm = (message: string) => {
	return ElMessageBox.confirm(message);
};

// const messagePromts = ElMessageBox.confirm("是否离开页面，数据将丢失？", "提示", {
// 	confirmButtonText: "确定",
// 	cancelButtonText: "取消",
// 	type: "warning",
// })
// 	.then(() => {
// 		ElMessage({
// 			type: "success",
// 			message: "离开!",
// 		});
// 	})
// 	.catch(() => {
// 		ElMessage({
// 			type: "info",
// 			message: "已取消离开",
// 		});
// 	});

export { Message, successMessage, warnMessage, errorMessage, messageHandle, messageConfirm };
