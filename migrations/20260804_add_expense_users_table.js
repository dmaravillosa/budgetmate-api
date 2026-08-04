exports.up = async function (knex) {
  await knex.schema.createTable('expense_users', (table) => {
    table.increments('id').primary();
    table.integer('expense_id').unsigned().notNullable().references('id').inTable('expenses').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['expense_id', 'user_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('expense_users');
};
