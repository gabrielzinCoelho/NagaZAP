'use strict'

class SessionController {

  async store({request, response, auth}){

    const {phoneNumber, password} = request.only(['phoneNumber', 'password'])

    const {token} = await auth.attempt(phoneNumber, password)

    return (token ? response.status(200).json({token}) : response.status(401).json({
      error: "Invalid credentials."
    }))

  }


}

module.exports = SessionController
