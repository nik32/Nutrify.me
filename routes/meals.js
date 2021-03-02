const express = require('express');
const { ObjectId } = require('mongodb');

const mealsController = require('../controllers/meals');
const isAuth = require('../RBACmiddleware').isAuth;


const router = express.Router();


router.get("/home", isAuth, mealsController.listMeals);


//Routes and API related to adding meals
//This can be POST
router.get("/meals/addMeal", isAuth, (req, res) =>  res.render("addMeal", {id: `${new ObjectId()}`}));

router.post("/api/meals/addMeal", isAuth, mealsController.addMeal);


//Routes and API related to editing meals
router.post("/meals/:meal_id/edit", isAuth, (req, res) => res.render("editMeal", {id: req.params.meal_id, name: req.body.name, calorie: req.body.calorie, description: req.body.description, reqFromAdmin: false, username: req.session.username}));

router.post("/api/meals/:meal_id/updateMeal", isAuth, mealsController.updateMeal);


//API related to deleting meal
router.post("/api/meals/:meal_id/removeMeal", isAuth, mealsController.removeMeal);


module.exports = router;