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
            value: { type: 'string' },
            created_by: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'value', 'created_by', 'created_at', 'updated_at'],
        },
        ExpenseCreate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'string' },
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
