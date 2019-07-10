import { writable } from 'svelte/store';
import { Profile } from './models/profile.js';
import { Notification } from './models/notification.js';

export const is_connected = writable(false);
export const public_address = writable("");
export const wallet = writable("");
export const user_profile = writable(undefined);
export const selected_profile = writable(undefined);
export const arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'});

export const notifications = writable([
    // new Notification({
    //     description: "Add: Zero Adam",
    //     status: "pending",
    //     unix_timestamp: "1562687898",
    //     id: "L40HhmDDeyO_MHEqB2wMPUhccWwARaJXXCNHGJY1OlA",
    // }),
    // new Notification({
    //     description: "Edit: First Adam",
    //     status: "pending",
    //     unix_timestamp: "1562688000",
    //     id: "3mAyWq0M_hN9Lumd1rJT3IQQOsxQZ18Xj8A46VW1LFE",
    // }),
    // new Notification({
    //     description: "Edit: Zero Adam",
    //     status: "pending",
    //     unix_timestamp: "1562685898",
    //     id: "3mAyWq0M_hN9Lumd1rJT3IQQOsxQZ18Xj8A46VW1LFE",
    // }),
]);
export const notifications_counter = writable(0);
  
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
        family_id = generateUUID();
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

    notifications.update(n => n.concat(
        new Notification({
            description: "Add: " + data_map['first_name'] + " " + data_map['last_name'],
            status: "pending",
            unix_timestamp: unixTime,
            id: tx.id,
        }),
    ));
    notifications_counter.update(n => n+1);

    return tx.id;
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

    notifications.update(n => n.concat(
        new Notification({
            description: "Edit: " + data_map['first_name'] + " " + data_map['last_name'],
            status: "pending",
            unix_timestamp: unixTime,
            id: tx.id,
        }),
    ));
    notifications_counter.update(n => n+1);
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

export async function get_transaction_status(tx_id) {
    console.log(tx_id);
    let status = await arweave.transactions.getStatus(tx_id)
    console.log(status);
    return status;
}

function generateUUID() {
    var d = new Date().getTime();
    if(Date.now){
        d = Date.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};