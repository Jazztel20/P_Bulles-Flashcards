import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_flashcard'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.text('question').notNullable()
      table.text('answer').notNullable()

      table
        .integer('deck_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('t_deck')
        .onDelete('CASCADE')

      table.integer('position').unsigned().nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
