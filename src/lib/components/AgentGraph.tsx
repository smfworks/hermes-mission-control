"use client";

import { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import type { GraphNode, GraphEdge, Agent, Skill } from "@/lib/types";
import { Bot, Code, Users, Database, GitBranch } from "lucide-react";

// Custom node component for agents
function AgentNode({ data }: { data: { label: string; status: string; type: string } }) {
  const statusColors = {
    idle: "border-slate-500",
    thinking: "border-blue-400",
    tool_calling: "border-amber-400",
    success: "border-green-400",
    failed: "border-red-400",
    evolving: "border-purple-400",
  };

  const typeIcons = {
    orchestrator: Users,
    worker: Bot,
    researcher: Database,
    coder: Code,
  };

  const Icon = typeIcons[data.type as keyof typeof typeIcons] || Bot;
  const borderColor = statusColors[data.status as keyof typeof statusColors] || "border-slate-500";

  return (
    <div className={`bg-slate-800 border-2 ${borderColor} rounded-xl p-3 min-w-[120px] text-center`}>
      <div className="flex items-center justify-center mb-1">
        <Icon className="w-4 h-4 text-blue-400" />
      </div>
      <div className="text-white text-sm font-medium">{data.label}</div>
      <div className="text-slate-400 text-xs capitalize">{data.status}</div>
      <div className="text-slate-500 text-xs">{data.type}</div>
    </div>
  );
}

// Custom node component for skills
function SkillNode({ data }: { data: { label: string; status: string; description: string } }) {
  const statusColors = {
    active: "border-green-400",
    evolving: "border-amber-400",
    deprecated: "border-slate-500",
  };

  const borderColor = statusColors[data.status as keyof typeof statusColors] || "border-slate-500";

  return (
    <div className={`bg-slate-800 border-2 ${borderColor} rounded-xl p-3 min-w-[120px] text-center`}>
      <div className="flex items-center justify-center mb-1">
        <Code className="w-4 h-4 text-purple-400" />
      </div>
      <div className="text-white text-sm font-medium">{data.label}</div>
      <div className="text-slate-400 text-xs capitalize">{data.status}</div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  agent: AgentNode,
  skill: SkillNode,
};

const edgeTypes: EdgeTypes = {};

interface AgentGraphProps {
  agents: Agent[];
  skills: Skill[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export default function AgentGraph({ agents, skills, graph }: AgentGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Convert graph data to React Flow format
    const rfNodes: Node[] = graph.nodes.map((node) => {
      const agent = agents.find((a) => a.id === node.id.replace("agent-", ""));
      const skill = skills.find((s) => s.id === node.id.replace("skill-", ""));

      return {
        id: node.id,
        type: node.type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          label: node.name,
          status: node.status,
          type: node.agentType || "",
          description: node.description || "",
        },
      };
    });

    const rfEdges: Edge[] = graph.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      label: edge.label || "",
      animated: edge.type === "communication",
      style: {
        stroke: edge.type === "communication" ? "#3b82f6" :
                edge.type === "tool_use" ? "#f59e0b" :
                edge.type === "memory_access" ? "#8b5cf6" :
                "#22c55e",
        strokeWidth: 2,
      },
    }));

    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [graph, agents, skills]);

  // Auto-layout: position nodes in a circle
  const onInit = useCallback((instance: any) => {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    const nodeCount = nodes.length;

    const updatedNodes = nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodeCount;
      return {
        ...node,
        position: {
          x: centerX + radius * Math.cos(angle) - 60,
          y: centerY + radius * Math.sin(angle) - 30,
        },
      };
    });

    setNodes(updatedNodes);
  }, [nodes]);

  return (
    <div className="h-96 w-full bg-slate-900/30 border border-slate-800 rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        connectionLineStyle={{ stroke: "#555", strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-slate-900/50"
      >
        <Controls className="bg-slate-800 border-slate-700" />
        <Background
          color="#374151"
          gap={16}
          lineWidth={1}
        />
        <MiniMap
          className="bg-slate-800 border-slate-700"
          nodeColor={(node) => {
            if (node.type === "agent") return "#3b82f6";
            if (node.type === "skill") return "#a855f7";
            return "#6b7280";
          }}
          nodeStrokeWidth={3}
        />
      </ReactFlow>
    </div>
  );
}
