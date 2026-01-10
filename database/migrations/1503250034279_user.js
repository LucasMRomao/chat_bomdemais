'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {

  up () {
    this.create('usuarios', (table) => {
      table.increments()
      table.string('usuario', 80).notNullable().unique()
      table.string('nome', 254).notNullable()
      table.string('senha', 33).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios')
  }
}

module.exports = UserSchema
