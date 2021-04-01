'use strict'

const { test, trait } = use('Test/Suite')('Create Session')

trait('Test/ApiClient')
trait('DatabaseTransactions')

const User = use('App/Models/User')
const Factory = use('Factory')

test('um token JWT deve ser retornado ao serem inseridas credenciais válidas (phone_number e password)',
  async ({ assert, client }) => {

    const sessionPayload = {
      phoneNumber: "5537991096605",
      password: "senha123"
    }

    const userCreated = await Factory.model('App/Models/User').create(sessionPayload)

    const response = await client.post('/sessions').send(sessionPayload).end()

    response.assertStatus(200)
    assert.exists(response.body.token)

  })
