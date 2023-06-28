const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const date = require(__dirname+'/date.js');
const _ = require('lodash');

// console.log(date);

const app = express();

// const items =["task 1"];
// const workItems=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine","ejs");

mongoose.connect('mongodb+srv://yash-chauhan:yash-3099@todolist.ptu8k1h.mongodb.net/todolistDB');

const itemsSchema = new mongoose.Schema({  //items schema 
    name : String
});

const Item = mongoose.model('item',itemsSchema); // items model 

const item1 = new Item({
    name : "Welcome to your todolist!"
});
const item2 = new Item({
    name : "Hit the + button to add a new item."
});
const item3 = new Item({
    name : "<-- Hit this to delete an item."
});

const defaultItems =[item1,item2,item3];

const listSchema = new mongoose.Schema({
    name : String,
    items : [itemsSchema]
});

const List = mongoose.model('List',listSchema);


app.get("/",(req,res)=>{
    // const day = date.getDate();
    // console.log(day);
    Item.find({}).then((foundItems)=>{
        // console.log(foundItems);
        if(foundItems.length === 0){  
            Item.insertMany(defaultItems)
            .then(() => {
                console.log("items added successfully");
            })
            .catch((err) => {
                console.log(err);
            });
            res.redirect('/');
        }
        else{
            res.render("list", { listTitle: "Today" , newListItems: foundItems});
        }
    })
    .catch((err)=>{ 
        console.log(err);
    });
    
});


app.get('/:listName',(req,res)=>{
    // console.log(req.params.listName);
    const customListName = _.capitalize(req.params.listName);
    List.findOne({name : customListName})
        .then((foundList)=>{
            if(!foundList){
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect('/'+customListName);
            }
            else{
                res.render('list',{listTitle : foundList.name , newListItems : foundList.items});
                
            }
        })
        .catch((err)=>{
            console.log(err);
        })

    
})

app.post("/",(req,res)=>{
    // console.log(req.body);
    const item = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({
        name : item
    });
  
    // console.log(listName)
    if(listName === "Today"){
        newItem.save();
        res.redirect('/');
    }
    else{
        List.findOne({name : listName})
            .then((foundList)=>{
                // console.log(foundList);
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/"+listName);
            })
            .catch((err)=>{
                console.log(err);
            });
    }
});



app.get('/about',(req,res)=>{
    res.render('about');
})

app.post('/delete',(req,res)=>{
    // console.log(req.body.checkBox);
    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId)
        .then(()=>{
            console.log('deleted checked item successfully');
            res.redirect('/');
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    else{
        List.findOneAndUpdate({name : listName},{$pull : {items : {_id : checkedItemId}}})
            .then((foundList)=>{
                console.log('list founded and updated ');
                res.redirect('/'+listName);
            })
            .catch((err)=>{
                console.log(err);
            })
    }
   
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});