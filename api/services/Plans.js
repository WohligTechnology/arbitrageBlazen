var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    script: String,
    depositeScript1Transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    },
    depositeScript2Transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    },
    withdrawalScript1Transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    },
    withdrawalScript2Transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    },
    status: {
        type: String,
        enum: ["Pending", "Terminated"]
    },
    statusLog: [{
        status: String,
        timeStamp: Date
    }],
    lastCheckTime: Date
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Plans', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    searchByFilter: function (data, callback) {
        var pipeline = [
            // Stage 1
            {
                $lookup: {
                    "from": "",
                    "localField": "",
                    "foreignField": "",
                    "as": ""
                }
            },
            // Stage 2
            {
                $unwind: ""
            },
            //stage 3
            {
                $match: {
                    "": data.location
                }
            },
        ]
        Plans.aggregate(pipeline, function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    },

    checkCurrnecyArrived: function (data, callback) {

    },

    makeWithdrawal: function (data, callback) {

    },

    updateStatus: function (data, callback) {

    }


};
module.exports = _.assign(module.exports, exports, model);