const { NON_REQUIRED_AUTHENTICATION } = require("../const/const");
const { register } = require("../controller/user.controller");
const { validatePostUserBody } = require("../middlewares/validator");
const authRoute = require('../route/auth.route');
const upload = require("./upload");
module.exports = {
    setupUnauthRoute : (app, routeList) => {
        for(let route of routeList) {
            switch (route) {
                case NON_REQUIRED_AUTHENTICATION.AUTH:
                    app.use('/' + route, authRoute)
                    break;
                case NON_REQUIRED_AUTHENTICATION.REGISTER:
                    app.post('/' + route,  upload.single('avatar'), validatePostUserBody(), register)
            }

        }
    }
}