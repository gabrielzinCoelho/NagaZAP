'use strict'

const Env = use('Env')
const axios = require('axios')

const User = use('App/Models/User')

const apiTelegram = axios.create({
  baseURL: 'https://api.telegram.org/bot1727122836:AAEzMtWNhLQZBPafciCqySIJ1qiP_4Y3AaY'
})

class TelegramController {

  async telegramUpdates({ request, response }) {

    try {

      const tokenBot = Env.get('TOKEN_BOT')

      if (tokenBot != request.params.tokenBot)
        throw "Token inválido."

      const updateData = request.body

      if(updateData.channel_post)
        throw "O bot atende apenas chats privados."


      if (updateData.message.text == "/code") {

        const dataMessageKeyboard = await apiTelegram.post(`/sendMessage`, {
          chat_id: updateData.message.chat.id,
          text: "Informe seu número de celular para receber um código de acesso.",
          reply_markup: {
            keyboard: [[{
              text: "Número de telefone: ",
              request_contact: true
            }]],
            one_time_keyboard: true
          }
        })

        return response.status(200).json({
          success: "Aguardando número de telefone."
        })

      }

      if (updateData.message.contact) {


       const securityCode = Math.random().toString().slice(2,10);

       await User.create({
          name: `${updateData.message.contact.first_name}${updateData.message.contact.last_name ?
            (' ' + updateData.message.contact.last_name) : ''}`,
          phoneNumber: updateData.message.contact.phone_number.slice(1),
          isValid: false,
          securityCode,
          securityCode_created_at: new Date()
       })

        const dataMessageSecurityCode = await apiTelegram.post('/sendMessage', {
          chat_id: updateData.message.chat.id,
          text: `Seu código de verificação é ${securityCode}.`
        })

        debugger

        return response.status(200).json({
          securityCode
        })

      }

      throw "Evento não reconhecido."

    }catch (error) {
      return response.status(200).json({
        error
      })
    }

  }

}

module.exports = TelegramController
