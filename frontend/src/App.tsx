import { useEffect, useState } from "react";
import { api } from "./services/api";

interface Client {
  id: number;
  name: string;
  contact?: string;
  notes?: string;
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  // Carregar lista de clientes
  useEffect(() => {
    api
      .get<Client[]>("/clients")
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  }, []);

  const handleAddClient = async () => {
    if (!name.trim()) return;
    try {
      const res = await api.post<Client>("/clients", {
        name,
        contact: contact || null,
      });
      setClients((prev) => [...prev, res.data]);
      setName("");
      setContact("");
    } catch (err) {
      console.error("Erro ao criar cliente:", err);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>ProjectFlow</h1>
      <p>Gerencie clientes de forma simples.</p>

      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>Novo cliente</h2>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            placeholder="Nome do cliente"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 2, padding: "8px" }}
          />
          <input
            placeholder="Contato"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={{ flex: 2, padding: "8px" }}
          />
          <button
            onClick={handleAddClient}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Adicionar
          </button>
        </div>
      </div>

      <h2>Clientes cadastrados</h2>
      {clients.length === 0 ? (
        <p>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <ul>
          {clients.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              {c.contact && ` — ${c.contact}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
