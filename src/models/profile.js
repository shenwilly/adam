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
        this.role = params.role;
        this.reference_id = params.reference_id;
        this.unix_timestamp = params.unix_timestamp;
    }

    fullname() {
        let name = this.first_name;
        if (this.last_name.length > 0) name += " " + this.last_name;
        return name;
    }

    sex() {
        return this.gender.charAt(0).toUpperCase() + this.gender.slice(1);
    }

    birth() {
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return months[this.birth_month] + " " + this.birth_year.toString() + ", " + this.birthplace;
    }
    // Adding a method to the constructor
    // greet() {
    //     return `${this.name} says hello.`;
    // }
}

