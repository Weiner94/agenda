const mongoose = require('mongoose')
const validator = require('validator')

//ISSO É UM EXEMPLO DE TIPOS DE DADOS QUA VÃO PARA OS BANCO -> UM TIPO DE FORMATAÇÃO NECESSÁRIO PARA GRAVAR 
// garantir que os dados estejam na base de dados como a gente quer q eles estejam

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true }, //require -> obrigatorio? sim/nao
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now }// data no cadastro(type: Date) e padrão: data atual(Date.now)
})

// cria o schema na base de dados -> pode adicionar dados usando ContatoModel.create(dado...)
const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null
}
Contato.prototype.register = async function () {
    this.valida()
    if (this.errors.length > 0) return
    // gravando ...
    this.contato = await ContatoModel.create(this.body)

}
Contato.prototype.valida = function () {
    this.cleanUp()
    //email precisa ser valido  
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido')
    if (!this.body.nome) this.errors.push('Nome é um campo Obrigatório')
    if (!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato válido precisa ser Informado: email ou telefone')
    }

}

Contato.prototype.cleanUp = function () {

    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';

        }
    }
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    }
}

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return
    this.valida();
    console.log(this.errors);
    if (this.errors > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })

}

//Metodos estaticos - nao vao pro prototype
//Buscando contato por id -- nao precisa instanciar para usar isso 
// ja que n esta atrelado no prototype (igual a uma função estatica)
Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return
    const contato = await ContatoModel.findById(id)
    return contato
}

//Metodos estaticos - nao vao pro prototype
Contato.buscaContatos = async function () {
    //encontra contatatos criados na base - > da pra usar filtros em ...find(email: tal)
    const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1 })// ebibir em ordem decrescente(-1) ou ordem crescente(1)
    return contatos
}

Contato.delete = async function (id) {
    if (typeof id !== 'string') return
    const contato = await ContatoModel.findOneAndDelete({ _id: id })//encontra e deleta o cadastro com o id referenciado
    return contato
}

module.exports = Contato;