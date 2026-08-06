exports.up = async function (knex) {
  await knex.schema.alterTable('expenses', (table) => {
    table.enum('calculation_type', ['equal', 'split','percentage']).notNullable().defaultTo('equal');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('expenses', (table) => {
    table.dropColumn('calculation_type');
  });
};
