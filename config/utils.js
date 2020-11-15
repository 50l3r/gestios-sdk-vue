import Vue from 'vue';

const utils = {
	message: (text) => {
		Vue.prototype.$gestios.$emit('message-success', text);
	},
	error: (text) => {
		Vue.prototype.$gestios.$emit('message-error', text);
	},
	loader: {
		start: () => Vue.prototype.$gestios.$emit('loader-start'),
		done: () => Vue.prototype.$gestios.$emit('loader-done')
	}
};

export default utils;
