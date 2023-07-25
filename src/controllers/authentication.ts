import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../halpers';
import router from 'router';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);

        }

        if (!user.authentication || !user.authentication.salt || !user.authentication.password) {
            return res.sendStatus(400);
        }

        const expectedHash = await authentication(user.authentication.salt, password);

        if (user.authentication.password === expectedHash) {
            return res.sendStatus(403);
        }


        const salt = await random();
        user.authentication.sessionToken = await authentication(salt, user._id.toString());


        await user.save();

        res.cookie('ALAMI_A', user.authentication.sessionToken, { domain: 'localhost', path: '/' })

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = await random(); // استفاده از await برای دریافت مقدار salt
        const hashedPassword = await authentication(salt, password);

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: hashedPassword,
            },
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
