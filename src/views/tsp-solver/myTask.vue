<template>
	<div class="taskContainer">
		<el-table
			:data="
				state.taskList.filter(
					(data) =>
						!state.search ||
						(data != null &&
							data.name.toLowerCase().includes(state.search.toLowerCase()))
				)
			"
			style="width: 100%;top:20px"
			:row-style="rowStyle"
			:cell-style="cellStyle"
			:header-row-style="headerRowStyle"
			:header-cell-style="headerCellStyle"
		>
			<el-table-column prop="id" label="id" width="90"> </el-table-column>
			<el-table-column prop="name" label="name" width="100">
				<template #default="scope">
					<el-popover
						effect="light"
						trigger="hover"
						placement="right"
						:width="state.popover.width"
					>
						<template #default>
							<p>NAME: {{ scope.row.name }}</p>
							<p>COMMENT: {{ scope.row.comment }}</p>
							<p>TYPE: {{ scope.row.dimension }}</p>
							<p>DIMENSION: {{ scope.row.type }}</p>
							<p>NODE_COORD_SECTION: {{ scope.row.edgeWeightType }}</p>
						</template>
						<template #reference>
							<div class="name-wrapper">
								<el-tag size="medium">{{ scope.row.name }}</el-tag>
							</div>
						</template>
					</el-popover>
				</template>
			</el-table-column>

			<!-- <el-table-column prop="type" label="type" width="90"> </el-table-column>
			<el-table-column prop="dimension" label="dimension" width="90"></el-table-column>
			<el-table-column prop="edgeWeightType" label="edgeWeightType" width="150">
			</el-table-column> -->
			<!-- <el-table-column prop="userId" label="userId" width="150"> </el-table-column> -->
			<el-table-column prop="status" label="status" width="150">
				<template #default="scope">
					<el-tag :type="scope.row.status == 0 ? '' : 'danger'" effect="dark">
						{{ scope.row.status == 0 ? "私有" : "公开" }}
					</el-tag>
					<!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
					</el-switch> -->
				</template>
			</el-table-column>
			<!-- <el-table-column prop="progress" label="progress" width="150"> </el-table-column> -->
			<el-table-column align="center" prop="progress" label="progress" width="150">
				<template #default="scope">
					<el-progress
						:text-inside="true"
						:stroke-width="18"
						:percentage="scope.row.progress"
						status="success"
					></el-progress>
				</template>
			</el-table-column>
			<el-table-column
				prop="createTime"
				label="createTime"
				width="200"
				:formatter="formatterTime"
			></el-table-column>
			<el-table-column align="right">
				<template #header>
					<el-input v-model="state.search" size="mini" placeholder="输入关键字搜索" />
				</template>
				<template #default="scope">
					<el-button
						size="mini"
						type="primary"
						@click="handleView(scope.$index, scope.row)"
						:disabled="scope.row.progress != 100"
						><i class="el-icon-view"></i
					></el-button>
					<el-button
						size="mini"
						type="warning"
						@click="handleEdit(scope.$index, scope.row)"
					>
						<i class="el-icon-s-tools"></i>
					</el-button>
					<el-button
						size="mini"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)"
						><i class="el-icon-delete-solid"></i
					></el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
	import urls from "@/api/urls";

	import { I_ResponseData, I_TSPTask } from "@/types";
	import service from "@/utils/http/service";
	import { messageHandle } from "@/utils/message";
	import { formatTime } from "@/utils/tools";
	import { defineComponent, onMounted, reactive } from "vue";
	import { useRouter } from "vue-router";

	export default defineComponent({
		name: "MyTask",
		components: {},
		setup() {
			const router = useRouter();
			const state = reactive({
				taskList: [] as Array<I_TSPTask>,
				search: "",
				popover: {
					width: 350,
				},
			});
			const getTask = async () => {
				const resData: I_ResponseData = await service.get(urls.myTask);
				console.log("resData: ", resData);
				if (resData.success) {
					state.taskList = resData.data.taskList;
				}
			};
			const handleDelete = async (index: any, row: any) => {
				console.log(index, row);
				console.log('urls.deleteTask + "/" + row.id: ', urls.deleteTask + "/" + row.id);
				const resData: I_ResponseData = await service.get(urls.deleteTask + "/" + row.id);
				messageHandle(resData, "删除");
				if (resData.success) {
					state.taskList.splice(index, 1);
				}
			};
			onMounted(() => {
				getTask();
			});
			return {
				state,
				handleDelete,
			};
		},
		methods: {
			// {row,rowIndex}
			rowStyle() {
				return "height:30px";
			},
			// {row,column,rowIndex,columnIndex}
			cellStyle() {
				return "padding:0;text-align:center";
			},
			headerRowStyle() {
				return "height:30px";
			},
			headerCellStyle() {
				return "text-align:center";
			},
			formatterTime(row: any, column: any, cellValue: any, index: any) {
				return formatTime(cellValue);
			},
			handleEdit(index: any, row: any) {
				console.log(index, row);
			},
			handleView(index: any, row: any) {
				console.log(index, row);
				this.$router.push({ name: "ViewSolution", params: { id: row.id } });
			},
		},
	});
</script>

<style scoped lang="less"></style>
