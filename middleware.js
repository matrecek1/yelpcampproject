const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/campground.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in to access this page");
        return res.redirect("/login");
    }
    next();
};
module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        let msg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "No permission to do that!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "No permission to do that!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
        let msg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.getUrl = (req, res, next) => {
    if (req.session.returnTo) {
        req.returnToUrl = req.session.returnTo;
    }
    next();
};
