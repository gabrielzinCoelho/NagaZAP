'use strict'

const Hash = use('Hash')

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    name: faker.username(),
    phoneNumber: faker.string({
      length: 13,
      alpha: false,
      numeric: true
    }),
    password: await Hash.make(faker.password()),
    isValid: true,
    securityCode: faker.string({
      length: 8,
      alpha: false,
      numeric: true
    }),
    securityCode_created_at: new Date(),
    ...data
  }
})
