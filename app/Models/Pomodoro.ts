import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'

export default class Pomodoro extends BaseModel {
  public static finishedOnly = scope((q, qs) => {
    const { onlyFinished } = qs

    if (!onlyFinished) {
      return
    }

    switch (onlyFinished) {
      case 'true':
        q.where('is_finished', 1)
        break
      case 'false':
        q.where('is_finished', 0)
        break
    }
  })

  @column({ isPrimary: true })
  public id: number

  @column()
  public lengthInMinutes: number

  @column()
  public isFinished: boolean

  @column()
  public taskId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Task)
  public user: BelongsTo<typeof Task>
}
