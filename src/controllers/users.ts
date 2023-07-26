import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import {
    getUsers,
    getUserByEmail,
    getUserBySessionToken,
    getUserById,
    createUser,
    deleteUserById,
    updateUserById,
} from "../db/users";


dotenv.config();

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deleteUser = await deleteUserById(id)

        return res.json(deleteUser)

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.sendStatus(400);

        }

        const user = await getUserById(id);
        if (user) {
            user.username = username;
            await user?.save()

            return res.status(200).json(user).end();
        }

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};



export const resetPassword = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required." });
        }



        return res.status(200).json({ message: "Password updated successfully." });


    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};


///////////////////////////

const emailSettings = {
    service: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(emailSettings);

// Endpoint برای ارسال ایمیل بازیابی رمز عبور به کاربر
export const forgotPassword = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "کاربر با این ایمیل وجود ندارد." });
        }

        // ایجاد توکن بازیابی رمز عبور
        const recoveryToken = uuidv4();

        const userIdString = user._id.toString() as string;
        // ذخیره توکن بازیابی رمز عبور در دیتابیس
        await updateUserById(userIdString, { "authentication.recoveryToken": recoveryToken });

        // ارسال ایمیل بازیابی رمز عبور به کاربر
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: "بازیابی رمز عبور",
            text: `برای بازیابی رمز عبور خود روی لینک زیر کلیک کنید:\n\nhttp://localhost:3000/${recoveryToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending recovery email:", error);
                return res.status(500).json({ error: "خطا در ارسال ایمیل بازیابی رمز عبور." });
            }
            console.log("Recovery email sent:", info.response);
            return res.status(200).json({ message: "ایمیل بازیابی رمز عبور با موفقیت ارسال شد." });
        });
    } catch (error) {
        console.error("Error sending recovery email:", error);
        return res.status(500).json({ error: "خطا در ارسال ایمیل بازیابی رمز عبور." });
    }
};

// Endpoint برای تغییر رمز عبور کاربر با استفاده از توکن بازیابی
export const resetpassword  = async (req: express.Request, res: express.Response) => {
    const { recoveryToken, newPassword } = req.body;

    try {
        const user = await getUserBySessionToken(recoveryToken);
        if (!user) {
            return res.status(404).json({ error: "توکن بازیابی رمز عبور نامعتبر است." });
        }

        // رمز عبور جدید را هش کنید
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ذخیره رمز عبور جدید در دیتابیس و پاک کردن توکن بازیابی
        const userIdString = user._id.toString();
        await updateUserById(userIdString, {
            "authentication.password": hashedPassword,
            "authentication.recoveryToken": null,
        });

        return res.status(200).json({ message: "رمز عبور با موفقیت تغییر یافت." });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ error: "خطا در تغییر رمز عبور." });
    }
};