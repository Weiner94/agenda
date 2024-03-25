const dotenv = require('dotenv').config()

const express = require('express')// nao precisa de caminho pq isso esta dentro da pasta node(quando instalado (npm...))
const app = express()//app por padrão convensão

// ------ISSO AQUI SALVA A SESSÃO //
const session = require('express-session')
const MongoStore = require('connect-mongo')
//flas-messages -> mensagens que irão aparecer na req apenas uma vez(desaparecem depois de visualizadas na 1 vez)
const flash = require('connect-flash')
const routes = require('./routes')
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware')

/*----------------- CONEXAO BASE DE DADOS - MONGO DB-------------- */
// CONEXÃO USANDO MONGOOSE (MELHOR PARA TRABALHAR COM MODELS)
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('conectando banco...')
        app.emit('connected')
    })
    .catch(e => console.log('erro de conexao   ==>  ', e));
//----------------- SESSÃO 
const sessionOptions = session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 *60 * 24 * 7 //7 dias em milesimos de segundos
    }
})
app.use(sessionOptions)
app.use(flash())
app.use(helmet())

app.use(express.urlencoded({ extended: true }))//URL-encoded bodies -> trata o body dos POST ou PUT via form
app.use(express.json())//JSON-encoded bodies

//conteudo estaticos --> arquivos que são enviados ao navegador exatamente como estão no HD do servidor
app.use(express.static(path.resolve(__dirname, 'public')))

//engine utilizada para renderizar os views(paginas) -> aqui utiliznado ejs (um tipo de "html" bombadão )
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())// injeta token de um form(POST) nosso garantindo que a requisição veio de uma pagina nossa e nao e terceiros(hackers) - token é valido? -> aceita requisição
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes)


app.on('connected', () => {
    app.listen(3000, () => {
        console.log('acessar: http://localhost:3000/');
        console.log('servidor executando na rota: 3000');
    })
})


