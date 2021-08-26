<template>
	<div class="taskContainer">
		<div class="taskHeader" id="taskHeader">
			TSP求解器 - 创建任务
		</div>
		<div class="taskMain" id="taskMain">
			<div class="createByHand">
				<el-form
					:model="state.task"
					label-width="80px"
					class="form"
					:rules="state.rule"
					ref="taskForm"
				>
					<div class="inputLeft">
						<el-form-item label="任务名称" prop="NAME">
							<el-input
								v-model="state.task.NAME"
								:disabled="state.formSet.disabled"
							></el-input>
						</el-form-item>
						<el-form-item label="任务描述" prop="COMMENT">
							<el-input
								v-model="state.task.COMMENT"
								:disabled="state.formSet.disabled"
							></el-input>
						</el-form-item>
						<el-form-item label="任务类型" prop="TYPE">
							<el-select
								v-model="state.task.TYPE"
								placeholder="请选择任务类型"
								:disabled="state.formSet.disabled"
							>
								<el-option label="TSP" value="TSP"></el-option>
								<el-option label="ATSP" value="ATSP"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="城市数量" prop="DIMENSION">
							<el-input
								v-model="state.task.DIMENSION"
								:disabled="state.formSet.disabled"
							></el-input>
						</el-form-item>
						<el-form-item label="权重类型" prop="EDGE_WEIGHT_TYPE">
							<el-select
								v-model="state.task.EDGE_WEIGHT_TYPE"
								placeholder="请选择权重类型"
								:disabled="state.formSet.disabled"
							>
								<el-option label="EUC_2D" value="EUC_2D"></el-option>
								<el-option label="ATT" value="ATT"></el-option>
								<el-option label="CEIL_2D" value="CEIL_2D"></el-option>
								<el-option label="GEO" value="GEO"></el-option>
							</el-select>
						</el-form-item>

						<div class="createByAuto">
							<el-upload
								ref="uploadFiles"
								accept=".tsp"
								class="upload"
								drag
								action=""
								:auto-upload="false"
								:on-change="handleChage"
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								:before-remove="beforeRemove"
								:before-upload="beforeUpload"
								:on-exceed="handleExceed"
								multiple
								:limit="1"
							>
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">
									将文件拖到此处，或<em>点击上传</em>
								</div>
								<template #tip>
									<div class="el-upload__tip">
										只能上传 .tsp 文件
									</div>
								</template>
							</el-upload>
						</div>
						<div class="btns">
							<el-button
								type="primary"
								@click="createTask()"
								:disabled="state.btn.createStatus"
								>创建</el-button
							>
							<!-- <el-button>取消</el-button> -->
						</div>
					</div>
					<div class="transfer">
						<div class="transfer-box">
							<div class="transfer-item">
								<el-button
									type="primary"
									round
									:disabled="state.btn.dataStatus"
									@click="initForm"
									><span> 初始化表</span><i class="el-icon-d-arrow-right"></i>
								</el-button>
							</div>
							<div class="transfer-item">
								<div>
									<el-button
										type="primary"
										round
										:disabled="state.btn.dataStatus"
										@click="randomData"
										><span> 随机生成</span><i class="el-icon-d-arrow-right"></i>
									</el-button>
								</div>
							</div>
							<div class="transfer-item">
								<div class="randomIntevel">
									<div class="start">
										<el-input
											type="text"
											v-model="state.randomSpace.start"
											:disabled="state.btn.dataStatus"
										></el-input>
									</div>
									<div class="linkLine"><span>-</span></div>
									<div class="end">
										<el-input
											type="text"
											v-model="state.randomSpace.end"
											:disabled="state.btn.dataStatus"
										></el-input>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="inputRight">
						<el-table
							:data="state.task.NODE_COORD_SECTION"
							border
							style="width: 100%"
							:height="state.formSet.height"
							:row-style="rowStyle"
							:cell-style="cellStyle"
							:header-row-style="headerRowStyle"
							:header-cell-style="headerCellStyle"
						>
							<el-table-column prop="id" label="id" width="90"> </el-table-column>
							<el-table-column prop="name" label="城市名称" width="150">
								<template #default="scope">
									<div>
										<el-input v-model="scope.row.name"> </el-input>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="x" label="coordX" width="120">
								<template #default="scope">
									<div>
										<el-input v-model="scope.row.x"> </el-input>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="y" label="coordY" width="120">
								<template #default="scope">
									<div>
										<el-input v-model="scope.row.y"> </el-input>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { I_Coord, I_ResponseData, I_TSP } from "@/types";
	import {
		errorMessage,
		Message,
		messageConfirm,
		messageHandle,
		warnMessage,
	} from "@/utils/message";
	import { computed, defineComponent, onMounted, reactive, watch, ref } from "vue";
	import { ElMessage, ElMessageBox } from "element-plus";
	import service from "@/utils/http/service";
	import urls from "@/api/urls";
	import { onBeforeRouteLeave, useRouter } from "vue-router";
	export default defineComponent({
		name: "CreateTask",
		components: {},
		setup() {
			const router = useRouter();
			const uploadFiles = ref();
			const cerateLeave = ref(false);
			const state = reactive(
				localStorage.tspState != undefined
					? JSON.parse(localStorage.tspState)
					: {
							task: {
								NAME: "",
								COMMENT: "",
								TYPE: "",
								DIMENSION: 1,
								EDGE_WEIGHT_TYPE: "",
								NODE_COORD_SECTION: [{ id: 0 }] as Array<I_Coord>,
							} as I_TSP,
							formSet: {
								height: 450,
								disabled: false,
							},
							rule: {
								NAME: [
									{ required: true, message: "请填写任务名称", trigger: "blur" },
								],
								TYPE: [
									{ required: true, message: "请选择任务类型", trigger: "blur" },
								],
								DIMENSION: [
									{ required: true, message: "请填写城市数量", trigger: "blur" },
								],
								EDGE_WEIGHT_TYPE: [
									{ required: true, message: "请选择权重类型", trigger: "blur" },
								],
							},
							btn: {
								dataStatus: true,
								createStatus: true,
							},
							randomSpace: {
								start: 0,
								end: 100,
							},
							file: null as any,
					  }
			);
			const getDimension = computed(() => {
				return state.task.DIMENSION;
			});
			const getTableHeight = () => {
				let screeHeight = window.screen.height;
				let headerE: HTMLElement | null = document.getElementById("myHeader");
				let footerE: HTMLElement | null = document.getElementById("myFooter");
				let taskHE: HTMLElement | null = document.getElementById("taskHeader");
				let headerHeight = 70;
				let footerHeight = 70;
				let taskHHeight = 70;
				if (headerE != null && footerE != null && taskHE != null) {
					headerHeight = headerE.clientHeight;
					footerHeight = footerE.clientHeight;
					taskHHeight = taskHE.clientHeight;
				}
				state.formSet.height = screeHeight - headerHeight - footerHeight - taskHHeight - 60;
				// console.log("state.formSet.height: ", state.formSet.height);
			};
			onMounted(() => {
				getTableHeight();
				window.onbeforeunload = (e: any) => {
					if (!cerateLeave.value) {
						localStorage.tspState = JSON.stringify(state);
					}
				};
			});
			onBeforeRouteLeave((to, from, next) => {
				if (!cerateLeave.value) {
					localStorage.tspState = JSON.stringify(state);
				}
				next();
			});

			watch(getDimension, (newValue, oldValue) => {
				// console.log("newValue, oldValue: ", newValue, oldValue);
				// state.task.NODE_COORD_SECTION = new Array<I_Coord>(getDimension.value);
				if (newValue > oldValue) {
					if (getDimension.value <= 20) {
						for (
							let i = state.task.NODE_COORD_SECTION.length + 1;
							i <= getDimension.value;
							i++
						) {
							state.task.NODE_COORD_SECTION.push({ id: i } as I_Coord);
						}
					}
				} else {
					state.task.NODE_COORD_SECTION.splice(newValue, oldValue - newValue);
				}
				console.log("state.file: ", state.file);
				console.log("state.file: ", state.file == null);
				if (getDimension.value > 1 && state.file == null) {
					state.btn.dataStatus = false;
				} else {
					state.btn.dataStatus = true;
				}
				if (getDimension.value > 1) {
					state.btn.createStatus = false;
				} else {
					state.btn.createStatus = true;
				}
			});
			const createTask = async () => {
				// state.task.NODE_COORD_SECTION.forEach((item) => {
				// 	console.log("item: ", item);
				// });
				// console.log("state.fileList: ", state.fileList);
				// let fileFormData = undefined;
				// let requestConfig = undefined;
				// if (state.file != null) {
				// 	fileFormData = new FormData();
				// 	fileFormData.append("tspFile", state.file.raw, state.file.name);
				// 	requestConfig = {
				// 		headers: {
				// 			"Content-Type": "multipart/form-data",
				// 		},
				// 	};
				// 	console.log("fileFormData:");
				// 	fileFormData.forEach((value, key) => {
				// 		console.log(key, value);
				// 	});
				// } else {
				// 	fileFormData = state.task;
				// }

				// console.log("uploadFiles: ", uploadFiles.value);
				// console.log("state.file: ", state.file);
				// console.log("fileFormData: ", fileFormData);
				// console.log("requestConfig: ", requestConfig);
				const resData: I_ResponseData = await service.post(urls.addTask, state.task);
				console.log("resData: ", resData);
				messageHandle(resData, "创建");
				if (resData.success) {
					cerateLeave.value = true;
					localStorage.removeItem("tspState");
					router.push("/tsp-solver/myTask");
				}
			};
			const beforeUpload = (file: any) => {
				state.file = file;
				return false;
			};
			const handleChage = (file: any) => {
				state.file = file;
				let reader = new FileReader();
				if (typeof FileReader === "undefined") {
					errorMessage("浏览器不支持文件读取");
					return;
				}
				state.btn.dataStatus = true;
				state.formSet.disabled = true;
				console.log("file: ", file);
				reader.readAsText(file.raw);
				reader.onload = (e: ProgressEvent<FileReader>) => {
					if (e.target !== null) {
						let content = e.target.result;
						let coordArr: Array<string[]> = [];
						if (typeof content === "string") {
							let strArr = content.split("\n");
							let flagIndex = Infinity;
							let cnt = 0;
							strArr.forEach((item, index, arr) => {
								coordArr.push(item.split(" "));
								let line: string[] = [];
								if (index <= 4) {
									line = item.split(":");
									if (line[0].trim() == "NAME") state.task.NAME = line[1].trim();
									if (line[0].trim() == "COMMENT")
										state.task.COMMENT = line[1].trim();
									if (line[0].trim() == "TYPE") state.task.TYPE = line[1].trim();
									if (line[0].trim() == "DIMENSION")
										state.task.DIMENSION = parseInt(line[1]);
									if (line[0].trim() == "EDGE_WEIGHT_TYPE")
										state.task.EDGE_WEIGHT_TYPE = line[1].trim();
								} else {
									line = item.split(" ");
									if (line[0].trim() == "NODE_COORD_SECTION") {
										flagIndex = index;
										initForm();
									}
									if (index > flagIndex && cnt < state.task.DIMENSION) {
										let x = parseFloat(line[1]);
										let y = parseFloat(line[2]);
										state.task.NODE_COORD_SECTION[cnt] = {
											id: cnt,
											x: x,
											y: y,
										} as I_Coord;
										cnt += 1;
									}
								}
							});
						}
					}
				};
			};
			const handleExceed = (files: any, fileList: any) => {
				warnMessage("只能上传一个文件");
			};
			const beforeRemove = (file: any, fileList: any) => {
				// return ElMessageBox.confirm(`确定移除 ${file.name}？`);
				return messageConfirm(`确定移除 ${file.name}？`);
			};
			const handleRemove = (file: any, fileList: any) => {
				console.log("handleRemove file, fileList: ", file, fileList);
				state.btn.dataStatus = false;
				state.formSet.disabled = false;
				state.file = null;
			};
			const handlePreview = (file: any) => {
				console.log("handlePreview file: ", file);
			};
			const initForm = () => {
				state.task.NODE_COORD_SECTION = new Array<I_Coord>(getDimension.value);
				for (let i = 1; i <= getDimension.value; i++) {
					state.task.NODE_COORD_SECTION[i - 1] = {
						id: i,
					} as I_Coord;
				}
			};
			const randomData = () => {
				initForm();
				let start = Math.min(state.randomSpace.start, state.randomSpace.end);
				let end = Math.max(state.randomSpace.start, state.randomSpace.end);
				for (let i = 1; i <= getDimension.value; i++) {
					state.task.NODE_COORD_SECTION[i - 1] = {
						id: i,
						x: Math.round(Math.random() * (end - start) + start),
						y: Math.round(Math.random() * (end - start) + start),
					} as I_Coord;
					// state.task.NODE_COORD_SECTION.push({
					// 	id: i,
					// 	x: Math.round(Math.random() * (end - start) + start),
					// 	y: Math.round(Math.random() * (end - start) + start),
					// } as I_Coord);
				}
			};
			return {
				state,
				uploadFiles,
				createTask,
				handleChage,
				handleExceed,
				beforeRemove,
				handleRemove,
				handlePreview,
				beforeUpload,
				initForm,
				randomData,
			};
		},
		methods: {
			// {row,rowIndex}
			rowStyle() {
				return "height:20px";
			},
			// {row,column,rowIndex,columnIndex}
			cellStyle() {
				return "padding:0;text-align:center";
			},
			headerRowStyle() {
				return "height:20px";
			},
			headerCellStyle() {
				return "text-align:center";
			},
		},
	});
</script>

<style scoped lang="less">
	.taskContainer {
		.taskHeader {
			width: 100%;
			background-color: aliceblue;
			text-align: center;
			font-size: 2em;
			margin-top: 2%;
			margin-bottom: 2%;
		}
		.taskMain {
			.createByHand {
				.form {
					display: flex;
					justify-content: space-around;
				}
				.inputLeft {
					margin-left: 3%;
					width: 40%;
					.btns {
						margin-top: 20px;
						display: flex;
						justify-content: center;
					}
				}
				.transfer {
					width: 20%;
					margin: auto 0;
					.transfer-box {
						.transfer-item {
							// margin-top: 40px;
							display: flex;
							justify-content: center;
							.randomIntevel {
								display: flex;
								justify-content: center;

								.start {
									width: 40%;
								}
								.linkLine {
									width: 20%;
									display: table-cell;
									vertical-align: middle;
									position: relative;

									span {
										width: 10px;
										position: absolute;
										top: 50%;
										left: 50%;
										transform: translate(-50%, -50%);
									}
								}
								.end {
									width: 40%;
								}
							}
						}
						.transfer-item:nth-child(2) {
							margin-top: 40px;
							margin-bottom: 10px;
						}
					}
				}
				.inputRight {
					margin-right: 3%;
					:deep(.el-input__inner) {
						// height: 30px;
						border: none;
						padding: 0;
						margin: 0;
					}
				}
			}
		}
	}
</style>
