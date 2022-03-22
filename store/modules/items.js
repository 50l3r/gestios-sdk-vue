import Vue from "vue";
import gestios from "../../config/gestios";
import utils from "../../config/utils";

const state = {
	vault: [
		// {
		//	app: 'appname',
		//	view: 'appnameList',
		//	total: 0,
		//	results: []
		// }
	],
};

const getters = {
	// Get all items
	"gestios/items/list": (st) => (view) => {
		const index = st.vault.findIndex((item) => item.view === view);
		if (index > -1) return st.vault[index];

		return false;
	},
	// Get specific item (Find in all apps)
	"gestios/items/get": (st) => (app, id) => {
		for (let i = 0; i < st.vault.length; i += 1) {
			const view = st.vault[i];

			if (view.app === app) {
				const index = view.results.findIndex(
					(item) => item._EntityId === id
				);
				if (index > -1) return view.results[index];
			}
		}

		return false;
	},
	"gestios/items/auth":
		(st, gt) =>
		({ app, scopes = [], item, strict = true, user = null }) => {
			try {
				if (!user) user = gt["gestios/user"];
				return gestios.app(app).auth({ scopes, item, strict, user });
			} catch (err) {
				console.error("No se pudo obtener las aplicaciones", err);
			}

			return false;
		},
};

const mutations = {
	// Wipe view data
	"GESTIOS/ITEMS/WIPE": function (st, view) {
		const index = st.vault.findIndex((item) => item.view === view);
		if (index > -1) {
			st.vault[index].total = 0;
			st.vault[index].results = [];
		}
	},
	// Add items to cache
	"GESTIOS/ITEMS/LIST": function (
		st,
		{ view, app, data, total = 0, reset = false }
	) {
		const index = st.vault.findIndex((item) => item.view === view);

		if (index === -1) {
			st.vault.push({
				app,
				view,
				results: data,
				total,
			});
		} else if (reset) {
			Vue.set(st.vault[index], "results", data);
			Vue.set(st.vault[index], "total", total);
		} else {
			Vue.set(st.vault[index], "total", total);
			Vue.set(
				st.vault[index],
				"results",
				st.vault[index].results.concat(data)
			);
		}
	},
	// Update item if exists
	"GESTIOS/ITEMS/EDIT": function (st, { app, data, ignore = null }) {
		if (!Array.isArray(data)) data = [data];

		st.vault.forEach((view) => {
			if (view.app === app && ignore !== app) {
				data.forEach((d) => {
					const index = view.results.findIndex(
						(item) => item._EntityId === d._EntityId
					);
					if (index > -1) {
						const item = view.results[index];
						const mixedItem = { ...item, ...d };

						view.results.splice(index, 1, mixedItem);
					}
				});
			}
		});
	},
	// Add item
	"GESTIOS/ITEMS/ADD": function (st, { view, data }) {
		const index = st.vault.findIndex((item) => item.view === view);
		if (index > -1) {
			st.vault[index].results.unshift(data);
			Vue.set(st.vault[index], "total", st.vault[index].total + 1);
		}
	},
	// Remove item
	"GESTIOS/ITEMS/DELETE": function (st, { app, id }) {
		st.vault.forEach((view) => {
			if (view.app === app) {
				const index = view.results.findIndex(
					(item) => item._EntityId === id
				);
				if (index > -1) view.results.splice(index, 1);
			}
		});
	},
	"CLEAR/ITEMS": function (st) {
		st.vault = [];
	},
};

const actions = {
	// Wipe view data
	"gestios/items/wipe": function ({ commit }, view) {
		commit("GESTIOS/ITEMS/WIPE", view);
	},
	// List app items
	"gestios/items/list": async function (
		{ commit },
		{
			app,
			view = null,
			page = 1,
			filters = null,
			order = null,
			limit = 20,
			silent = false,
			reset = false,
		}
	) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios
				.app(app)
				.list({ page, filters, order, limit });
			if (!silent) utils.loader.done();
			if (!view) view = app;

			if (result.ok) {
				commit("GESTIOS/ITEMS/LIST", {
					view,
					app,
					data: result.data,
					total: result.total,
					reset,
				});
				commit("GESTIOS/ITEMS/EDIT", {
					app,
					data: result.data,
					ignore: view,
				});

				return result;
			}

			if (result.code === 404) {
				result.data = [];
				commit("GESTIOS/ITEMS/LIST", {
					view,
					app,
					data: result.data,
					total: 0,
					reset,
				});
				return result;
			}

			if (!silent) utils.error(result);
			return result;
		} catch (err) {
			console.error(`No se pudo obtener los registros de ${app}`, err);
			return err;
		}
	},
	// Get app item by ID
	"gestios/items/get": async function (
		{ commit },
		{ app, id, silent = false, view = null }
	) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios.app(app).get(id);
			if (!silent) utils.loader.done();

			if (result.ok) {
				commit("GESTIOS/ITEMS/EDIT", { app, data: [result.data] });
				if(view){
					commit("GESTIOS/ITEMS/LIST", {
						view,
						app,
						data: [result.data],
						total: result.total,
						reset: false,
					});
				}
				return result;
			}

			if (!silent) utils.error(result);
			return result;
		} catch (err) {
			if (!silent) utils.loader.done();
			console.error(`No se pudo obtener los registros de ${app}`, err);
			return err;
		}
	},
	// Add item
	"gestios/items/add": async function (
		{ commit },
		{ app, params, view = null, callback = null, silent = false, relationalFieldFakeResponse = [] }
	) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios.app(app).add(params, callback);
			if (!silent) utils.loader.done();

			if (result.ok) {
				if (!view) view = app;

				if (Array.isArray(relationalFieldFakeResponse)) {
					for (const i in relationalFieldFakeResponse) {
						const fieldName = relationalFieldFakeResponse[i];
						result.data[fieldName] = JSON.parse(params[fieldName]);
					}
				} else {
						const fieldName = relationalFieldFakeResponse;
						result.data[fieldName] = JSON.parse(params[fieldName]);
				}

				commit("GESTIOS/ITEMS/ADD", { view, data: result.data });
				return result;
			}

			if (!silent) utils.error(result);
			return result;
		} catch (err) {
			if (!silent) utils.loader.done();
			console.error(`No se pudo añadir el registro a ${app}`, err);
			return err;
		}
	},
	// Edit item
	"gestios/items/edit": async function (
		{ commit },
		{ app, id, params, callback = null, silent = false }
	) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios
				.app(app)
				.edit({ id, params, callback });
			if (!silent) utils.loader.done();

			if (result.ok) {
				commit("GESTIOS/ITEMS/EDIT", { app, data: [result.data] });
				return result;
			}

			if (!silent) utils.error(result);
			return result;
		} catch (err) {
			if (!silent) utils.loader.done();
			console.error(`No se pudo modificar el registro ${id}:${app}`, err);
			return err;
		}
	},
	// Toggle item status
	"gestios/items/status": async function ({ commit }, { app, id }) {
		try {
			utils.loader.start();
			const result = await gestios.app(app).status(id);
			utils.loader.done();

			if (result.ok) {
				commit("GESTIOS/ITEMS/EDIT", { app, data: [result.data] });
				return result;
			}

			utils.error(result);
			return result;
		} catch (err) {
			utils.loader.done();
			console.error(
				`No se pudo cambiar el estado del registro ${id}:${app}`,
				err
			);
			return err;
		}
	},
	// Delete app item
	"gestios/items/delete": async function (
		{ commit },
		{ app, id, callback = null }
	) {
		try {
			utils.loader.start();
			const result = await gestios.app(app).delete(id, callback);
			utils.loader.done();

			if (result.ok) {
				commit("GESTIOS/ITEMS/DELETE", { app, id });
				return result;
			}

			utils.error(result);
			return result;
		} catch (err) {
			utils.loader.done();
			console.error("No se pudo obtener las aplicaciones", err);
			return err;
		}
	},
	// List app items
	"gestios/items/export": async function (
		{ commit },
		{
			app,
			fields,
			page = 1,
			filters = null,
			order = null,
			limit = 20,
			silent = false,
		}
	) {
		try {
			if (!silent) utils.loader.start();
			const result = await gestios
				.app(app)
				.export({ page, filters, order, limit, fields });
			if (!silent) utils.loader.done();

			if (result.ok) {
				return result;
			}

			if (!silent) utils.error(result);
			return result;
		} catch (err) {
			console.error(`No se pudo export los registros de ${app}`, err);
			return err;
		}
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
