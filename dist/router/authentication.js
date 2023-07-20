"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("controllers/authentication");
//import router from "router";
exports.default = (router) => {
    router.post('/auth/register', authentication_1.register);
};
//# sourceMappingURL=authentication.js.map