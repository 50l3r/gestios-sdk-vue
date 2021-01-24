import gestios from '../config/gestios';

export default async function utils(store) {
	const gUtils = await gestios.utils();

	return {
		filter(app, value, parent = 'OR') {
			return gUtils.filter(app, value, parent);
		},
		getValue(app, field, value) {
			return gUtils.getValue(app, field, value);
		}
	};
}
