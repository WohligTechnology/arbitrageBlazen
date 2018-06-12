var schema = new Schema({
    email: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Contact', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    findContact: function (data, callback) {
        Contact.find({}).sort({
            createdAt: -1
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