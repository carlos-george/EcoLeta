import Knex from 'knex';

export async function up(knex: Knex) {

    return knex.schema.createTable('items', table => {
        table.increments('id_item').primary();
        table.string('titulo').notNullable();
        table.string('image').notNullable();
        
    });
}

export async function down(knex: Knex) {

    return knex.schema.dropTable('items');

}