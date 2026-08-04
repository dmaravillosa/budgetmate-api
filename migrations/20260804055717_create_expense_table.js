exports.up = async function (knex) {
  await knex.schema.createTable('expenses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('value').notNullable();
    table.integer('created_by').unsigned().references('users.id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('expenses');
};
