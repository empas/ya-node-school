const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 8000;
const indexRoutes = ['/', '/index.html', '/index.htm', '/index'];
const responses = [
    {
        "status": "success"
    },
    {
        "status": "progress",
        "timeout": 1000
    },
    {
        "status": "error",
        "reason": "Что-то пошло не так..."
    }
];

const server = http.createServer((req, res) => {

    if(isIndex(req.url)){
        if(req.method == 'GET'){
            fs.readFile('index.html', (err, data) => {
                if(err){
                    return console.log('Что-то пошло не так', err);
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data, 'utf-8');
                }
            });
        }else if(req.method == 'POST'){
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(randomAnswer(), 'utf-8');
        }else{
            res.writeHead(405, {'Content-Type': 'text/html'});
            res.end('<h1>Method Not Allowed</h1>', 'utf-8');
        }
    }else if(/\/(style.css|index.js)/.test(req.url)){
        let url = req.url.replace('/','');
        let contentType = /\.js/.test(url)?'text/javascript':'text/css';
        fs.readFile(url, (err, data) => {
            if(err){
                return console.log('Что-то пошло не так', err);
            }else{
                res.writeHead(200, {'Content-Type': contentType})
                res.end(data, 'utf-8');
            }
        });
    }else{
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end('<h1>Page not found</h1>', 'utf-8');
    }
}).listen(port, err => {
    if(err){
        return console.log('Что-то пошло не так', err);
    }else{
        console.log(`Сервер запузен на ${port} порту`);
    }
})

function isIndex(url){
    return !!indexRoutes.find(u => u == url);
}

function randomAnswer(){
    let randomKey = Math.floor(Math.random() * 3);
    console.log('--status: ',responses[randomKey].status);
    return JSON.stringify(responses[randomKey]);
}
