import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import feedbackRoutes from "./router/feedbackRoutes";


 
const app = express ();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", feedbackRoutes);

const server = http.createServer(app);

server.listen(3000 , () =>{
    console.log('server ranning http://localhost:3000/')
})


const MONGO_URL = 'mongodb://127.0.0.1:27017/mydb'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
console.log('conect to databesa')

app.use('/' , router());
