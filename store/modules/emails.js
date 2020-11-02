import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	emails: {
		total: 0,
		results: []
	},
	folders: {
		total: 0,
		results: []
	}
};

const getters = {
	'gestios/emails/list': (st) => st.emails,
	'gestios/emails/folders': (st) => st.folders,
	'gestios/emails/get': (st) => (id) => {
		const index = st.emails.results.findIndex((item) => item.EmailId === id);
		if (index > -1) return st.emails.results[index];

		return false;
	}
};

const mutations = {
	// Add emails to cache
	'GESTIOS/EMAILS/LIST': function (st, { emails = [], total = 0, reset = false }) {
		if (reset) {
			st.emails.results = [];
			st.emails.total = 0;
		}

		st.emails.results = st.emails.results.concat(emails);
		st.emails.total = total;
	},
	// Add email folders to cache
	'GESTIOS/EMAILS/FOLDERS': function (st, { folders = [], total = 0, reset = false }) {
		if (reset) {
			st.folders.results = [];
			st.folders.total = 0;
		}

		st.folders.results = st.folders.results.concat(folders);
		st.folders.total = total;
	},
	// Add email to cache
	'GESTIOS/EMAILS/ADD': function (st, email) {
		st.emails.results.unshift(email);
		Vue.set(st.emails, 'total', st.emails.total + 1);
	},
	// Remove email from cache
	'GESTIOS/EMAILS/DELETE': function (st, id) {
		const index = st.emails.results.findIndex((u) => u.EmailId === id);
		if (index > -1) {
			st.emails.results.splice(index, 1);
			st.emails.total -= 1;
		}
	},
	'CLEAR/EMAILS': function (st) {
		Vue.set(st, 'emails', {
			total: 0,
			results: []
		});

		Vue.set(st, 'folders', {
			total: 0,
			results: []
		});
	}
};

const actions = {
	// List users
	'gestios/emails/list': async function ({ commit }, { page = 1, folder = null, reset = false, silent = false } = {}) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios.emails.list({ page, folder });
			if (!silent) utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/EMAILS/LIST', { emails: result.data, total: result.total, reset });
				return result;
			}

			if (!silent) utils.error(result.message);
		} catch (err) {
			if (!silent) utils.loader.done();
			console.error('No se pudo obtener el listado de emails', err);
		}

		return false;
	},
	// Get user
	'gestios/emails/folders': async function ({ commit }, { page = 1, reset = true, silent = false }) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios.emails.folder(page);
			if (!silent) utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/EMAILS/FOLDERS', { folders: result.data, total: result.total, reset });
				return result;
			}

			if (!silent) utils.error(result.message);
		} catch (err) {
			if (!silent) utils.loader.done();
			console.error('No se pudo obtener el listado de carpetas', err);
		}

		return false;
	},
	// Add user
	'gestios/emails/send': async function (_, { email, subject, message, cc = [], replyto = '', folder = '' }) {
		try {
			utils.loader.start();
			const result = await gestios.emails.send({ email, subject, message, cc, replyto, folder });
			utils.loader.done();

			if (result.ok) {
				// TODO: Pendiente definicion de nombres. Envia parametros con distinta nomenclatura.
				// commit('GESTIOS/EMAILS/ADD', result.data);
				return result;
			}

			utils.error(result.message);
		} catch (err) {
			utils.loader.done();
			console.error('No se pudo enviar el email', err);
		}

		return false;
	},
	// Delete email
	'gestios/emails/delete': async function ({ commit }, id) {
		try {
			utils.loader.start();
			const result = await gestios.emails.delete(id);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/EMAILS/DELETE', id);
				return result;
			}

			utils.error(result.message);
		} catch (err) {
			utils.loader.done();
			utils.error(err.message);
			console.error('No se pudo eliminar el email', err);
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
