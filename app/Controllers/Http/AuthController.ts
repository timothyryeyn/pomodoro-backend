import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    console.log('foo')

    try {
      const token = await auth.use('api').attempt(email, password)
      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
  public async register({ request, auth }: HttpContextContract) {
    //Throws error if fields are missing
    const email = request.input('email')
    const password = request.input('password')

    const newUser = await User.create({ email, password })

    const token = await auth.use('api').login(newUser, {
      expiresIn: '10 days',
    })
    return token.toJSON()
  }
  public async logout({ auth }: HttpContextContract) {
    return auth.logout()
  }
}
