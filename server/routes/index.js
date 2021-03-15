module.exports = (app) => {
    app.get('/test', function(req, res) {
        console.log('Test endpoint!')
        res.send("Dobro je")
    })

}