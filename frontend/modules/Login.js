/* const validator = require('validator') */
import validator from 'validator'

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass)
    }
    init() {
        this.events()
    }
    events() {
        if (!this.form) return
        this.form.addEventListener('submit', e => {
            e.preventDefault()
            console.log('form nao enviado');//controle debug
            this.validate(e)
        })
    }
    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]')
        const passwordInput = el.querySelector('input[name="password"]')

        let error = false
        
        //NOTA: adaptar alert para algo mais elaborado
        if (!validator.isEmail(emailInput.value)) {
            // aqui pode ter algo mais elaborado do que um alert
            alert('Email inválido')
            error = true
        }


        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            alert('Senha precisa ter entre 3 e 50 caracteres')
            error = true
        }

        if(!error) el.submit()
        
        

    }
}