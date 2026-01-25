'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { status: 'Online' }
})

Route.resource('usuarios', 'UsuarioController').apiOnly() //Cria sem as rotas de view
//Route.resource('usuarios', 'UsuarioController') //Faz o mesmo que criar as 5 rotas abaixo mais 2 de view
/*Route.get('/usuarios', 'UsuarioController.index')
Route.get('/usuarios/:id', 'UsuarioController.show')
Route.post('/usuarios', 'UsuarioController.store')
Route.put('/usuarios/:id', 'UsuarioController.update')
Route.delete('/usuarios/:id', 'UsuarioController.destroy')*/

Route.resource('mensagens', 'MensagemController').apiOnly()

Route.get('/getUsuarioByCredentials', 'UsuarioController.getUsuarioByCredentials')
Route.get('/getMensagensEntreUsuarios', 'MensagemController.getMensagensEntreUsuarios')