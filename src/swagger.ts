import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SwingNotes API',
      version: '1.0.0',
      description: 'API documentation for the SwingNotes app',
    },
    components: {
      schemas: {
        NewNote: {
          type: 'object',
          required: ['title', 'text'],
          properties: {
            title: {
              type: 'string',
              example: 'My Note Title',
            },
            text: {
              type: 'string',
              example: 'This is the content of the note.',
            },
            category: {
              type: 'string',
              example: 'personal',
            },
          },
        },
        PublicNote: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            title: {
              type: 'string',
            },
            text: {
              type: 'string',
            },
            category: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        PublicUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            username: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            role: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AdminUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            username: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            role: {
              type: 'string',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            owned_notes: {
              type: 'number',
            },
            shared_notes: {
              type: 'number',
            },
            by_others_shared_notes: {
              type: 'number',
            },
          },
        },
        NewUser: {
          type: 'object',
          required: ['username', 'password', 'email'],
          properties: {
            username: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        SharedNoteInput: {
          type: 'object',
          required: ['username', 'accessLevel'],
          properties: {
            username: {
              type: 'string',
            },
            accessLevel: {
              type: 'string',
              enum: ['read', 'edit', 'owner'],
              default: 'read',
            },
          },
        }
      },    
    },
  },
    apis: ['./src/routes/*.ts'], // ← points to your route files
  };

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
