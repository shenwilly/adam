import { get_transaction_status, notifications } from '../arweave.js';

export class Notification {
    constructor(params) {
        this.id = params.id;
        this.unix_timestamp = params.unix_timestamp;
        this.description = params.description;
        this.url = params.url;
        this.status = params.status;
        this.seen = false;

        this.checkStatus = this.checkStatus.bind(this); 

        // this.checkStatus(params.id);
    }

    timestamp() {
        var date_options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        var datetime = new Date(this.unix_timestamp*1000);
        var formatted_datetime = datetime.toLocaleDateString('default', date_options)
        return formatted_datetime;
    }

    see() {
        this.seen = true;
    }

    async checkStatus(tx_id) {
        var self = this;
        setTimeout(async function() {
            let response = await get_transaction_status(tx_id);
            if (response.status == 200) {
                this.seen = false;
                this.status = "done";

                let notification_values;
                notifications.subscribe(value => {
                    notification_values = value;
                });
                notifications.update(n => {
                    if (n.length > 1) return [n[0]];
                });
                // notifications[0].set([]);
            } else {
                self.checkStatus(tx_id);
            }
        }, 3000);
    } 
}

