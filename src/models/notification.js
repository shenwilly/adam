export class Notification {
    constructor(params) {
        this.id = params.id;
        this.unix_timestamp = params.unix_timestamp;
        this.description = params.description;
        this.url = params.url;
        this.status = params.stauts;
    }
}

