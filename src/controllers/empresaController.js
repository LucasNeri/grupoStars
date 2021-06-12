const Empresa = require('../models/EmpresaModel')
const Colaborador = require('../models/ColaboradorModel')

exports.index = (req, res) => {
    res.render('empresa/cadastrar-empresa', {
        empresa: {}
    });
}

exports.empresas = async(req, res) => {
    const empresas = await Empresa.buscaEmpresas();
    res.render('empresa/empresas', { empresas });
};

exports.view = async function(req, res) {
    if(!req.params.id) return res.render('404');
    
    const colaboradores = await Colaborador.buscaColaboradores();
    const empresa = await Empresa.buscaPorId(req.params.id)

    const colaboradoresFiltrados = await Colaborador.filtraColaboradores(colaboradores, empresa);

    if(!empresa) return res.render('404');

    res.render('empresa/empresa-view', { empresa, colaboradoresFiltrados })
};

// Separei as verificações de cadastro de empresa pois se desejarem retirar fica mais fácil
exports.register = async (req, res) => {
    const empresas = await Empresa.buscaEmpresas();
    
    const vereditocnpj = await Empresa.filtraEmpresasPorCnpj(empresas, req.body.cnpj);
    const vereditoemail = await Empresa.filtraEmpresasPorEmail(empresas, req.body.email);
    const vereditocodigo = await Empresa.filtraEmpresasPorCodigo(empresas, req.body.codigo);
    const vereditonome = await Empresa.filtraEmpresasPorNome(empresas, req.body.nome);

    if (vereditocnpj.length > 0) {
        req.flash('errors', `O CNPJ informado já foi cadastrado por ${vereditocnpj[0].nome}!`);
        req.session.save(() => res.redirect('/empresa/index'));
        return;
    } else if (vereditoemail.length > 0) {
        req.flash('errors', `O Email informado já foi cadastrado por ${vereditoemail[0].nome}!`);
        req.session.save(() => res.redirect('/empresa/index'));
        return;
    } else if (vereditocodigo.length > 0) {
        req.flash('errors', `O Código informado já foi cadastrado por ${vereditocodigo[0].nome}!`);
        req.session.save(() => res.redirect('/empresa/index'));
        return;
    } else if (vereditonome.length > 0) {
        req.flash('errors', `O Nome informado já foi cadastrado por ${vereditonome[0].nome}!`);
        req.session.save(() => res.redirect('/empresa/index'));
        return;
    }

    try {
        const empresa = new Empresa(req.body);
        await empresa.register();

        if(empresa.errors.length > 0) {
            req.flash('errors', empresa.errors);
            req.session.save(() => res.redirect('/empresa/index'));
            return;
        }

        req.flash('success', 'Empresa registrada com sucesso');
        req.session.save(() => res.redirect('/empresa/empresas'));
        return;
    } catch (e){
        console.log(e);
        return res.render('404');
    }
};

exports.validaCnpj = async function(req, res) {
    const empresas = await Empresa.buscaEmpresas();

}

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404');
    
    const empresa = await Empresa.buscaPorId(req.params.id)
    if(!empresa) return res.render('404');

    res.render('empresa/cadastrar-empresa', { empresa })
};

exports.edit = async function(req, res) {
    const empresas = await Empresa.buscaEmpresas();
    const vereditocnpj = await Empresa.filtraEmpresasPorCnpj(empresas, req.body.cnpj);
    const vereditoemail = await Empresa.filtraEmpresasPorEmail(empresas, req.body.email);
    const vereditocodigo = await Empresa.filtraEmpresasPorCodigo(empresas, req.body.codigo);
    const vereditonome = await Empresa.filtraEmpresasPorNome(empresas, req.body.nome);
    
    const propria = await Empresa.buscaPorId(req.params.id)

    if (vereditocnpj.length > 0) {
        if (vereditocnpj[0].cnpj != propria.cnpj) {
            req.flash('errors', `O CNPJ informado já foi cadastrado por ${vereditocnpj[0].nome}!`);
            req.session.save(() => res.redirect(`/empresa/index/${req.params.id}`));
            return;
        }
    }
    
    if (vereditoemail.length > 0) {
        if (vereditoemail[0].email != propria.email) {
            req.flash('errors', `O Email informado já foi cadastrado por ${vereditoemail[0].nome}!`);
            req.session.save(() => res.redirect(`/empresa/index/${req.params.id}`));
            return;
        }
    }
    
    if (vereditocodigo.length > 0) {
        if (vereditocodigo[0].codigo != propria.codigo) {
            req.flash('errors', `O Codigo informado já foi cadastrado por ${vereditocodigo[0].nome}!`);
            req.session.save(() => res.redirect(`/empresa/index/${req.params.id}`));
            return;
        }
    }

    if (vereditonome.length > 0) {
        if (vereditonome[0].nome != propria.nome) {
            req.flash('errors', `O Nome informado já foi cadastrado por ${vereditonome[0].nome}!`);
            req.session.save(() => res.redirect(`/empresa/index/${req.params.id}`));
            return;
        }
    }

    try {
        if(!req.params.id) return res.render('404');
        const empresa = new Empresa(req.body);
        await empresa.edit(req.params.id);

        if(empresa.errors.length > 0) {
            req.flash('errors', empresa.errors);
            req.session.save(() => res.redirect('/empresa/empresas'));
            return;
        }

        req.flash('success', 'Empresa editada com sucesso');
        req.session.save(() => res.redirect(`/empresa/view/${empresa.empresa._id}`));
        return;
    } catch(e) {
        console.log(e);
        res.render('404')
    }
};

exports.delete = async function(req, res) {
    if(!req.params.id) return res.render('404');

    const apagado = await Colaborador.apagarFiltrados(req.params.id);
    if(!apagado) return res.render('404');

    const empresa = await Empresa.delete(req.params.id)
    if(!empresa) return res.render('404');

    req.flash('success', 'Empresa apagada.');
    req.session.save(() => res.redirect(`/empresa/empresas/`));
    return;
};