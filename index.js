const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fetch = require('node-fetch');
const {response} = require("express");

require('dotenv').config();

const app = express();

app.use(morgan('tiny'));
app.use(cors());

const PROXY_KEY = process.env.PROXY_KEY;

function redirect(address) {
    console.log(address);
    return fetch(address)
};

app.get('/redirect', async (req, res) => {
    if (req.query.key === PROXY_KEY) {
        redirect(decodeURIComponent(req.query.address))
            .then(response => {
                res.status(response.status);
                return response.text();
            })
            .then(data => {
                res.send(data);
            })
            .catch(err =>{
                console.error(err)
                res.send('{"success": false}')
            });
    } else {
        res.send('{"success": false, "result":"bad key"}');
    }
});


function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found');
    next(error);
}

function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: error.message
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port', port);
});
