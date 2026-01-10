'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mensagem extends Model {

    static table = 'mensagens'

}

module.exports = Mensagem
