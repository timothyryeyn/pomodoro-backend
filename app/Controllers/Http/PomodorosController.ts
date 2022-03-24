import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PomodorosController {
  public async index({ params, auth, request, response }: HttpContextContract) {
    const { task_id } = params

    const task = await auth.user
      ?.related('tasks')
      .query()
      .preload('pomodoros', (pQuery) => {
        pQuery.withScopes((scopes) => scopes.finishedOnly(request.qs()))
      })
      .where('id', task_id)
      .first()

    const pomodoros = task?.pomodoros

    if (!pomodoros) return response.notFound()

    return response.ok({ pomodoros })
  }

  public async store({ params, request, auth }: HttpContextContract) {
    const { task_id } = params

    const { pomodoro_count, pomodoro_length } = request.body()

    const task = await auth.user
      ?.related('tasks')
      .query()
      .preload('pomodoros')
      .where('id', task_id)
      .first()

    type Pomodoro = {
      lengthInMinutes: number
      isFinished: boolean
    }

    let pomodoros: Pomodoro[] = []

    let lengthInMinutes = pomodoro_length

    let isFinished = false

    for (let i = 0; i < pomodoro_count; i++) {
      pomodoros.push({ lengthInMinutes, isFinished })
    }

    return await task?.related('pomodoros').createMany(pomodoros)
  }

  public async show({ params, auth }: HttpContextContract) {
    const { task_id, id } = params

    const task = await auth.user
      ?.related('tasks')
      .query()
      .preload('pomodoros', (pomodorosQuery) => {
        pomodorosQuery.where('id', id)
      })
      .where('id', task_id)
      .first()

    return task?.pomodoros[0]
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const { task_id, id } = params

    const lengthInMinutes = request.input('length_in_minutes')

    const isFinished = request.input('is_finished')

    const task = await auth.user
      ?.related('tasks')
      .query()
      .preload('pomodoros', (pomodorosQuery) => {
        pomodorosQuery.where('id', id)
      })
      .where('id', task_id)
      .first()

    return task?.pomodoros[0]?.merge({ lengthInMinutes, isFinished })?.save()
  }

  public async destroy({ params, auth }: HttpContextContract) {
    const { task_id, id } = params

    const task = await auth.user
      ?.related('tasks')
      .query()
      .preload('pomodoros', (pomodorosQuery) => {
        pomodorosQuery.where('id', id)
      })
      .where('id', task_id)
      .first()

    task?.pomodoros[0]?.delete()
  }
}
