module.exports.isAuth = (req, res, next) =>{
    if(!req.session.isAuth)
        return res.redirect("/signin");
    return next();
}

module.exports.isAdmin = (req, res, next) =>{
    if(!req.session.isAdmin)
        return res.redirect("/home");
    return next();
}