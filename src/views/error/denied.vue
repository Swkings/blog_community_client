<template>
	<div id="deniedContainer" class="denied">
		<!-- <img src="../assets/logo.png" alt=""> -->
		<div class="info">
			拒绝访问,
			<router-link to="/home">返回主页</router-link>
		</div>
	</div>
</template>

<!-- <script lang="ts">
</script> -->

<style lang="less" scoped>
	.denied {
		width: 100%;
		height: 100%;
		overflow: hidden;
		img {
			width: 100%;
			height: 100%;
		}
		.info {
			text-align: center;
			font-size: 2em;
			text-align: center;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
