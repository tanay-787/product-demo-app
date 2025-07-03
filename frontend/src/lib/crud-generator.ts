// lib/crud-generator.ts
import { v4 as uuidv4 } from 'uuid';
import { generateZodSchema } from './zod-generator';
import type { ModelConfig, ApiEndpointConfig } from './project-config';

export function generateCrudEndpoints(model: ModelConfig): ApiEndpointConfig[] {
  const schema = generateZodSchema(model);
  const schemaArray = `z.array(${schema})`;

  return [
    // GET /models
    { id: uuidv4(), method: 'GET', path: '/', description: `Get all ${model.name}s`, pathParams: [], queryParams: [], responseSchema: schemaArray, authorization: 'public' },
    // POST /models
    { id: uuidv4(), method: 'POST', path: '/', description: `Create a new ${model.name}`, pathParams: [], queryParams: [], requestBodySchema: schema, responseSchema: schema, authorization: 'user' },
    // GET /models/:id
    { id: uuidv4(), method: 'GET', path: '/:id', description: `Get a single ${model.name} by ID`, pathParams: [{ id: uuidv4(), name: 'id', type: 'string', required: true, in: 'path' }], queryParams: [], responseSchema: schema, authorization: 'public' },
    // PUT /models/:id
    { id: uuidv4(), method: 'PUT', path: '/:id', description: `Update a ${model.name}`, pathParams: [{ id: uuidv4(), name: 'id', type: 'string', required: true, in: 'path' }], queryParams: [], requestBodySchema: schema, responseSchema: schema, authorization: 'user' },
    // DELETE /models/:id
    { id: uuidv4(), method: 'DELETE', path: '/:id', description: `Delete a ${model.name}`, pathParams: [{ id: uuidv4(), name: 'id', type: 'string', required: true, in: 'path' }], queryParams: [], responseSchema: 'z.object({ success: z.boolean() })', authorization: 'admin' },
  ];
}