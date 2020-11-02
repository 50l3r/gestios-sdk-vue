import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	user: {
		BOSS: '0',
		Status: '0',
		ID: '0',
		API: '',
		Nick: '',
		Name: '',
		Email: '',
		Phone: '',
		RegisterDate: new Date(),
		LastDate: null,
		LastIp: null,
		Roles: { UnReadable: { App: [], Custom: [] }, Readable: [] },
		Group: { ID: null, Name: null }
	}
};

const getters = {
	'gestios/connected': (st) => {
		if (st.user !== null && parseInt(st.user.ID, 10) > 0) return true;
		return false;
	},
	'gestios/user': (st) => st.user
};

const mutations = {
	// USER
	'GESTIOS/AUTH/NICK': function (st, nick) {
		st.user.Nick = nick;
	},
	'GESTIOS/AUTH/LOGIN': function (st, user) {
		st.user = user;
		gestios.token = user.API;
	},
	'GESTIOS/AUTH/EDIT': function (st, { nick = null, name = null, phone = null, group = null, email = null }) {
		if (nick) st.user.Nick = nick;
		if (name) st.user.Name = name;
		if (phone) st.user.Phone = phone;
		if (group) st.user.Group = group;
		if (email) st.user.Email = email;
	},
	'CLEAR/USER': function (st) {
		Vue.set(st, 'user', {
			BOSS: '0',
			Status: '0',
			ID: '0',
			API: '',
			Nick: '',
			Name: '',
			Email: '',
			Phone: '',
			RegisterDate: new Date(),
			LastDate: null,
			LastIp: null,
			Roles: { UnReadable: { App: [], Custom: [] }, Readable: [] },
			Group: { ID: null, Name: null }
		});
	}
};

const actions = {
	'gestios/auth/nick': function ({ commit }, nick) {
		commit('GESTIOS/AUTH/NICK', nick);
	},
	'gestios/auth/login': async function ({ commit, dispatch }, { username, password }) {
		try {
			utils.loader.start();
			const auth = await gestios.auth.login({ username, password });

			if (auth.ok) {
				commit('GESTIOS/AUTH/LOGIN', auth.data);

				await dispatch('gestios/apps/list');

				utils.loader.done();
				return auth;
			}
			utils.loader.done();
			return auth;
		} catch (err) {
			console.error('Ocurrió un error al iniciar sesión', err);
			utils.loader.done();
			return err;
		}
	},
	'gestios/auth/forgot': async function (_, email) {
		try {
			const result = await gestios.auth.forgot(email);
			return result;
		} catch (err) {
			console.error('Ocurrió un error al intentar recuperar las credenciales', err);
			return err;
		}
	},
	'gestios/auth/restore': async function (_, { email, authcode, password }) {
		try {
			const restore = await gestios.auth.restore({ email, authcode, password });
			return restore;
		} catch (err) {
			console.error('Ocurrió un error al intentar restablecer las credenciales', err);
			return err;
		}
	},
	'gestios/auth/logout': function ({ commit, dispatch }) {
		commit('CLEAR/USER');
		dispatch('cache/clear');
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
