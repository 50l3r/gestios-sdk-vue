import Vue from 'vue';

const utils = {
	message: (text) => {
		Vue.prototype.$core.$emit('message-success', text);
	},
	error: (text) => {
		Vue.prototype.$core.$emit('message-error', text);
	},
	loader: {
		start: () => Vue.prototype.$core.$emit('loader-start'),
		done: () => Vue.prototype.$core.$emit('loader-done')
	}
};

export default utils;
