/*  ESSE ARQUIVO TEM A FUNÇÃO DE VER QUAL ROTA ESTA SENDO REQUISITADA E CHAMAR UM
 CONTROLADOR PARA DECIDIR QUAL VIEW/MODEL(db) IREMOS USAR(MOSTRAR PARA O USUÁRIO)*/

const express = require('express')
const route = express.Router()

const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')

const { loginRequired } = require('./src/middlewares/middleware')

function meuMiddleware(req, res, next) {
    console.log();
    console.log('passando pelo 1 middleware route.get -> estou em routes.js');
    console.log();
    //dentro de um middleware precisa chamar o proximo(next) se nao a pagina fica carregando infinitamente
    next()
}
//AQUI UM GET PARA TRATAR REQUISIÇÃO NO / -> Servidor precisa estar ouvindo((on) em uma porta(ex porta:3000))) para isso funcionar 
//rotas da home (meuMiddleware e homeController aqui é uma middleware...)
route.get('/', meuMiddleware, homeController.index, function (req, res, next) {
    console.log('resposta 2 middleware route.get -> estou em rotes.js');
})//MOSTRA
/* route.post('/', homeController.index)//ENVIA/RECEBE->CRIA */

//ROTAS DE LOGIN
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

// Rotas de contato (exibir/cadastrar/delete)
route.get('/contato/index', loginRequired, contatoController.index)
route.post('/contato/register', loginRequired, contatoController.register)
route.get('/contato/index/:id', loginRequired, contatoController.editIndex)
route.post('/contato/edit/:id', loginRequired, contatoController.edit)
route.get('/contato/delete/:id', loginRequired, contatoController.delete)

function teste() {
    console.log('teste rota ---------------');
}

module.exports = route