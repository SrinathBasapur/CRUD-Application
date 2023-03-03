const express = require("express");
const app = express();

let items = [
  {
    id: 1,
    name: "ABC-1234",
  },
  {
    id: 2,
    name: "XYZ-5678",
  },
];


function removeItemWithId(deleteId){
  const len = items.length;
  let val = 0;
  let arr = [];
  for (let i = 0; i < len; i++)
  {
    if (items[i].id == deleteId)
    {
      val = deleteId;
      continue;
    }
    else
    {
      if (val == 0)
        arr.push(items[i]);
      else
      {
        items[i].id = val;
        val++;
        arr.push(items[i]);
      }
    }
  }
  return arr;
}


// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get("/", (req, res) => {
  console.log("view login page");
  res.render("login.ejs");
});


app.get("/home", (req, res) => {
  console.log("list all sites");
  res.render("home.ejs", { items: items });
});


app.get("/Add", (req, res) => {
  console.log("view add site page");
  res.render("addSite.ejs");
});


// app.get("/editSite", (req, res) => {
//   console.log("view edit page");
//   const editId = req.query.editId;
//   let editItem = items.filter((item) => item.id == editId);
//   console.log(editItem);
//   res.render("editSite.ejs", { editItem: editItem });
// });


// app.get("/deleteSite", (req, res) => {
//   console.log("delete");
//   const deleteId = req.query.deleteId;
//   items = removeItemWithId(deleteId);
//   console.log(items);
//   res.redirect("/home");
// });


app.get("/Edit/:Id", (req, res) => {
  console.log("view edit page");
  const editId = req.params.Id;
  let editItem = items.filter((item) => item.id == editId);
  console.log(editItem);
  res.render("editSite.ejs", { editItem: editItem });
});

app.get("/Delete/:Id", (req, res) => {
  console.log("delete");
  const deleteId = req.params.Id;
  items = removeItemWithId(deleteId);
  console.log(items);
  res.redirect("/home");
});



app.post("/login", (req, res) => {
  console.log("login success");
  res.redirect("/home");
});


app.post("/Add", (req, res) => {
  console.log("Adding Data");
  console.log(req.body);
  curr_id = items.length + 1;
  items.push({
    id: curr_id,
    name: req.body.siteName,
  });
  res.redirect("/home");
});



app.post("/Edit", (req, res) => {
  console.log("Editing Data");
  let objIndex = items.findIndex((obj => obj.id == req.body.editId));
  console.log(items[objIndex]);
  
  items[objIndex].name = req.body.siteName;
  res.redirect("/home");
});




app.listen(8000, () => {
  console.log("listening to port 8000");
});
