const express = require('express');
const route = express.Router();

// Controlllers
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const empresaController = require('./src/controllers/empresaController');
const colaboradorController = require('./src/controllers/colaboradorController');

const { loginRequired } = require('./src/middlewares/middleware')

// Rotas da home
route.get('/', homeController.index );

// Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//Rotas de empresa
route.get('/empresa/empresas', loginRequired, empresaController.empresas);
route.get('/empresa/index', loginRequired, empresaController.index);
route.post('/empresa/register', loginRequired, empresaController.register);
route.get('/empresa/view/:id', loginRequired, empresaController.view);
route.get('/empresa/index/:id', loginRequired, empresaController.editIndex);
route.post('/empresa/edit/:id', loginRequired, empresaController.edit);
route.get('/empresa/delete/:id', loginRequired, empresaController.delete);

//Rotas de colaboradores
route.get('/colaborador/empresas', loginRequired, colaboradorController.empresas);
route.get('/colaborador/view/:id', loginRequired, colaboradorController.view);
route.get('/colaborador/selecao-colaborador/:id', loginRequired, colaboradorController.colaboradores);
route.get('/colaborador/cadastro/:id', loginRequired, colaboradorController.index);
route.get('/colaborador/index/:id', loginRequired, colaboradorController.editIndex);
route.post('/colaborador/edit/:id', loginRequired, colaboradorController.edit);
route.post('/colaborador/register/:id', loginRequired, colaboradorController.register);
route.get('/colaborador/delete/:id', loginRequired, colaboradorController.delete);

module.exports = route;