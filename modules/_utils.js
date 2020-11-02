import gestios from '../config/gestios';

export default function utils(store) {
	return {
		filter(app, value, parent = 'OR') {
			const a = store.getters['gestios/apps/get'](app);
			return gestios.utils(a).filter(value, parent);
		},
		getValue(app, field, value) {
			const a = store.getters['gestios/apps/get'](app);
			return gestios.utils(a).getValue(field, value);
		}
	};
}
