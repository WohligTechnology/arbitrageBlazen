module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    createDepositTransaction: function (req, res) {
        if (req.body) {
            Transaction.createDepositTransaction(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    createWithdrawalTransaction: function (req, res) {
        if (req.body) {
            Transaction.createWithdrawalTransaction(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);