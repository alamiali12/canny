import  express  from "express";
import { get, merge } from "lodash";

import { getUserBySessinToken } from "../db/users";

export const isAuthenticated =async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    try {

        const sessionToken = req.cookies ['ALAMI_A'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessinToken(sessionToken);

        if( !existingUser) {
            return res.sendStatus(403)
        }

        merge(req , {identity: existingUser });

        return next();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}