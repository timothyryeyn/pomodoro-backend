import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TasksController {
  public async index({ auth, response }: HttpContextContract) {
    const user = auth.user

    const tasks = await user
      ?.related('tasks')
      .query()
      .withAggregate('pomodoros', (q) => {
        q.where({ isFinished: true }).count('*').as('finished_pomodoros')
      })
      .withCount('pomodoros')

    console.log(tasks)

    if (!tasks) return response.notFound()

    return response.ok({ tasks })
  }

  public async store({ request, auth }: HttpContextContract) {
    const { title, description } = request.body()

    return await auth.user?.related('tasks').create({ title, description })
  }

  public async show({ params, auth, response }: HttpContextContract) {
    const { id } = params

    const task = await auth.user
      ?.related('tasks')
      .query()
      .withAggregate('pomodoros', (q) => {
        q.where({ isFinished: true }).sum('length_in_minutes').as('minutes_spent')
      })
      .withAggregate('pomodoros', (q) => {
        q.where({ isFinished: true }).count('*').as('finished_pomodoros')
      })
      .withCount('pomodoros')
      .where('id', id)
      .first()

    if (!task) return response.notFound()

    return response.ok({ task })
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { id } = params

    const { title, description } = request.body()

    const todo = await auth.user?.related('tasks').query().where('id', id).first()

    await todo?.merge({ title, description }).save()
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const { id } = params

    const todo = await auth.user?.related('tasks').query().where('id', id).first()

    return await todo?.delete()
  }
}
