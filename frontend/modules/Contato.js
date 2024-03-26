/* const validator = require('validator') */
import validator from 'validator'

export default class Contato {
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
            console.log('form nao enviado');//contole debug
            this.validate(e)
        })
    }
    validate(e) {
        const el = e.target;

        const nomeInput = el.querySelector('input[name="nome"]')
        const sobrenomeInput = el.querySelector('input[name="sobrenome"]')
        const emailInput = el.querySelector('input[name="email"]')
        const telefoneInput = el.querySelector('input[name="telefone"]')
        
        let error = false
        
        //NOTA: adaptar alert para algo mais elaborado

        if(!nomeInput.value){
            alert("Campo nome não pode estar vazio") 
            error = true
        }else if(typeof nomeInput.value !== 'string'){
            alert("Campos Nome e Sobrenome não podem conter numeros")
            error = true
        }

        if(sobrenomeInput.value !=='' && typeof sobrenomeInput.value !== 'string'){
            alert("Campos Nome e Sobrenome não podem conter numeros")
            error = true
        }

        if (!validator.isEmail(emailInput.value)) {
            // aqui pode ter algo mais elaborado do que um alert
            alert('Email inválido')
            error = true
        }
        

        if (!emailInput.value && !this.body.telefone) {
            alert('Pelo menos um contato válido precisa ser Informado: email ou telefone')
        }

        if(!error) el.submit()
        
        

    }
}