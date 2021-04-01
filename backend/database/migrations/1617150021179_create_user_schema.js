'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateUserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string("name")
      table.string("phoneNumber").notNullable().unique()
      table.string("password")
      table.integer("file_id")
      table.string("statusMessage")
      table.boolean("isValid").notNullable()
      table.string("securityCode").unique()
      table.string("securityCode_created_at")
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = CreateUserSchema
