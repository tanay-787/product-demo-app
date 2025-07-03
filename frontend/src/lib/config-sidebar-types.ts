// lib/config-sidebar-types.ts
import type { ProjectConfig } from '@/lib/project-config';

export type BuilderView = 'stack' | 'models' | 'endpoints';

export type DeletionCandidate = {
  type: 'model' | 'resource' | 'endpoint';
  id: string;
  name: string;
};

export interface ConfigSidebarProps {
  // Data
  projectConfig: ProjectConfig;
  selectedIds: { resourceId: string | null; endpointId: string | null };

  // Navigation & Creation
  onNavigate: (view: BuilderView) => void;
  onAddModel: () => void;
  onAddResource: () => void;
  onAddEndpoint: (resourceId: string) => void;

  // Selection & Editing
  onEditModel: (modelId: string) => void;
  onSelectEndpoint: (resourceId: string, endpointId: string | null ) => void;

  // Deletion
  onRequestDelete: (item: DeletionCandidate) => void;
}