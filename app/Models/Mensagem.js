'use strict'

const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mensagem extends Model {

    static table = 'mensagens'

    static async getMensagensEntreUsuarios(data){
        return Database.raw(`(SELECT * from mensagens 
            WHERE 
                (id_usuario_envia = '${data.usuario1}' and id_usuario_recebe = '${data.usuario2}')
            OR
                (id_usuario_envia = '${data.usuario2}' and id_usuario_recebe = '${data.usuario1}'))
            ORDER BY updated_at`)
    }

}

module.exports = Mensagem
