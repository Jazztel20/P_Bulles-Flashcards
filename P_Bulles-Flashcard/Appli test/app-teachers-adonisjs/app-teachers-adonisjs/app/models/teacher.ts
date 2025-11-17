import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Section from './section.js'

export default class Teacher extends BaseModel {
  // renommer le nom de la table pour respecter les conventions de nommage de l'ETML

  public static table = 't_teacher'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gender: String

  @column()
  declare firstname: String

  @column()
  declare lastname: String

  @column()
  declare nickname: String

  @column()
  declare origine: String

  @column()
  declare sectionId: number // colonne correspondant à la clé étrangère

  @belongsTo(() => Section)
  public section: ReturnType<typeof belongsTo> // Relation vers le modèle Section

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
