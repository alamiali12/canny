import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
 
const app = express ();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3000 , () =>{
    console.log('server ranning http://localhost:3000/')
})

const MONGO_URL = 'mongodb://root:XoCcxmBcvr196Pm2vG4h77PS@luca.iran.liara.ir:33007/my-app?authSource=admin'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.on('open', (error: Error) => console.log(error));

app.use('/' , router());