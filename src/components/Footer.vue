<template>
	<div>
		<a :href="data.href" class="iconfont icon-self-b"></a>
		<a class="iconfont icon-github-a" :href="data.github"></a>
		<p>
			Copyright @ 2021 Powered by Vue. Designed by
			<router-link :to="'/about/' + data.user">
				{{ data.user }}
			</router-link>
		</p>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	export default defineComponent({
		name: "Footer",
		setup() {
			let data = {
				user: "Swking",
				href: "http://swking.cn",
				github: "https://github.com/Swkings",
			};
			return {
				data,
			};
		},
	});
</script>

<style lang="less" scoped>
	.iconfont {
		font-size: 1.875rem;
		color: rgb(15, 12, 12);
		margin-right: 0.625rem;
	}
	.icon-github:hover {
		color: royalblue;
	}
	.icon-cion15 {
		font-size: 1.625rem;
	}
	.icon-cion15:hover {
		color: deepskyblue;
	}
	.icon-self:hover {
		color: green;
	}
	div {
		// position: absolute;
		// margin-bottom: 0%;
		// height: 50px;
		bottom: 0.5%;
		text-align: center;
		// padding-top: 0.625rem;
		line-height: 2rem;
		width: 100%;
		// background: rgba(55, 57, 65, 0.5);
		p {
			text-align: center;
			color: #0c0b0b;
			font-size: 1rem;
			margin-top: 0%;
			margin-bottom: 0%;
		}
	}
</style>
