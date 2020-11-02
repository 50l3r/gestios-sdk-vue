import Vue from 'vue';
import gestios from '../../config/gestios';
import utils from '../../config/utils';

const state = {
	media: {
		total: 0,
		results: []
	}
};

const getters = {
	'gestios/media/list': (st) => st.media,
	'gestios/media/get': (st) => (id) => {
		const index = st.media.results.findIndex((item) => item.EmailId === id);
		if (index > -1) return st.media.results[index];

		return false;
	}
};

const mutations = {
	// Add media to cache
	'GESTIOS/MEDIA/LIST': function (st, { media = [], total = 0, reset = false }) {
		if (reset) {
			st.media.results = [];
			st.media.total = 0;
		}

		st.media.results = st.media.results.concat(media);
		st.media.total = total;
	},
	// Add media to cache
	'GESTIOS/MEDIA/ADD': function (st, media) {
		st.media.results.unshift(media);
		Vue.set(st.media, 'total', st.media.total + 1);
	},
	// Remove media from cache
	'GESTIOS/MEDIA/DELETE': function (st, id) {
		const index = st.media.results.findIndex((u) => u.id === id);
		if (index > -1) {
			st.media.results.splice(index, 1);
			st.media.total -= 1;
		}
	},
	'CLEAR/MEDIA': function (st) {
		Vue.set(st, 'data', {
			total: 0,
			results: []
		});
	}
};

const actions = {
	// List media
	// 'gestios/media/list': async function({ commit },
	// { page = 1, reset = false, silent = false } = {}) {
	// 	try {
	// 		if (!silent) utils.loader.start();
	// 		const result = await gestios.media.list({ page });
	// 		if (!silent) utils.loader.done();

	// 		if (result.ok) {
	// 			commit('GESTIOS/MEDIA/LIST', { media: result.data, total: result.total, reset });
	// 			return result.data;
	// 		}

	// 		if (!silent) utils.error(result.message);
	// 	} catch (err) {
	// 		utils.error(err.message);
	// 		console.error('No se pudo obtener el listado de ficheros', err);
	// 	}

	// 	return false;
	// },
	// Get media
	'gestios/media/get': async function ({ commit }, id) {
		try {
			utils.loader.start();
			const result = await gestios.emails.get(id);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/MEDIA/ADD', result.data);
				return result;
			}

			utils.error(result.message);
		} catch (err) {
			utils.loader.done();
			utils.error(err.message);
			console.error(`No se pudo obtener el fichero #${id}`, err);
		}

		return false;
	},
	// Share media
	'gestios/media/share': async function (_, { id, ts }) {
		try {
			utils.loader.start();
			const result = await gestios.media.share({ id, ts });
			utils.loader.done();

			if (result.ok) return result;
			utils.error(result.message);
		} catch (err) {
			utils.loader.done();
			utils.error(err.message);
			console.error(`No se pudo compartir el fichero #${id}`, err);
		}

		return false;
	},
	// Add media
	'gestios/media/add': async function ({ commit }, { file, name, folder = '' }) {
		try {
			utils.loader.start();
			const result = await gestios.media.add({ file, name, folder });
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/MEDIA/ADD', result.data);
				return result;
			}

			utils.error(result.message);
		} catch (err) {
			utils.loader.done();
			utils.error(err.message);
			console.error('No se pudo añadir el fichero', err);
		}

		return false;
	},
	'gestios/media/delete': async function ({ commit }, id) {
		try {
			utils.loader.start();
			const result = await gestios.media.delete(id);
			utils.loader.done();

			if (result.ok) {
				commit('GESTIOS/MEDIA/DELETE', id);
				return result;
			}

			utils.error(result.message);
		} catch (err) {
			utils.loader.done();
			utils.error(err.message);
			console.error(`No se pudo eliminar el fichero #${id}`, err);
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
