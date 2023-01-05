const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => console.log("connected to database"));

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        let random1000 = Math.floor(Math.random() * 1000);
        let campground = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: "63b0ac6aea8d65c66c903375",
            price: Math.floor(Math.random() * 20),
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },
            image: [
                {
                    url: "https://res.cloudinary.com/dytluqrqh/image/upload/v1672650455/YelpCamp/gimzkgltnvodnambul2w.jpg",
                    filename: "YelpCamp/gimzkgltnvodnambul2w",
                },
                {
                    url: "https://res.cloudinary.com/dytluqrqh/image/upload/v1672650457/YelpCamp/b6lcrje1gi6qd2fgen1d.jpg",
                    filename: "YelpCamp/b6lcrje1gi6qd2fgen1d",
                },
            ],
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita veniam obcaecati dolorum minima, nihil beatae voluptate accusantium molestias doloribus vel ratione nam corporis unde. Deleniti dolorem aliquam ad perferendis blanditiis!",
        });
        await campground.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});
