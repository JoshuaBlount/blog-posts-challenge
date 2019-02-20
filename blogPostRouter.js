const express = require('express');
const router = express.Router();

const {BlogPosts} =  require('./model');

function lorem() {
  return (
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod " +
    "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, " +
    "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse " +
    "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non " +
    "proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
}

// We create some items for users to interact with for blog-posts
BlogPosts.create('Working with Node', lorem(),'John Doe');
BlogPosts.create('Hello world', lorem(), 'Jim Smith');
BlogPosts.create('Foo Bar for beginners', lorem(), 'Josh Blount');

// Create the CRUD operations for blog-post-API

//makes GET request at blog-posts endpoint
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// makes POST at blog-posts endpoint
router.post('/', (req, res) => {
  // create constants for required body content
  const requiredFields = ['title','content','author'];

  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.log(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  return res.status(201).json(item);
});

// makes PUT request at blog-posts/:id endpoint
router.put('/:id', (req, res) => {
  const requiredFields = ['title','content','author', 'id'];

  for (let i=0;i<requiredFields; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.log(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const pathErr = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.log(pathErr);
    return res.status(400).send(pathErr);
  }
  console.log(`Updating blog-posts entry \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title ,
    content: req.body.content,
    author: req.body.author,
  });
  res.status(204).end();
});

// makes DELETE request at blog-posts/:id endpoint
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog Post item \`${req.params.id}\``);
  res.status(204).end();
});

module.exports = router;
