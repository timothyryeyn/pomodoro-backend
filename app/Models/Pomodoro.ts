import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'

export default class Pomodoro extends BaseModel {
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
