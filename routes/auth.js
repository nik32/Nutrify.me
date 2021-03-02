
const router = require('express').Router();

const authContoller = require('../controllers/auth');
const isAuth = require('../RBACmiddleware').isAuth;


router.get("/signup", (req, res) => res.render("signup", {fail: null}));

router.get("/signin", (req, res) => res.render("signin", {sucess: null}));

router.get("/signout", isAuth, 
            (req, res) => req.session.destroy( err => {
                if(err) 
                    return next();
                return res.redirect("/signin"); 
            }),
);

router.post("/api/addUser", authContoller.addUser);

router.post("/api/authenticate", authContoller.authenticate);


module.exports = router;