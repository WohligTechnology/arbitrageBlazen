var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortName:String,
    currencyExchangeAddress:    [{
        exchange:{
            type: Schema.Types.ObjectId,
            ref: "Exchange"
        },
        address:Date
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Currency', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);