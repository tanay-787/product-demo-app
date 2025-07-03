export interface ProjectMetadata {
    id: string
    name: string
    description?: string
    ownerId: string
    stackJson: string[]
    createdAt: string
    updatedAt: string
    buildStatus: BuildStatus
  }
  
  export type BuildStatus = "idle" | "in-progress" | "generated" | "error"
  
  export interface ProjectWithOwner {
    project: ProjectMetadata
    owner?: {
      name: string
      email: string
      image?: string
    }
    
  }
  
  export type ProjectStatus = "active" | "development" | "planning" | "archived"
  
  // Helper function to determine project status (in a real app, this would be based on actual data)
  export function getProjectStatus(project: ProjectMetadata): ProjectStatus {
    // This is a mock implementation - in a real app, you'd determine this based on actual data
    const daysSinceUpdate = Math.floor((Date.now() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
  
    if (daysSinceUpdate < 2) return "active"
    if (daysSinceUpdate < 7) return "development"
    if (daysSinceUpdate < 30) return "planning"
    return "archived"
  }
  
  // Helper to get appropriate colors based on status
  export function getStatusColors(status: ProjectStatus): { color: string; bgColor: string; borderColor: string } {
    switch (status) {
      case "active":
        return { color: "text-primary", bgColor: "bg-primary/20", borderColor: "border-primary/20" }
      case "development":
        return { color: "text-blue-500", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/20" }
      case "planning":
        return { color: "text-amber-500", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/20" }
      case "archived":
        return { color: "text-gray-500", bgColor: "bg-gray-500/20", borderColor: "border-gray-500/20" }
    }
  }
  
  // Helper to get tech stack icons
  export function getTechIcon(tech: string): string {
    const techIcons: Record<string, string> = {
      express: "server",
      fastify: "server",
      koa: "server",
      next: "layout",
      react: "component",
      vue: "component",
      angular: "component",
      svelte: "component",
      prisma: "database",
      sequelize: "database",
      typeorm: "database",
      mongoose: "database",
      postgresql: "database",
      mysql: "database",
      mongodb: "database",
      sqlite: "database",
      redis: "database",
      zod: "check-circle",
      joi: "check-circle",
      yup: "check-circle",
      docker: "container",
      kubernetes: "container",
      jest: "test-tube",
      mocha: "test-tube",
      cypress: "test-tube",
      typescript: "braces",
      javascript: "braces",
      graphql: "git-branch",
      rest: "network",
      tailwind: "paintbrush",
      bootstrap: "paintbrush",
      "material-ui": "paintbrush",
      "chakra-ui": "paintbrush",
      aws: "cloud",
      azure: "cloud",
      gcp: "cloud",
      vercel: "cloud",
      netlify: "cloud",
      heroku: "cloud",
      "github-actions": "git-merge",
      "gitlab-ci": "git-merge",
      jenkins: "git-merge",
      "circle-ci": "git-merge",
      "travis-ci": "git-merge",
    }
  
    return techIcons[tech.toLowerCase()] || "code"
  }
  