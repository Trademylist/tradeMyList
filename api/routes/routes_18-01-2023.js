'use strict';

const { Product } = require('square-connect');

const S3Helper = require('../../_helpers/s3Helper');
const StripeHelper = require('../../_helpers/stripeHelper.js');

module.exports = function (app) {

    var product = require('../controllers/productController');
    var freebies = require('../controllers/freebiesController');
    var user = require('../controllers/userController');
    var vacancies = require('../controllers/vacanciesController');
    var ad = require('../controllers/adController');
    var cms = require('../controllers/cmsController');
    var offer = require('../controllers/offerController');
    var category = require('../controllers/categoryController');
    var share = require('../controllers/shareController');
    var suggest = require('../controllers/suggestController');
    var review = require('../controllers/reviewController');
    var currencies = require('../controllers/currenciesController');
    var Subcategory = require('../controllers/subcategoryController');
    const report = require('../controllers/reportController')
    const comment = require('../controllers/commentController')
    const notification = require('../controllers/notificationController')
    const contactUs = require('../controllers/contactUsController')
    const paymentInfo = require('../controllers/PaymentInfoController')
    const defaultData = require('../controllers/defaultDataController')

    /********************* PRODUCT *********************/
    app.route('/product/:product_id?')
        .post(product.upload_image, product.add_product)
        .put(product.updateProduct)
        .delete(product.deleteProduct);
    app.route('/search_product')
        .post(product.search_product);
    app.route('/all_product')
        .get(product.get_all);
    app.route('/all_product_new')
        .get(product.get_all_new);
    app.route('/productByCategory')
        .post(product.productByCategory);
    app.route('/nearBy')
        .post(product.nearBy);
    app.route('/count_product')
        .get(product.count);


    /**********************FREEBIES******************/
    app.route('/freebies/:freebies_id?')
        .post(freebies.upload_image, freebies.add_product)
        .put(freebies.updateProduct)
        .delete(freebies.deleteProduct);
    app.route('/search_freebies')
        .post(freebies.search_product);
    app.route('/all_freebies')
        .get(freebies.get_all);
    app.route('/all_freebies_new')
        .get(freebies.get_all_new);
    app.route('/freebiesByCategory')
        .post(freebies.productByCategory);
    app.route('/nearByfreebies')
        .post(freebies.nearBy);
    app.route('/count_freebies')
        .get(freebies.count);


    /********************* USER *********************/

    // app.route('/emailvalidate/:access_token?')
    //     .get(user.email_validate);
    app.route('/users') //  /:offset/:limit
        .get(user.all_users);
    app.route('/search_user')
        .post(user.search_user);
    app.route('/login')
        .post(user.login);
    app.route('/is_valid_token')
        .post(user.is_valid_token);
    app.route('/user/:userId?')
        .post(user.add_user)
        .get(user.read_a_user)
        .put(user.update_a_user)
        .delete(user.delete_a_user);
    app.route('/forgot_password')
        .post(user.forgot_password);
    app.route('/change_password')
        .post(user.change_password);
    /* RE-GENERATE TOKEN */
    app.route('/generate_token')
        .post(user.generate_token);
    app.route('/count_seller')
        .get(user.count);

    /**************************ADMIN*******************/
    app.route('/admin/:userId?')
        //.post(user.add_admin)
        .post(user.add_admin_new)
        .put(user.update_a_user)
        .delete(user.delete_a_user);

    app.route('/all_admin')
        .get(user.all_admin);
    app.route('/search_admin')
        .post(user.search_admin);

    app.route('/download_seller')
        .get(user.userConvertInCSVFile);
    app.route('/updateAdminAndSuperAdminDetails')
        .post(user.updateAdminAndSuperAdminDetails);

    /********************* Vacancies *********************/
    app.route('/add_job')
        .post(vacancies.add_job);
    app.route('/all_vacancies') //  /:offset/:limit
        .get(vacancies.all_vacancies);
    app.route('/vacancies/:_id?')
        .get(vacancies.read_a_job)
        .put(vacancies.update_a_job)
        .delete(vacancies.delete_a_job);
    app.route('/search_vacancies')
        .post(vacancies.search_a_job);
    app.route('/count_vacancies')
        .get(vacancies.count);

    /*********************** Ad *************************/
    app.route('/ad/:ad_id?')
        .post(ad.add_Ad)
        // .post(ad.upload_image, ad.add_ad)
        .delete(ad.delete_ad)
        .put(ad.update_ad);
    app.route('/all_ad/:ad_type?')
        .get(ad.get_all);
    app.route('/search_ad')
        .post(ad.search_ad);
    app.route('/count_ad')
        .get(ad.ad_count);

    /********************* CMS *********************/

    app.route('/all_cms') //  /:offset/:limit
        .get(cms.all_cms);
    app.route('/cms/:cms_id?')
        .post(cms.add_cms)
        .get(cms.read_a_cms)
        .put(cms.update_a_cms)
        .delete(cms.delete_a_cms);
    app.route('/count_cms')
        .get(cms.count);
    app.route('/get_cms/:page_name?')
        .get(cms.cms_by_name);

    /*********************** OFFER *************************/
    app.route('/offer/:offer_id?')
        .post(offer.add_Ad)
        .delete(offer.delete_offer)
        .put(offer.update_offer);
    app.route('/all_offer')
        .get(offer.get_admin_list);
    app.route('/all_offer_user')
        .get(offer.get_user_list);
    app.route('/search_offer')
        .post(offer.search_offer);
    app.route('/search_offer_user')
        .post(offer.search_offer_user);
    app.route('/count_admin_offer')
        .get(offer.admin_count);
    app.route('/count_seller_offer')
        .get(offer.seller_count);

    /********************* CATEGORY *********************/

    app.route('/all_category') //  /:offset/:limit
        .get(category.all_category);
    app.route('/category_list/:category_type?')
        .get(category.category_list);
    app.route('/category/:category_id?')
        .post(category.add_category)
        //.post(category.uploadImage)
        .put(category.update_a_category)
        .delete(category.delete_a_category);
    app.route('/count_category')
        .get(category.count);
    /*************************Comment *************************/
    app.route('/comment/:comment_id?')
        .get(comment.list)
        .delete(comment.delete)
        .post(comment.add);
    /**********************Report *****************************/
    app.route('/report/:report_id?')
        .get(report.Report_list)
        .delete(report.delete_a_Report)
    /*****************************************************************/
    /********************* App User *************************/

    app.route('/app_user/all_product')//add latlong
        .post(product.product_listing);
    app.route('/app_user/product/:product_id?')
        .get(product.product_details)
    app.route('/app_user/search_product')
        .post(product.search_user_product);
    app.route('/app_user/productByCategory')
        .post(product.product_by_user_Category);

    app.route('/app_user/all_freebies')//add lat long
        .post(freebies.product_listing);
    app.route('/app_user/freebies/:product_id?')
        .get(freebies.product_details)
    app.route('/app_user/search_freebies')
        .post(freebies.search_user_product);
    app.route('/app_user/freebiesByCategory')
        .post(freebies.product_by_user_Category);

    app.route('/app_user/category_list/:category_type?') //  /:offset/:limit
        .get(category.user_category_list);

    app.route('/app_user/all_vacancies')
        .post(vacancies.nearBy);
    app.route('/app_user/search_vacancies')
        .post(vacancies.search_user_vacancy);

    app.route('/app_user/all_offer')
        .post(offer.nearBy);
    app.route('/app_user/search_offer')
        .post(offer.search_user_offer);
    app.route('/app_user/search_offer_category')
        .post(offer.search_user_offer_category);


    app.route('/app_user/filter')
        .post(product.product_filter);
    app.route('/app_user/filter_test')
        .post(product.product_filter_development);

    app.route('/app_user/commercial_filter')
        .post(freebies.product_filter);
    app.route('/app_user/commercial_filter/van&truck')
        .post(freebies.van_truck_filter)
    app.route('/app_user/get_review')
        .post(review.seller_reveiw_details);



    /************ App seller****************/
    app.route('/app/registration')
        .post(user.add_user);
    app.route('/app/login')
        .post(user.seller_login);
    app.route('/app/social_login')
        .post(user.social_login)

    /********product section */
    app.route('/app_seller/all_product')
        .post(product.login_user_listing)
    app.route('/app_seller/all_freebies')
        .post(freebies.login_user_listing)

    // app.route('/app/contact_login')
    //     .post(user.contact_login)
    /****** Mobile number login and verification ************/
    app.route('/app_user/send_mobile_verification')
        .post(user.send_mobile_verification)
    app.route('/app_user/check_mobile_verification')
        .post(user.check_mobile_verification)

    app.route('/app_seller/userdetail')
        .get(user.user_details);
    app.route('/app_seller/chatuser')
        .post(user.chatuser_list);

    app.route('/app_seller/useredit')
        .post(user.user_edit);
    app.route('/app_seller/change_password')
        .post(user.change_password);
    app.route('/app/forgot_password')
        .post(user.forgot_password);
    // app.route('/app_seller/profileupload')
    //     .post(user.upload);
    //multer upload
    // app.route('/app_seller/profileuploadtest')
    //     .post(user.upload_image,user.add_image);

    app.route('/app_seller/own_product')
        .get(product.my_product);
    app.route('/app_seller/chatProduct')
        .post(product.chatProduct);
    app.route('/app_seller/chatListDetail')
        .post(product.chatListDetail);
    // app.route('/app_seller/upload')
    //     .post(product.upload);
    // multer upload
    // app.route('/app_seller/uploadtest')
    //     .post(product.upload_image, product.image_response);

    app.route('/app_seller/unlink')
        .post(product.delete);
    app.route('/app_seller/product/:product_id?')
        .get(product.product_details)
        .post(product.add_seller_product)
        .put(product.update_seller_product)
        .delete(product.delete_seller_product);

    app.route('/app_seller/freebies/:product_id?')
        .get(freebies.product_details)
        .post(freebies.add_seller_product)
        .put(freebies.update_seller_product)
        .delete(freebies.delete_seller_product);



    app.route('/app_seller/own_freebies')
        .get(freebies.my_product);

    app.route('/app_seller/vacancies')
        .get(vacancies.seller_vacancies)
        .post(vacancies.add_vacancies)
        .put(vacancies.update_a_job);

    app.route('/app_user/sample')
        .post(offer.sample);


    app.route('/app_seller/boost')
        .post(product.boost_product)
    app.route('/app_seller/commercial_boost')
        .post(freebies.boost_product)

    app.route('/app_seller/filter')
        .post(product.product_filter);
    app.route('/app_seller/likes')
        .post(product.like_product);
    app.route('/app_seller/dislikes')
        .post(product.dislike_product);
    app.route('/app_seller/likelist')
        .get(product.likelist);

    app.route('/app_seller/commercial_filter')
        .post(freebies.product_filter);
    app.route('/app_seller/commercial_filter/van&truck')
        .post(freebies.van_truck_filter)
    app.route('/app_seller/commercial_likes')
        .post(freebies.like_product);
    app.route('/app_seller/commercial_dislikes')
        .post(freebies.dislike_product);
    app.route('/app_seller/commercial_likelist')
        .get(freebies.likelist);
    // app.route('/chat/addnew')
    //     .post(secondOpinion.add);


    /***************** Share **************/
    app.route('/app_seller/share/:share_id?')
        .post(share.add)
        .get(share.list)
        .delete(share.delete);

    /***************** suggest ***************/
    app.route('/app_user/suggest/:suggest_id?')
        .get(suggest.list)
        .delete(suggest.delete)
        .post(suggest.add);

    /*******************sold Out******************* */
    app.route('/app_seller/all_sold_product')
        .get(product.soldout_list);
    app.route('/app_seller/product_sold')
        .post(product.soldout);
    app.route('/app_seller/product_resell')
        .post(product.resell);
    app.route('/app_seller/delete_sold_product')
        .post(product.delete_seller_product)
    /*******************sold Out******************* */
    app.route('/app_seller/all_sold_freebies')
        .get(freebies.soldout_list);
    app.route('/app_seller/freebies_sold')
        .post(freebies.soldout);
    app.route('/app_seller/freebies_resell')
        .post(freebies.resell);
    app.route('/app_seller/delete_sold_freebies')
        .post(freebies.delete_seller_product)

    /********************expire product *************/
    app.route('/app_seller/all_expire_product/:product_id?')
        .get(product.expire_product)
        .delete(product.delete_expire_product);
    /***********reactivation*************/
    app.route('/app_seller/product_reactivation')
        .post(product.reactivation_product)
    app.route('/app_seller/commercial_reactivation')
        .post(freebies.reactivation_product)

    app.route('/currency')
        .get(currencies.list)
        .post(currencies.add);
    app.route('/app_user/currency')
        .post(currencies.currency_by_name);
    // app.route('/app_seller/upload_multiple')
    //     .post(product.upload_test);

    //******************REVIEW *****************/
    app.route('/app_seller/review')
        .get(review.list)
        .post(review.add_review)
    app.route('/app_seller/get_review')
        .post(review.seller_reveiw_details);
    app.route('/app_user/rating/:user_id?')
        .get(review.get_rating)


    /****************subcategory******************/
    app.route('/app_user/subcategory')
        .post(Subcategory.add);
    app.route('/app_user/subCategoryList')
        .post(Subcategory.list);
    // app.route('/app_user/filterlist')
    //     .post(Subcategory.filter);

    app.route('/app_user/all_list')
        .post(Subcategory.all_list);
    app.route('/app_user/editSubCategory')
        .put(Subcategory.edit);
    app.route('/app_user/subCategoryName')
        .get(Subcategory.subCategoryName);
    app.route('/app_user/deleteMake')
        .put(Subcategory.deleteMake);
    app.route('/app_user/addMakewithModel')
        .post(Subcategory.addMakewithModel);


    /***********discard product */
    app.route('/app_seller/discard')
        .post(product.discard);

    /**********  report **********/
    app.route('/app_seller/report')
        .post(report.add_Report)

    /*********** comment *********/
    app.route('/app_seller/commentList')
        .get(comment.list)
    app.route('/app_seller/seller_tag')
        .get(comment.seller_tag_list)
    app.route('/app_seller/buyer_tag')
        .get(comment.buyer_tag_list)

    /**************blockuser ***********/
    app.route('/app_seller/block_user')
        .post(user.block_user)
        .get(user.block_list)
    app.route('/app_seller/unblock_user')
        .post(user.unblock_user)
    app.route('/app_seller/favorite_list')
        .post(product.favorite_list)
    /****OTP */
    // app.route('/app_seller/send_verification')
    //     .post(user.send_verification)

    // app.route('/app_seller/check_verification')
    //     .post(user.check_verification)
    app.route('/app_user/send_verification')
        .post(user.send_verification)
    app.route('/app_user/check_verification')
        .post(user.check_verification)
    app.route('/app_user/change_password')
        .post(user.change_password_verification)

    /******chat push ***************************/
    app.route('/app_seller/chat_push')
        .post(product.chat_push)

    /*******user notification ******************/
    app.route('/app_seller/notification/:notification_id?')
        .get(notification.list)
        .put(notification.update_a_Notification)
        .delete(notification.delete_a_Notification);
    app.route('/app_seller/delete_notification')
        .delete(notification.delete_user_Notification)
    /************contact Us *******************/
    app.route('/app_user/contactUs/:contactUs_id?')
        .get(contactUs.all_contactUs)
        .post(contactUs.add_contactUs)
        .delete(contactUs.delete_a_contactUs);

    /***********all product details ********/
    app.route('/app_seller/any_product_details')
        .post(product.any_product_details)

    app.route('/app_seller/profileupload')
        .post(S3Helper.upload.array('file', 1), user.addprofile)

    /***********Product upload ****************/
    app.route('/app_seller/upload')
        .post(S3Helper.upload.array('file', 1), product.add_product_image)
    app.route('/app_seller/upload_multiple')
        .post(S3Helper.upload_cover.array('file', 10), product.add_product_array_image)

    app.route('/chat_media_upload')
        .post(S3Helper.upload.array('file', 1), product.add_chat_image)
    /******************chat block */
    app.route('/app_seller/chatBlock/:chatBlock_id?')
        .post(user.add_chatBlock)
        .get(user.chatBlock_list)
        .delete(user.delete_a_chatBlock);

    /*********Email change *******/
    app.route('/app_seller/change_email')
        .post(user.email_change)
    /*********Payment**********/
    app.route('/app_seller/all_payment') //  /:offset/:limit
        .get(paymentInfo.all_payment);
    app.route('/app_seller/payment/:paymentId?')
        .post(paymentInfo.add_payment)
        .get(paymentInfo.user_payment)
        .delete(paymentInfo.delete_a_payment);
    /*******amount*********/
    app.route('/app_seller/amount/:currency_code?/:type?')
        .post(paymentInfo.add_amount)
        .get(paymentInfo.get_amount)
    /**stripe */
    app.route('/app_user/create_token')
        .post(user.token)
    app.route('/app_user/create_charge')
        .post(user.charge)
    //********************Apple login */\
    app.route('/app_user/applelogin')
        .post(user.appleLogin)

    /********DefaultData ******/
    app.route('/app_user/defaultData')
        .post(S3Helper.upload.array('file', 1), defaultData.add_default)
        .put(S3Helper.upload.array('file', 1), defaultData.update_a_default)
    app.route('/app_user/defaultData/:type?')
        .get(defaultData.getByName);
    /**************Change Email *******/
    app.route('/app_seller/changeEmail')
        .post(user.changeEmail)
    app.route('/app_user/validation/:token')
        .get(user.emailValidation)
};

