const User = require("../models/users");


module.exports.listUsers = (req, res) => {
    User.getAllUsers()
    .then(users => {
        console.log("fetched Users!!");
        //console.log(users);
        res.render("listUsers", { usersArr: users,   status: null});
    })
    .catch(err => {
        console.log(err);
        res.render("listUsers", { usersArr: [],   status: -1});
    });
}


module.exports.updateUser = (req, res) => {

    const userDoc = {
        username: req.params.username,
        first: req.body.first,
        last: req.body.last,
        cals_per_day: parseInt(req.body.cals_per_day),
        phone: req.body.phone, 
        email: req.body.email, 
    }

    //console.log(req.params.meal_id);
    User.updateUser(userDoc)
    .then(meal => {
        console.log("Updated user data in the DB");
        res.redirect("/admin/users");
    })
    .catch(err => {
        console.log("An Error Occured while Updating user from the DB\n" + err);
        res.redirect("/admin/users");
    });
}


module.exports.removeUser = (req, res) => {

    //console.log(req.params.meal_id);
    User.removeUser(req.params.username)
    .then(meal => {
        console.log("Removed user from the DB");
        res.redirect("/admin/users");
    })
    .catch(err => {
        console.log("An Error Occured while Removing User from the DB\n" + err);
        res.redirect("/admin/users");
    });

}




//WE could have used the "home" route of the meals module. But a lot of conditions would have reduced readablity
//Thus for the sake of clarity and readability, I have caopied the code in this module and made the changes here
//in all the belwo 3 funtions -  
module.exports.listUserMeals = (req, res) => {
    let mealsArr = [];

    User.getMealsArrayBy(req.query.date, req.query.sortBy, req.query.sortOrder, req.body.username)
    .then(meals => {
        console.log("fetched meals!!");
        mealsArr = meals;
        //console.log("mealsArr: " + mealsArr);
        User.getAllUsernames()
        .then(usernames => {
            console.log("fetched usenames also!!");
            res.render("listUserMeals", {usernameSelected: req.body.username, usersArr: usernames, mealsArr: mealsArr, status: null});
        })
        .catch(err => {
            res.render("listUserMeals", {usernameSelected: null, mealsArr: null, status: -1});
        });
    })
    .catch(err => {
        console.log(err);
        res.render("listUserMeals", {usernameSelected: null, mealsArr: null, status: -2});
    })
}

module.exports.updateMeal = (req, res) => {

    const mealsDoc = {
        username: req.body.username,//This is one change from the code in meals controler
        name: req.body.name,
        id: req.params.meal_id,
        calorie: parseInt(req.body.calorie),
        description: req.body.description, 
    }

    //console.log(req.params.meal_id);
    User.updateMeal(mealsDoc)
    .then(meal => {
        console.log("Updated meal data in the DB");
        res.redirect("/admin/usermeals",/*, {status: 2}*/);//This is another change
    })
    .catch(err => {
        console.log("An Error Occured while Updating meal from the DB\n" + err);
        res.redirect("/admin/usermeals",/*, {status: -2}*/);//This is another change
    });
}


module.exports.removeMeal = (req, res) => {

    User.removeMeal(req.body.username, req.params.meal_id)// again changed here to from req.session.username to req.body.username because the session belongs to the admin, not to the user whose meals the admin want!
    .then(meal => {
        console.log("Removed meal from the DB");
        res.redirect("/admin/usermeals",/*, {status: 3}*/);
    })
    .catch(err => {
        console.log("An Error Occured while Removing meal from the DB\n" + err);
        res.redirect("/admin/usermeals",/*, {status: -3}*/);
    });

}