import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	users: {
		total: 0,
		results: []
	}
};

const getters = {
	'gestios/users/list': (st) => st.users,
	'gestios/users/get': (st) => (id) => {
		const index = st.users.results.findIndex((item) => item.ID === id);
		if (index > -1) return st.users.results[index];

		return false;
	}
};

const mutations = {
	// Add users to cache
	'GESTIOS/USERS/LIST': function (st, { users = [], total = 0, reset = false }) {
		if (reset) {
			st.users.results = [];
			st.users.total = 0;
		}

		st.users.results = st.users.results.concat(users);
		st.users.total = total;
	},
	// If user exists update info
	'GESTIOS/USERS/EDIT': function (st, user) {
		const index = st.users.results.findIndex((u) => u.ID === user.ID);
		if (index > -1) st.users.results.splice(index, 1, user);
	},
	// If user exists update info
	'GESTIOS/USERS/ADD': function (st, user) {
		st.users.results.unshift(user);
		Vue.set(st.users, 'total', st.users.total + 1);
	},
	// Remove user from cache
	'GESTIOS/USERS/DELETE': function (st, id) {
		const index = st.users.results.findIndex((u) => u.ID === id);
		if (index > -1) {
			st.users.results.splice(index, 1);
			st.users.total -= 1;
		}
	},
	'CLEAR/USERS': function (st) {
		Vue.set(st, 'users', {
			total: 0,
			results: []
		});
	}
};

const actions = {
	// List users
	'gestios/users/list': async function ({ commit }, { page = 1, search = null, limit = 10, reset = false, silent = false } = {}) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios.users.list({ page, search, limit });
			if (!silent) utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/USERS/LIST', { users: result.data, total: result.total, reset });
				return result;
			}

			if (result.code === 404) {
				commit('GESTIOS/USERS/LIST', { users: [], total: 0, reset });
				return result;
			}

			if (!silent) utils.error(result);
		} catch (err) {
			if (!silent) utils.loader.done();
			utils.error(err);
			console.error('No se pudo obtener el listado de usuarios', err);
		}

		return false;
	},
	// Get user
	'gestios/users/get': async function ({ commit, getters }, id = null) {
		try {
			if (!id) id = getters['gestios/user'].ID;

			utils.loader.start();
			const result = await gestios.users.get(id);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/USERS/EDIT', result.data);
				return result;
			}

			utils.error(result);
		} catch (err) {
			utils.loader.done();
			utils.error(err);
			console.error('No se pudo obtener el usuario especificado', err);
		}

		return false;
	},
	// Add user
	'gestios/users/add': async function ({ commit }, { email, nick, name, phone = null, group = null, password = null }) {
		try {
			utils.loader.start();
			const result = await gestios.users.add({ email, nick, name, phone, group, password });
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/USERS/ADD', result.data);
				return result;
			}

			utils.error(result);
		} catch (err) {
			utils.loader.done();
			utils.error(err);
			console.error('No se pudo dar de alta al nuevo usuario', err);
		}

		return false;
	},
	// Edit user
	'gestios/users/edit': async function ({ commit }, { id, email, nick, name, phone = null, group = null, password = null }) {
		try {
			utils.loader.start();
			const result = await gestios.users.edit({ id, email, nick, name, phone, group, password });
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/USERS/EDIT', result.data);
				return result;
			}

			utils.error(result);
		} catch (err) {
			utils.loader.done();
			utils.error(err);
			console.error('No se pudo dar de alta al nuevo usuario', err);
		}

		return false;
	},
	// Change user status
	'gestios/users/status': async function ({ commit }, { id, status }) {
		try {
			utils.loader.start();
			const result = await gestios.users.status(id, status);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/USERS/EDIT', result.data);
				return result;
			}

			utils.error(result);
		} catch (err) {
			utils.loader.done();
			utils.error(err);
			console.error('No se pudo obtener eliminar el usuario', err);
		}

		return false;
	},
	// Delete user
	'gestios/users/delete': async function ({ commit }, id) {
		try {
			utils.loader.start();
			const result = await gestios.users.delete(id);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/USERS/DELETE', id);
				return result;
			}

			utils.error(result);
		} catch (err) {
			utils.loader.done();
			utils.error(err);
			console.error('No se pudo obtener eliminar el usuario', err);
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
