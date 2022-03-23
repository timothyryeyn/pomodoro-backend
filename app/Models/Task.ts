import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Pomodoro from './Pomodoro'

export default class Task extends BaseModel {
  public serializeExtras() {
    return {
      pomodoros_stats: {
        minutes_spent: this.$extras.minutes_spent ?? 0,
        finished: this.$extras.finished_pomodoros,
        total: this.$extras.pomodoros_count,
      },
    }
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Pomodoro)
  public pomodoros: HasMany<typeof Pomodoro>
}
