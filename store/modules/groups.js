import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	groups: {
		total: 0,
		results: []
	}
};

const getters = {
	'gestios/groups/list': (st) => st.groups,
	'gestios/groups/get': (st) => (id) => {
		const index = st.groups.results.findIndex((item) => item.ID === id);
		if (index > -1) return st.groups.results[index];

		return false;
	}
};

const mutations = {
	// Add group to cache
	'GESTIOS/GROUPS/LIST': function (st, { groups = [], total = 0, reset = false }) {
		if (reset) {
			st.groups.results = [];
			st.groups.total = 0;
		}

		st.groups.results = st.groups.results.concat(groups);
		st.groups.total = total;
	},
	'CLEAR/GROUPS': function (st) {
		Vue.set(st, 'groups', {
			total: 0,
			results: []
		});
	}
};

const actions = {
	// List groups
	'gestios/groups/list': async function ({ commit }, { reset = false, silent = false } = {}) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios.groups.list();
			if (!silent) utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/GROUPS/LIST', { groups: result.data, total: result.total, reset });
				return result;
			}

			if (!silent) utils.error(result.message);
		} catch (err) {
			if (!silent) utils.loader.done();
			utils.error(err.message);
			console.error('No se pudo obtener el listado de grupos', err);
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
