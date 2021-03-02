const User = require('../models/users');

function getParams(date, sortBy, sortOrder){//This function returns the prams part of the URL
    let paramsStr = "";
    if(date != undefined)
        paramsStr += `date=${date}&`;
    if(sortBy != undefined)
        paramsStr += `sortBy=${sortBy}&`;
    if(sortOrder != undefined)
        paramsStr += `sortOrder=${sortOrder}`;
    
    return paramsStr != "" ? "?" + paramsStr : "";
}


module.exports.listMeals = (req, res) => {

    req.session.date = req.query.date;//Saved in session so that we can redirect again to the smae page in case of edit or removal of a meal
    req.session.sortBy = req.query.sortBy;
    req.session.sortOrder = req.query.sortOrder;

    User.getMealsArrayBy(req.query.date, req.query.sortBy, req.query.sortOrder, req.session.username)
    .then(meals => {
        console.log("fetched Meals!!");
        //console.log(meals);
        res.render("home", { mealsArr: meals,   status: null,  isAdmin: req.session.isAdmin});//Don;t add the prams here because we are not redirecting but rendering for the home route whihc already contains the params
    })
    .catch(err => {
        console.log(err);
        res.render("home", { mealsArr: [],   status: -4,  isAdmin: req.session.isAdmin});
    });
    
}


module.exports.addMeal = (req, res) => {
    const mealsDoc = {
        username: req.session.username,
        dateTime: new Date(),
        name: req.body.name,
        id: req.body.id,
        calorie: parseInt(req.body.calorie),
        description: req.body.description, 
    }

    User.addMeal(mealsDoc)
    .then(meal => {
        console.log("Added meal to the DB");
        res.redirect("/home" //We don't add any params here because the new meals will be added to the current date. SO no matter what the query params are we will be redirected to the current date's page whihc is "/home"
                    /*, {status: 1}*/);
    })
    .catch(err => {
        console.log("An Error Occured while Adding meal in the DB\n" + err);
        res.redirect("/home" //We don't add any params here because the new meals will be added to the current date. SO no matter what the query params are we will be redirected to the current date's page whihc is "/home"
                    /*, {status: -1}*/);
    });
}


module.exports.updateMeal = (req, res) => {

    const mealsDoc = {
        username: req.session.username,
        name: req.body.name,
        id: req.params.meal_id,
        calorie: parseInt(req.body.calorie),
        description: req.body.description, 
    }

    //console.log(req.params.meal_id);
    User.updateMeal(mealsDoc)
    .then(meal => {
        console.log("Updated meal data in the DB");
        res.redirect("/home" + getParams(req.session.date, req.session.sortBy, req.session.sortOrder)
                    /*, {status: 2}*/);
    })
    .catch(err => {
        console.log("An Error Occured while Updating meal from the DB\n" + err);
        res.redirect("/home" + getParams(req.session.date, req.session.sortBy, req.session.sortOrder)
                    /*, {status: -2}*/);
    });
}


module.exports.removeMeal = (req, res) => {

    //console.log(req.params.meal_id);
    User.removeMeal(req.session.username, req.params.meal_id)
    .then(meal => {
        console.log("Removed meal from the DB");
        res.redirect("/home" + getParams(req.session.date, req.session.sortBy, req.session.sortOrder)
                    /*, {status: 3}*/);
    })
    .catch(err => {
        console.log("An Error Occured while Removing meal from the DB\n" + err);
        res.redirect("/home" + getParams(req.session.date, req.session.sortBy, req.session.sortOrder)
                    /*, {status: -3}*/);
    });

}