exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('google_id').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('display_name').notNullable();
    table.string('provider').notNullable();
    table.string('avatar_url').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
};
