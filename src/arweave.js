import { writable } from 'svelte/store';
import { Profile } from './models/profile.js';

export const is_connected = writable(false);
export const public_address = writable("");
export const wallet = writable("");
export const user_profile = writable(undefined);
export const selected_profile = writable(undefined);
export const arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'});

export const notifications = writable([]);
export const new_notifications_counter = writable(0);
  
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
                    expr1: 'Self',
                    expr2: 'true',
                }
            },
        };
        
    const res = await arweave.api.post(`arql`, query)
    var tx_rows = []
    if (res.data != '') {
        tx_rows = await Promise.all(res.data.map(async function (id, i) {
            let tx = await arweave.transactions.get(id);

            let tx_data = tx.get('data', {decode: true, string: true});
            let tx_object = JSON.parse(tx_data);
            if (tx_object.id === undefined) tx_object.id = id;
            tx_object['unix_timestamp'] = '0'
            tx.get('tags').forEach(tag => {
                let key = tag.get('name', { decode: true, string: true })
                let value = tag.get('value', { decode: true, string: true })
                if (key === 'Unix-Time') tx_object['unix_timestamp'] = value
            })
            
            let profile = new Profile(tx_object);
            return profile;
        }))
    } else {
        return;
    }

    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)))
    let profile = tx_rows[0];

    // console.log(user_profile)
    return profile;
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
                op: 'equals',
                expr1: 'Family-Id',
                expr2: family_id,
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
            // console.log(tx_object);
            if (tx_object.id === undefined) tx_object.id = id;
            tx_object['unix_timestamp'] = '0'
            tx.get('tags').forEach(tag => {
                let key = tag.get('name', { decode: true, string: true })
                let value = tag.get('value', { decode: true, string: true })
                if (key === 'Unix-Time') tx_object['unix_timestamp'] = value;
            })
            
            let profile = new Profile(tx_object);
            return profile;
        }))
    } else {
        return;
    }

    var unique_ids = [];
    var unique_family_members = [];
    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)));
    tx_rows.forEach((item) => {
        if (!unique_ids.includes(item.id)) {
            unique_ids.push(item.id);
            unique_family_members.push(item);
        }
    });
    // let user_profile = tx_rows[0];

    console.log(unique_family_members);
    return unique_family_members;
}

export async function create_profile(data_map, is_self=false) {
    var unixTime = Math.round((new Date()).getTime() / 1000)

    var keywords = [];
    if ('first_name' in data_map) {
        var new_keywords = data_map['first_name'].replace(',', '').toLowerCase().split(" ");
        keywords.push(...new_keywords);
    }
    if ('last_name' in data_map) {
        var new_keywords = data_map['last_name'].replace(',', '').toLowerCase().split(" ");
        keywords.push(...new_keywords);
    }
    if ('birthplace' in data_map) {
        var new_keywords = data_map['birthplace'].replace(',', '').toLowerCase().split(" ");
        keywords.push(...new_keywords);        
    }
    
    let wallet_value;
    wallet.subscribe(value => {
        wallet_value = value;
    });

    var family_id;
    if (is_self === true) {
        family_id = uuidv4();
        data_map["family_id"] = family_id;
    } else {
        family_id = data_map["family_id"];
    }
    console.log(data_map);
    let json_data = JSON.stringify(data_map);
    var tx =
        await arweave.createTransaction(
            {
                data: json_data,
            },
            wallet_value
        );

    tx.addTag('App-Name', 'adam-0');
    tx.addTag('Unix-Time', unixTime);
    tx.addTag('Self', is_self.toString());
    tx.addTag('Family-Id', family_id);
    keywords.forEach(function(keyword) {
        tx.addTag('keyword', keyword);
    });
    await arweave.transactions.sign(tx, wallet_value);
    console.log(tx.id, "<")
    await arweave.transactions.post(tx);
}

export async function edit_profile(data_map) {
    var unixTime = Math.round((new Date()).getTime() / 1000)

    var keywords = [];
    if ('first_name' in data_map) {
        var new_keywords = data_map['first_name'].replace(',', '').toLowerCase().split(" ");
        keywords.push(...new_keywords);
    }
    if ('last_name' in data_map) {
        var new_keywords = data_map['last_name'].replace(',', '').toLowerCase().split(" ");
        keywords.push(...new_keywords);
    }
    if ('birthplace' in data_map) {
        var new_keywords = data_map['birthplace'].replace(',', '').toLowerCase().split(" ");
        keywords.push(...new_keywords);        
    }
    
    let wallet_value;
    wallet.subscribe(value => {
        wallet_value = value;
    });

    console.log(data_map);
    let json_data = JSON.stringify(data_map);
    var tx =
        await arweave.createTransaction(
            {
                data: json_data,
            },
            wallet_value
        );

    tx.addTag('App-Name', 'adam-0');
    tx.addTag('Unix-Time', unixTime);
    if (user_profile.id == data_map["id"]) {
        tx.addTag('Self', 'true');
    } else {
        tx.addTag('Self', 'false');
    };
    tx.addTag('Family-Id', data_map["family_id"]);
    keywords.forEach(function(keyword) {
        tx.addTag('keyword', keyword);
    });
    await arweave.transactions.sign(tx, wallet_value);
    console.log(tx.id, "<")
    await arweave.transactions.post(tx);
}

export async function search_family_tree(search_query) {
    var keywords = search_query.split(" ");
    
    let query =
        {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'App-Name',
                expr2: 'adam-0'
            },
            expr2: {},
        };

    var query_map = generateQueryMap(keywords);
    query.expr2 = query_map;
        
    const res = await arweave.api.post(`arql`, query)
    var tx_rows = []
    if (res.data != '') {
        tx_rows = await Promise.all(res.data.map(async function (id, i) {
            let tx = await arweave.transactions.get(id);

            let tx_data = tx.get('data', {decode: true, string: true});
            let tx_object = JSON.parse(tx_data);
            // console.log(tx_object);
            if (tx_object.id === undefined) tx_object.id = id;
            tx_object['unix_timestamp'] = '0'
            tx.get('tags').forEach(tag => {
                let key = tag.get('name', { decode: true, string: true })
                let value = tag.get('value', { decode: true, string: true })
                if (key === 'Unix-Time') tx_object['unix_timestamp'] = value;
            })
            
            let profile = new Profile(tx_object);
            return profile;
        }))
    } else {
        return [];
    }

    var unique_ids = [];
    var unique_family_members = [];
    tx_rows.sort((a, b) => (Number(a.unixTime) - Number(b.unixTime)));
    tx_rows.forEach((item) => {
        if (!unique_ids.includes(item.id)) {
            unique_ids.push(item.id);
            unique_family_members.push(item);
        }
    });
    
    console.log(unique_family_members);
    return unique_family_members;
}


function generateQueryMap(queries) {
    if (queries.length <= 0) return;
    var last_query = queries.pop();
    var temp_query_map = generateQueryMap(queries);
    var query_map;
    if (temp_query_map !== undefined) {
        if (last_query !== undefined) {
            query_map = {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'keyword',
                    expr2: last_query,
                },
                expr2: temp_query_map,
            }
        }
    } else {
        query_map = {
            op: 'equals',
            expr1: 'keyword',
            expr2: last_query,
        }
    }
    return query_map;
};