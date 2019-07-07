export class Profile {
    constructor(params) {
        this.first_name = params.first_name;
        this.last_name = params.last_name;
        this.gender = params.gender;
        this.birthplace = params.birthplace;
        this.birth_month = params.birth_month;
        this.birth_year = params.birth_year;
        this.id = params.id;
        this.family_id = params.family_id;
        this.spouse_id = params.spouse_id;
        this.children_ids = params.children_ids;
        this.unix_timestamp = params.unix_timestamp;
    }

    // Adding a method to the constructor
    // greet() {
    //     return `${this.name} says hello.`;
    // }
}

