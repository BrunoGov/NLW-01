import Knex from 'knex';

export async function up(knex: Knex){
    //CRIAR TABELA DO BANCO DE DADOS
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    });
}

export async function down(knex: Knex){
    //VOLTAR ATRAS (DELETE O QUE FOI CRIADO NO UP)
    return knex.schema.dropTable('point_items');
}