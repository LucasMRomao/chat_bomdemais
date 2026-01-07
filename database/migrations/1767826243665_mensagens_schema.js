'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MensagensSchema extends Schema {
  up () {
    this.create('mensagens', (table) => {
      table.increments()
      table.integer('id_usuario_envia').unsigned().references('id').inTable('usuarios')
      table.integer('id_usuario_recebe').unsigned().references('id').inTable('usuarios')
      table.string('mensagem', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('mensagens')
  }
}

module.exports = MensagensSchema
