import { writable } from 'svelte/store';

export const is_connected = writable(false);
export const public_address = writable("");
export let arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'});
