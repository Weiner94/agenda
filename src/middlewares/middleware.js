//middlewareGlobal e checkCsrfError fazem a mesma coisa
exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.userGlobal = req.session;//guardado a sessão na variavel global user
    next()
}
/* checa token */
exports.checkCsrfError = (err, req, res, next) => {
    if (err /* && err.code === 'EBADCSRFTOKEN' */) {
        /*return res.send('BAD CSRF')// é melhor rederizar uma pagina(404 por ex) mas por agora n precisa*/
        console.log('VERIFICOU TOKEN...');
        return res.render('404')
    }
    next()
}
/* criando token */
exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}

// conferir a sequencia dessa função (loginRequired) em routes
exports.loginRequired = (req, res, next) => {
    
    /* console.log(res.locals.user); */
    /* console.log(req.session); */
    // se usuário n estiver logado
    if (!res.locals.userGlobal.user) {
        req.flash('errors', 'Voce precisa fazer login primeiro')
        //quem n estiver logado e estiver tentando acessar a pagina de cadastrar contatos -> é redirecionado pela funçaõ de callback dentro de req.session.save(aqui)
        req.session.save(() => res.redirect('/'))
        return
    }
    // se usuário estiver logado (sai/n passa do if) exibe a pagina -> sequencia
    next()
}
