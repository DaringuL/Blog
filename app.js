//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const lodash = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "This is personal blog of Liubov Dzhochka. It was created as a part of WebDeveloper Bootcamp.";
const aboutContent = "Hi! My name is Liubov. I graduated from medical university and completed specialization in Ophthalmology... but Computer Science always was my passion. So one day I decided to become Web Developer.";
const contactContent = "love.dzh.r@gmail.com";

const app = express();
let posts = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//initial setting of DB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser : true});
const postSchema = new mongoose.Schema({
    postTitle: String,
    postContent: String
  });

const Post = mongoose.model("Post", postSchema);


function updatePosts() {
Post.find(function(err, postCollection){
  if (err) {
    console.log(err)
  } else {
    posts = postCollection;
  }
})

}


app.get("/", function(req, res){
updatePosts();
res.render("home.ejs", {homeStartingContent: homeStartingContent, posts : posts })
})


app.get("/about", function(req, res){
res.render("about.ejs", {aboutContent: aboutContent})
})


app.get("/contact", function(req, res){
res.render("contact.ejs", {contactContent: contactContent})
})

app.get("/compose", function(req, res){
res.render("compose.ejs", {});
})

app.get("/posts/:title", function(req, res) {

var userRequestTitle = req.params.title;
userRequestTitle = transformPostTitle(userRequestTitle);
let foundMatch = posts.find(({postTitle}) => transformPostTitle(postTitle) === userRequestTitle);

if (foundMatch != undefined) {
  res.render("post", {post : foundMatch});
} else {
  let errorPost = {
    postTitle: "Ooops... Something went wrong",
    postContent:"Post with such name doesn't exist. Try another name, please"};
  res.render("post", {post: errorPost});
}

})


app.post("/compose", function(req, res){
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });
  post.save();
  updatePosts();
  res.redirect("/");
})


function transformPostTitle(title) {
  title = lodash.lowerCase(title);
  return title
}


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
