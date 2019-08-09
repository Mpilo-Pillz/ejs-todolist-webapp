const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const fixTheCasing = require(__dirname + "/proppercased.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

// var item = ""; keeping i like this replaces the last value save this in a colection instead
// var item = req.body.newItem;
// var items = ["Buy Ingredients", "Freeze Ingredients", "Blend Ingredients"];
// let workItems = ["JavaScript Objects", "Fix Casing", "My Own Module Dot Exports"];
// let groceryItems = ["Turkey", "Brown Rice", "Spinach"];
// let skillItems = ["JavaScript", "C Sharp", "Java"];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//create or connect a new database inside mongo
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

//create a new schema on the db
const itemsSchema = {
   name: String
}
//create model singular name in relation to model
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
   name: "Welcome to your todolist!"
});

const item2 = new Item({
   name: "Hit the + button to add a new item."
});

const item3 = new Item({
   name: "<-- Hit this to delete an Item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
   name: String,
   items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
   // let day = date.getDate();
   Item.find({}, function(err, foundItems){
      console.log(foundItems);

      if(foundItems.length === 0) {
         Item.insertMany(defaultItems, function(err){
   if(err){
      console.log(err);
   } else {
      console.log("successfully saved default items to database");
   }
});
   res.redirect("/");
      } else{
         res.render("lists", {listTitle: "Today", newListItems: foundItems});
      }
   });
   // res.render("lists", {listTitle: "Today", newListItems: items});
   
});
// app.get("/", function(req, res) {
//     let day = date.getDate();
//     res.render("lists", {listTitle: day, newListItems: items});
    
// });

app.get("/:karabo", function(req, res) {
  customListName = _.capitalize(req.params.karabo);
  console.log(req.params.karabo);

  List.findOne({name: customListName}, function(err, foundList){
     if(!err){
        if(!foundList){
           console.log("Doesn't exist!");
           //create a new list
           const list = new List({
            name: customListName,
            items: defaultItems
         });
         list.save();
         res.redirect("/" + customListName);
         // res.redirect("/" + karabo);
        } else {
           console.log("Exists!");
           //show an existing list
           res.render("lists", {listTitle: foundList.name, newListItems: foundList.items});
        }
     }
  });

  
});

app.post("/", function(req, res) {
   //TODO let newItem = newItem.fixedCase(fixedCase);
   //let item = req.body.newItem.toUpperCase();
   // let item = fixTheCasing.fixedCaseFormatter(req.body.newItem);
   const itemName = req.body.newItem;
   const listName = req.body.listButton;
   //create a item as we did above
   const item = new Item({
      name: itemName
   });
   if(listName === "Today"){
      //save the items to the mongodb
   item.save();
   //redirect to the page
   res.redirect("/");
   console.log("itemNameIS " + itemName);
   console.log("listName " + listName)
   } else {
      console.log("listName " + listName);
      List.findOne({name: listName}, function(err, foundList){
         foundList.items.push(item);
         foundList.save();
         res.redirect("/" + listName);
      });
   }
   

   console.log(req.body);
   
   // if (req.body.listButton === "Work") {
   //    workItems.push(item);
   //    res.redirect("/work");
   // } else if(req.body.listButton === "Grocery") {
   //    groceryItems.push(item);
   //    res.redirect("/groceries");
   // } else if(req.body.listButton === "MySkills") {
   //    skillItems.push(item);
   //    res.redirect("/skills");
   // } else{
   //    items.push(item);
   //    console.log(item);
   //    res.redirect("/");
   // }
    
   
    
 }); 

 app.post("/delete", function(req, res){
   console.log(req.body.checkboxName);
   const checkedItemId = req.body.checkboxName;
   const listName = req.body.hiddenListName;

   if(listName === "Today"){
      Item.findByIdAndRemove(checkedItemId, function(err){
         if(!err) {
            console.log("Successfully deleted checked Item.");
            res.redirect("/");  
         }
      });
   } else {
      List.findOneAndUpdate({name: listName},
         {$pull: {items: {_id: checkedItemId}}}
         , function(err, foundList){
            if(!err){
               res.redirect("/" + listName);
            }
      });
   }

   
 });
 
//  app.get("/work", function(req, res) {
//     res.render("lists", {listTitle: "Work List", newListItems: workItems});
//  });

//  app.get("/groceries", function(req, res) {
//     let day = date.getDay();
//     res.render("lists", {listTitle: day + " Grocery List", newListItems: groceryItems});
//  });


//  app.get("/skills", function(req, res){
//    res.render("lists", {listTitle: "MySkills List", newListItems:skillItems})
//  });

//  app.get("/about", function(req, res) {
//     res.render("about");
//  });

//  app.get("/footer", function(req, res){
//     res.render("footer");
//  });

//  app.get("/header", function(req, res){
//     res.render("header");
//  })


app.listen(4100, function(){
console.log("Server started on port 4100");
});


// app.get("/", function(req, res) {
//     // res.send("fika");
//     var today = new Date();
//     var currentDay = today.getDay();
//     var day = "";

//     switch (currentDay) {
//         case 0:
//             day = "Sunday";
//             break;
//         case 1:
//             day = "Monday";
//             break;
//         case 2:
//             day = "Tuesday";
//             break;
//         case 3:
//             day = "Wednesday";
//             break;
//         case 4:
//             day = "Thursday";
//             break;
//         case 5:
//             day = "Friday";
//             break;
//         case 6:
//             day = "Saturday";
//             break;    


    
//         default:
//             break;
//     }
//     res.render("lists", {kindOfDay: day});
//     // if (currentDay == 6 || currentDay == 0 ) {
//     //     day = "Weekend";
//     //     // res.send("Weedend plenty of time to code");
//     // } else {
//     //     day = "Not weekend"
//     //     // res.write("<h2>Not weekend</h2>");
//     //     // res.send("Not Weekend gotta make time to code");
//     // }
//     // res.render("lists", {kindOfDay: day});

// if (currentDay == 6 || currentDay == 0 ) {
    //     day = "Weekend";
    //     // res.send("Weedend plenty of time to code");
    // } else {
    //     day = "Not weekend"
    //     // res.write("<h2>Not weekend</h2>");
    //     // res.send("Not Weekend gotta make time to code");
    // }
    // res.render("lists", {kindOfDay: day});

    // <% if (kindOfDay === "Saturday" || kindOfDay === "Sunday") { %>
    //     <h1 style="color: purple"><%= kindOfDay %> TODO list</h1>
    //     <% } else {%>
    //     <h1 style="color: blue"><%= kindOfDay %> TODO list</h1>
    //     <% } %>

    //EJS remeber i is item
   //  newListItems.forEach(function(item){
   //    <p>item.name</p>
   //  });

   // <%for(var i = 0; i < newListItems.length; i++){%> 
   //    <form action="/delete" method="post">
   //    <div class="item">
   //     <input type="checkbox" name="checkboxName" value="<%=[i]._id%>" onChange="this.form.submit()">
   //         <p><%= newListItems[i].name %></p>
   //         </div>
   //     <%} %>
   //     </form>