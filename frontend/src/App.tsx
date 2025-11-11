import { useEffect, useState } from "react";
import type React from "react";
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

const TASK_STATUSES = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"] as const;
type View = "overview" | "clients" | "projects" | "board";

function App() {
  // Navegação
  const [view, setView] = useState<View>("overview");

  // Dados
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Forms - Clients
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");

  // Forms - Projects
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectClientId, setProjectClientId] = useState<number | "">("");

  // Forms - Tasks
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<number | "">("");
  const [taskStatus, setTaskStatus] = useState<string>("BACKLOG");
  const [taskPriority, setTaskPriority] = useState<string>("MEDIUM");

  // Carregar dados iniciais
  useEffect(() => {
    api.get<Client[]>("/clients").then((res) => setClients(res.data));
    api.get<Project[]>("/projects").then((res) => setProjects(res.data));
    api.get<Task[]>("/tasks").then((res) => setTasks(res.data));
  }, []);

  // Helpers
  const getProjectName = (projectId: number) => {
    const p = projects.find((proj) => proj.id === projectId);
    return p ? p.name : `Projeto #${projectId}`;
  };

  const tasksByStatus: Record<string, Task[]> = TASK_STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  // Actions
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

  // Componentes de layout

  const NavButton = ({ label, target }: { label: string; target: View }) => (
    <button
      onClick={() => setView(target)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        marginBottom: "4px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        backgroundColor: view === target ? "#111827" : "transparent",
        color: view === target ? "#f9fafb" : "#9ca3af",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );

  const Card = ({
    title,
    children,
    right,
  }: {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
  }) => (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );

  // Views

  const OverviewView = () => (
    <>
      <Card
        title="Resumo rápido"
        right={
          <span
            style={{
              fontSize: "11px",
              color: "#6b7280",
            }}
          >
            Demo ambiente — dados locais
          </span>
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Clientes</div>
            <div style={metricValueStyle}>{clients.length}</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Projetos</div>
            <div style={metricValueStyle}>{projects.length}</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Tarefas totais</div>
            <div style={metricValueStyle}>{tasks.length}</div>
          </div>
          <div style={metricCardStyle}>
            <div style={metricLabelStyle}>Tarefas concluídas</div>
            <div style={metricValueStyle}>
              {tasks.filter((t) => t.status === "DONE").length}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Visão geral das tarefas">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {TASK_STATUSES.map((status) => (
            <div key={status}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                {status}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {tasksByStatus[status].length}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  const ClientsView = () => (
    <>
      <Card title="Novo cliente">
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Nome do cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Contato"
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleAddClient} style={primaryButtonStyle}>
            Salvar
          </button>
        </div>
      </Card>

      <Card title="Clientes cadastrados">
        {clients.length === 0 ? (
          <p style={mutedTextStyle}>Nenhum cliente cadastrado ainda.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {clients.map((c) => (
              <li
                key={c.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #f3f4f6",
                  fontSize: "14px",
                }}
              >
                <strong>{c.name}</strong>{" "}
                {c.contact && (
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                    }}
                  >
                    — {c.contact}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );

  const ProjectsView = () => (
    <>
      <Card title="Novo projeto">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <input
            placeholder="Nome do projeto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Tipo (interno, cliente, etc.)"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            style={inputStyle}
          />
          <select
            value={projectClientId}
            onChange={(e) =>
              setProjectClientId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            style={inputStyle}
          >
            <option value="">Sem cliente vinculado</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddProject} style={primaryButtonStyle}>
            Salvar
          </button>
        </div>
      </Card>

      <Card title="Projetos cadastrados">
        {projects.length === 0 ? (
          <p style={mutedTextStyle}>Nenhum projeto cadastrado.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {projects.map((p) => (
              <li
                key={p.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #f3f4f6",
                  fontSize: "14px",
                }}
              >
                <strong>{p.name}</strong>
                {p.type && (
                  <span
                    style={{
                      color: "#6b7280",
                      marginLeft: "4px",
                    }}
                  >
                    ({p.type})
                  </span>
                )}
                {p.client_id && (
                  <span
                    style={{
                      color: "#9ca3af",
                      marginLeft: "6px",
                      fontSize: "12px",
                    }}
                  >
                    Cliente ID: {p.client_id}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );

  const BoardView = () => (
    <Card
      title="Quadro Kanban"
      right={
        <span
          style={{
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          Estilo inspirado em Trello / Jira
        </span>
      }
    >
      {/* Form da task */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <input
          placeholder="Título da tarefa"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={inputStyle}
        />
        <select
          value={taskProjectId}
          onChange={(e) =>
            setTaskProjectId(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          style={inputStyle}
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
          style={inputStyle}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <button onClick={handleAddTask} style={primaryButtonStyle}>
          Criar
        </button>
      </div>

      {/* Colunas Kanban */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        {TASK_STATUSES.map((status) => (
          <div
            key={status}
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              padding: "8px",
              border: "1px solid #e5e7eb",
              minHeight: "120px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              {status}
            </div>
            {tasksByStatus[status].length === 0 ? (
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                }}
              >
                Sem tarefas.
              </p>
            ) : (
              tasksByStatus[status].map((task) => (
                <div
                  key={task.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    padding: "6px",
                    marginBottom: "6px",
                    boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "2px",
                    }}
                  >
                    {task.title}
                  </div>
                  <div
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {getProjectName(task.project_id)}
                  </div>
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "10px",
                      marginTop: "2px",
                    }}
                  >
                    Prioridade: {task.priority || "MEDIUM"}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  // Render final com layout

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #020817, #030712)",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "16px",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            backgroundColor: "rgba(9,9,11,0.98)",
            borderRadius: "18px",
            padding: "16px",
            border: "1px solid rgba(75,85,99,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#f9fafb",
              }}
            >
              ProjectFlow
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "2px",
              }}
            >
              Simple project & task hub
            </div>
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "11px",
              color: "#6b7280",
            }}
          >
            Navegação
          </div>
          <NavButton label="Overview" target="overview" />
          <NavButton label="Clientes" target="clients" />
          <NavButton label="Projetos" target="projects" />
          <NavButton label="Quadro Kanban" target="board" />

          <div
            style={{
              marginTop: "auto",
              fontSize: "10px",
              color: "#6b7280",
            }}
          >
            Demo acadêmica / portfólio.
          </div>
        </aside>

        {/* Conteúdo */}
        <main>
          {/* Topbar */}
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#e5e7eb",
                  margin: 0,
                }}
              >
                {view === "overview" && "Overview"}
                {view === "clients" && "Clientes"}
                {view === "projects" && "Projetos"}
                {view === "board" && "Quadro Kanban"}
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  margin: 0,
                }}
              >
                Ambiente conectado à sua API FastAPI.
              </p>
            </div>
          </div>

          {/* Views */}
          {view === "overview" && <OverviewView />}
          {view === "clients" && <ClientsView />}
          {view === "projects" && <ProjectsView />}
          {view === "board" && <BoardView />}
        </main>
      </div>
    </div>
  );
}

/** estilos reutilizáveis */

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  flex: 1,
  minWidth: "160px",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#111827",
  color: "#f9fafb",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: 500,
};

const mutedTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#9ca3af",
};

const metricCardStyle: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#6b7280",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#111827",
};

export default App;

