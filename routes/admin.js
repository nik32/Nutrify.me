const router = require('express').Router();

const adminController = require("../controllers/admin");
const isAuth = require("../RBACMiddleware").isAuth;
const isAdmin = require("../RBACMiddleware").isAdmin;

//Admin will also have meals. So his home is same as the home of normal user and 
//he will have access to all the meals routes coz he is also a normal user.
//But 2 functions are added and the following are the routes for the added functionalities -



//1. Routes and apis for listing users
router.get("/admin/users", isAuth, isAdmin, adminController.listUsers);

router.post("/admin/user/:username/edit", isAuth, isAdmin, (req, res) => res.render("editUser", {username: req.params.username, first: req.body.first, last: req.body.last , cals_per_day: req.body.cals_per_day, phone: req.body.phone, email: req.body.email,}));

router.post("/api/admin/user/:username/updateUser", isAuth, isAdmin, adminController.updateUser);

router.post("/api/admin/user/:username/removeUser", isAuth, isAdmin, adminController.removeUser);



//2. Routes and apis for editing user meals (NOTE - THIS PART IS 90% SIMILAR TO THE "EDIT MEALS" Realted ROUTES IN meals.js. SO TRY TO SINGULARIZE THEM IN A WAY WHIHC DOSEN'T HAMPER READABILITY)
router.all("/admin/usermeals", isAuth, isAdmin, adminController.listUserMeals);//hanfdles both get and post

//To make the this route work just pass the username also as an ejs param. And in ejs add a hidden input of username.
//Also do the above in meals.js routes 
router.post("/admin/usermeals/:meal_id/edit", isAuth, (req, res) => res.render("editMeal", {id: req.params.meal_id, name: req.body.name, calorie: req.body.calorie, description: req.body.description, reqFromAdmin: true, username: req.body.username}));

router.post("/api/admin/usermeals/:meal_id/updateMeal", isAuth, adminController.updateMeal);

router.post("/api/admin/usermeals/:meal_id/removeMeal", isAuth, adminController.removeMeal);

module.exports = router;