<template>
	<div class="about">
		<h1>This is an about page</h1>
		<div>ID = {{ id }}</div>
		<router-link to="/home">返回主页</router-link>
	</div>
</template>
<script lang="ts">
	import { defineComponent } from "vue";
	export default defineComponent({
		name: "About",
		props: ["id"],
	});
</script>
