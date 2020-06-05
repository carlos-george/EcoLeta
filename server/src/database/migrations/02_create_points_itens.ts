import Knex from 'knex';

export async function up(knex: Knex) {

    return knex.schema.createTable('points_items', table => {
        table.increments('id_point_item').primary();

        table.integer('id_point')
            .notNullable()
            .references('id_point')
            .inTable('points');

        table.integer('id_item')
            .notNullable()
            .references('id_item')
            .inTable('items');
        
    });
}

export async function down(knex: Knex) {

    return knex.schema.dropTable('points_items');

}