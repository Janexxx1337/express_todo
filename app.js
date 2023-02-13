'use strict';
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const port = 3000
const bodyParser = require('body-parser')
const _ = require('lodash')


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/todolistDB')


const itemsSchema = {name: String}
const Item = mongoose.model("Item", itemsSchema);

const work = new Item({
    name: 'You should work!'
})


const breakfast = new Item({
    name: 'You should eat!'
})


const morning = new Item({
    name: 'You should get up!'
})


const defaultItems = [work, breakfast, morning]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model('List', listSchema)


app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Good')
                }
            });
            res.redirect('/')
        } else {
            res.render('list', {listTitle: 'Today', newListItems: foundItems})
        }
    })
})

app.get('/:name', (req, res) => {
    const routeName = _.capitalize(req.params.name)


    List.findOne({name: routeName}, (err, sameList) => {
        if (!sameList) {
            const list = new List({
                name: routeName,
                items: defaultItems
            })
            list.save()
            res.redirect('/')
        } else {
            res.render('list', {listTitle: sameList.name, newListItems: sameList.items})
        }
    })
})


app.get('/about', (req, res) => {
    res.render('about')
})

app.post('/', (req, res) => {
    const itemName = req.body.item
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if (item.name.length > 2) {
        if (listName === 'Today') {
            item.save()
            res.redirect('/')
        } else {
            List.findOne({name: listName}, (err, sameList) => {
                sameList.items.push(item)
                sameList.save()

            })

        }
    } else {
        res.redirect('/')
    }


})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if (listName === 'Today') {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('All right')
            }
        })
        res.redirect('/')
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName)
            }
        })
    }


})


app.listen(3000, () => {
    console.log(`Server start on port ${port}`)
})
