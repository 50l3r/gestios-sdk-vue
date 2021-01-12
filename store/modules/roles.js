import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {};

const getters = {
	// Check user roles
	'gestios/roles/check': (st, gt) => ({ user = null, scopes = [], strict = true }) => {
		try {
			if (!user) user = gt['gestios/user'];
			return gestios.roles.check({ user, scopes, strict });
		} catch (err) {
			utils.error(err);
			console.error(`Ocurrió un error al chequear los permisos de ${user.ID}`, err);
		}

		return false;
	},
	// Check roles from specific section
	'gestios/roles/section': (st, gt) => (item) => {
		let pass = false;

		if (item.auth) {
			pass = gt['gestios/roles/check']({ scopes: item.auth.roles, strict: item.auth.strict });
		} else {
			pass = true;
		}

		return pass;
	}
};

const mutations = {};

const actions = {
	// List user roles
	'gestios/roles/list': async function ({ getters }, id = null) {
		try {
			if (!id) id = getters['gestios/user'].ID;

			utils.loader.start();
			const result = await gestios.roles.list(id);
			utils.loader.done();

			if (result.ok) return result;

			utils.error(result);
		} catch (err) {
			utils.loader.done();
			utils.error(err);
			console.error(`No se pudo obtener los roles del usuario #${id}`, err);
		}

		return false;
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
