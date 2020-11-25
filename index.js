import gestios from './modules';

export default {
	install(Vue, { project, url = 'https://gestios.es/api/1', events = null }) {
		if (!events) {
			events['message-success'] = () => true;
			events['message-error'] = () => true;
		}

		Vue.prototype.$gestios = gestios({ project, url, events });
	}
};
