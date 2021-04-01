'use strict'

const { test, trait } = use('Test/Suite')('Validate Security Code Register User')

trait('Test/ApiClient')
trait('DatabaseTransactions')

const Env = use('Env')
const User = use('App/Models/User')

test(`um usuário deve ser cadastrado com o campo "isValid" setado como false e um número e código de segurança
      associado a ele`, async ({ assert, client }) => {

  const tokenBot = Env.get('TOKEN_BOT')

  const responseData = await client.post(`/telegramUpdates/${tokenBot}`).send({
    "update_id": 748245683,
    "message": {
      "message_id": 81,
      "from": {
        "id": 1056384222,
        "is_bot": false,
        "first_name": "Gabriel",
        "last_name": "Coelho Costa",
        "language_code": "pt-br"
      },
      "chat": {
        "id": 1056384222,
        "first_name": "Gabriel",
        "last_name": "Coelho Costa",
        "type": "private"
      },
      "date": 1617223770,
      "reply_to_message": {
        "message_id": 80,
        "from": {
          "id": 1727122836,
          "is_bot": true,
          "first_name": "@NagaZAP_BOT",
          "username": "NagazapBot"
        },
        "chat": {
          "id": 1056384222,
          "first_name": "Gabriel",
          "last_name": "Coelho Costa",
          "type": "private"
        },
        "date": 1617223750,
        "text": "Informe seu número de celular para receber um código de acesso."
      },
      "contact": {
        "phone_number": "+5537991096605",
        "first_name": "Gabriel",
        "last_name": "Coelho Costa",
        "user_id": 1056384222
      }
    }
  }).end()

  const userRegister = await User.query().where({
    name: "Gabriel Coelho Costa",
    phoneNumber: '5537991096605',
    securityCode: responseData.body.securityCode,
    isValid: false
  }).fetch()

  assert.exists(userRegister.rows[0])


})
