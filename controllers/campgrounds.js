const Campground = require("../models/campground.js");
const app = module.exports;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder=mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require("../cloudinary");

app.index = async (req, res) => {
     const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds });
};

app.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

app.createNewCampground = async (req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Campground was created");
    res.redirect(`/campgrounds/${campground._id}`);
};

app.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");
    if (!campground) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
};

app.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
};

app.editCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f =>({url: f.path, filename:f.filename}))
    campground.image.push(...imgs);
    campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Campground updated successfully')
    res.redirect(`/campgrounds/${campground._id}`);
};

app.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted");
    res.redirect("/campgrounds");
};
