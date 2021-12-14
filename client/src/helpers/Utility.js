const toTimeFormat = (data) => {
	let date = new Date(data * 1000);
	return date.getFullYear() + '/' + parseInt(date.getUTCMonth() + 1) + '/' + date.getDate() + ' ' + date.toTimeString().split(' ')[0];
}

const toTimeFormat2 = (data) => {
	let date = new Date(data * 1000);
	return date.getFullYear() + '/' + parseInt(date.getUTCMonth() + 1) + '/' + date.getDate() + ' ' + date.toTimeString().split(' ')[0];
}

export {
	toTimeFormat,
	toTimeFormat2
};

