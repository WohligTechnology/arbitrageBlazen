var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    currency1: {
        type: Schema.Types.ObjectId,
        ref: "Currency"
    },
    currency2: {
        type: Schema.Types.ObjectId,
        ref: "Currency"
    },
    annulizedReturn: Number,
    monthlyReturn: Number,
    status: {
        type: String,
        enum: ["Enable", "Disable"]
    },
    sequence: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Scripts', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    findScripts: function (data, callback) {
        Scripts.find({}).sort({
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