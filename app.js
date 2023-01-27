'use strict';
const express = require('express')
const app = express()

const port = 3000
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')

let day = date.getDate()

let list_items = []
let work_items = []


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', (req, res) => {



    res.render('list', {listTitle: day, newListItems: list_items})
})

app.post('/', (req, res) => {
    let item = req.body.item
    if (item.length > 2) {
        work_items.push(item)
    }

    if (req.body.list === 'Work') {

        res.redirect('/work')
    }
    else {
        let item = req.body.item
        res.redirect('/')
        if (item.length > 2) {
            list_items.push(item)
        }
    }


})

app.get('/work', (req, res) => {
    res.render('list', {listTitle: 'Work List', newListItems: work_items})
})

app.post('/work', (req, res) => {
    let item = req.body.item
    work_items.push(item)
    req.redirect('/work')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.listen(3000, () => {
    console.log(`Server start on port ${port}`)
})
