const express = require('express');
const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')
const router = express.Router();

router.use('/:id', validateUserId)

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
    .then(user => {
      res.status(201).json({message: 'User successfully added', user})
    })
  .catch(err => {
      res.status(500).json({errorMessage: 'There was an error adding the user'})
  })
});

router.post('/:id/posts', validatePost, (req, res) => {
    const postInfo = {...req.body, user_id: req.params.id}
    Posts.insert(postInfo)
      .then(post => {
        res.status(201).json({message: 'Post successfully added', post})
      })
      .catch(err => {
        res.status(500).json({errorMessage: 'There was an error adding your post'})
      })
});

router.get('/', async (req, res) => {
  try {
    const users = await Users.get()
    res.status(200).json(users)
  }catch(err) {
    res.status(500).json({errorMessage: 'There was an error trying to retrieve the users'})
  }
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', async (req, res) => {
    try {
      const posts = await Users.getUserPosts(req.user.id)
      res.status(200).json(posts)
    }catch(err) {
      res.status(500).json({errorMessage: 'There was an error trying to retrieve the users posts'})
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Users.remove(req.params.id)
      res.status(200).json({message: 'User was sucessfully deleted', user: {...req.user}})
    } catch(error) {
      res.status(500).json({errorMessage: 'There was an error deleting the user'})
    }
});

router.put('/:id', validateUser, (req, res) => {
    Users.update(req.params.id, req.body) 
      .then(user => {
        res.status(201).json({message: 'User sucessfully updated', user: {id: req.params.id, ...req.body}})
      })
      .catch(err => {
        res.status(500).json({errorMessage: 'There was an error updating the user'})
      })
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const user = await Users.getById(req.params.id)
    if(user){
      req.user = user
      next()
    } else{
        res.status(400).json({message: 'Invalid user id'})
    }
  }catch(err) {
    res.status(500).json({errorMessage: 'There was an error with your request'})
  }
}

function validateUser(req, res, next) {
  console.log(req.body)
  if(!req.body) {
    res.status(400).json({message: 'Missing user data'})
  }else if(!req.body.name) {
    res.status(400).json({message: 'Missing required name field'})
  }else {
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({message: 'Missing post data'})
  }else if(!req.body.text) {
    res.status(400).json({message: 'Missing required text field'})
  }else{
    next()
  }
}

module.exports = router;
