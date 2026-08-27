import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BudgetMate API',
      version: '1.0.0',
      description: 'BudgetMate backend API definition for Postman and client integrations.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Expense: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            value: { type: 'integer' },
            calculation_type: {
              type: 'string',
              enum: ['equal', 'split', 'percentage'],
            },
            created_by: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'value', 'calculation_type', 'created_by', 'created_at', 'updated_at'],
        },
        ExpenseCreate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'integer' },
            calculation_type: {
              type: 'string',
              enum: ['equal', 'split', 'percentage'],
            },
            created_by: { type: 'integer' },
          },
          required: ['name', 'value', 'created_by'],
        },
        ExpenseUser: {
          type: 'object',
          properties: {
            expense_id: { type: 'integer' },
            user_id: { type: 'integer' },
          },
          required: ['expense_id', 'user_id'],
        },
        ExpenseSplit: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            expense_id: { type: 'integer' },
            user_id: { type: 'integer' },
            split_value: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'expense_id', 'user_id', 'split_value', 'created_at'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
