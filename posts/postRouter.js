const express = require('express');
const Posts = require('./postDb.js')
const router = express.Router();

router.use('/:id', validatePostId)

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get()
    res.status(200).json(posts)
  }catch(error) {
    res.status(500).json({errorMessage: 'There was an error with your request'})
  }
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(deleted => {
      res.status(200).json({message: 'Post successfully deleted', post: {...req.post}})
    })
    .catch(err => {
      res.status(500).json({errorMessage: 'There was an error with your request'})
    })
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Posts.update(req.params.id, req.body)
    res.status(201).json({message: 'Post successfully updated', post: {id: req.params.id, ...req.body}})
  }catch(error) {
    res.status(500).json({errorMessage: 'There was an error with your request'})
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const post = await Posts.getById(req.params.id)
    if(post) {
      req.post = post
      next()
    }else{
      res.status(400).json({message: 'Invalid post id'})
    }
  }catch(error) {
    res.status(500).json({errorMessage: 'There was an error with your request'})
  }
}

module.exports = router;
