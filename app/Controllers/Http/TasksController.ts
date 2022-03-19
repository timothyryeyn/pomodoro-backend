import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TasksController {
  public async index({ auth }: HttpContextContract) {
    const user = auth.user

    await user?.load('tasks')

    return user?.tasks
  }

  public async store({ request, auth }: HttpContextContract) {
    const { title, description } = request.body()

    await auth.user?.related('tasks').create({ title, description })
  }

  public async show({ params, auth }: HttpContextContract) {
    const { id } = params

    const todo = await auth.user?.related('tasks').query().where('id', id).first()

    return todo
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { id } = params

    const { title, description } = request.body()

    const todo = await auth.user?.related('tasks').query().where('id', id).first()

    await todo?.merge({ title, description }).save()
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const { id } = params

    //

    const todo = await auth.user?.related('tasks').query().where('id', id).first()

    return await todo?.delete()
  }
}
