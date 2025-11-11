import { useEffect, useState } from "react";
import { api } from "./services/api";

interface Client {
  id: number;
  name: string;
  contact?: string;
  notes?: string;
}

interface Project {
  id: number;
  name: string;
  type?: string;
  status: string;
  deadline?: string;
  client_id?: number | null;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignee?: string;
  due_date?: string;
  project_id: number;
}

const TASK_STATUSES = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"];

function App() {
  // Clientes
  const [clients, setClients] = useState<Client[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");

  // Projetos
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectClientId, setProjectClientId] = useState<number | "">("");

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<number | "">("");
  const [taskStatus, setTaskStatus] = useState("BACKLOG");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");

  // Carregar dados iniciais
  useEffect(() => {
    api.get<Client[]>("/clients").then((res) => setClients(res.data));

    api.get<Project[]>("/projects").then((res) => setProjects(res.data));

    api.get<Task[]>("/tasks").then((res) => setTasks(res.data));
  }, []);

  // Criar cliente
  const handleAddClient = async () => {
    if (!clientName.trim()) return;
    try {
      const res = await api.post<Client>("/clients", {
        name: clientName,
        contact: clientContact || null,
      });
      setClients((prev) => [...prev, res.data]);
      setClientName("");
      setClientContact("");
    } catch (err) {
      console.error("Erro ao criar cliente", err);
    }
  };

  // Criar projeto
  const handleAddProject = async () => {
    if (!projectName.trim()) return;
    try {
      const res = await api.post<Project>("/projects", {
        name: projectName,
        type: projectType || null,
        client_id: projectClientId === "" ? null : Number(projectClientId),
        status: "ACTIVE",
      });
      setProjects((prev) => [...prev, res.data]);
      setProjectName("");
      setProjectType("");
      setProjectClientId("");
    } catch (err) {
      console.error("Erro ao criar projeto", err);
    }
  };

  // Criar task
  const handleAddTask = async () => {
    if (!taskTitle.trim() || taskProjectId === "") return;
    try {
      const res = await api.post<Task>("/tasks", {
        title: taskTitle,
        project_id: Number(taskProjectId),
        status: taskStatus,
        priority: taskPriority,
      });
      setTasks((prev) => [...prev, res.data]);
      setTaskTitle("");
      setTaskProjectId("");
      setTaskStatus("BACKLOG");
      setTaskPriority("MEDIUM");
    } catch (err) {
      console.error("Erro ao criar task", err);
    }
  };

  // Agrupar tasks por status (para Kanban)
  const tasksByStatus: Record<string, Task[]> = TASK_STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: tasks.filter((t) => t.status === status),
    }),
    {} as Record<string, Task[]>
  );

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : `Projeto #${projectId}`;
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>ProjectFlow</h1>
      <p style={{ color: "#555" }}>
        Demo full-stack para gestão simples de clientes, projetos e tarefas.
      </p>

      {/* Seção de Clientes */}
      <section
        style={{
          marginTop: "24px",
          padding: "16px",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <h2>Clientes</h2>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            placeholder="Nome do cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={{ flex: 2, padding: "8px" }}
          />
          <input
            placeholder="Contato"
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
            style={{ flex: 2, padding: "8px" }}
          />
          <button
            onClick={handleAddClient}
            style={{
              padding: "8px 16px",
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Adicionar
          </button>
        </div>
        <ul style={{ marginTop: "12px" }}>
          {clients.length === 0 ? (
            <li style={{ color: "#777" }}>Nenhum cliente cadastrado.</li>
          ) : (
            clients.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>
                {c.contact && ` — ${c.contact}`}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Seção de Projetos */}
      <section
        style={{
          marginTop: "24px",
          padding: "16px",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <h2>Projetos</h2>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Nome do projeto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ flex: 2, minWidth: "180px", padding: "8px" }}
          />
          <input
            placeholder="Tipo (interno, consultoria, etc.)"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            style={{ flex: 2, minWidth: "180px", padding: "8px" }}
          />
          <select
            value={projectClientId}
            onChange={(e) =>
              setProjectClientId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            style={{ flex: 2, minWidth: "180px", padding: "8px" }}
          >
            <option value="">Sem cliente vinculado</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddProject}
            style={{
              padding: "8px 16px",
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Adicionar
          </button>
        </div>

        <ul style={{ marginTop: "12px" }}>
          {projects.length === 0 ? (
            <li style={{ color: "#777" }}>Nenhum projeto cadastrado.</li>
          ) : (
            projects.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                {p.client_id && (
                  <> — Cliente: {getProjectName(p.client_id)}</>
                )}
                {p.type && ` — Tipo: ${p.type}`}
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Seção de Tasks + Kanban */}
      <section
        style={{
          marginTop: "24px",
          padding: "16px",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <h2>Tarefas (Kanban básico)</h2>

        {/* Form de criação de task */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Título da tarefa"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            style={{ flex: 2, minWidth: "160px", padding: "8px" }}
          />
          <select
            value={taskProjectId}
            onChange={(e) =>
              setTaskProjectId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            style={{ flex: 2, minWidth: "160px", padding: "8px" }}
          >
            <option value="">Selecione um projeto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            style={{ minWidth: "140px", padding: "8px" }}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            style={{ minWidth: "120px", padding: "8px" }}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <button
            onClick={handleAddTask}
            style={{
              padding: "8px 16px",
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Criar tarefa
          </button>
        </div>

        {/* Kanban */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          {TASK_STATUSES.map((status) => (
            <div
              key={status}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px",
                minHeight: "80px",
              }}
            
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                {status}
              </h3>
              {tasksByStatus[status].length === 0 ? (
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Sem tarefas.
                </p>
              ) : (
                tasksByStatus[status].map((task) => (
                  <div
                    key={task.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "6px",
                      marginBottom: "6px",
                      fontSize: "12px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                    <div style={{ color: "#6b7280" }}>
                      Projeto: {getProjectName(task.project_id)}
                    </div>
                    <div style={{ color: "#6b7280" }}>
                      Prioridade: {task.priority}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;


