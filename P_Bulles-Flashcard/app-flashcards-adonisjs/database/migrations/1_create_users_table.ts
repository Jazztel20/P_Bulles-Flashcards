import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 't_user' // 👈 important

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().notNullable()
      table.string('username').notNullable()
      table.string('password').notNullable()
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
