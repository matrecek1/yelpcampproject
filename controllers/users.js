const User = require("../models/user");
const app = module.exports;

app.renderRegisterForm = (req, res) => {
    res.render("users/register");
};
app.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
};
app.renderLoginForm = (req, res) => {
    res.render("users/login");
};
app.loginUser = (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = req.returnToUrl || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

app.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/campgrounds");
    });
};
