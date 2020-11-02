import gestios from '../../config/gestios';

const state = {
	project: '',
	url: 'https://gestios.es/api/1'
};

const getters = {
	'gestios/project': (st) => st.project,
	'gestios/url': (st) => st.url,
	'gestios/api': (st) => `${st.url}/${st.project}`
};

const mutations = {
	'GESTIOS/PROJECT': (st, value) => {
		st.project = value;
		gestios.project = value;
	},
	'GESTIOS/URL': (st, value) => {
		st.url = value;
		gestios.url = value;
	}
};

const actions = {
	'gestios/project': async function ({ commit, getters, dispatch }, project) {
		try {
			const result = await gestios.projects(project);

			if (result.ok) {
				commit('GESTIOS/PROJECT', result.data.Slug);

				if (getters['gestios/project'] !== project && getters['gestios/connected']) await dispatch('gestios/apps/list');
				return result;
			}

			throw result;
		} catch (err) {
			console.error('No se pudo obtener la información del proyecto', err);
			return err;
		}
	},
	'gestios/url': function ({ commit }, value = 'http://gestios.es/api/1') {
		commit('GESTIOS/URL', value);
	},
	'cache/clear': function ({ commit }) {
		commit('CLEAR/APPS');
		commit('CLEAR/CONFIG');
		commit('CLEAR/EMAILS');
		commit('CLEAR/GROUPS');
		commit('CLEAR/ITEMS');
		commit('CLEAR/MEDIA');
		commit('CLEAR/USERS');
		commit('CLEAR/FORMS');
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
