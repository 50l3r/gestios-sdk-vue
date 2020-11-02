import GestiosSDK from 'gestios-sdk-js';

const gestios = new GestiosSDK({ debug: process.env.NODE_ENV !== 'production' });
export default gestios;
