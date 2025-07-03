// hooks/use-auto-layout.ts

import { useMemo } from 'react';
import dagre from 'dagre';
import type { ModelConfig } from '@/components/model-building-ui/model-config-builder'; // Adjust this import path

// Constants to define the size of our nodes for the layout algorithm
const NODE_WIDTH = 256;  // Corresponds to w-64 in Tailwind
const NODE_HEIGHT = 220; // An approximate height for a model card with a few fields

export const useAutoLayout = (models: ModelConfig[]) => {
  const { nodesWithPositions, graphWidth, graphHeight } = useMemo(() => {
    // Return early if there are no models to prevent errors.
    if (models.length === 0) {
      return { nodesWithPositions: [], graphWidth: 0, graphHeight: 0 };
    }

    // Initialize the graph
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    // Set graph options: 'LR' = Left-to-Right, 'TB' = Top-to-Bottom
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 70, ranksep: 90 });

    // Add each model as a "node" to the graph
    models.forEach(model => {
      dagreGraph.setNode(model.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    // Add "edges" (lines) for every relationship found
    models.forEach(model => {
      model.fields.forEach(field => {
        if (field.type === 'Relation' && field.relationToModelId) {
          // Create an edge from the current model to the related model
          dagreGraph.setEdge(model.id, field.relationToModelId);
        }
      });
    });

    // Run the layout algorithm
    dagre.layout(dagreGraph);

    // Map our original models to include the new calculated positions
    const nodesWithPositions = models.map(model => {
      const node = dagreGraph.node(model.id);
      return { ...model, position: { x: node.x, y: node.y } };
    });

    const graph = dagreGraph.graph();
    return {
      nodesWithPositions,
      graphWidth: graph.width || 0,
      graphHeight: graph.height || 0
    };
  }, [models]); // This heavy calculation only re-runs when the models array changes

  return { nodesWithPositions, graphWidth, graphHeight };
};