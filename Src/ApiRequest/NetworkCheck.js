import NetInfo from "@react-native-community/netinfo";

export function connectionrequest() {
    //console.log("inside connectionrequest------------>")
    return new Promise(function (resolve, reject) {
        NetInfo.fetch().then( function (isConnected) {
            //console.log("stat page" + isConnected)
            if (isConnected) {
                resolve(isConnected);
            } else {
                reject(isConnected)
            }
      
    });
});
}


export function connectionremove() {
    return new Promise(function (resolve, reject) {
        NetInfo.isConnected.removeEventListener('connectionChange', function (isConnected) {
            ////console.log("stat page" + isConnected)
            if (isConnected) {
                resolve(isConnected);
            } else {
                reject(isConnected)
            }
        })
    });
}


// import NetInfo from "@react-native-community/netinfo";
// import axios from 'axios'
// export const base_url = 'https://mydevfactory.com/~sanjib/raju/acti50/wp-json/wl/v1'


// //THIS CODE IS FOR DEBUGGIN NETWORK CALLES IN CHROME DEVTOOLS

// //Main method for network calls using axios
// export const Network = (method, endpoint, data = {}) => {
//   return fetch = new Promise((resolve, reject) => {
//     //cheking network connection    
//     NetInfo.fetch().then(state => {
//       if (state.isConnected) {
//         axios({
//           method,
//           url: `${base_url}${endpoint}`,
//           headers:{
//            'x-access-token': data.authtoken ? data.authtoken : null
//           },
//          data,
//         }).then((response) => {
//             if(response.status === 200 || response.response_code == 2000) {
//               resolve(response.data)
//             } else {
//               //reject('something went wrong')
//             }
//         });
//       }
//     });
//   })
// }




