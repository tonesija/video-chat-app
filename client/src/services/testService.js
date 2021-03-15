import Api from './api'

export default {
    test () {
        return Api().get('/test')
    }
}