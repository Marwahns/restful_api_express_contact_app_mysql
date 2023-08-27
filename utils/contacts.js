const fs = require('fs')
const db = require('./config/database')

const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

// membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// Get all data in contacts.json
const loadContacts = () => {
    const fileBuffer = fs.readFileSync('./data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer) // mengubah data dari string -> objek
    return contacts
}

const loadContactsFromDB = () => {
    const query = 'SELECT * FROM contacts';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching contacts:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// find contact based on email
const findContact = (email) => {
    const contacts = loadContacts()

    // find data
    const contact = contacts.find((contact) => contact.email.toLowerCase() === email.toLowerCase())

    console.log(contact)
    return contact
}

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts)) // mengubah data dari objek -> string
}

// menambahkan data contact (satu data) baru
const addContact = (contact) => {
    const contacts = loadContacts()
    contacts.push(contact)
    saveContacts(contacts)
}

// Cek email yang duplikat
const cekDuplikat = (email) => {
    const contacts = loadContactsFromDB()
    return contacts.find((contact) => contact.email === email)
}

// Cek nomor handphone yang duplikat
const cekUniqueHp = (noHP) => {
    const contacts = loadContactsFromDB()
    return contacts.find((contact) => contact.noHP === noHP)
}

// hapus contact
const deleteContact = (email) => {
    const contacts = loadContacts()
    const filteredContacts = contacts.filter((contact) => contact.email !== email)

    saveContacts(filteredContacts)
}

// mengubah contacts
// const updateContacts = (contactBaru) => {
//     const contacts = loadContacts()

//     // hilangkan contact lama yang emailnya sama dengan oldEmail
//     const filteredContacts = contacts.filter((contact) => contact.email !== contactBaru.oldEmail)

//     delete contactBaru.oldEmail
//     delete contactBaru.oldnoHP

//     filteredContacts.push(contactBaru)
//     saveContacts(filteredContacts)
// }

const updateContacts = (updateContact) => {
    const contacts = loadContactsFromDB()

    // hilangkan contact lama yang emailnya sama dengan oldEmail
    // const filteredContacts = contacts.filter((contact) => contact.email !== updateContact.oldEmail)
    console.log(contacts);
}

module.exports = { loadContacts, loadContactsFromDB, findContact, addContact, cekDuplikat, cekUniqueHp, deleteContact, updateContacts }