'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')

const moment = require('moment')

class UserController {

  async updateByCode({ request, response }) {

    try {

      const { user_id, securityCode } = request.body

      const userInstance = await User.findOrFail(user_id)

      const {securityCode : securityCodeInstance, securityCode_created_at} = userInstance.toJSON()

      if(securityCode != securityCodeInstance)
        throw "Código de acesso não compatível com usuário referenciado."

      const codeExpired = moment().subtract(1, 'hours').isAfter(new Date(parseInt(securityCode_created_at)))

      if(codeExpired)
        throw "O código de segurança foi expirado. Obtenha um novo código válido e repita o processo."

      const updateFields = ['name', 'password', 'file_id', 'statusMessage']

      const emptyFields = []

      for (let field of updateFields)
        if (!field in request.body)
          emptyFields.push(field)

      if (emptyFields.length)
        return response.status(406).json({
          error: `Os campos a seguir precisam ser preenchidos: ${emptyFields}`
        })

      const userUpdated = await User.query().where({
        id: user_id
      }).update({
        name: request.body.name,
        password: await Hash.make(request.body.password),
        file_id: request.body.file_id,
        statusMessage: request.body.statusMessage,
        isValid: true,
        securityCode: null,
        securityCode_created_at: null
      })

      if (!userUpdated)
        throw "Houve um erro na atualização dos dados do usuário."

      return response.status(200).json({
        success: "Os dados do usuário foram atualizados com sucesso."
      })

    } catch (error) {

      return response.status(401).json({
        error
      })

    }

  }

}

module.exports = UserController
