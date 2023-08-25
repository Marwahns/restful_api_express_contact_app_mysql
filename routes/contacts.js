const express = require('express');
const router = express.Router();
// const connection = require('../utils/config/database')
// const { loadContacts, loadContactsFromDB, findContact, addContact, cekDuplikat, cekUniqueHp, deleteContact, updateContacts } = require('../utils/contacts')
// const { body, validationResult, check } = require('express-validator')
const contactController = require('../controller/ContactController');

/* GET contacts page. */
// router.get('/contacts', function (req, res) {
//     const query = 'SELECT * FROM contacts';
//     connection.query(query, (err, results) => {
//         if (err) {
//             // res.status(500).json({ error: 'Failed to fetch contacts' });
//             console.error('Error fetching contacts:', err);
//             req.flash('msg', 'Terjadi kesalahan saat mengambil data kontak.');
//             res.render('contact/contact', {
//                 layout: 'layouts/base',
//                 title: 'Halaman Contact',
//                 contacts: [],
//                 msg: req.flash('msg')
//             });
//         } else {
//             // res.status(200).json(results);
//             res.render('contact/contact', {
//                 layout: 'layouts/base',
//                 title: 'Halaman Contact',
//                 contacts: results, // Assign the query results to 'contacts'
//                 msg: req.flash('msg')
//             });
//         }
//     });
// });

router.get('/contacts', contactController.getAllContacts);

/* GET Add contacts page. */
router.get('/contact/add', function (req, res) {
    res.render('contact/add-contact', {
        title: "Form Tambah Data Contact",
        layout: 'layouts/base',
    })
})

/* POST Process Save New contacts */
// router.post(
//     '/contacts',
//     [
//         body('email').custom((value) => {
//             const duplikat = cekDuplikat(value)
//             if (duplikat) {
//                 throw new Error('Email contact sudah digunakan!')
//             }
//             return true
//         }),
//         body('noHP').custom((value) => {
//             const uniqueNoHP = cekUniqueHp(value)
//             if (uniqueNoHP) {
//                 throw new Error('Nomor Handphone sudah ada!')
//             }
//             return true
//         }),
//         check('email', 'Email invalid!').isEmail(),
//         check('noHP', 'Nomor Handphone invalid!').isMobilePhone('id-ID'),
//     ],
//     function (req, res) {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             // Return res.status(422).json({ errors: errors.array() })
//             res.render('contact/add-contact', {
//                 title: "Form Tambah Data Contact",
//                 layout: 'layouts/base',
//                 errors: errors.array()
//             })
//         } else {
//             const { name, email, noHP } = req.body;
//             const query = 'INSERT INTO contacts (name, email, noHP) VALUES (?, ?, ?)';
//             connection.query(query, [name, email, noHP], (err, result) => {
//                 if (err) {
//                     console.error('Error adding contact:', err);
//                     req.flash('msg', 'Terjadi kesalahan saat menambahkan data kontak.');
//                 } else {
//                     req.flash('msg', 'Data contact berhasil ditambahkan!');
//                 }
//                 res.redirect('/contacts');
//             });
//         }
//     }
// )

router.post('/contacts', contactController.validateContact, contactController.createContact)

/* GET edit contacts page. */
// router.get('/contact/edit/:id', function (req, res) {
//     const contactId = req.params.id;
//     const query = 'SELECT * FROM contacts WHERE id = ?';
//     connection.query(query, [contactId], (err, result) => {
//         if (err) {
//             console.error('Error fetching contact for editing:', err);
//             req.flash('msg', 'Terjadi kesalahan saat mengambil data kontak untuk diedit.');
//             res.redirect('/contacts');
//         } else {
//             res.render('contact/edit-contact', {
//                 title: "Form Ubah Data Contact",
//                 layout: 'layouts/base',
//                 contact: result[0]
//             });
//         }
//     });
// });
router.get('/contact/edit/:id', contactController.getContactById);

/* Process PUT Update contacts */
// router.put(
//     '/contact/:id',
//     [
//         body('email').custom((value, { req }) => {
//             const duplikat = cekDuplikat(value)
//             if (value !== req.body.oldEmail && duplikat) {
//                 throw new Error('Email contact sudah digunakan!')
//             }
//             return true
//         }),
//         body('noHP').custom((value, { req }) => {
//             const uniqueNoHP = cekUniqueHp(value)
//             if (value !== req.body.oldnoHP && uniqueNoHP) {
//                 throw new Error('Nomor Handphone sudah ada!')
//             }
//             return true
//         }),
//         check('email', 'Email invalid!').isEmail(),
//         check('noHP', 'Nomor Handphone invalid!').isMobilePhone('id-ID'),
//     ],
//     function (req, res) {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             // Handle validasi gagal untuk permintaan API
//             res.status(400).json({ errors: errors.array() });
//         } else {
//             const contactId = req.params.id;
//             const { name, noHP, email } = req.body;
//             const query = 'UPDATE contacts SET name = ?, noHP = ?, email = ? WHERE id = ?';
//             connection.query(query, [name, noHP, email, contactId], (err, result) => {
//                 if (err) {
//                     res.status(500).json({ error: 'Failed to update contact' });
//                 } else {
//                     res.status(200).json({ message: 'Contact updated successfully' });
//                 }
//             });
//         }
//     }
// )
router.put('/contact/:id', contactController.updateContact);

/* Process Delete contacts */
router.delete('/contact/:id', contactController.deleteContact);

/* GET detail contacts page */
// router.get('/contact/:id', function (req, res) {
//     const contactId = req.params.id;
//     const query = 'SELECT * FROM contacts WHERE id = ?';
//     connection.query(query, [contactId], (err, results) => {
//         if (err) {
//             // res.status(500).json({ error: 'Failed to fetch contact details' });
//             res.render('contact/contact', {
//                 layout: 'layouts/base',
//                 title: 'Halaman Contact',
//                 contacts: [],
//                 msg: req.flash('msg')
//             });
//         } else {
//             if (results.length === 0) {
//                 // res.status(404).json({ error: 'Contact not found' });
//                 res.render('contact/contact', {
//                     layout: 'layouts/base',
//                     title: 'Halaman Contact',
//                     contacts: [],
//                     msg: req.flash('msg')
//                 });
//             } else {
//                 // res.status(200).json(results[0]);
//                 res.render('contact/detail', {
//                     layout: 'layouts/base',
//                     title: 'Halaman Detail Contact',
//                     contact: results[0], // Assign the query results to 'contacts'
//                     msg: req.flash('msg')
//                 });
//             }
//         }
//     });
// });
router.get('/contact/:id', contactController.getDetailContactById);

module.exports = router;