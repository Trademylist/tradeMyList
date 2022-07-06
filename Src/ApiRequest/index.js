const axios = require('axios');
 export const API_URL = 'https://trademylist.com:8936';

 axios({
    method: 'post',
    url: '/user/12345',
    data: {
      firstName: 'Fred',
      lastName: 'Flintstone'
    }
  });


//....get api without header pass......
export function getApicall(url) {
    //console.log("calling get api-" + `${API_URL}/${url}`)
    // return axios.get(`${API_URL}/${url}`, {
    // });
    return axios({
        method: 'get',
        url: `${API_URL}/${url}`,
        data: {}
      });
}

///......for Post method Api.....
export function postApiCall(url, payload) {
    //console.log("calling post api-" + `${API_URL}/${url}`)
    return axios.post(`${API_URL}/${url}`, payload);
}

///......for Put method Api.....
export function putApiCall(url, payload, header) {
    //console.log("calling put api-" + `${API_URL}/${url}`)
    return axios.put(`${API_URL}/${url}`, payload);
}

////......from Delete method Api.......
export function deleteApiCall(url, payload, header) {
    //console.log("calling post api-" + `${API_URL}/${url}`)
    return axios.delete(`${API_URL}/${url}`, payload);
}