const config={
    screens:{
        home:{
            path:'',
            screens: {
                productDetails: {
                    path: 'trade://trademylist.com/product-details/:id/:process',
                    exact: true,
                },
                reviewExperience: {
                    path: 'trade://trademylist.com:8936/app_seller/buyer_tag',
                    exact: true,
                }
              },
        }

    }
}

const linking={
   // prefixes:["https://trademylist.com"],
    config
}

export default linking;