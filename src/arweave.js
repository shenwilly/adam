import { writable } from 'svelte/store';
import { Profile } from './models/profile.js';

export const is_connected = writable(false);
export const public_address = writable("");
export const wallet = writable("");
export const user_profile = writable(undefined);
export const arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'});

export async function login(wallet_data) {
    wallet.set(JSON.parse(wallet_data));
    let wallet_value;
    wallet.subscribe(value => {
        wallet_value = value;
    });
    
    await arweave.wallets.jwkToAddress(wallet_value).then(async (address) => {
        public_address.set(address);
        const profile = await fetch_self_identity(address);
        if (profile !== undefined) user_profile.set(profile);
        is_connected.set(true);
    });
}

export async function fetch_self_identity(address) {
    let query =
        {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'App-Name',
                expr2: 'adam-0'
            },
            expr2: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'from',
                    expr2: address,
                },
                expr2: {
                    op: 'equals',
                    expr1: 'self',
                    expr2: 'false',
                }
            },
        };
        
    const res = await arweave.api.post(`arql`, query)
    var tx_rows = []
    // res.data = ''
    if (res.data != '') {
        tx_rows = await Promise.all(res.data.map(async function (id, i) {
            let tx = await arweave.transactions.get(id);

            let tx_data = tx.get('data', {decode: true, string: true});
            let tx_object = JSON.parse(tx_data);
            tx_object['id'] = id;
            tx_object['unix_timestamp'] = '0'
            tx.get('tags').forEach(tag => {
                let key = tag.get('name', { decode: true, string: true })
                let value = tag.get('value', { decode: true, string: true })
                if (key === 'Unix-Time') tx_object['unix_timestamp'] = value
                else if (key === 'spouse') tx_object['spouse_id'] = value;
                else if (key === 'family') tx_object['family_id'] = value;
            })
            
            let profile = new Profile(tx_object);
            return profile;
        }))
    } else {
        return;
    }

    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)))
    let user_profile = tx_rows[0];

    console.log(user_profile)
    return user_profile;
}

export async function create_profile(data_map, is_self=false) {
    var unixTime = Math.round((new Date()).getTime() / 1000)

    var keywords = [];
    if ('first_name' in data_map) keywords.push(data_map['first_name'].toLowerCase());
    if ('last_name' in data_map) keywords.push(data_map['last_name'].toLowerCase());
    if ('birthplace' in data_map) keywords.push(data_map['birthplace'].toLowerCase());
    console.log(keywords);
    
    let wallet_value;
    wallet.subscribe(value => {
        wallet_value = value;
    });

    var tx =
        await arweave.createTransaction(
            {
                data: JSON.stringify(data_map),
            },
            wallet_value
        );

    tx.addTag('App-Name', 'adam-0');
    tx.addTag('Unix-Time', unixTime);
    tx.addTag('self', is_self.toString());
    keywords.forEach(function(keyword) {
        tx.addTag('keyword', keyword);
    });
    await arweave.transactions.sign(tx, wallet_value);
    console.log(tx.id)
    await arweave.transactions.post(tx);
}

export async function fetch_family_members(family_id) {
    let query =
        {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'App-Name',
                expr2: 'adam-0'
            },
            expr2: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'from',
                    expr2: address,
                },
                expr2: {
                    op: 'equals',
                    expr1: 'self',
                    expr2: 'false',
                }
            },
        };
        
    const res = await arweave.api.post(`arql`, query)
    var tx_rows = []
    // res.data = ''
    if (res.data != '') {
        tx_rows = await Promise.all(res.data.map(async function (id, i) {
            let tx = await arweave.transactions.get(id);

            let tx_data = tx.get('data', {decode: true, string: true});
            let tx_object = JSON.parse(tx_data);
            tx_object['id'] = id;
            tx_object['unix_timestamp'] = '0'
            tx.get('tags').forEach(tag => {
                let key = tag.get('name', { decode: true, string: true })
                let value = tag.get('value', { decode: true, string: true })
                if (key === 'Unix-Time') tx_object['unix_timestamp'] = value
                else if (key === 'spouse') tx_object['spouse_id'] = value;
                else if (key === 'family') tx_object['family_id'] = value;
            })
            
            let profile = new Profile(tx_object);
            return profile;
        }))
    } else {
        return;
    }

    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)))
    let user_profile = tx_rows[0];

    console.log(user_profile)
    return user_profile;
}