var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:8080';
    app.all('*', function (req, res) {

        apiProxy.web(req, res, {target: serverOne});
});
app.listen(3000);
