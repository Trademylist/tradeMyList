const config={
    screens:{
        home:{
            path:'',
            screens: {
                productDetails: {
                    path: 'https://trademylist.com/product-details/:id/:process',
                    exact: true,
                },
                reviewExperience: {
                    path: 'https://trademylist.com:8936/app_seller/buyer_tag',
                    exact: true,
                }
              },
        }

    }
}

const linking={
    config
}

export default linking;