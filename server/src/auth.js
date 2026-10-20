import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'app.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const seedUsers = async () => {
  const count = await get('SELECT COUNT(*) as total FROM users');
  if (count.total > 0) return;

  const users = [
    ['admin@empresa.test', 'Admin', 'Sistema', 'admin', bcrypt.hashSync('admin123', 10)],
    ['rrhh@empresa.test', 'Recursos', 'Humanos', 'rrhh', bcrypt.hashSync('rrhh123', 10)],
    ['contador@empresa.test', 'Contador', 'General', 'contador', bcrypt.hashSync('contador123', 10)],
    ['consulta@empresa.test', 'Usuario', 'Consulta', 'consulta', bcrypt.hashSync('consulta123', 10)],
  ];

  for (const [email, first_name, last_name, role, password_hash] of users) {
    await run(
      `INSERT INTO users (email, first_name, last_name, role, password_hash) VALUES (?, ?, ?, ?, ?)`,
      [email, first_name, last_name, role, password_hash]
    );
  }
};

const seedParameters = async () => {
  const count = await get('SELECT COUNT(*) as total FROM parameters');
  if (count.total > 0) return;

  const seedData = [
    {
      code: 'remuneracion_base',
      name: 'Remuneración base',
      type: 'laboral',
      value: '0',
      unit: 'monto',
      source: 'Config manual',
      effective_from: '2025-01-01',
      effective_to: null,
      description: 'Parámetro general para la base de cálculo del trabajador.',
    },
    {
      code: 'asignacion_familiar',
      name: 'Asignación familiar',
      type: 'laboral',
      value: '0',
      unit: 'monto',
      source: 'Config manual',
      effective_from: '2025-01-01',
      effective_to: null,
      description: 'Monto de asignación familiar configurado por la empresa o la normativa vigente.',
    },
    {
      code: 'descuento_faltas',
      name: 'Descuento por faltas',
      type: 'laboral',
      value: '0',
      unit: 'factor',
      source: 'Config manual',
      effective_from: '2025-01-01',
      effective_to: null,
      description: 'Factor configurable usado en la validación del cálculo.',
    },
    {
      code: 'aporte_pensionario',
      name: 'Aporte pensionario',
      type: 'pensionario',
      value: '0',
      unit: 'factor',
      source: 'Config manual',
      effective_from: '2025-01-01',
      effective_to: null,
      description: 'Aporte parametrizado por la AFP/ONP autorizada o por la fuente legal vigente.',
    },
  ];

  for (const item of seedData) {
    await run(
      `INSERT INTO parameters (code, name, type, value, unit, source, effective_from, effective_to, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.code,
        item.name,
        item.type,
        item.value,
        item.unit,
        item.source,
        item.effective_from,
        item.effective_to,
        item.description,
      ]
    );
  }
};

const initDatabase = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'consulta',
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dni TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      position TEXT NOT NULL,
      area TEXT NOT NULL,
      contract_type TEXT NOT NULL,
      labor_regime TEXT NOT NULL,
      base_salary REAL NOT NULL,
      pension_system TEXT NOT NULL,
      bank_account TEXT,
      entry_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS parameters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      unit TEXT,
      source TEXT,
      effective_from TEXT NOT NULL,
      effective_to TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payrolls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      month TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'borrador',
      total_bruto REAL DEFAULT 0,
      total_descuentos REAL DEFAULT 0,
      total_neto REAL DEFAULT 0,
      created_by INTEGER,
      approved_by INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (approved_by) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payroll_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payroll_id INTEGER NOT NULL,
      worker_id INTEGER NOT NULL,
      worked_days REAL DEFAULT 0,
      absences REAL DEFAULT 0,
      tardiness REAL DEFAULT 0,
      overtime_hours REAL DEFAULT 0,
      family_allowance REAL DEFAULT 0,
      other_income REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      employer_contributions REAL DEFAULT 0,
      gross REAL DEFAULT 0,
      net REAL DEFAULT 0,
      status TEXT DEFAULT 'pendiente',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (payroll_id) REFERENCES payrolls(id),
      FOREIGN KEY (worker_id) REFERENCES workers(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await seedUsers();
  await seedParameters();
};

export {
  db,
  run,
  get,
  all,
  initDatabase,
};
