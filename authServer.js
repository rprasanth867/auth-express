require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// temporary storing in the list as we don't have database
let refreshTokens = [];

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({accessToken, refreshToken});
});

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.refToken);
    res.sendStatus(204);
});

app.post('/token', (req, res) => {
    const refreshToken = req.body.refToken;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken});
    })
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
}

app.listen(4000, () => {
    console.log('Auth dev Express is running on 4000 port');
});
