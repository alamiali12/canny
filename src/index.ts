import express from 'express';
import http from 'http';
import bodyParser from 'body-parser ';
import cookieParser from 'cookie-parser';
import compressin from 'compressin';
import cors from 'cors';

const app = express ();

app.use(cors({
    credential: true,
}));

app.use(compressin());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3000,() => {
    console.log("server running on http://localhost:3000/");
})