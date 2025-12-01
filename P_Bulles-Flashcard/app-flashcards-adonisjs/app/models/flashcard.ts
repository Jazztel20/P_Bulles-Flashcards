import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Deck from '#models/deck'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Flashcard extends BaseModel {
  public static table = 't_flashcard'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare question: string

  @column()
  declare answer: string

  @column()
  declare deckId: number

  @column()
  declare position: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>
}
