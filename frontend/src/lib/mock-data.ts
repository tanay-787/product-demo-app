import type { ProjectWithOwner } from "./mock-project"

// Generate a random date within the last 30 days
function randomRecentDate() {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// Generate a random UUID
function randomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Sample tech stacks
const techStacks = [
  ["next", "prisma", "postgresql", "typescript", "tailwind", "zod"],
  ["express", "mongoose", "mongodb", "jest", "docker"],
  ["fastify", "prisma", "mysql", "typescript", "zod", "github-actions"],
  ["react", "graphql", "mongodb", "typescript", "material-ui"],
  ["vue", "typeorm", "postgresql", "docker", "cypress"],
  ["koa", "sequelize", "mysql", "javascript", "jest"],
  ["next", "prisma", "postgresql", "typescript", "chakra-ui", "aws"],
  ["express", "mongoose", "mongodb", "typescript", "bootstrap", "vercel"],
  ["svelte", "prisma", "sqlite", "typescript", "tailwind", "netlify"],
  ["angular", "typeorm", "postgresql", "typescript", "bootstrap", "azure"],
]

// Sample project names and descriptions
const projectTemplates = [
  {
    name: "E-commerce Platform",
    description: "A full-featured online store with product management, cart, and checkout",
  },
  { name: "Blog CMS", description: "Content management system for publishing articles and managing media" },
  { name: "Task Manager", description: "Project management tool with tasks, boards, and team collaboration" },
  { name: "Social Network", description: "Platform for user profiles, posts, comments, and social interactions" },
  { name: "Analytics Dashboard", description: "Data visualization and reporting tool for business metrics" },
  { name: "API Gateway", description: "Centralized service for managing and routing API requests" },
  { name: "Inventory System", description: "Stock management and tracking for retail and warehousing" },
  { name: "Learning Platform", description: "Online courses, lessons, and student progress tracking" },
  { name: "HR Management", description: "Employee records, time tracking, and performance reviews" },
  { name: "Customer Support", description: "Ticketing system for handling customer inquiries and issues" },
]

// Sample user IDs and names
const users = [
  { id: "user1", name: "Alex Johnson", email: "alex@example.com", image: "https://i.pravatar.cc/150?u=alex" },
  { id: "user2", name: "Sam Taylor", email: "sam@example.com", image: "https://i.pravatar.cc/150?u=sam" },
  { id: "user3", name: "Jordan Lee", email: "jordan@example.com", image: "https://i.pravatar.cc/150?u=jordan" },
  { id: "user4", name: "Casey Morgan", email: "casey@example.com", image: "https://i.pravatar.cc/150?u=casey" },
]
const statuses = ['idle', 'in-progress', 'generated', 'error'] as const
type Status = (typeof statuses)[number]

// Generate mock projects
export const mockProjects: ProjectWithOwner[] = Array.from({ length: 10 }, (_, i) => {
  const createdAt = randomRecentDate()
  const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
  const userIndex = Math.floor(Math.random() * users.length)
  const projectIndex = i % projectTemplates.length
  const status: Status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    project: {
      id: randomUUID(),
      name: projectTemplates[projectIndex].name,
      description: projectTemplates[projectIndex].description,
      ownerId: users[userIndex].id,
      stackJson: techStacks[i % techStacks.length],
      createdAt,
      updatedAt,
      buildStatus: status,
    },
    owner: users[userIndex],
  }
})
