'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

var UserSchema = new Schema({
    country: [
        {
            id: { type: Number, default: null },
            itemName: { type: String, default: null }
        }
    ],
    address: {
        type: String,
        default: null
    },
    geometry: GeoSchema,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        //validate: { validator: isEmail, message: 'Invalid email.' },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    username: { type: String, default: null },
    image: { type: String, default: null },
    access_token: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'super_admin', 'seller'],
        default: 'seller'
    },
    password: {
        type: String,
        default: null
    },
    email_verify: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No'
    },
    block_user_id: [{ type: String }],
    bio: { type: String, default: null },
    distance_unit: {
        type: String,
        enum: ['Km', 'Miles'],
        default: 'Miles'
    },
    status: {
        type: String,
        enum: ['Active', 'In Active', 'Block', 'Deleted'],
        default: 'In Active'
    },
    notification: {
        email: {
            expired_product: { type: Boolean, default: true },
            user_visit_product: { type: Boolean, default: true },
            chat: { type: Boolean, default: true },
            review: { type: Boolean, default: true },
            expired_favorite_product: { type: Boolean, default: true },
            delete_favorite_product: { type: Boolean, default: true },
            soldOut_favorited_product: { type: Boolean, default: true },
            image_change_favorited_product: { type: Boolean, default: true },
            price_change_favorited_product: { type: Boolean, default: true },
            description_change_favorited_product: { type: Boolean, default: true }
        },
        push: {
            expired_product: { type: Boolean, default: true },
            user_visit_product: { type: Boolean, default: true },
            chat: { type: Boolean, default: true },
            review: { type: Boolean, default: true },
            expired_favorite_product: { type: Boolean, default: true },
            delete_favorite_product: { type: Boolean, default: true },
            soldOut_favorited_product: { type: Boolean, default: true },
            image_change_favorited_product: { type: Boolean, default: true },
            price_change_favorited_product: { type: Boolean, default: true },
            description_change_favorited_product: { type: Boolean, default: true }
        }
    },
    notification_token: { type: String, default: null },
    device_token: { type: String, default: null },
    device_type: { type: String, default: null },
    socialId: { type: String, default: null },
    login_type: { type: String, default: null },
    contact: {
        type: String,
        default: null
    },
    contact_verify: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No'

    },
    otp_code: { type: Number, default: null },
    otp_expAt: { type: Number, default: null },
    permission: {
        cms: {
            type:Boolean,
            default: false
        },
        change_password: {
            type:Boolean,
            default: false
        },
        manage_report_option: {
            type:Boolean,
            default: false
        },
        manage_commercial_category: {
            type:Boolean,
            default: false
        },
        manage_commercial: {
            type:Boolean,
            default: false
        },
        manage_product_category: {
            type:Boolean,
            default: false
        },
        manage_make_model:{
            type:Boolean,
            default: false
        },
        manage_product: {
            type:Boolean,
            default: false
        },
        manage_seller: {
            type:Boolean,
            default: false
        },
        manage_admin: {
            type:Boolean,
            default: false
        }

    }

},
    {
        timestamps: true,
        typecast: true
    });

UserSchema.pre('save', function (next) {

    var user = this;
    if (!user.isModified('password')) { return next(); }


    if (user.password) {
        bcrypt.hash(user.password, null, null, function (err, hash) {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    }

});

UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('Users', UserSchema);