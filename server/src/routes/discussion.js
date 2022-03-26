const express = require('express')
const router = express.Router()
const { query, body, validationResult, check } = require('express-validator')
const cors = require('cors')
const path = require('path')
//Controllers
const comment = require('../controllers/commentController')

const failValidation = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    next()
}

//enable cors
router.use(cors())

// Request body parsing
router.use(express.urlencoded({
    extended: true
}))
router.use(express.json())

// Routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../../../index.html'))
})

// Get all comments
router.get('/comments/get',
    query('user_id').if(check('user_id').not().isEmpty()).isNumeric(),
    failValidation,
    comment.comment_get_all)

// Create new Comment & Reply   with Validation
router.post('/comments/create',
    body('comment_id').if(check('comment_id').not().isEmpty()).isNumeric(),
    body('user_id').isNumeric(),
    body('comment').isString(),
    failValidation,
    comment.comment_create)

// upvote comment with Validation
router.post('/comments/upvote',
    body('comment_id').isNumeric(),
    body('user_id').isNumeric(),
    failValidation,
    comment.comment_upvote)

module.exports = router