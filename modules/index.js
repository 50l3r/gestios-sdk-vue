/* eslint-disable prefer-promise-reject-errors */
import Vue from 'vue';
import sdk from '../config/gestios';

import cache from './_cache';
import utils from './_utils';
import store from '../store';

export default function ({ project, url, events }) {
	return new Vue({
		data() {
			return {
				// User auth
				auth: {
					login: ({ username, password, project }) => this.$store.dispatch('gestios/auth/login', { username, password, project }),
					forgot: (email) => this.$store.dispatch('gestios/auth/forgot', email),
					restore: ({ email, authcode, password }) => this.$store.dispatch('gestios/auth/restore', { email, authcode, password }),
					logout: () => this.$store.dispatch('gestios/auth/logout'),
					roles: (id = null) => this.$store.dispatch('gestios/roles/list', id),
					check: ({ user = null, scopes = [], strict = true }) => this.$store.getters['gestios/roles/check']({ user, scopes, strict })
				},
				// Users
				users: {
					list: ({ page = 1, search = null, limit = 10, reset = false, silent = false } = {}) => this.$store.dispatch('gestios/users/list', { page, search, limit, reset, silent }),
					get: (id) => this.$store.dispatch('gestios/users/get', id),
					add: ({ email, nick, name, phone = null, group = null, password = null }) => this.$store.dispatch('gestios/users/add', { email, nick, name, phone, group, password }),
					edit: ({ id, email, nick, name, phone = null, group = null, password = null }) => this.$store.dispatch('gestios/users/edit', { id, email, nick, name, phone, group, password }),
					status: (id) => this.$store.dispatch('gestios/users/status', id),
					delete: (id) => this.$store.dispatch('gestios/users/delete', id)
				},
				// Groups
				groups: {
					list: ({ reset = false, silent = false } = {}) => this.$store.dispatch('gestios/groups/list', { reset, silent })
				},
				// Emails
				emails: {
					list: ({ page = 1, folder = null, reset = false, silent = false } = {}) => this.$store.dispatch('gestios/emails/list', { page, folder, reset, silent }),
					folders: ({ page = 1, reset = true, silent = false }) => this.$store.dispatch('gestios/emails/folders', { page, reset, silent }),
					send: ({ email, subject, message, cc = [], replyto = '', folder = '' }) => this.$store.dispatch('gestios/emails/send', { email, subject, message, cc, replyto, folder }),
					delete: (id) => this.$store.dispatch('gestios/emails/delete', id)
				},
				// Configurations
				config: {
					list(keys = []) {
						return this.$store.dispatch('gestios/config/list', keys);
					},
					edit: (keys) => this.$store.dispatch('gestios/config/edit', keys),
					del: (keys) => this.$store.dispatch('gestios/config/delete', keys)
				},
				// Media files
				media: {
					get: (id) => this.$store.dispatch('gestios/media/get', id),
					share: ({ id, ts }) => this.$store.dispatch('gestios/media/share', { id, ts }),
					add: ({ file, name, folder = '' }) => this.$store.dispatch('gestios/media/add', { file, name, folder }),
					delete: (id) => this.$store.dispatch('gestios/media/delete', id)
				}
			};
		},
		computed: {
			project: {
				get() {
					return this.$store.getters['gestios/project'];
				},
				set(value) {
					return this.$store.dispatch('gestios/project', value);
				}
			},
			url: {
				get() {
					return this.$store.getters['gestios/url'];
				},
				set(value) {
					return this.$store.dispatch('gestios/url', value);
				}
			},
			api() {
				return this.$store.getters['gestios/api'];
			},
			connected() {
				return this.$store.getters['gestios/connected'];
			},
			profile() {
				return this.$store.getters['gestios/user'];
			},
			avatars() {
				return this.$store.getters['gestios/avatars/get'];
			}
		},
		beforeCreate() {
			this.$on('message-success', events['message-success']);
			this.$on('message-error', events['message-error']);

			this.$cache = cache(this.$store, this);
			this.$utils = utils(this.$store);

			Vue.prototype.$gestios = this;

			this.$store.commit('GESTIOS/URL', url);
			this.$store.commit('GESTIOS/PROJECT', project);

			sdk.token = this.$store.getters['gestios/user'] ? this.$store.getters['gestios/user'].API : '';
		},
		methods: {
			// List apps
			async apps() {
				return this.$store.dispatch('gestios/apps/list');
			},
			// Get app
			app(appName) {
				const self = this;

				return {
					data() {
						return self.$store.dispatch('gestios/apps/list');
					},
					field(fieldName) {
						return new Promise((resolve, reject) => {
							self.$store.dispatch('gestios/apps/list').then(() => {
								const field = self.$store.getters['gestios/apps/field'](appName, fieldName);
								if (field) resolve(field);
								reject(false);
							}).catch(() => {
								reject(false);
							});
						});
					}
				};
			},
			// Authentication
			items(app) {
				return {
					list: ({ page = 1, filters = null, order = null, limit = 20, silent = false, reset = false, view = null }) => this.$store.dispatch('gestios/items/list', { app, page, filters, order, limit, silent, reset, view }),
					get: ({ id, silent = false }) => this.$store.dispatch('gestios/items/get', { app, id, silent }),
					add: ({ params, view = null, callback = null }) => this.$store.dispatch('gestios/items/add', { app, params, view, callback }),
					edit: ({ id, params, callback = null }) => this.$store.dispatch('gestios/items/edit', { app, id, params, callback }),
					status: (id) => this.$store.dispatch('gestios/items/status', { app, id }),
					delete: ({ id, callback = null }) => this.$store.dispatch('gestios/items/delete', { app, id, callback }),
					auth: ({ scopes = [], item, strict = true, user = null }) => this.$store.getters['gestios/items/auth']({ app, scopes, item, strict, user })
				};
			}
		},
		store
	});
}
