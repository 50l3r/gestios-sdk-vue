import gestios from './modules';
import sdk from './config/gestios';

export default {
	install(Vue, { project, url = 'https://gestios.es/api/1', events = null, store }) {
		if (!events) {
			events['message-success'] = () => true;
			events['message-error'] = () => true;
		}

		if (!store) {
			throw new Error('Para un correcto funcionamiento debes adjuntar una instancia de Vuex existente');
		}

		sdk.project = project;
		sdk.url = url;

		Vue.prototype.$gestios = gestios({ project, url, events, store });
	}
};
