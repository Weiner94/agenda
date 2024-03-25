const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    })

}
exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body)
        await contato.register()

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            //quem n estiver logado e estiver tentando acessar a pagina de cadastrar contatos -> é redirecionado pela funçaõ de callback dentro de req.session.save(aqui)
            req.session.save(() => res.redirect('index'))//index do contato->não o principal
            return
        }
        req.flash('success', 'Contato registrado com sucesso')
        req.session.save(() => res.redirect(`index/${contato.contato.id}`))//index do contato->não o principal
        return
    } catch (e) {
        console.log('ERRO DENTRO DE exports.register-Contato(req.body) retornou erro ou alguma rota com problema', e);
        return res.render('404')
    }
}

//exibindo dados do contato na tela - res.render -> id
exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404')//404 se nao tiver id em params.id
    const contato = await Contato.buscaPorId(req.params.id)
    if (!contato) return res.render('404')
    res.render('contato', { contato })
}
//editando e salvando a edição -> post -> edit/save
exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const contatoEdit = new Contato(req.body);
        await contatoEdit.edit(req.params.id);

        if (contatoEdit.errors.length > 0) {
            req.flash('errors', contatoEdit.errors)
            //quem n estiver logado e estiver tentando acessar a pagina de cadastrar contatos -> é redirecionado pela funçaõ de callback dentro de req.session.save(aqui)
            req.session.save(() => res.redirect('/contato/index/'))//index do contato->não o principal
            return
        }
        req.flash('success', 'Contato editado com sucesso')
        req.session.save(() => res.redirect(`/contato/index/${contatoEdit.contato.id}`))//index do contato->não o principal
        return
    } catch (e) {
        console.log('erro EDIT DO CONTROLLEr -------   ', e);
        res.render('404')

    }
}

exports.delete = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404')//404 se nao tiver id em params.id
        console.log(req.params.id);
        const contatoDelete = await Contato.delete(req.params.id)//deletando usuario com id por referencia      

        if (!contatoDelete) return res.render('404')// se usuário nao existe com id passado -> retorna erro render 404

        req.flash('success', 'Contato DELETADO com sucesso')
        req.session.save(() => res.redirect(`/`))//index do contato->não o principal
        return
    } catch (e) {
        console.log('erro DELETE DO CONTROLLER -------   ', e);
        res.render('404')

    }
}

