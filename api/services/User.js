var schema = new Schema({
    name: {
        type: String,
        required: true,
        excel: true,
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        excel: "User Email",
        unique: true
    },
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
    },
    photo: {
        type: String,
        default: "",
        excel: [{
            name: "Photo Val"
        }, {
            name: "Photo String",
            modify: function (val, data) {
                return "http://abc/" + val;
            }
        }, {
            name: "Photo Kebab",
            modify: function (val, data) {
                return data.name + " " + moment(data.dob).format("MMM DD YYYY");
            }
        }]
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    address: [{
        lineOne: String,
        lineTwo: String,
        lineThree: String,
        city: String,
        district: String,
        state: String,
        pincode: String
    }],
    location: String,
    otpTime: Date,
    verifyAcc: {
        type: String,
        enum: ['true', 'false']
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
    add: function () {
        var sum = 0;
        _.each(arguments, function (arg) {
            sum += arg;
        });
        return sum;
    },
    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                console.log(err);
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    /**
     * This function get all the media from the id.
     * @param {userId} data
     * @param {callback} callback
     * @returns  that number, plus one.
     */
    getAllMedia: function (data, callback) {

    },

    /**
     * This function register the user.
     * @param {userId} data
     * @param {callback} callback
     * @returns  registered details.
     */
    registerUser: function (data, callback) {
        var newUserDataToSave = new User();
        newUserDataToSave.name = data.name;
        newUserDataToSave.password = md5(data.password);
        newUserDataToSave.accessToken = uid(16);
        newUserDataToSave.email = data.email;
        newUserDataToSave.dob = data.dob;
        newUserDataToSave.gender = data.gender;
        newUserDataToSave.save(function (err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },

    checkUsersForOtp: function (data, callback) {
        var Otp = (Math.random() + "").substring(2, 6);
        User.findOne({
            email: data.email,
            password: md5(data.password)
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {

                // async.waterfall([
                //         function (callback) {
                //             var saveOtpData = {};
                //             saveOtpData._id = found._id;
                //             saveOtpData.otp = Otp;
                //             User.saveData(saveOtpData, callback)
                //         },
                //         function (userData, callback) {
                //             // if (found.contact) {
                //             //     var smsData = {};
                //             //     smsData.mobile = found.contact;
                //             //     smsData.content = " Please confirm the OTP " + Otp + " to complete your registration.";
                //             //     console.log("*************************************************sms data from photographer***********************************************", smsData);
                //             //     Config.sendSms(smsData, function (err, smsRespo) {
                //             //         if (err) {
                //             //             console.log("*************************************************sms gateway error in photographer***********************************************", err);
                //             //         } else if (smsRespo) {
                //             //             console.log(smsRespo, "*************************************************sms sent partyyy hupppieeee**********************************************");
                //             //         } else {
                //             //             console.log("invalid data")
                //             //         }
                //             //     });
                //             // }
                //         }
                //     ],
                //     callback);

                callback(null, found);
            }
        });
    },

    verifyOTP: function (data, callback) {
        User.findOne({
            otp: data.otp
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);