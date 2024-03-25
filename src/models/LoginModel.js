// ARQUIVO MODEL RESPONSAVEL PELO TRATAMENTO-VALIDAÇÃO DOS DADOS(EMAIL, SENHA, CPF...)

const mongoose = require('mongoose')
const validator = require('validator')//validador usado p email
const bcryptjs = require('bcryptjs')//hashcode para senha

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})
const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];// se esse array conter algo dados nao serão cadastrados
        this.user = null;
    }
    //USAR COM DADOS INTEIROS (CUIDADO, ISSO SALVA O TOKENCSRF TB ->E NÃO PODE<-):
    /* cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = this.body[key].toString();
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }   */
    /// garante que tudo que tenha dentro do req.body seja uma string
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
    //VALIDAÇÃO 
    valida() {
        this.cleanUp()
        //email precisa ser valido
        if (!validator.isEmail(this.body.email)) this.errors.push('Email inválido')

        //password precisa ter entre 3 e 0 caracteres
        if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('a senha precisa ter entre 3 e 50 caracteres')
    }

    // sempre que for gravar dados na base de dados-> melhor usar promisses
    async register() {
        //checa dados do formulario
        this.valida();
        if (this.errors.length > 0) return;
        //checa se usuario existe na base de dados
        await this.userExists();
        //adiciona o hascode na senha
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        //tenta gravar na base
        // CRIAÇÃO DE USUÁRIO (da pra acessar "user" de fora dessa classe(e em outros arquivos))
        this.user = await LoginModel.create(this.body)
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email })
        if (this.user) this.errors.push('Ja existe uma conta com o email informado')

    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        //recebe em this.user o que achar findOne()
        this.user = await LoginModel.findOne({ email: this.body.email })
        //se nao achar retorna um erro
        if (!this.user) {
            this.errors.push('Usuário não cadastrado');
            return;
        }

        //bcrypt.compareSync(stringSenha, hash(do banco))
        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }

    }



}
module.exports = Login;