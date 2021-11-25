import * as actions from './actions';

const initialState = {
    savedLocation: {
        latitude: null,
        longitude: null,
        address: null,
        country: null,
        wholeAddress: null,
        latitudeDelta: 6,
        longitudeDelta: 6,
    },
    categoryList: [],
    categoryImageBaseUrl: null,
    commercialCategoryList: [],
    commercialCategoryImageBaseUrl: null,
    filterData: null,
    sliderDistance: 500,
    chatCounter: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOCATION_SELECTED:
            return {
                ...state,
                savedLocation: {
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude,
                    address: action.payload.address,
                    country: action.payload.country,
                    wholeAddress: action.payload.wholeAddress,
                    latitudeDelta: action.payload.latitudeDelta || 6,
                    longitudeDelta: action.payload.longitudeDelta || 6
                },
            }
        case actions.STORE_CATEGORY_LIST:
            return {
                ...state,
                categoryList: action.payload.categories,
                categoryImageBaseUrl: action.payload.imagePath
            }
        case actions.STORE_COMMERCIAL_CATEGORY_LIST:
            return {
                ...state,
                commercialCategoryList: action.payload.categories,
                commercialCategoryImageBaseUrl: action.payload.imagePath
            }
        case actions.STORE_FILTER_DATA:
            return {
                ...state,
                filterData: action.payload.filterData
            }
        case actions.STORE_SLIDER_DISTANCE:
            return {
                ...state,
                sliderDistance: action.payload
            }
        case actions.RESET_SLIDER_DISTANCE:
            return {
                ...state,
                sliderDistance: 500
            }
        case actions.UPDATE_CHAT_COUNTER:
            return {
                ...state,
                chatCounter: action.payload
            }
    }
    return state;
}

export default reducer;