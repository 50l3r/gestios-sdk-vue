import gestios from './modules';
import sdk from './config/gestios';

export default {
	install(Vue, { project, url = 'https://gestios.es/api/1', events = null }) {
		if (!events) {
			events['message-success'] = () => true;
			events['message-error'] = () => true;
		}

		sdk.project = project;
		sdk.url = url;

		Vue.prototype.$gestios = gestios({ project, url, events });
	}
};
