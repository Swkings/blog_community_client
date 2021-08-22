import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Index",
		redirect: "/home",
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("../views/Home.vue"),
		children: [
			// user
			{
				path: "/login",
				name: "Login",
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () => import("../views/user/Login.vue"),
			},
			{
				path: "/register",
				name: "Register",
				component: () => import("../views/user/Register.vue"),
			},
			{
				path: "/forget",
				name: "Forget",
				component: () => import("../views/user/Forget.vue"),
			},
			{
				path: "/about/:id",
				name: "About",
				component: () => import("../views/user/About.vue"),
				// 开启传参
				props: true,
			},
			{
				path: "/userCenter",
				name: "UserCenter",
				component: () => import("../views/user/UserCenter.vue"),
				meta: {
					requireAuth: true, // 添加需要权限的标记
				},
			},
			// Search
			{
				path: "/search",
				name: "Search",
				component: () => import("../views/search/index.vue"),
			},
			// TSP Solver
			{
				path: "/tsp-solver",
				name: "TSPSolver",
				component: () => import("../views/tsp-solver/index.vue"),
				children: [
					{
						path: "/tsp-solver",
						name: "TSPSolver",
						redirect: "/tsp-solver/myTask",
					},
					{
						path: "/tsp-solver/createTask",
						name: "CreateTask",
						component: () => import("../views/tsp-solver/createTask.vue"),
					},
					{
						path: "/tsp-solver/doneTask",
						name: "DoneTask",
						component: () => import("../views/tsp-solver/doneTask.vue"),
					},
					{
						path: "/tsp-solver/doingTask",
						name: "DoingTask",
						component: () => import("../views/tsp-solver/doingTask.vue"),
					},
					{
						path: "/tsp-solver/myTask",
						name: "MyTask",
						component: () => import("../views/tsp-solver/myTask.vue"),
					},
				],
			},
			// Blog
			{
				path: "/blog",
				name: "Blog",
				component: () => import("../views/blog/index.vue"),
			},
			// Community
			{
				path: "/community",
				name: "Community",
				component: () => import("../views/community/index.vue"),
			},
			// Message
			{
				path: "/message",
				name: "Message",
				component: () => import("../views/message/index.vue"),
				meta: {
					requireAuth: true, // 添加需要权限的标记
				},
			},
		],
	},

	{
		path: "/:catchAll(.*)",
		name: "NotFound",
		component: () => import("../views/error/404.vue"),
	},
	{
		path: "/denied",
		name: "Denied",
		component: () => import("../views/error/denied.vue"),
	},
	// {
	// 	path: "/login",
	// 	name: "Login",
	// 	// route level code-splitting
	// 	// this generates a separate chunk (about.[hash].js) for this route
	// 	// which is lazy-loaded when the route is visited.
	// 	component: () =>
	// 		import(/* webpackChunkName: "about" */ "../views/Login.vue"),
	// },
	// {
	// 	path: "/register",
	// 	name: "Register",
	// 	component: () => import("../views/Register.vue"),
	// },
	// {
	// 	path: "/forget",
	// 	name: "Forget",
	// 	component: () => import("../views/Forget.vue"),
	// },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	console.log("to.path: ", to.path);
	const loginState =
		localStorage.loginState != undefined ? JSON.parse(localStorage.loginState) : null; // 读取本地用户信息。自己写的方法！
	// 判读是不是要权限登录
	if (to.matched.some((res) => res.meta.requireAuth)) {
		// 在去判断当前用户的信息
		if (loginState != null && loginState.isSign) {
			next(); // 如果是 直接渲染
		} else {
			next("/login"); // 否则跳转登录页面
		}
	} else {
		if (
			loginState != null &&
			loginState.isSign &&
			(to.path == "/register" || to.path == "/login")
		) {
			next("/home");
		} else {
			next(); // 不是就直接去渲染路由
		}
	}
});

export default router;
