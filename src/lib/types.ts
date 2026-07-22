/**
 * Hermes Mission Control — Data Models
 *
 * Clean, versioned data contracts for agents, skills, tasks, memory, and events.
 * These interfaces define the shape of data exchanged between the Hermes backend
 * and the Mission Control frontend.
 */

/**
 * Agent status reflects the current state of an agent in the system.
 */
export type AgentStatus =
  | "idle"
  | "thinking"
  | "tool_calling"
  | "success"
  | "failed"
  | "evolving";

/**
 * Agent type categorizes the role of an agent.
 */
export type AgentType =
  | "orchestrator"
  | "worker"
  | "researcher"
  | "coder";

/**
 * Represents a Hermes agent in the system.
 */
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  currentTask: string | null;
  skills: string[]; // skill IDs
  createdAt: string;
  lastActive: string;
}

/**
 * Skill status indicates whether a skill is active, evolving, or deprecated.
 */
export type SkillStatus = "active" | "evolving" | "deprecated";

/**
 * Represents a skill in the Hermes system.
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author: "agent" | "human";
  status: SkillStatus;
  performance: {
    usageCount: number;
    successRate: number;
    avgExecutionTime: number;
  };
  createdAt: string;
  updatedAt: string;
  versions: SkillVersion[];
}

/**
 * A specific version of a skill.
 */
export interface SkillVersion {
  version: string;
  code: string;
  diff: string | null;
  createdAt: string;
  performance: {
    usageCount: number;
    successRate: number;
  };
}

/**
 * Task status.
 */
export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed";

/**
 * Represents a task assigned to an agent.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedAgent: string | null;
  result: string | null;
  createdAt: string;
  completedAt: string | null;
}

/**
 * Memory entry type.
 */
export type MemoryType = "structured" | "unstructured";

/**
 * Represents a memory entry in the Hermes system.
 */
export interface MemoryEntry {
  id: string;
  agentId: string;
  key: string;
  value: string;
  type: MemoryType;
  tags: string[];
  createdAt: string;
  lastAccessed: string;
  isBeingAttended: boolean;
}

/**
 * System event types.
 */
export type SystemEventType =
  | "agent_started"
  | "agent_completed"
  | "skill_created"
  | "skill_evolved"
  | "task_started"
  | "task_completed"
  | "tool_called"
  | "error"
  | "goal_injected";

/**
 * Represents a system event for the activity feed.
 */
export interface SystemEvent {
  id: string;
  timestamp: string;
  type: SystemEventType;
  agentId: string | null;
  skillId: string | null;
  taskId: string | null;
  message: string;
  details: Record<string, any>;
}

/**
 * Graph node for the agent graph visualization.
 */
export interface GraphNode {
  id: string;
  type: "agent" | "skill";
  name: string;
  status: AgentStatus | SkillStatus;
  agentType?: AgentType;
  description?: string;
}

/**
 * Graph edge for the agent graph visualization.
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: "communication" | "tool_use" | "memory_access" | "skill_inheritance";
  label?: string;
}

/**
 * System metrics snapshot.
 */
export interface SystemMetrics {
  activeAgents: number;
  skillsUnderEvolution: number;
  tasksInProgress: number;
  successRate: number;
  totalEvents: number;
  memoryEntries: number;
  uptime: string;
}

/**
 * Complete system state.
 */
export interface SystemState {
  agents: Agent[];
  skills: Skill[];
  tasks: Task[];
  memory: MemoryEntry[];
  events: SystemEvent[];
  metrics: SystemMetrics;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}
