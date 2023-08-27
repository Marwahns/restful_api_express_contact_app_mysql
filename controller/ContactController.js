const connection = require("../utils/config/database");
const Contact = require("../models/contactsModel");
const express = require("express");
const { body, validationResult, check } = require("express-validator");
const { cekDuplikat, cekUniqueHp } = require("../utils/contacts");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();

// Konfigurasi flash
app.use(cookieParser("secret")); // res.cookie('cookieName', 'cookieValue', { secure: true });
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Middleware untuk menampilkan pesan error ketika terjadi validasi input formulir
// Validate new contact
const validateContact = [
    body("email").custom((value) => {
        const duplikat = cekDuplikat(value);
        if (duplikat) {
            throw new Error("Email contact sudah digunakan!");
        }
        return true;
    }),
    body("noHP").custom((value) => {
        const uniqueNoHP = cekUniqueHp(value);
        if (uniqueNoHP) {
            throw new Error("Nomor Handphone sudah ada!");
        }
        return true;
    }),
    check("email", "Email invalid!").isEmail(),
    check("noHP", "Nomor Handphone invalid!").isMobilePhone("id-ID"),
];

// validate update contact
const validateUpdateContact = [
    body("email").custom((value, { req }) => {
        const duplikat = cekDuplikat(value);
        if (value !== req.body.oldEmail && duplikat) {
            throw new Error("Email contact sudah digunakan!");
        }
        return true;
    }),
    body("noHP").custom((value, { req }) => {
        const uniqueNoHP = cekUniqueHp(value);
        if (value !== req.body.oldnoHP && uniqueNoHP) {
            throw new Error("Nomor Handphone sudah ada!");
        }
        return true;
    }),
    check("email", "Email invalid!").isEmail(),
    check("noHP", "Nomor Handphone invalid!").isMobilePhone("id-ID"),
];

// cek duplikat data contact
const checkDuplicateContact = (email, noHP) => {
    const query = "SELECT * FROM contacts WHERE email = ? OR noHP = ?";
    return new Promise((resolve, reject) => {
        connection.query(query, [email, noHP], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const checkDuplicateUpdateContact = (email, noHP, excludedId) => {
    const query = "SELECT * FROM contacts WHERE (email = ? OR noHP = ?) AND id != ?";
    return new Promise((resolve, reject) => {
        connection.query(query, [email, noHP, excludedId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// mengambil semua data contact
// const getAllContacts = () => {
//     const query = 'SELECT * FROM contacts';
//     return new Promise((resolve, reject) => {
//         db.query(query, (err, results) => {
//             if (err) {
//                 console.error('Error fetching contacts:', err);
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };
const getAllContacts = (req, res) => {
    const query = "SELECT * FROM contacts";
    const countContactQuery = "SELECT COUNT(name) AS contactCount FROM contacts";

    // Fetch the count of contacts
    connection.query(countContactQuery, (countErr, countResults) => {
        if (countErr) {
            console.error("Error fetching contact count:", countErr);
            req.flash("msg", "Terjadi kesalahan saat mengambil data kontak.");
            res.render("contact/contact", {
                layout: "layouts/base",
                title: "Halaman Contact",
                contacts: [],
                countContact: 0, // Set a default count value
                msg: req.flash("msg"),
            });
        } else {
            const countContact = countResults[0].contactCount;

            // Fetch all contacts
            connection.query(query, (err, results) => {
                if (err) {
                    console.error("Error fetching contacts:", err);
                    req.flash("msg", "Terjadi kesalahan saat mengambil data kontak.");
                    res.render("contact/contact", {
                        layout: "layouts/base",
                        title: "Halaman Contact",
                        contacts: [],
                        countContact,
                        msg: req.flash("msg"),
                    });
                } else {
                    res.render("contact/contact", {
                        layout: "layouts/base",
                        title: "Halaman Contact",
                        contacts: results,
                        countContact,
                        msg: req.flash("msg"),
                    });
                }
            });
        }
    });
};

// proses menyimpan data contact baru
// Menggunakan async await karena fungsi ini membutuhkan beberapa promise sebelumnya yang harus di
// const createContact = (req, res) => {
//     // Logika untuk membuat pengguna baru berdasarkan data yang diberikan
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         // Return res.status(422).json({ errors: errors.array() })
//         res.render('contact/add-contact', {
//             title: "Form Tambah Data Contact",
//             layout: 'layouts/base',
//             errors: errors.array()
//         })
//     } else {
//         const { name, email, noHP } = req.body;
//         const query = 'INSERT INTO contacts (name, email, noHP) VALUES (?, ?, ?)';
//         connection.query(query, [name, email, noHP], (err, result) => {
//             if (err) {
//                 console.error('Error adding contact:', err);
//                 req.flash('msg', 'Terjadi kesalahan saat menambahkan data kontak.');
//             } else {
//                 req.flash('msg', 'Data contact berhasil ditambahkan!');
//             }
//             res.redirect('/contacts');
//         });
//     }
// };

const createContact = async (req, res) => {
    const { name, email, noHP } = req.body;

    try {
        // Periksa duplikat berdasarkan email atau nomor HP
        const duplicateContacts = await checkDuplicateContact(email, noHP);

        if (duplicateContacts.length > 0) {
            req.flash(
                "errors",
                "Data kontak dengan email atau nomor HP yang sama sudah ada."
            );
            // res.redirect('/contact/add');
            res.render("contact/add-contact", {
                title: "Form Tambah Data Contact",
                layout: "layouts/base",
                errors: req.flash("errors"),
            });
            return; // Hentikan eksekusi lebih lanjut
        }

        // Lanjutkan proses menyimpan data ke basis data
        const query = "INSERT INTO contacts (name, email, noHP) VALUES (?, ?, ?)";
        connection.query(query, [name, email, noHP], (err, result) => {
            if (err) {
                console.error("Error adding contact:", err);
                req.flash("msg", "Terjadi kesalahan saat menambahkan data kontak.");
            } else {
                req.flash("msg", "Data contact berhasil ditambahkan!");
            }
            // res.redirect("/contacts");
            res.redirect("/");
        });
    } catch (error) {
        console.error("Error checking duplicate contacts:", error);
        req.flash("msg", "Terjadi kesalahan saat memeriksa data duplikat.");
        // res.redirect("/contacts");
        res.redirect("/");
    }
};

// halaman edit contact
const getContactById = (req, res) => {
    // Logika untuk mengambil data pengguna berdasarkan ID yang diberikan
    const contactId = req.params.id;
    const query = "SELECT * FROM contacts WHERE id = ?";
    connection.query(query, [contactId], (err, result) => {
        if (err) {
            console.error("Error fetching contact for editing:", err);
            req.flash(
                "msg",
                "Terjadi kesalahan saat mengambil data kontak untuk diedit."
            );
            // res.redirect("/contacts");
            res.redirect("/");
        } else {
            res.render("contact/edit-contact", {
                title: "Form Ubah Data Contact",
                layout: "layouts/base",
                contact: result[0],
            });
        }
    });
};

// proses update data contact
// const updateContact = (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         // Handle validasi gagal untuk permintaan API
//         res.status(400).json({ errors: errors.array() });
//     } else {
//         const contactId = req.params.id;
//         const { name, noHP, email } = req.body;
//         const query = 'UPDATE contacts SET name = ?, noHP = ?, email = ? WHERE id = ?';
//         connection.query(query, [name, noHP, email, contactId], (err, result) => {
//             if (err) {
//                 res.status(500).json({ error: 'Failed to update contact' });
//             } else {
//                 res.status(200).json({ message: 'Contact updated successfully' });
//             }
//         });
//     }
// }

const updateContact = (req, res) => {
    const errors = validationResult(req);

    try {

        if (!errors.isEmpty()) {
            // Handle validation failure for API request
            res.status(400).json({ errors: errors.array() });
        } else {
            const contactId = req.params.id;
            const { name, noHP, email } = req.body;

            // Check for duplicate email or noHP before updating
            checkDuplicateUpdateContact(email, noHP, contactId)
                .then((duplicateContacts) => {
                    if (duplicateContacts.length > 0) {
                        // Duplicate email or noHP found
                        // res.status(400).json({ error: "Duplicate email or noHP" });
                        console.log('masuk')
                        req.flash("error", "Data kontak dengan email atau nomor HP yang sama sudah ada.");

                        res.render(`contact/edit-contact/${contactId}`, {
                            title: "Form Edit Data Contact",
                            layout: "layouts/base",
                            error: req.flash("error"),
                        });
                        // return; // Hentikan eksekusi lebih lanjut
                    } else {
                        const updateQuery = "UPDATE contacts SET name = ?, noHP = ?, email = ? WHERE id = ?";
                        connection.query(updateQuery, [name, noHP, email, contactId], (err, result) => {
                            // console.log('masuk')
                            if (err) {
                                res.status(500).json({ error: "Failed to update contact" });
                            } else {
                                req.flash("msg", "Contact updated successfully");
                                res
                                    .status(200)
                                    .json({ message: "Contact updated successfully" })
                                    .render("contact/detail", {
                                        layout: "layouts/base",
                                        title: "Halaman Detail Contact",
                                        msg: req.flash("msg"),
                                    });
                            }
                        }
                        );
                    }
                })
                .catch((error) => {
                    res.status(500).json({ error: "Failed to check duplicate contact" });
                });
        }
    } catch (error) {
        console.error("Error checking duplicate contacts:", error);
        req.flash("msg", "Terjadi kesalahan saat memeriksa data duplikat.");
        // res.redirect("/contacts");
        res.redirect("/");
    }
};

// proses delete data contact
const deleteContact = (req, res) => {
    const contactId = req.params.id;
    console.log(req.params);
    const query = "DELETE FROM contacts WHERE id = ?";
    connection.query(query, [contactId], (err, result) => {
        if (err) {
            console.error("Error deleting contact:", err);
            req.flash('msg', 'Terjadi kesalahan saat menghapus data kontak.');
            res.redirect('/contacts');
        } else {
            req.flash('msg', 'Data contact berhasil dihapus!');
            res.redirect('/contacts');
        }
    });
};

const deleteMultipleContact = (req, res) => {
    // const contactIds = (req.params.ids);
    const contactIds = [req.params.ids];
    // const splitContactIds = contactIds.split(','); // Split the string by comma

    // Filter out the -1 IDs if present
    // const filteredIds = splitContactIds.filter(id => id !== '-1');
    // console.log(filteredIds);

    if (!Array.isArray(contactIds) || contactIds.length === 0) {
        req.flash('msg', 'No contacts selected for deletion.');
        res.redirect('/contacts');
        return;
    }

    const query = `DELETE FROM contacts WHERE id IN (${contactIds})`;
    connection.query(query, [contactIds], (err, result) => {
        console.log(query);
        if (err) {
            console.error("Error deleting contacts:", err);
            req.flash('msg', 'An error occurred while deleting contacts.');
            res.redirect('/contacts');
        } else {
            const deletedCount = result.affectedRows || 0;
            req.flash('msg', `${deletedCount} contacts successfully deleted.`);
            res.redirect('/contacts');
        }
        // res.redirect('/contacts');
    });
}

// halaman detail data contact
const getDetailContactById = (req, res) => {
    const contactId = req.params.id;
    const query = "SELECT * FROM contacts WHERE id = ?";
    connection.query(query, [contactId], (err, results) => {
        if (err) {
            // res.status(500).json({ error: 'Failed to fetch contact details' });
            res.render("contact/contact", {
                layout: "layouts/base",
                title: "Halaman Contact",
                contacts: [],
                msg: req.flash("msg"),
            });
        } else {
            if (results.length === 0) {
                // res.status(404).json({ error: 'Contact not found' });
                res.render("contact/contact", {
                    layout: "layouts/base",
                    title: "Halaman Contact",
                    contacts: [],
                    msg: req.flash("msg"),
                });
            } else {
                // res.status(200).json(results[0]);
                res.render("contact/detail", {
                    layout: "layouts/base",
                    title: "Halaman Detail Contact",
                    contact: results[0], // Assign the query results to 'contacts'
                    msg: req.flash("msg"),
                });
            }
        }
    });
};


module.exports = {
    validateContact,
    validateUpdateContact,
    getAllContacts,
    createContact,
    getContactById,
    updateContact,
    deleteContact,
    getDetailContactById,
    deleteMultipleContact,
};
