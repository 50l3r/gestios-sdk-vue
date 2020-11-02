// import avatar from '@/assets/images/avatars/bot.jpg';

const state = {};

const getters = {
	'gestios/avatars/get': (st, gt) => (id = null) => {
		if (!id) id = gt['gestios/user'].ID;

		// if (typeof user.BOT !== 'undefined') {
		// 	if (user.BOT === '1') {
		// 		// return require('@/assets/images/avatars/bot.jpg');
		// 		return avatar;
		// 	}
		// }

		return `${gt['gestios/api']}/avatar/${id}`;
	}
};

const mutations = {};

const actions = {};

export default {
	state,
	getters,
	actions,
	mutations
};
