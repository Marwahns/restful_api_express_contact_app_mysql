// import database
const connection = require('../utils/config/database')

// Buat Schema
class Contact {
    constructor(id, name, noHP, email) {
        this.id = id;
        this.name = name;
        this.noHP = noHP;
        this.email = email;
    }
}

module.exports = Contact;