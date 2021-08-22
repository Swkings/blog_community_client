<template>
	<div id="tspSolveContainer">
		<div class="asideContainer">
			<h5>TSP Solver</h5>
			<el-menu>
				<!-- <el-submenu index="1">
					<template #title>
						<i class="el-icon-s-tools"></i>
						<span class="fontSet">我的任务</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="1-1">
							<i class="el-icon-s-flag"></i>
							<router-link to="/tsp-solver/doneTask" class="linkTo fontSet"
								>已完成</router-link
							>
						</el-menu-item>
						<el-menu-item index="1-2">
							<i class="el-icon-video-pause"></i>
							<router-link to="/tsp-solver/doingTask" class="linkTo fontSet"
								>未完成</router-link
							>
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu> -->
				<el-menu-item index="1">
					<i class="el-icon-s-tools"></i>
					<!-- <template #title>创建任务</template> -->
					<router-link to="/tsp-solver/myTask" class="linkTo fontSet"
						>我的任务</router-link
					>
				</el-menu-item>
				<el-menu-item index="2">
					<i class="el-icon-s-operation"></i>
					<!-- <template #title>创建任务</template> -->
					<router-link to="/tsp-solver/createTask" class="linkTo fontSet"
						>创建任务</router-link
					>
				</el-menu-item>
			</el-menu>
		</div>
		<div class="tspMianContainer">
			<router-view></router-view>
		</div>
	</div>
</template>

<script lang="ts">
	export default {};
</script>

<style lang="less" scoped>
	#tspSolveContainer {
		display: flex;
		.asideContainer {
			width: 15%;
			text-align: center;
			font-size: 2em;
			.linkTo {
				text-decoration: none;
				cursor: pointer;
				color: black;
			}
			.fontSet {
				font-size: 1.5em;
			}
		}
		.tspMianContainer {
			width: 85%;
		}
	}
</style>
