const express = require("express");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/vehiclesDB", {
  useNewUrlParser: true,
});

// let userName = "admin";
let userName;

const itemSchema = new mongoose.Schema(
  {
    SiteName: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
    CreatedBy: String,
    ModifiedBy: String,
  },
  {
    timestamps: {
      createdAt: "CreatedDate",
      updatedAt: "ModifiedDate",
    },
  }
);

itemSchema.plugin(AutoIncrement, { inc_field: "SiteId", start_seq: 3 });

const Item = mongoose.model("Site", itemSchema);
const item1 = new Item({
  SiteId: 1,
  SiteName: "ABC-1234",
  CreatedBy: "ansh",
  ModifiedBy: "ansh",
});

const item2 = new Item({
  SiteId: 2,
  SiteName: "XYZ-5678",
  CreatedBy: "srinath",
  ModifiedBy: "srinath",
});

const defaultItems = [item1, item2];

// GET Request

app.get("/", (req, res) => {
  res.render("login.ejs", { userName: userName });
});

app.get("/logout", (req, res) => {
  userName = null;
  res.redirect("/");
});

app.get("/home", (req, res) => {
  if (userName === undefined || userName === null) {
    res.redirect("/");
  } else {
    Item.find({ IsActive: true }, function (err, foundItems) {
      if (foundItems.length == 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB");
          }
        });
        res.redirect("/home");
      } else {
        res.render("home.ejs", { items: foundItems, userName: userName });
      }
    });
  }
});

app.get("/add", (req, res) => {
  if (userName === undefined || userName === null) {
    res.redirect("/");
  } else {
    res.render("addSite.ejs", { userName: userName });
  }
});

app.get("/edit/:Id", (req, res) => {
  if (userName === undefined || userName === null) {
    res.redirect("/");
  } else {
    const editId = req.params.Id;

    Item.find({ _id: editId }, function (err, foundItem) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundItem);
        res.render("editSite.ejs", { editItem: foundItem, userName: userName });
      }
    });
  }
});

// POST Request

app.post("/login", (req, res) => {
  userName = req.body.username.toLowerCase();
  res.redirect("/home");
});

app.post("/add", (req, res) => {
  const itemName = req.body.name.trim();
  Item.findOne({ SiteName: itemName }, function (err, data) {
    if (err) {
      res.status(500).send("Error finding data!");
    } else if (data) {
      res.json({ exists: true });
    } else {
      console.log();
      const item = new Item({
        SiteName: itemName,
        CreatedBy: userName,
        ModifiedBy: userName,
      });
      item.save(function (err) {
        if (err) {
          res.status(500).send("Error saving data!");
        } else {
          res.json({ exists: false });
        }
      });
    }
  });
});

app.post("/edit", (req, res) => {
  const editId = req.body.editId;
  const editName = req.body.siteName.trim();

  if (editName) {
    Item.findOneAndUpdate(
      { _id: editId },
      { $set: { SiteName: editName, ModifiedBy: userName } },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/home");
        }
      }
    );
  } else {
    res.redirect("/home");
  }
});

app.post("/delete/:Id", (req, res) => {
  const deleteId = req.params.Id;

  Item.findOneAndUpdate(
    { _id: deleteId },
    { $set: { IsActive: false } },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/home");
      }
    }
  );
});

app.post("/home/search", (req, res) => {
  Item.find(
    {
      IsActive: true,
      SiteName: { $regex: req.body.searchTxt, $options: "i" },
    },
    function (err, foundItems) {
      if (err) {
        console.log(err);
      } else {
        res.render("home.ejs", { items: foundItems, userName: userName });
      }
    }
  );
});

app.listen(8000, () => {
  console.log("listening to port 8000");
});
