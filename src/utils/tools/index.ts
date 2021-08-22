// 格式化时间
const formatTime = (time: string): string => {
	return time.replace(/T/, " ").replace(/\..*/, " ");
};

const isBlank = (str: string): boolean => {
	return str.replace(/(^\s+)|(\s+$)/, "") == "";
};

export { formatTime, isBlank };
