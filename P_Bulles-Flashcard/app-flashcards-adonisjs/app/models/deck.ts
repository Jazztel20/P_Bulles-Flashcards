import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Flashcard from '#models/flashcard'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Deck extends BaseModel {
  public static table = 't_deck'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare isPublished: boolean

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Flashcard)
  declare flashcards: HasMany<typeof Flashcard>
}
