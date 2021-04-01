'use strict'

const { test, trait } = use('Test/Suite')('Register User Using Security Code')

trait('Test/ApiClient')
trait('DatabaseTransactions')

const User = use('App/Models/User')
const Factory = use('Factory')
const Hash = use('Hash')
const moment = require('moment')

test('um usuário deve conseguir se registrar utilizando um código de segurança válido',
  async ({ assert, client }) => {

    const userCreated = await Factory.model('App/Models/User').create({
      name: null,
      isValid: false,
      password: null,
      securityCode_created_at: moment().subtract(0.5, 'hours').toDate()
    })

    const { id: user_id, securityCode } = userCreated.toJSON()

    const updatePayload = {
      name: "Gabriel Coelho Costa",
      password: "senha123",
      file_id: 1,
      statusMessage: "Opa, fala comigo!"
    }

    const response = await client.put('/user').send({
      user_id,
      securityCode,
      ...updatePayload
    }).end()

    const userInstance = await User.find(user_id)

    response.assertStatus(200)
    assert.include(userInstance.toJSON(), {
      isValid: 1,
      securityCode: null,
      securityCode_created_at: null,
      name: updatePayload.name,
      file_id: updatePayload.file_id,
      statusMessage: updatePayload.statusMessage
    })

    assert.equal(true, await Hash.verify(updatePayload.password, userInstance.toJSON().password))




  })
