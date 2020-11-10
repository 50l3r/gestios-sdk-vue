import PersistedState from 'vuex-persistedstate';
// import Cookies from 'js-cookie';

import apps from './modules/apps';
import auth from './modules/auth';
import avatars from './modules/avatars';
import config from './modules/config';
import emails from './modules/emails';
import groups from './modules/groups';
import info from './modules/info';
import items from './modules/items';
import media from './modules/media';
import roles from './modules/roles';
import users from './modules/users';

const modules = {
	apps,
	auth,
	avatars,
	config,
	emails,
	groups,
	info,
	items,
	media,
	roles,
	users
};

const plugins = [
	PersistedState({
		// TODO: Indexed DB
		key: 'gestios-info',
		paths: ['info'],
		storage: window.localStorage
	}),
	PersistedState({
		key: 'gestios-app',
		paths: ['apps'],
		storage: window.localStorage
	}),
	PersistedState({
		key: 'gestios-items',
		paths: ['items'],
		storage: window.localStorage
	}),
	PersistedState({
		key: 'gestios-data',
		paths: ['media', 'emails', 'avatars'],
		storage: window.localStorage
	}),
	PersistedState({
		key: 'gestios-config',
		paths: ['config'],
		storage: window.localStorage
	}),
	PersistedState({
		key: 'gestios-users',
		paths: ['auth', 'users', 'roles', 'groups'],
		storage: window.localStorage
	})
	// PersistedState({
	// 	key: 'cache',
	// 	paths: ['cache'],
	// 	storage: {
	// 		// 1H CAD
	// 		getItem: (key) => Cookies.get(key),
	// 		setItem: (key, value) => Cookies.set(key, value, {
	// 			expires: new Date(new Date().getTime() + 60 * 60 * 1000),
	// 			secure: false
	// 		}),
	// 		removeItem: (key) => Cookies.remove(key)
	// 	}
	// })
];

export { modules, plugins };

// const store = new Vuex.Store({
// 	modules,
// 	plugins,
// 	strict: process.env.NODE_ENV !== 'production'
// });

// export default store;
