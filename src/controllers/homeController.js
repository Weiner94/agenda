const Contato = require('../models/ContatoModel')

exports.index = async (req, res, next) => {
    const contatos = await Contato.buscaContatos()
    res.render('index', { contatos })
}

exports.trataPost = (req, res, next) => {
    res.send('resposta do POST')
    console.log(req.body);//dados enviados no form 
    console.log('aaaa');
    next()
}

