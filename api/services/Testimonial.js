var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    designation: String,
    company: String,
    title: String,
    testimonial: String,
    image: String,
    sequence: Number,
    status: {
        type: String,
        enum: ["Enable", "Disable"]
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Testimonial', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    findTestimonial: function (data, callback) {
        Testimonial.find({}).sort({
            sequence: -1
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);