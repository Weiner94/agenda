const mongoose = require('mongoose')

//ISSO É UM EXEMPLO DE TIPOS DE DADOS QUA VÃO PARA OS BANCO -> UM TIPO DE FORMATAÇÃO NECESSÁRIO PARA GRAVAR 
// garantir que os dados estejam na base de dados como a gente quer q eles estejam

const HomeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: String
})

const HomeModel = mongoose.model('Home', HomeSchema)

module.exports = HomeModel;