var express=require("express");
    bodyParser=require("body-parser");
    methodOverride=require("method-override");
    mongoose=require("mongoose");
    app=express();
    expressSanitizer=require("express-sanitizer");

mongoose.connect('mongodb://localhost/blogapp', {
        useNewUrlParser: true,
        useCreateIndex: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false);


var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog=mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err,blog) {
        res.render("home.ejs", {blog: blog});
    });
});

app.post("/blogs", function(req, res) {
    Blog.create({
        title: req.body.title,
        image: req.body.image,
        body: req.body.blog }, function(err, blog) {
            res.redirect("/blogs");
        });
});

app.get("/blogs/new", function(req, res) {
    res.render("newForm.ejs");
});

app.get("/blogs/:id", function(req,res) {
    Blog.findById(req.params.id, function(err, blog){
        res.render("show.ejs", {blog: blog});
    });
});

app.get("/blogs/:id/edit", function(req,res) {
    Blog.findById(req.params.id, function(err, blog){
        res.render("editForm.ejs", {blog: blog});
    });
})

app.put("/blogs/:id", function(req,res) {
    Blog.findByIdAndUpdate(req.params.id, { title: req.body.title, image: req.body.image, body: req.body.blog }, function(err,blog) {
        res.redirect("/blogs/" + req.params.id);
    });
});

app.delete("/blogs/:id", function(req,res) {
        Blog.findByIdAndRemove(req.params.id, function(err){
            res.redirect("/blogs");
        });
    });

app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started");
});