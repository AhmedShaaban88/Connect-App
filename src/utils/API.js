import axios from 'axios'

// object from axios to fetch all requests with token
export default axios.create({
    baseURL: "https://connect-app-v1.herokuapp.com/api/",
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        Authorization: localStorage.getItem('userData')
            ? 'Bearer' + ' ' + JSON.parse(localStorage.getItem('userData')).token
            : '',
    },
})
