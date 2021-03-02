const moment = require('moment');

const getDbRef = require('../database/dbConnection').getDbRef;


module.exports = class User {

    /*AUTH RELATED API - start*/
    constructor(first, last, password, cals_per_day, phone, email, username, doj, meals){
        this.first = first;
        this.last = last;
        this.password = password;
        this.cals_per_day = cals_per_day;
        this.phone = phone;
        this.email = email;
        this.username = username;
        this.doj = doj;
        this.meals = meals;
    }

    save(){
        const db = getDbRef();
        return db.collection('user').insertOne(this);
    }

    static findByUsername(username){
        const db = getDbRef();
        return db.collection('user').findOne({username: username});
    }
    /*End*/





    /*MEALS REALTED API - Start*/
    static addMeal(mealsDoc){
        const db = getDbRef();
        return db.collection('user').updateOne(
            {"username" : mealsDoc.username}, 
            {$push: {
                        "meals":  mealsDoc,
                    },
            });
    }

    static updateMeal(mealsDoc){
        const db = getDbRef();
        return db.collection('user').updateOne( //doc for the query - https://docs.mongodb.com/manual/reference/operator/update/positional/#update-documents-in-an-array
            {"username" : mealsDoc.username, "meals.id": mealsDoc.id},  
            {$set : { 
                        "meals.$.name" : mealsDoc.name,
                        "meals.$.calorie" : mealsDoc.calorie,
                        "meals.$.description" : mealsDoc.description, 
                    }, 
            });
    }

    static removeMeal(username, meal_id){
        const db = getDbRef();
        return db.collection('user').updateOne( 
            {"username" : username},  
            {$pull: { 
                        meals:  { "id" : meal_id }, 
                    }, 
            });
    }
    
    static async getMealsArrayBy(date, sortBy, sortOrder, username) {
        
        if(date === undefined) 
            date = new moment().format("YYYY-MM-DD");
        if(sortBy == undefined)
            sortBy = "dateTime";
        if(sortOrder == undefined)
            sortOrder = 1;
        //console.log(date + " " + sortBy + " " + typeof(parseInt(sortOrder)) + " " + sortOrder + " " + username)

        sortBy = "filtered_meals." + sortBy ;
        const db = getDbRef();
        //As this is an async function, the return below will return the result array, wrraped inside a promise object
        return db.collection('user').aggregate([     
            {$match: {"username" : username} }, 
            {
                $project: {
                    filtered_meals: {
                        $filter: {
                            input: "$meals",
                            as: "meals",
                            cond: { $and : [ 
                                    {$gte: [ "$$meals.dateTime", new Date(date + "T00:00:00") ]}, //Don't add "Z" at the end of time because it will mean that time is according to UTC format. Not addin "Z" makes it time according to local time zone. SO date will convert this local time automatically to UTC format
                                    {$lte: [ "$$meals.dateTime", new Date(date + "T23:59:59") ]}, 
                                    ], 
                            },
                        },
                    },
                    _id : 0,
                    cals_per_day: 1,
                },
            },
            {$unwind: '$filtered_meals'}, 
            {$sort: { [sortBy] : parseInt(sortOrder) } }, 
        ]).toArray();
    }    
    /*End*/
    
    
    
    

    /*ADMIN RELATED API - Start*/
    static updateUser(userDoc){
        const db = getDbRef();
        return db.collection('user').updateOne( 
            {"username" : userDoc.username},  
            {$set : { 
                        "first" : userDoc.first,
                        "last" : userDoc.last,
                        "cals_per_day" : userDoc.cals_per_day,
                        "phone" : userDoc.phone,
                        "email" : userDoc.email,
                    }, 
            });
    }

    static removeUser(username){
        const db = getDbRef();
        return db.collection('user').deleteOne({username: username});
    }

    static getAllUsers(){
        const db = getDbRef();
        return db.collection('user').find({}).project({_id: 0, password: 0, meals: 0}).toArray();
    }

    static getAllUsernames(){
        const db = getDbRef();
        return db.collection('user').find({}).project({username: 1, _id: 0}).toArray();
        /*  Here, if performance becomes an issue, you can make and object of objects and iterate 
            through each of the objects. This will be the query - 
                let usernamesObj = {}; //WE need to have each key unique
                db.collection('user').find({}).project({username: 1, _id: 0}).forEach(function(doc){
                    let id = new OjectId()
                    usernamesObj[id] = doc;
                });
                return usernamesObj;

            Now to access all the username we can do something like this -
                for(let key in usernamesObj)
                    console.log(usernamesObj[key][username])

            *Reference - https://stackoverflow.com/questions/25507866/how-can-i-use-a-cursor-foreach-in-mongodb-using-node-js
        */
    }
    /*End*/
}