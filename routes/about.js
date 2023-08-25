const express = require('express');
const router = express.Router();

/* GET about page. */
router.get('/about', function (req, res) {
    // di dalam render di kasih tau path filenya ada dimana, kalau di dalam folder views kemudian di dalam folder yang location, maka cukup seperti ini saja 'namaFolder/namaFile'
    res.render('about/about', {
        layout: 'layouts/base',
        title: 'Halaman About'
    })
})

module.exports = router;