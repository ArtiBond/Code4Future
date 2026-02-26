module.exports = class UserDto {
    id;
    email;
    name;
    country;
    role;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.name = model.name;
        this.country = model.country;
        this.role = model.role;
    }
}
