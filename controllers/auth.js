const bycrypt = require('bcryptjs');

const User = require('../models/users');


module.exports.addUser = (req, res) => {

    //NOTE 1 - I am going with the assumption here that a user can have same emails for different usernames so that he gets mail forwarded to same id for diffrent accounts (this can happen if a family uses one email account). 
    //But if otherwise reqired, then add a validation here to check if the email is already there in the DB
    
    //NOTE 2 - Uniquness of user id is maintined on the DB layer. We have set a unique index on the username feild, so any attempt to enter duplicate usernames will result in error (handled in catch block of the promise)
    const {first, last, password, cals_per_day, phone, email, username} = req.body;
    const date = new Date();
    const doj =  date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

    /*So the promise flow is (read comments in line to understand) -
      First we call the bycrpt method to hash our password. This method is promise based method.*/
    bycrypt.hash(password, 12)//[Note: 12 - specefies the rounds of encryption applied. The higher the value the better it is. 12 is considered secure industry wide]
    .then(hashedPassword => {
        //untill we don't get the hashed password we can't create a user. That is why the below 
        //code (of registering the user is tranferred to this first then block).
        const userObj = new User(first, last, hashedPassword, parseInt(cals_per_day), phone, email, username, doj, []);
        return userObj.save();//Now this will save the created user obj in our DB, but if you see this method is also promise based.
                              //It will return whether we were sucessfull in saving the user or not.
                              //So it can either give a resolved promise (whihc will be handled by the next then() block)
                              //Or it can give us a rejected promise (whihc will be handled by the catch block instead)
    })
    .then(result => {
        console.log("User Registerd Secussfully!\n");
        res.render("signin", {sucess: 1});
    })
    .catch(err => {//can get here in 2 situations - if there was an error while hashing the password or the username inputed already exists
        console.log("Failed to Register User.\n" );
        res.render("signup", {fail: 1});
    });
}

module.exports.authenticate =  (req, res) => {
    const {username, password} = req.body;
    let isAdmin;

    User.findByUsername(username)//Now here either we will get a resolved promise with user obj(handled by first then handler) or rejected promise with an error (handled by the catch handler)
    .then(user => {
        isAdmin = user.admin;//if the user is admin, this set isAdmin = true;
        return bycrypt.compare(password, user.password);//if we get a resolved promise, we compare the hased password with password entered in the form. If the password is matched or failed, we get a resolved promise with the boolean (indicating match or not). If we get an error while comparing, we get rejected promise, again handled by the catch 
    })
    .then(passwordsMatch => {
        // passwordsMatch = true;
        if(passwordsMatch) { //if passowrds matched we store the username in the session and redirect to home
            req.session.username = username;
            req.session.isAuth = true;
            if(isAdmin)
                req.session.isAdmin = isAdmin;

            req.session.save(err => { //This gives guranteee that the userdata (username) is saved in the session, and then only we are redirected, Not before. 
                if(err){
                    console.log("Could not save the session after password match\n" + err);
                    return next();
                }
                return res.redirect("/home");
            });
        }
        else
            return res.render("signin", {sucess: 0});
    })
    .catch(err => {//can get here in 2 situations - either we don't have a user with the username or if we get an "error" while comparing passwords
        console.log("an error occured while comparing the passwords\n" + err);
        res.render("signin", {sucess: -1});
    });
}
