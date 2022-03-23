import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ auth }: HttpContextContract) {
    return { user: auth.user }
  }
}
