'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateUserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string("name").notNullable()
      table.string("phoneNumber").notNullable().unique()
      table.string("password").notNullable()
      table.integer("file_id")
      table.string("statusMessage")
      table.string("token")
      table.string("token_created_at")
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = CreateUserSchema
