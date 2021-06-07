const Joi = require('joi')

module.exports = {
    register (req, res, next){
        //pravila
        const schema = Joi.object({
            username: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9_]{1,15}$')),
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9@$!%*#?&]{8,}$')
            )
        })

        const {error, value} = schema.validate(req.body)
        console.log('Policy: ' + value)
        if(error) {
            
          switch(error.details[0].context.key){
            case 'username':
                res.status(400).send({
                  message: 'Korisničko ime mora biti kraće od 16 znakova te smije sadržavati velika i mala slova, znamenke i donju crtu.'
                })
                break
            case 'email':
                res.status(400).send({
                  message: 'E-mail nije valjan.'
                })
                break
            case 'password':
                res.status(400).send({
                  message: 'Lozinka mora sadržavati minimalno 8 znakova te barem jedno slovo i jednu znamenku.'
                })
                break
          }
        }else {
            next()
        }
    }
}