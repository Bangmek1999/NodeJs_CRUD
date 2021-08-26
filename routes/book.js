const express = require('express');
const router = express.Router();
const dbCon = require('../lib/db');

//display book page
router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM book ORDER BY id asc', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('book', { data: '' });
        } else {
            res.render('book', { data: rows });
        }
    })
})

//display add book page
router.get('/add', (req, res, next) => {
    res.render('book/add', {
        name: '',
        author: ''
    })
})

//add a new book
router.post('/add', (req, res, next) => {
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', 'Please enter name and author');
        // render to add.ejs with flash message
        res.render('book/add', {
            name: name,
            author: author
        })
    }
    if (!errors) {
        const form_data = {
            name: name,
            author: author
        }
        dbCon.query('INSERT INTO book SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err)

                res.render('book/add', {
                    name: form_data.name,
                    author: form_data.author
                })

            } else {
                req.flash('success', 'book successfully added');
                res.redirect('/book')
            }
        })
    }
})

//display edit book page
router.get('/edit/(:id)', (req, res, next) => {
    const id = req.params.id;
    dbCon.query('select * from book where id =' + id, (err, rows, fields) => {
        if (rows.length === 0) {
            req.flash('error', 'Book not founnd with id =' + id);
            res.redirect('/book')
        } else {
            res.render('book/edit', {
                table: 'Edit Book',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author
            })
        }
    });
})

//update a book
router.post('/update/:id', (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error', 'Please enter name and author');
        res.render('book/edit', {
            id: req.params.id,
            name: name,
            author: author
        })
    }
    //if on error
    if (!errors) {
        let form_data = {
            name: name,
            author: author
        }

        //udate data query
        dbCon.query("UPDATE book SET ? WHERE id = " + id, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('book/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success', 'Book Successfully updated');
                res.redirect('/book')
            }
        })
    }
})
router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;
    dbCon.query('DELETE FROM book WHERE id = ' + id, (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/book')
        } else {
            req.flash('success', 'Book Successfully Deleted = id', +id);
            res.redirect('/book')
        }
    })
})

module.exports = router;