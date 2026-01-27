'use strict'

const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {

  static table = 'usuarios'

  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  static async getUsuarioByCredentials(data){
    return Database.raw(`(SELECT * FROM usuarios WHERE usuario = '${data.usuario}' AND SENHA = '${data.senha}')`)
  }

  static async resetarSenhaUsuario(data){
    return Database.raw(`UPDATE usuarios SET senha = '12345' WHERE id = '${data.id_usuario}'`)
  }
}

module.exports = User
