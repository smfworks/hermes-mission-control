/**
 * Hermes Mission Control — Mock Data Store
 *
 * Generates realistic mock data for development and demo purposes.
 * In production, this would be replaced by real-time data from Hermes.
 */

import type {
  Agent,
  Skill,
  Task,
  MemoryEntry,
  SystemEvent,
  SystemState,
  SystemMetrics,
  GraphNode,
  GraphEdge,
} from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// Agent pool
const AGENT_NAMES = [
  "Orion", "Lyra", "Cassiopeia", "Polaris", "Sirius",
  "Vega", "Altair", "Deneb", "Rigil", "Capella",
];

const AGENT_TYPES: Agent["type"][] = ["orchestrator", "worker", "researcher", "coder"];
const AGENT_STATUSES: Agent["status"][] = ["idle", "thinking", "tool_calling", "success", "failed", "evolving"];

// Skill pool
const SKILL_NAMES = [
  "Web Researcher", "Code Generator", "Test Writer", "Documentation Writer",
  "Data Analyzer", "API Integrator", "Security Auditor", "Performance Optimizer",
  "Bug Fixer", "Feature Builder", "Code Reviewer", "Architecture Designer",
];

// Task pool
const TASK_TITLES = [
  "Build a React todo app", "Research quantum computing", "Optimize database queries",
  "Write unit tests for auth module", "Create API documentation", "Audit security vulnerabilities",
  "Generate landing page for startup", "Analyze customer data trends", "Build CI/CD pipeline",
  "Refactor legacy payment system", "Create data visualization dashboard", "Write blog post on AI ethics",
];

/**
 * Generate a random date within the last N hours.
 */
function randomDate(hoursAgo: number): string {
  const date = new Date(Date.now() - Math.random() * hoursAgo * 60 * 60 * 1000);
  return date.toISOString();
}

/**
 * Generate mock agents.
 */
export function generateAgents(count: number): Agent[] {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: AGENT_NAMES[i % AGENT_NAMES.length],
    type: AGENT_TYPES[Math.floor(Math.random() * AGENT_TYPES.length)],
    status: AGENT_STATUSES[Math.floor(Math.random() * AGENT_STATUSES.length)],
    currentTask: Math.random() > 0.3 ? TASK_TITLES[Math.floor(Math.random() * TASK_TITLES.length)] : null,
    skills: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => uuidv4()),
    createdAt: randomDate(48),
    lastActive: randomDate(0.5),
  }));
}

/**
 * Generate mock skills.
 */
export function generateSkills(count: number): Skill[] {
  return Array.from({ length: count }, (_, i) => {
    const versions = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
      version: `v${j + 1}.0`,
      code: `// Skill implementation\nfunction execute(input) {\n  // Version ${j + 1}\n  return process(input);\n}`,
      diff: j > 0 ? `@@ -1,3 +1,4 @@\n function execute(input) {\n-  return oldProcess(input);\n+  return process(input);\n }` : null,
      createdAt: randomDate(48 - j * 12),
      performance: {
        usageCount: Math.floor(Math.random() * 100) + 10,
        successRate: 0.7 + Math.random() * 0.3,
      },
    }));

    return {
      id: uuidv4(),
      name: SKILL_NAMES[i % SKILL_NAMES.length],
      description: `A skill for ${SKILL_NAMES[i % SKILL_NAMES.length].toLowerCase()}.`,
      version: versions[versions.length - 1].version,
      author: Math.random() > 0.5 ? "agent" : "human",
      status: Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "evolving" : "deprecated",
      performance: {
        usageCount: Math.floor(Math.random() * 200) + 50,
        successRate: 0.6 + Math.random() * 0.4,
        avgExecutionTime: Math.random() * 5000 + 500,
      },
      createdAt: versions[versions.length - 1].createdAt,
      updatedAt: versions[0].createdAt,
      versions,
    };
  });
}

/**
 * Generate mock tasks.
 */
export function generateTasks(count: number, agents: Agent[]): Task[] {
  return Array.from({ length: count }, (_, i) => {
    const status = ["pending", "in_progress", "completed", "failed"][Math.floor(Math.random() * 4)] as Task["status"];
    return {
      id: uuidv4(),
      title: TASK_TITLES[i % TASK_TITLES.length],
      description: `Task description for: ${TASK_TITLES[i % TASK_TITLES.length]}`,
      status,
      assignedAgent: status !== "pending" ? agents[Math.floor(Math.random() * agents.length)].id : null,
      result: status === "completed" ? "Task completed successfully." : status === "failed" ? "Task failed: timeout." : null,
      createdAt: randomDate(24),
      completedAt: status === "completed" || status === "failed" ? randomDate(12) : null,
    };
  });
}

/**
 * Generate mock memory entries.
 */
export function generateMemory(count: number, agents: Agent[]): MemoryEntry[] {
  return Array.from({ length: count }, () => {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    return {
      id: uuidv4(),
      agentId: agent.id,
      key: `memory_${Math.random().toString(36).substring(7)}`,
      value: `Memory content for ${agent.name}. This is a sample memory entry.`,
      type: Math.random() > 0.5 ? "structured" : "unstructured",
      tags: ["auto-generated", "sample", Math.random() > 0.5 ? "important" : "routine"],
      createdAt: randomDate(48),
      lastAccessed: randomDate(2),
      isBeingAttended: Math.random() > 0.8,
    };
  });
}

/**
 * Generate mock system events.
 */
export function generateEvents(count: number, agents: Agent[], skills: Skill[], tasks: Task[]): SystemEvent[] {
  const eventTypes: SystemEvent["type"][] = [
    "agent_started", "agent_completed", "skill_created", "skill_evolved",
    "task_started", "task_completed", "tool_called", "error", "goal_injected",
  ];

  return Array.from({ length: count }, () => {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const skill = skills[Math.floor(Math.random() * skills.length)];
    const task = tasks[Math.floor(Math.random() * tasks.length)];

    return {
      id: uuidv4(),
      timestamp: randomDate(12),
      type,
      agentId: agent.id,
      skillId: skill.id,
      taskId: task.id,
      message: `Agent ${agent.name} ${type.replace("_", " ")} on task "${task.title}".`,
      details: {
        duration: Math.floor(Math.random() * 10000),
        success: Math.random() > 0.2,
      },
    };
  });
}

/**
 * Generate graph nodes and edges from agents and skills.
 */
export function generateGraph(agents: Agent[], skills: Skill[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Agent nodes
  for (const agent of agents) {
    nodes.push({
      id: `agent-${agent.id}`,
      type: "agent",
      name: agent.name,
      status: agent.status,
      agentType: agent.type,
      description: `${agent.type} agent`,
    });
  }

  // Skill nodes
  for (const skill of skills) {
    nodes.push({
      id: `skill-${skill.id}`,
      type: "skill",
      name: skill.name,
      status: skill.status,
      description: skill.description,
    });
  }

  // Edges: agent -> skill (skill inheritance)
  for (const agent of agents) {
    for (const skillId of agent.skills) {
      edges.push({
        id: `edge-${agent.id}-${skillId}`,
        source: `agent-${agent.id}`,
        target: `skill-${skillId}`,
        type: "skill_inheritance",
      });
    }
  }

  // Edges: agent -> agent (communication)
  for (let i = 0; i < agents.length - 1; i++) {
    edges.push({
      id: `edge-comm-${agents[i].id}-${agents[i + 1].id}`,
      source: `agent-${agents[i].id}`,
      target: `agent-${agents[i + 1].id}`,
      type: "communication",
      label: "communicating",
    });
  }

  // Edges: agent -> skill (tool use)
  for (const agent of agents) {
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    edges.push({
      id: `edge-tool-${agent.id}-${randomSkill.id}`,
      source: `agent-${agent.id}`,
      target: `skill-${randomSkill.id}`,
      type: "tool_use",
      label: "using",
    });
  }

  return { nodes, edges };
}

/**
 * Generate complete system state.
 */
export function generateSystemState(): SystemState {
  const agents = generateAgents(8);
  const skills = generateSkills(12);
  const tasks = generateTasks(15, agents);
  const memory = generateMemory(20, agents);
  const events = generateEvents(50, agents, skills, tasks);
  const graph = generateGraph(agents, skills);

  const metrics: SystemMetrics = {
    activeAgents: agents.filter(a => a.status !== "idle" && a.status !== "failed").length,
    skillsUnderEvolution: skills.filter(s => s.status === "evolving").length,
    tasksInProgress: tasks.filter(t => t.status === "in_progress").length,
    successRate: 0.85 + Math.random() * 0.15,
    totalEvents: events.length,
    memoryEntries: memory.length,
    uptime: "2h 34m",
  };

  return {
    agents,
    skills,
    tasks,
    memory,
    events,
    metrics,
    graph,
  };
}

// Singleton store
let store: SystemState | null = null;

/**
 * Simple event emitter for real-time updates.
 */
type EventListener = (state: SystemState) => void;
const listeners: Set<EventListener> = new Set();

/**
 * Subscribe to system state changes.
 */
export function subscribeToState(listener: EventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Broadcast state change to all listeners.
 */
function broadcastChange(): void {
  if (store) {
    listeners.forEach((listener) => listener(store!));
  }
}

/**
 * Inject a new goal into the system.
 * This simulates a human operator injecting a new task.
 */
export function injectGoal(goal: string): SystemEvent {
  if (!store) {
    store = generateSystemState();
  }

  const event: SystemEvent = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type: "goal_injected",
    agentId: null,
    skillId: null,
    taskId: null,
    message: `New goal injected: ${goal}`,
    details: { goal },
  };

  // Add event to the feed
  store.events.unshift(event);
  if (store.events.length > 100) {
    store.events.pop();
  }

  // Create a new task from the goal
  const newTask: Task = {
    id: uuidv4(),
    title: goal,
    description: `Task generated from injected goal: ${goal}`,
    status: "pending",
    assignedAgent: null,
    result: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  store.tasks.unshift(newTask);

  // Update metrics
  store.metrics.totalEvents = store.events.length;

  broadcastChange();
  return event;
}

/**
 * Simulate real-time agent activity.
 * This generates random events to simulate agents working.
 */
export function simulateActivity(): void {
  if (!store) {
    store = generateSystemState();
  }

  const agents = store.agents;
  const skills = store.skills;
  const tasks = store.tasks;

  // Pick a random agent to do something
  const agent = agents[Math.floor(Math.random() * agents.length)];
  const eventTypes: SystemEvent["type"][] = [
    "agent_started", "agent_completed", "tool_called",
  ];
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  // Update agent status
  const statuses: Agent["status"][] = ["thinking", "tool_calling", "success", "idle"];
  agent.status = statuses[Math.floor(Math.random() * statuses.length)];
  agent.lastActive = new Date().toISOString();

  const event: SystemEvent = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type,
    agentId: agent.id,
    skillId: null,
    taskId: tasks[Math.floor(Math.random() * tasks.length)].id,
    message: `Agent ${agent.name} ${type.replace("_", " ")}`,
    details: {
      duration: Math.floor(Math.random() * 5000),
      success: Math.random() > 0.2,
    },
  };

  store.events.unshift(event);
  if (store.events.length > 100) {
    store.events.pop();
  }

  // Update metrics
  store.metrics.activeAgents = agents.filter(
    (a) => a.status !== "idle" && a.status !== "failed"
  ).length;
  store.metrics.totalEvents = store.events.length;

  broadcastChange();
}

/**
 * Start the activity simulation interval.
 */
let activityInterval: NodeJS.Timeout | null = null;

export function startActivitySimulation(intervalMs: number = 3000): void {
  if (activityInterval) {
    clearInterval(activityInterval);
  }
  activityInterval = setInterval(simulateActivity, intervalMs);
}

export function stopActivitySimulation(): void {
  if (activityInterval) {
    clearInterval(activityInterval);
    activityInterval = null;
  }
}

/**
 * Get the current system state (singleton).
 */
export function getSystemState(): SystemState {
  if (!store) {
    store = generateSystemState();
  }
  return store;
}

/**
 * Reset the store with fresh mock data.
 */
export function resetStore(): SystemState {
  store = generateSystemState();
  return store;
}
