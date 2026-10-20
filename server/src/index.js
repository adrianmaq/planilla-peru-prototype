* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
  font-family: Inter, Arial, sans-serif;
  background: #f3f6fb;
  color: #18212f;
}

button,
input,
select {
  font: inherit;
}

button {
  border: none;
  border-radius: 10px;
  background: #1d4ed8;
  color: white;
  cursor: pointer;
  padding: 0.75rem 1.1rem;
}

button:hover {
  opacity: 0.96;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.login-card {
  width: min(100%, 460px);
  background: white;
  border-radius: 18px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  padding: 32px;
}

.login-card h1 {
  margin: 0 0 8px;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
}

input,
select {
  width: 100%;
  border: 1px solid #d9e2f1;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  background: #f9fbff;
}

.message {
  margin-top: 16px;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: #dbeafe;
  color: #1e3a8a;
}

.demo-credentials {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
  color: #475569;
}

.dashboard {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
}

.sidebar {
  width: 260px;
  min-height: 100vh;
  background: #0f172a;
  color: white;
  padding: 22px 18px;
}

.sidebar h2 {
  margin-top: 0;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}

.sidebar nav a {
  color: #dbeafe;
  text-decoration: none;
}

.logout {
  margin-top: 24px;
  width: 100%;
  background: #ef4444;
}

.content {
  flex: 1;
  padding: 32px;
}

.topbar {
  background: white;
  padding: 18px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  margin-bottom: 24px;
}

.topbar h3,
.topbar p {
  margin: 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.card {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card strong {
  font-size: 1.5rem;
}

.panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  margin-top: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

th {
  background: #f8fafc;
}

@media (max-width: 800px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
  }

  .content {
    padding: 16px;
  }
}
