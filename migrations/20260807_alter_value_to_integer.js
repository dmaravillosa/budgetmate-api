exports.up = async function (knex) {
  // Change `expenses.value` from string to integer cents
  await knex.schema.alterTable('expenses', (table) => {
    table.integer('value').notNullable().defaultTo(0).alter();
  });

  // Change `expense_splits.split_value` from string to integer cents
  await knex.schema.alterTable('expense_splits', (table) => {
    table.integer('split_value').notNullable().defaultTo(0).alter();
  });
};

exports.down = async function (knex) {
  // Revert `expenses.value` back to string
  await knex.schema.alterTable('expenses', (table) => {
    table.string('value').notNullable().alter();
  });

  // Revert `expense_splits.split_value` back to string
  await knex.schema.alterTable('expense_splits', (table) => {
    table.string('split_value').notNullable().alter();
  });
};
