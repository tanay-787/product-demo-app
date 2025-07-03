// lib/predefined-models.ts
import { type ModelConfig, createNewField } from '@/components/model-building-ui/types'; // Adjust import
import { v4 as uuidv4 } from 'uuid';

// A special, non-generated ID for our system User model
// to make it easy to find.
export const SYSTEM_USER_MODEL_ID = 'system-user-model-id';

export const JWT_USER_MODEL: ModelConfig = {
  id: SYSTEM_USER_MODEL_ID,
  name: 'User',
  fields: [
    createNewField({ name: 'id', type: 'ID', isRequired: true, isUnique: true }),
    createNewField({ name: 'email', type: 'Text', isRequired: true, isUnique: true }),
    createNewField({ name: 'password', type: 'Text', isRequired: true, isUnique: false }),
    createNewField({ name: 'name', type: 'Text', isRequired: false, isUnique: false }),
    // If RBAC is also selected, this field could be added dynamically
    // createNewField({ name: 'role', type: 'Enum', enumValues: 'USER,ADMIN', isRequired: true }),
  ],
};

// You could define a Neon-specific user model here if needed
// export const NEON_USER_MODEL: ModelConfig = { ... };