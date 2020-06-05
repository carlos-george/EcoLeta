import Knex from 'knex';

export async function seed(knex: Knex) {

  await knex('items').insert([
        { titulo: 'Lâmpadas', image: 'lampadas.svg' },
        { titulo: 'Pilhas e Baterias', image: 'baterias.svg' },
        { titulo: 'Resíduos Eletrônico', image: 'eletronicos.svg' },
        { titulo: 'Óleo de Cozinha', image: 'oleo.svg' },
        { titulo: 'Resíduos Orgânicos', image: 'organicos.svg' },
        { titulo: 'Papéis e Papelão', image: 'papeis-papelao.svg' }
    ]);
}