import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	config: {}
};

const getters = {
	'gestios/config/list': (st) => (keys = []) => {
		if (keys.length === 0) return st.config;

		const results = {};
		for (let i = 0; i < keys.length; i += 1) {
			const ck = keys[i];

			if (st.config[ck] !== undefined) results[ck] = st.config[ck];
		}
		return results;
	},
	'gestios/config/get': (st) => (key) => {
		if (st.config[key] !== undefined) return st.config[key];
		return false;
	}
};

const mutations = {
	// Add config keys to cache
	'GESTIOS/CONFIG/EDIT': function (st, configs = []) {
		Object.keys(configs).forEach((key) => {
			Vue.set(st.config, key, configs[key]);
		});
	},
	// Remove keys from cache
	'GESTIOS/CONFIG/DELETE': function (st, configs = []) {
		Object.keys(configs).forEach((key) => {
			Vue.delete(st.config, key);
		});
	},
	'CLEAR/CONFIG': function (st) {
		Vue.set(st, 'config', {});
	}
};

const actions = {
	// list configs
	'gestios/config/list': async function ({ commit }, keys = []) {
		try {
			if (keys.length === 0) keys = null;
			const result = await gestios.config.get(keys);

			if (result.ok) {
				commit('GESTIOS/CONFIG/EDIT', result.data);
				return result;
			}

			utils.error(result);
			return false;
		} catch (err) {
			console.error('No se pudo obtener los parametros de configuración', err);
			return false;
		}
	},
	'gestios/config/edit': async function ({ commit }, keys) {
		try {
			utils.loader.start();
			const result = await gestios.config.set(keys);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/CONFIG/EDIT', result.data);
				return result;
			}

			utils.error(result);
		} catch (err) {
			console.error('No se pudo modificar los parametros de configuración', err);
		}

		return false;
	},
	'gestios/config/delete': async function ({ commit }, keys) {
		try {
			utils.loader.start();
			const result = await gestios.config.delete(keys.join(','));
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/CONFIG/DELETE', keys);
				return true;
			}

			utils.error(result);
		} catch (err) {
			console.error('No se pudo eliminar los parametros de configuración', err);
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
