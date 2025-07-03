// lib/zod-generator.ts

// lib/zod-generator.ts
import type { ModelConfig, FieldConfig } from '@/components/model-building-ui/types.ts'; // Adjust import path
 // Adjust import path

// A simple mapping from our FieldType to Zod types.
const typeToZodMap: Record<string, string> = {
  ID: 'z.string().uuid()',
  Text: 'z.string()',
  Number: 'z.number()',
  Boolean: 'z.boolean()',
  Date: 'z.string().datetime()',
  JSON: 'z.record(z.any())', // or z.any()
  Enum: 'z.enum()', // We'll handle this special case
  Point: 'z.object({ x: z.number(), y: z.number() })',
  Relation: 'z.string()', // Relations are usually represented by an ID string
};

export function generateZodSchema(model: ModelConfig): string {
  const schemaFields = model.fields
    // We typically don't include the relation objects themselves in a base schema
    .filter(field => field.type !== 'Relation')
    .map(field => {
      let zodType = typeToZodMap[field.type] || 'z.any()';
      
      // Special handling for enums
      if (field.type === 'Enum' && field.enumValues) {
        const enumValues = field.enumValues.split(',').map(v => `'${v.trim()}'`).join(', ');
        zodType = `z.enum([${enumValues}])`;
      }
      
      const isOptional = !field.isRequired;
      return `  ${field.name}: ${zodType}${isOptional ? '.optional()' : ''},`;
    }).join('\n');

  return `z.object({\n${schemaFields}\n});`;
}