import express from "express";
import {forgotPassword,resetPassword, deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";


export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id',isAuthenticated, isOwner,deleteUser)
    router.patch('/user/:id',isAuthenticated, isOwner,updateUser )
    router.post("/resetpassword/:id", resetPassword);
    router.post("/forgotPassword", forgotPassword);
};
