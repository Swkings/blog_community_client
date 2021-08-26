<template>
	<div class="solutionContainer">
		<!-- <json-viewer :value="state.tspData"></json-viewer>
		<json-viewer :value="state.option"></json-viewer> -->
		<div class="echart" id="echart"></div>
	</div>
</template>

<script lang="ts">
	import urls from "@/api/urls";
	import { I_ResponseData, I_TSP } from "@/types";
	import service from "@/utils/http/service";
	import { defineComponent, nextTick, onMounted, reactive } from "vue";
	import * as echarts from "echarts";
	export default defineComponent({
		name: "ViewSolution",
		components: {},
		props: ["id"],
		setup(props) {
			const state = reactive({
				tspData: {} as I_TSP,
				option: {
					tooltip: {
						backgroundColor: "rgba(255,255,255,0.5)", //tooltip背景色
						borderColor: "black", //tooltip边框颜色
						borderWidth: 0.1,
						/*返回需要的信息*/
						formatter: function(param: any) {
							console.log("param: ", param);
							var value = param.value;
							return (
								'<div style="font-size: 16px;padding:0px"> ' +
								"id: " +
								value[2] +
								"<br>" +
								"x: " +
								value[0] +
								"<br>" +
								"y: " +
								value[1] +
								"</div>"
							);
						},
					},
					title: {
						text: "test",
						left: "center",
					},
					xAxis: {
						show: false,
						splitLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
					},
					yAxis: {
						show: false,
					},
					series: [
						{
							type: "line",
							symbolSize: 5,
							data: [] as Array<Array<number>>,
						},
					],
				},
			});
			const getSolution = async () => {
				const resData: I_ResponseData = await service.get(
					urls.viewSolution + "/" + props.id
				);
				console.log("resData: ", resData);
				if (resData.success) {
					state.tspData = resData.data.tspData;
				}
			};
			const createEcharts = () => {
				// 基于准备好的dom，初始化echarts实例
				var myChart = echarts.init(document.getElementById("echart"));

				let dis = 0;
				state.tspData.SOLUTION.forEach((item) => {
					let x = state.tspData.NODE_COORD_SECTION[item].x;
					let y = state.tspData.NODE_COORD_SECTION[item].y;
					let id = state.tspData.NODE_COORD_SECTION[item].id;
					state.option.series[0].data.push([x, y, id]);
				});
				if (state.tspData.SOLUTION.length > 0 && state.tspData.SOLUTION != undefined) {
					let start = state.tspData.SOLUTION[0];
					let x = state.tspData.NODE_COORD_SECTION[start].x;
					let y = state.tspData.NODE_COORD_SECTION[start].y;
					let id = state.tspData.NODE_COORD_SECTION[start].id;
					state.option.series[0].data.push([x, y, id]);
				}
				for (let i = 0; i < state.option.series[0].data.length; i++) {
					let A = state.option.series[0].data[i];
					let B =
						state.option.series[0].data[(i + 1) % state.option.series[0].data.length];
					dis += Math.sqrt(Math.pow(A[0] - B[0], 2.0) + Math.pow(A[1] - B[1], 2.0));
				}
				state.option.title.text = state.tspData.NAME + "  CalDis:" + dis;
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(state.option);
			};
			onMounted(() => {
				getSolution().then(() => {
					createEcharts();
				});
			});
			return {
				state,
			};
		},
	});
</script>

<style scoped lang="less">
	.solutionContainer {
		width: 100%;

		.echart {
			margin: 0 auto;
			width: 800px;
			height: 500px;
			margin-top: 10%;
			// color: rgba(56, 228, 107, 0.3);
		}
	}
</style>
