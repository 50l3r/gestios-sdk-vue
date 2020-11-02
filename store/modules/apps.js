import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	apps: {}
};

const getters = {
	'gestios/apps/list': (st) => st.apps,
	'gestios/apps/get': (st) => (app) => {
		if (st.apps[app] !== undefined) {
			return st.apps[app];
		}

		return false;
	},
	'gestios/apps/fields': (st) => (app) => {
		if (st.apps[app] !== undefined) return st.apps[app].Fields;
		return false;
	},
	'gestios/apps/field': (st) => (app, field) => {
		if (st.apps[app] !== undefined) {
			if (typeof st.apps[app].Fields[field] !== 'undefined') return st.apps[app].Fields[field];
		}

		return false;
	}
};

const mutations = {
	// Add apps to cache
	'GESTIOS/APPS/LISTS': function (st, apps = null) {
		st.apps = {};

		if (apps) {
			Object.keys(apps).forEach((i) => {
				const app = apps[i];
				st.apps[app.Permalink] = app;
			});
		}
	},
	'CLEAR/APPS': function (st) {
		Vue.set(st, 'apps', {});
	}
};

const actions = {
	// list apps
	'gestios/apps/list': async function ({ commit }) {
		try {
			const result = await gestios.apps();

			if (result) {
				commit('GESTIOS/APPS/LISTS', result);
				return result;
			}

			utils.error(result.message);

			return result;
		} catch (err) {
			console.error('No se pudo obtener las aplicaciones', err);
			return err;
		}
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
