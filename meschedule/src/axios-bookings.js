import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://bookingapp-react.firebaseio.com/',
})

export default instance;