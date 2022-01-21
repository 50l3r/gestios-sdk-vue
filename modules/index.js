/* eslint-disable prefer-promise-reject-errors */
import Vue from "vue";
import sdk from "../config/gestios";

import cache from "./_cache";
import utils from "./_utils";
import store from "../store";

export default function ({ project = "", url, events }) {
	return new Vue({
		data() {
			return {
				// Project info
				project: null,
				// User auth
				auth: null,
				// Users
				users: null,
				// Groups
				groups: null,
				// Emails
				emails: null,
				// Configurations
				config: null,
				// Media files
				media: null,
			};
		},
		computed: {
			url: {
				get() {
					return this.$store.getters["gestios/url"];
				},
				set(value) {
					return this.$store.dispatch("gestios/url", value);
				},
			},
			api() {
				return this.$store.getters["gestios/api"];
			},
			connected() {
				return this.$store.getters["gestios/connected"];
			},
			profile() {
				return this.$store.getters["gestios/user"];
			},
			avatars() {
				return this.$store.getters["gestios/avatars/get"];
			},
		},
		async beforeCreate() {
			this.$on("message-success", events["message-success"]);
			this.$on("message-error", events["message-error"]);

			this.$cache = cache(this.$store, this);

			Vue.prototype.$gestios = this;

			const storedProject = this.$store.getters["gestios/project"];
			if (storedProject) project = storedProject;

			sdk.project = project;
			sdk.url = url;

			this.$store.commit("GESTIOS/URL", url);
			this.$store.commit("GESTIOS/PROJECT", project);

			sdk.token = this.$store.getters["gestios/user"]
				? this.$store.getters["gestios/user"].API
				: "";

			if (storedProject) this.$utils = await utils(this.$store);
		},
		async created() {
			const self = this;

			this.project = {
				name: self.$store.getters["gestios/project"],
				set: (value) => self.$store.dispatch("gestios/project", value),
			};

			this.config = {
				list(keys = []) {
					return self.$store.dispatch("gestios/config/list", keys);
				},
				edit: (keys) =>
					self.$store.dispatch("gestios/config/edit", keys),
				del: (keys) =>
					self.$store.dispatch("gestios/config/delete", keys),
			};

			// User auth
			this.auth = {
				login: ({ username, password, project }) =>
					self.$store.dispatch("gestios/auth/login", {
						username,
						password,
						project,
					}),
				forgot: (email) =>
					self.$store.dispatch("gestios/auth/forgot", email),
				restore: ({ email, authcode, password }) =>
					self.$store.dispatch("gestios/auth/restore", {
						email,
						authcode,
						password,
					}),
				logout: () => self.$store.dispatch("gestios/auth/logout"),
				roles: (id = null) =>
					self.$store.dispatch("gestios/roles/list", id),
				check: ({ user = null, scopes = [], strict = true }) =>
					self.$store.getters["gestios/roles/check"]({
						user,
						scopes,
						strict,
					}),
				section: (item) =>
					self.$store.getters["gestios/roles/section"](item),
			};

			// Users
			this.users = {
				list: ({
					page = 1,
					search = null,
					limit = 10,
					reset = false,
					silent = false,
				} = {}) =>
					self.$store.dispatch("gestios/users/list", {
						page,
						search,
						limit,
						reset,
						silent,
					}),
				get: (id) => self.$store.dispatch("gestios/users/get", id),
				add: ({
					email,
					nick,
					name,
					phone = null,
					group = null,
					password = null,
				}) =>
					self.$store.dispatch("gestios/users/add", {
						email,
						nick,
						name,
						phone,
						group,
						password,
					}),
				edit: ({
					id,
					email,
					nick,
					name,
					phone = null,
					group = null,
					password = null,
				}) =>
					self.$store.dispatch("gestios/users/edit", {
						id,
						email,
						nick,
						name,
						phone,
						group,
						password,
					}),
				status: (id) =>
					self.$store.dispatch("gestios/users/status", id),
				delete: (id) =>
					self.$store.dispatch("gestios/users/delete", id),
			};

			// Groups
			this.groups = {
				list: ({ reset = false, silent = false } = {}) =>
					self.$store.dispatch("gestios/groups/list", {
						reset,
						silent,
					}),
			};

			// Emails
			this.emails = {
				list: ({
					page = 1,
					folder = null,
					reset = false,
					silent = false,
				} = {}) =>
					self.$store.dispatch("gestios/emails/list", {
						page,
						folder,
						reset,
						silent,
					}),
				folders: ({ page = 1, reset = true, silent = false }) =>
					self.$store.dispatch("gestios/emails/folders", {
						page,
						reset,
						silent,
					}),
				send: ({
					email,
					subject,
					message,
					cc = [],
					replyto = "",
					folder = "",
				}) =>
					self.$store.dispatch("gestios/emails/send", {
						email,
						subject,
						message,
						cc,
						replyto,
						folder,
					}),
				delete: (id) =>
					self.$store.dispatch("gestios/emails/delete", id),
			};

			// Media files
			this.media = {
				list: ({
					page = 1,
					limit = 20,
					order = null,
					folder = null,
					type = null,
					search = null,
					reset = false,
					silent = false,
				} = {}) =>
					self.$store.dispatch("gestios/media/list", {
						page,
						limit,
						order,
						folder,
						type,
						search,
						reset,
						silent,
					}),
				get: (id) => self.$store.dispatch("gestios/media/get", id),
				share: ({ id, ts }) =>
					self.$store.dispatch("gestios/media/share", { id, ts }),
				add: ({ file, name, folder = "" }) =>
					self.$store.dispatch("gestios/media/add", {
						file,
						name,
						folder,
					}),
				delete: (id) =>
					self.$store.dispatch("gestios/media/delete", id),
			};
		},
		methods: {
			// List apps
			async apps() {
				return this.$store.dispatch("gestios/apps/list");
			},
			// Get app
			app(appName) {
				const self = this;

				return {
					data() {
						return self.$store.dispatch("gestios/apps/list");
					},
					field(fieldName) {
						return new Promise((resolve, reject) => {
							self.$store
								.dispatch("gestios/apps/list")
								.then(() => {
									const field = self.$store.getters[
										"gestios/apps/field"
									](appName, fieldName);
									if (field) resolve(field);
									reject(false);
								})
								.catch(() => {
									reject(false);
								});
						});
					},
				};
			},
			// Authentication
			items(app) {
				return {
					list: ({
						page = 1,
						filters = null,
						order = null,
						limit = 20,
						silent = false,
						reset = false,
						view = null,
					} = {}) =>
						this.$store.dispatch("gestios/items/list", {
							app,
							page,
							filters,
							order,
							limit,
							silent,
							reset,
							view,
						}),
					get: (id, silent = false) =>
						this.$store.dispatch("gestios/items/get", {
							app,
							id,
							silent,
						}),
					add: ({ params, view = null, callback = null }) =>
						this.$store.dispatch("gestios/items/add", {
							app,
							params,
							view,
							callback,
						}),
					edit: ({ id, params, callback = null }) =>
						this.$store.dispatch("gestios/items/edit", {
							app,
							id,
							params,
							callback,
						}),
					status: (id) =>
						this.$store.dispatch("gestios/items/status", {
							app,
							id,
						}),
					delete: ({ id, callback = null }) =>
						this.$store.dispatch("gestios/items/delete", {
							app,
							id,
							callback,
						}),
					auth: ({ scopes = [], item, strict = true, user = null }) =>
						this.$store.getters["gestios/items/auth"]({
							app,
							scopes,
							item,
							strict,
							user,
						}),
					export: ({
						page = 1,
						filters = null,
						order = null,
						limit = 20,
						silent = false,
						fields,
					} = {}) =>
						this.$store.dispatch("gestios/items/export", {
							app,
							page,
							filters,
							order,
							limit,
							silent,
							fields,
						}),
				};
			},
		},
		store,
	});
}
