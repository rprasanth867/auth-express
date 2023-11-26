require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const posts = [
    {
        username: 'Prasanth',
        title: 'Post 1'
    },
    {
        username: 'Vamsi',
        title: 'Post 2'
    }
]

app.use(express.json());

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log('+++++++++++error', err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => {
    console.log('Express is running on 3000 port');
});
