var schema = new Schema({
    currency: {
        type: Schema.Types.ObjectId,
        ref: "Currency"
    },
    quantity:Number,
    systemAddress:String,
    customerAddress:String,
    transactionId:String,
    commission:Number,
    amountProvided:Number,
    status: {
        type: String,
        enum: ["Pending", "Canceled","Accepted"]
    },
    statusLog:[{
        status:String,
        timeStamp:Date
    }],
    type: {
        type: String,
        enum: ["withdrawal", "deposite"]
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Transaction', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);