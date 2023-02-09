//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false)
mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = {
  name: String
}

const Item = mongoose.model('Item', itemsSchema)

const item_1 = new Item ({name: 'Welcome to the ToDo list.'})
const item_2 = new Item ({name: 'Hit + to add an item.'})
const item_3 = new Item ({name: '<-- Click the checkbox to delete item.'})

const defaultItems = [item_1, item_2, item_3]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model('List', listSchema)

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
    
      item.insertMany(defaultItems, function(err) {
    
        if (err) {
    
          console.log(err)
    
        } else {
    
          console.log('saved default items to Database')
    
        }
    
      })

      res.redirect('/')
    
    } else {
    
      res.render('list', {listTitle: 'Today', newListItems: foundItems})
    
    }

  })

});

app.get('/:customListName', function(req, res) {
  console.log(req.params.customListName)
})

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })

  item.save()

  res.redirect('/')

});

app.post('/delete', function(req, res) {
   const checkedItemId = req.body.checkbox

   Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log('removed checked item from Database')
      res.redirect('/')
    }
   })
})

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
