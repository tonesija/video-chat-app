import axios from 'axios'

//spoj na backend server
export default () => {
    console.log(process.env.VUE_APP_ENV_BASE_URL)
    return axios.create({
        baseURL: process.env.VUE_APP_ENV_BASE_URL
    })
}