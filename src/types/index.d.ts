// 统一返回数据
export interface I_ResponseData {
	success: boolean;
	code: number;
	message: string;
	// data: Map<string, Object>;
	data: any;
	// data: T;
}

// 用户
export interface I_User {
	id: number;
	username: string;
	password: string;
	salt: string;
	email: string;
	type: number;
	status: number;
	activationCode: string;
	headerUrl: string;
	createTime: string;
}

// 分页
export interface I_Pagination {
	current: number;
	limit: number;
	rows: number;
	path: string;
	offset: number;
	from: number;
	total: number;
	to: number;
}

// Community 帖子
export interface I_Post {
	id: number;
	userId: number;
	title: string;
	content: string;
	type: number;
	status: number;
	createTime: string;
	commentCount: number;
	score: number;
}

// Community 帖子+用户
export interface I_PostUser {
	post: I_Post;
	user: I_User;
	likeStatus: number;
	likeCount: number;
}

export interface I_CommunityData {
	pagination: I_Pagination;
	postUserList: Array<I_PostUser>;
}

// // Community 单条回复
// export interface I_Reply {
// 	id: number;
// 	userId: number;
// 	entityType: number;
// 	entityId: number;
// 	targetId: number;
// 	content: string;
// 	status: number;
// 	createTime: string;
// }
// Community 评论
export interface I_Comment {
	id: number;
	userId: number;
	entityType: number; // 评论类型 => 1: 对帖子评论; 2: 对评论评论
	entityId: number; // 被评论的comment ID
	targetId: number; // 被评论的实体所属的用户ID
	content: string;
	status: number;
	createTime: string;
}

export interface I_ReplyContainer {
	likeCount: number;
	likeStatus: number;
	reply: I_Comment;
	user: I_User;
	target: I_User;
}

export interface I_CommentContainer {
	replyCount: number;
	replys: Array<I_ReplyContainer>;
	comment: I_Comment;
	likeCount: number;
	likeStatus: number;
	user: I_User;
}

export interface I_CommentsData {
	comments: Array<I_CommentContainer>;
	pagination: I_Pagination;
	post: Post;
	likeCount: number;
	likeStatus: number;
	user: User;
}

// Blog 文章
export interface I_Article {
	id: number;
	userId: number;
	title: string;
	desc: string;
	content: string;
	state: number; // 文章发布状态 => 0 草稿, 1 已发布, 2 隐藏
	create_time: string;
	update_time: string;
	commentCount: number;
	score: number;
}

// TSP
export interface I_Coord {
	id: number;
	name: string;
	x: number;
	y: number;
}
export interface I_TSP {
	NAME: string;
	COMMENT: string;
	TYPE: string;
	DIMENSION: number;
	EDGE_WEIGHT_TYPE: string;
	NODE_COORD_SECTION: Array<I_Coord>;
	SOLUTION: Array<number>;
}

export interface I_TSPTask {
	id: number; // 'id'
	name: string;
	comment: string;
	type: string;
	dimension: number; // '问题规模'
	edgeWeightType: string; // '权重类型：EUC_2D，ATT..'
	filePath: string; // '存储路径'
	solutionFilePath: string; // '解决方案存储路径'
	userId: number; // '用户id'
	status: number; //  '状态：0：私有，1：公开'
	progress: number; //  '任务完成进度：0-100'
	createTime: string; //  '创建时间'
}
