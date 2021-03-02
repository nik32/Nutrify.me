
const express = require('express');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

const connectToDb = require('./database/dbConnection').connect;
const authRoutes = require('./routes/auth');
const mealsRoutes = require('./routes/meals');
const adminRoutes = require('./routes/admin');

const app = express();
const store = new mongoDbStore({
    uri: "mongodb+srv://admin:admin@cluster0.hsate.mongodb.net/user_meals(no_index)_db_assignment?retryWrites=true&w=majority",
    collection: 'sessions',
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({extended: false}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'Used for signing the hash. This hash is used for genererateing session id. This should be long to better the security',
    resave: false,
    saveUninitialized: false,
    store: store,
    //WE can also configure the cookie here using "cookie : {<config obj>}"
})); 

app.use(authRoutes);
app.use(mealsRoutes);
app.use(adminRoutes);
app.get("/", (req, res) => res.redirect("/signin"));

connectToDb(() => {
    app.listen(3000);
    console.log("listening on 3000");
});
