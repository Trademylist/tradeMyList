

var config = {
    port: process.env.PORT || 8936, 
    database : {
        username: "TradeApp",
        password: "LogIn2Trade20",
        authDb: "admin",
        port: 27017,
        host: "127.0.0.1",
        dbName: "mag"
    },
    secret : 'Afv2ilj0iaT1@sB6r345-ipn0ilu9maI-Tn2n9eR',
    dev_mode : true,

    

    __site_url: 'https://trademylist.com:8936/',
    __admin_url: 'https://trademylist.com:8936/',
    __image_url: 'https://trademylist.com:8936/productImages/',
    __profile_image_url: 'https://trademylist.com:8936/profileImages/',
    __adimage_url: 'https://trademylist.com:8936/adImages/',
    __offerimage_url: 'https://trademylist.com:8936/offerImages/',
    __categoryimage_url: 'https://trademylist.com:8936/categoryImages/',
    __key: '/var/www/ssl/trademylist_com.pem',
    __cert: '/var/www/ssl/trademylist.com.crt',
    __bundle:'/var/www/ssl/trademylist.com.ca-bundle',

    
    // email: {
    //     host: 'email-smtp.us-east-2.amazonaws.com',
    //     pass: 'BBN9vvPfgY7fQd6oSpLavG/ZsJ4g/0XTPgoYOrNEakba',
    //     user: 'AKIAYCSDANL26PNINYLU',
    //     port: 587,
    //     fromName: 'noreply@trademylist.com'

    // },
    // email: {
    //     host: 'smtpout.secureserver.net',
    //     pass: 'Trade@12345',
    //     user: 'noreply@trademylist.com',
    //     port: 465,
    //     fromName: 'noreply@trademylist.com'

    // },

    // email: {
    //     host: 'smtp.office365.com',
    //     pass: 'Trade@12345',
    //     user: 'noreply@trademylist.com',
    //     port: 587,
    //     fromName: 'noreply@trademylist.com'

    // },
    email: {
        host: 'smtp.sendgrid.net',
        pass: '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',
        user: 'apikey',
        port: 465,
        fromName: 'noreply@trademylist.com'

    },

    status: {
        OK: 200,
        CREATED: 201,
        FOUND: 302,
        BAD_REQUEST: 400,
        NOT_AUTHORIZED: 401,
        PAYMENT_REQUERED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500,
        NO_SERVICE: 503
    },
 
    server_key: 'AAAA_otr1V4:APA91bH9c86NzEkLGMY6Bh5hTWFIC3RcxAAueY-nASJEv-QKfxqG8IGNnj1UJfouley3ge0QRAvQUYTNQFT15bte9O-H1QfyBv_I7KXzUAvFCIOkYpMxVO_F4VPcbTmZ6KjT3qAyTqyT',
    FCM: {
        requestUrl: 'httpss://fcm.googleapis.com/fcm/send',
        apiKey: 'AIzaSyD2Vz9LytM7uuvx5zf9HSKwi6-_RY5dNhs'
    },

    //twillo
    Account_SID:'AC4de9bed48711d37dc1d2bb923b36600a',
    Auth_Token:'0517fe40e3269ae115f2db4011fadd3a',
    Sender_number:'+17622464710',
    // List of all countries in a simple list / array.
 countryList : [
    { "id": 1, "itemName": "India" },
    { "id": 2, "itemName": "Singapore" },
    { "id": 3, "itemName": "Australia" },
    { "id": 4, "itemName": "Canada" },
    { "id": 5, "itemName": "South Korea" },
    { "id": 6, "itemName": "Germany" },
    { "id": 7, "itemName": "France" },
    { "id": 8, "itemName": "Russia" },
    { "id": 9, "itemName": "Italy" },
    { "id": 10, "itemName": "Sweden" },{ "id": 11, "itemName": "USA" }
],
AWS_S3_BUCKET:'magclubbucket',
AWS_ACCESS_KEY_ID:'AKIAI2XID245DD7OSKQA',
AWS_SECRET_KEY:'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',
AWS_REGION:'us-east-1',
STRIPE_API_KEY:'sk_test_51I9ehvHyg5mkVfE7Q0cGsZGaQgXXjWBuvcqjqiVLRTn2BIAgAV0jVX5yUOBzZajjAChBomMpMp4UioJVBUGNDZjP00qb2iCojw'
};
module.exports = config;
