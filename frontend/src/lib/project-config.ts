import { v4 as uuidv4 } from "uuid";

// --- Stack Configuration Types ---
export interface StackConfig {
  framework: "express" | "fastify";
  database: "neon-postgres" | "mongodb" | "mssql" | "";
  orm: "prisma" | "drizzle" | "mongoose";
  validation: "zod" | "framework-specific";
  authentication: "none" | "jwt";
  features: string[];
}

export const FEATURES = [
    // Security
    { value: "rbac", label: "Role-Based Access", description: "Define User and Admin roles for endpoints.", techKey: "rbac", dependsOn: "jwt" },
    { value: "rate-limit", label: "Rate Limiting", description: "Protect your API from brute-force attacks.", techKey: "ratelimit" },
    { value: "cors", label: "CORS", description: "Configure Cross-Origin Resource Sharing for your API.", techKey: "cors" },
    // Async & Real-time
    { value: "background-jobs", label: "Background Jobs", description: "Use BullMQ and Redis to offload long tasks.", techKey: "bullmq" },
    { value: "websockets", label: "WebSockets", description: "Enable real-time communication with Socket.IO.", techKey: "socketio" },
    { value: "cron-jobs", label: "Scheduled Tasks", description: "Run code on a recurring schedule (e.g., nightly).", techKey: "cron" },
    // DX & Utilities
    { value: "pino-logging", label: "Structured Logging", description: "Use Pino for high-performance, structured logging.", techKey: "pino" },
    { value: "health-check", label: "Health Check", description: "An essential endpoint for container orchestration.", techKey: "healthcheck" },
    { value: "docker", label: "Docker", description: "Containerize your application for consistent environments.", techKey: "docker" },
    { value: "swagger", label: "Swagger", description: "Automatically generate API documentation.", techKey: "swagger" },
];
export { FRAMEWORKS,
  DATABASES,
  ORMS,
  VALIDATIONS,
  AUTHENTICATION_OPTIONS,
  } from "@/lib/tech-assets"

export const DEFAULT_STACK_CONFIG: StackConfig = {
  framework: "express",
  database: "neon-postgres",
  orm: "drizzle",
  validation: "zod",
  authentication: "none",
  features: ["cors", "pino-logging", "health-check"],
};

// --- Model Configuration Types ---
export type FieldType =
  | "ID"
  | "Text"
  | "Number"
  | "Boolean"
  | "Date"
  | "JSON"
  | "Relation"
  | "Enum"
  | "Point";


  export interface FieldConfig {
    id: string;
    name: string;
    type: FieldType;
    isRequired: boolean;
    isUnique: boolean;
    relationToModelId?: string;
    relationName?: string; // Added missing property
    enumValues?: string;
    defaultValue?: string; // Added missing property
  }

export interface ModelConfig {
  id: string;
  name: string;
  fields: FieldConfig[];
}

// --- API Endpoint Configuration Types ---
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type ParameterLocation = "path" | "query";

export interface ParameterConfig {
  id: string;
  name: string;
  type: string; // e.g., 'string', 'number', 'boolean'
  required?: boolean;
  in: ParameterLocation;
}

export interface ApiEndpointConfig {
  id: string;
  method: HttpMethod;
  path: string; // Relative to the resource's base path (e.g., '/', '/:id')
  description?: string;
  pathParams: ParameterConfig[];
  queryParams: ParameterConfig[];
  requestBodySchema?: string; // e.g., a JSON schema string or reference
  responseSchema?: string; // e.g., a JSON schema string or reference
  authorization: string; // e.g., 'public', 'admin', 'user'
  isBackgroundTask?: boolean;
}

export interface ResourceConfig {
  id: string;
  name: string; // e.g., "User Management", "Product Catalog"
  basePath: string; // e.g., "/api/v1/users"
  middleware?: string[]; // e.g., ["authenticate", "authorize"]
  endpoints: ApiEndpointConfig[];
}

// --- Main Project Configuration Type ---
export interface ProjectConfig {
  projectName: string;
  projectDescription?: string;
  stack: StackConfig;
  models: ModelConfig[];
  resources: ResourceConfig[];
}

// --- Example of a deeply nested ProjectConfig object ---
export const EXAMPLE_PROJECT_CONFIG: ProjectConfig = {
  projectName: "My E-commerce Backend",
  projectDescription: "A sample backend for an e-commerce application with users and products.",
  stack: {
    framework: "express",
    database: "neon-postgres",
    orm: "prisma",
    validation: "zod",
    authentication: "jwt",
    features: ["cors", "pino-logging", "health-check", "rbac", "rate-limit"],
  },
  models: [
    {
      id: uuidv4(),
      name: "User",
      fields: [
        { id: uuidv4(), name: "id", type: "ID", isRequired: true, isUnique: true },
        { id: uuidv4(), name: "email", type: "Text", isRequired: true, isUnique: true },
        { id: uuidv4(), name: "passwordHash", type: "Text", isRequired: true, isUnique: false },
        { id: uuidv4(), name: "role", type: "Text", isRequired: true, isUnique: false, defaultValue: "'user'" },
        { id: uuidv4(), name: "createdAt", type: "Date", isRequired: true, isUnique: false, defaultValue: "now()" },
        { id: uuidv4(), name: "updatedAt", type: "Date", isRequired: true, isUnique: false, defaultValue: "now()" },
      ],
    },
    {
      id: uuidv4(),
      name: "Product",
      fields: [
        { id: uuidv4(), name: "id", type: "ID", isRequired: true, isUnique: true },
        { id: uuidv4(), name: "name", type: "Text", isRequired: true, isUnique: false },
        { id: uuidv4(), name: "description", type: "Text", isRequired: false, isUnique: false },
        { id: uuidv4(), name: "price", type: "Number", isRequired: true, isUnique: false },
        { id: uuidv4(), name: "stock", type: "Number", isRequired: true, isUnique: false, defaultValue: "0" },
        { id: uuidv4(), name: "createdAt", type: "Date", isRequired: true, isUnique: false, defaultValue: "now()" },
        { id: uuidv4(), name: "updatedAt", type: "Date", isRequired: true, isUnique: false, defaultValue: "now()" },
      ],
    },
    {
      id: uuidv4(),
      name: "Order",
      fields: [
        { id: uuidv4(), name: "id", type: "ID", isRequired: true, isUnique: true },
        { id: uuidv4(), name: "userId", type: "Text", isRequired: true, isUnique: false, relationToModelId: "USER_MODEL_ID_PLACEHOLDER", relationName: "UserOrders" }, // Placeholder for actual User ID
        { id: uuidv4(), name: "totalAmount", type: "Number", isRequired: true, isUnique: false },
        { id: uuidv4(), name: "status", type: "Enum", isRequired: true, isUnique: false, defaultValue: "'pending'", enumValues: "processing,pending,shipped,delivered" },
        { id: uuidv4(), name: "createdAt", type: "Date", isRequired: true, isUnique: false, defaultValue: "now()" },
      ],
    },
  ],
  resources: [
    {
      id: uuidv4(),
      name: "User API",
      basePath: "/api/v1/users",
      middleware: ["auth"],
      endpoints: [
        {
          id: uuidv4(),
          method: "GET",
          path: "/",
          description: "Get all users",
          pathParams: [],
          queryParams: [
            { id: uuidv4(), name: "limit", type: "number", in: "query", required: false },
            { id: uuidv4(), name: "offset", type: "number", in: "query", required: false },
          ],
          authorization: "admin",
          isBackgroundTask: false,
        },
        {
          id: uuidv4(),
          method: "GET",
          path: "/:id",
          description: "Get user by ID",
          pathParams: [{ id: uuidv4(), name: "id", type: "Text", in: "path", required: true }],
          queryParams: [],
          authorization: "user",
          isBackgroundTask: false,
        },
        {
          id: uuidv4(),
          method: "POST",
          path: "/",
          description: "Create a new user",
          pathParams: [],
          queryParams: [],
          requestBodySchema: "{ \"email\": \"string\", \"password\": \"string\", \"role\": \"string\" }",
          authorization: "public",
          isBackgroundTask: false,
        },
        {
          id: uuidv4(),
          method: "DELETE",
          path: "/:id",
          description: "Delete user by ID",
          pathParams: [{ id: uuidv4(), name: "id", type: "Text", in: "path", required: true }],
          queryParams: [],
          authorization: "admin",
          isBackgroundTask: false,
        },
      ],
    },
    {
      id: uuidv4(),
      name: "Product API",
      basePath: "/api/v1/products",
      endpoints: [
        {
          id: uuidv4(),
          method: "GET",
          path: "/",
          description: "Get all products",
          pathParams: [],
          queryParams: [],
          authorization: "public",
          isBackgroundTask: false,
        },
        {
          id: uuidv4(),
          method: "GET",
          path: "/:id",
          description: "Get product by ID",
          pathParams: [{ id: uuidv4(), name: "id", type: "Text", in: "path", required: true }],
          queryParams: [],
          authorization: "public",
          isBackgroundTask: false,
        },
        {
          id: uuidv4(),
          method: "POST",
          path: "/",
          description: "Create a new product",
          pathParams: [],
          queryParams: [],
          requestBodySchema: '{ "name": "string", "price": "number" }',
          authorization: "admin",
          isBackgroundTask: false,
        },
      ],
    },
  ],
};

// Helper function to create a new, empty project config (similar to DEFAULT_PROJECT_CONFIG)
export const createNewProjectConfig = (): ProjectConfig => ({
  projectName: 'New Project',
  projectDescription: 'A custom generated backend project.',
  stack: DEFAULT_STACK_CONFIG,
  models: [],
  resources: [],
});
