import Vue from 'vue';

export default function cache(store) {
	return {
		// App Items
		items(app) {
			return {
				get list() { return store.getters['gestios/items/list'](app); },
				get: (id) => store.getters['gestios/items/get'](app, id),
				add: (params) => store.commit('GESTIOS/ITEMS/ADD', { app, data: params }),
				edit: ({ id, params }) => store.commit('GESTIOS/ITEMS/EDIT', { app, data: { ...params, _EntityId: id } }),
				delete: (id) => store.commit('GESTIOS/ITEMS/DELETE', { app, id })
			};
		},

		// Users
		get users() { return store.getters['gestios/users/list']; },
		user: (id) => store.getters['gestios/users/get'](id),

		// Groups
		get groups() { return store.getters['gestios/groups/list']; },
		group: (id) => store.getters['gestios/groups/get'](id),

		// Project config
		get config() {
			return {
				get: (key) => store.getters['gestios/config/get'](key),
				...store.getters['gestios/config/list']
			};
		},

		// Emails
		get emails() {
			return {
				get folders() { return store.getters['gestios/emails/folders']; },
				get: (id) => store.getters['gestios/emails/get'](id),
				...store.getters['gestios/emails/list']
			};
		},

		// Media
		get media() {
			return {
				get: (id) => store.getters['gestios/media/get'](id),
				...store.getters['gestios/media/list']
			};
		},

		// Wipe view data
		wipe: (view) => store.dispatch('gestios/items/wipe', view),

		// Clean data cache
		clean() {
			store.dispatch('cache/clear', { data: true });

			Vue.prototype.$gestios.apps(true);
			Vue.prototype.$gestios.auth.roles();

			this.$emit('message-success', 'Cache limpiada');
		}
	};
}
