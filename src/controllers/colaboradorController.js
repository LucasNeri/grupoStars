const Colaborador = require('../models/ColaboradorModel')
const Empresa = require('../models/EmpresaModel')

exports.index = async(req, res) => {
    const empresa = await Empresa.buscaPorId(req.params.id)
    res.render('colaborador/cadastrar-colaborador', {
        empresa,
        colaborador: {}
    });
}

exports.empresas = async(req, res) => {
    const empresas = await Empresa.buscaEmpresas();
    res.render('colaborador/selecao-empresa', { empresas });
};

exports.view = async function(req, res) {
    if(!req.params.id) return res.render('404');

    const colaborador = await Colaborador.buscaPorId(req.params.id)
    const empresa = await Empresa.buscaPorId(colaborador.empresa_id)
    if(!colaborador) return res.render('404');

    res.render('colaborador/colaborador-view', { colaborador, empresa })
};

exports.colaboradores = async function(req, res) { 
    if(!req.params.id) return res.render('404');
    
    const colaboradores = await Colaborador.buscaColaboradores();
    const empresa = await Empresa.buscaPorId(req.params.id)
    
    const colaboradoresFiltrados = await Colaborador.filtraColaboradores(colaboradores, empresa);

    if(!colaboradoresFiltrados) return res.render('404');
    if(!empresa) return res.render('404');

    res.render('colaborador/selecao-colaborador', { colaboradoresFiltrados, empresa })
};

exports.register = async (req, res) => {
    const colaboradores = await Colaborador.buscaColaboradores();
    
    const vereditocpf = await Colaborador.filtraColaboradoresPorCpf(colaboradores, req.body.cpf);
    const vereditoemail = await Colaborador.filtraColaboradoresPorEmail(colaboradores, req.body.email);
    const vereditocodigo = await Colaborador.filtraColaboradoresPorCodigo(colaboradores, req.body.codigo);

    if (vereditocpf.length > 0) {
        req.flash('errors', `O CPF informado já foi cadastrado por ${vereditocpf[0].nome}!`);
        req.session.save(() => res.redirect(`/colaborador/cadastro/${ req.params.id }`));
        return;
    } else if (vereditoemail.length > 0) {
        req.flash('errors', `O Email informado já foi registrado por ${vereditoemail[0].nome}!`);
        req.session.save(() => res.redirect(`/colaborador/cadastro/${ req.params.id }`));
        return;
    } else if (vereditocodigo.length > 0) {
        req.flash('errors', `O Código informado já foi registrado por ${vereditocodigo[0].nome}!`);
        req.session.save(() => res.redirect(`/colaborador/cadastro/${ req.params.id }`));
        return;
    }

    try {
        const colaborador = new Colaborador(req.body);
        await colaborador.register();

        if(colaborador.errors.length > 0) {
            req.flash('errors', colaborador.errors);
            req.session.save(() => res.redirect(`/colaborador/cadastro/${ req.params.id }`));
            return;
        }
        
        req.flash('success', 'Colaborador registrado com sucesso');
        req.session.save(() => res.redirect(`/colaborador/selecao-colaborador/${ req.params.id }`));
        return;
    } catch (e){
        console.log(e);
        return res.render('404');
    }
};

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404');
    
    const colaborador = await Colaborador.buscaPorId(req.params.id)
    if(!colaborador) return res.render('404');

    res.render('colaborador/cadastrar-colaborador', { colaborador })
};

exports.edit = async function(req, res) {
    const colaboradores = await Colaborador.buscaColaboradores();
    const vereditocpf = await Colaborador.filtraColaboradoresPorCpf(colaboradores, req.body.cpf);
    const vereditoemail = await Colaborador.filtraColaboradoresPorEmail(colaboradores, req.body.email);
    const vereditocodigo = await Colaborador.filtraColaboradoresPorCodigo(colaboradores, req.body.codigo);

    const proprio = await Colaborador.buscaPorId(req.params.id)

    if (vereditocpf.length > 0) {
        if (vereditocpf[0].cpf != proprio.cpf) {
            req.flash('errors', `O CPF informado já foi cadastrado por ${vereditocpf[0].nome}!`);
            req.session.save(() => res.redirect(`/colaborador/index/${req.params.id}`));
            return;
        }
    } else if (vereditoemail.length > 0) {
        if (vereditoemail[0].email != proprio.email) {
            req.flash('errors', `O Email informado já foi cadastrado por ${vereditoemail[0].nome}!`);
            req.session.save(() => res.redirect(`/colaborador/index/${req.params.id}`));
            return;
        }
    } else if (vereditocodigo.length > 0) {
        if (vereditocodigo[0].codigo != proprio.codigo) {
            req.flash('errors', `O Codigo informado já foi cadastrado por ${vereditocodigo[0].nome}!`);
            req.session.save(() => res.redirect(`/colaborador/index/${req.params.id}`));
            return;
        }
    }

    try {
        if(!req.params.id) return res.render('404');
        const colaborador = new Colaborador(req.body);
        await colaborador.edit(req.params.id);

        if(colaborador.errors.length > 0) {
            req.flash('errors', colaborador.errors);
            req.session.save(() => res.redirect(`/colaborador/index/${req.params.id}`));
            return;
        }

        req.flash('success', 'Colaborador editado com sucesso');
        req.session.save(() => res.redirect(`/colaborador/view/${colaborador.colaborador._id}`));
        return;
    } catch(e) {
        console.log(e);
        res.render('404')
    }
};

exports.delete = async function(req, res) {
    if(!req.params.id) return res.render('404');
    
    const empresa = await Colaborador.buscaPorEmpresa(req.params.id) 

    const colaborador = await Colaborador.delete(req.params.id)
    if(!colaborador) return res.render('404');

    req.flash('success', 'Colaborador apagado.');
    req.session.save(() => res.redirect(`/colaborador/selecao-colaborador/${ empresa }`));
    return;
};