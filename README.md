@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #f4f3ef;
  --panel: #ffffff;
  --dark: #112018;
  --gold: #b68d35;
  --gold-soft: #efe2b2;
  --muted: #69756d;
  --line: #eae7e1;
  --green: #1a7a46;
  --green-soft: #dff4e8;
  --red: #ba3b3b;
  --red-soft: #f9e3e3;
}

* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
  margin: 0;
  font-family: 'Cairo', sans-serif;
  background: var(--bg);
  color: var(--dark);
}
button, input, select { font: inherit; }
button { cursor: pointer; }

.app-shell {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f4f1 0%, #f0efe9 100%);
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #0f1a16 0%, #172b24 100%);
  color: #f0f4f1;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-left: 1px solid rgba(255,255,255,0.05);
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #d7b870, #a57f27);
  color: #1b1e1f;
}
.brand-box strong { display: block; font-size: 19px; }
.brand-box small { color: #afc4b5; }

.nav { display: grid; gap: 6px; }
.nav-item {
  background: transparent;
  border: 0;
  color: #dfe9e1;
  border-radius: 10px;
  padding: 12px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: right;
  transition: all 0.15s ease;
}
.nav-item.active {
  background: rgba(255,255,255,0.07);
  color: #f7d67a;
  box-shadow: inset 0 0 0 1px rgba(247,214,122,0.12);
}
.nav-item:hover { background: rgba(255,255,255,0.05); }

.status-box {
  margin-top: auto;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 12px 14px;
}
.online-pill {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  background: rgba(49, 194, 120, 0.12);
  color: #8ce3ae;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
}
.online-pill.offline {
  background: rgba(222, 166, 53, 0.12);
  color: #f0c975;
}
.status-box small {
  display: block;
  margin-top: 6px;
  color: #a9bbb0;
  font-size: 11px;
}

.main-area {
  flex: 1;
  padding: 26px 30px 22px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.small-label {
  display: block;
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 4px;
}
.header h1 {
  margin: 0;
  font-size: 30px;
}
.header-actions { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f1d68a, #bd8d35);
  font-weight: 700;
}
.ghost-btn, .primary-btn, .secondary-btn, .icon-btn {
  border: 0;
  border-radius: 10px;
  font-weight: 600;
  transition: transform 0.15s ease;
}
.ghost-btn:hover, .primary-btn:hover, .secondary-btn:hover, .icon-btn:hover { transform: translateY(-1px); }
.ghost-btn {
  background: #fff;
  color: var(--dark);
  border: 1px solid var(--line);
  padding: 9px 12px;
}
.primary-btn {
  background: linear-gradient(135deg, #143225 0%, #214d3a 100%);
  color: #fff;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.secondary-btn {
  background: #fff;
  color: var(--dark);
  border: 1px solid var(--line);
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  width: 34px;
  height: 34px;
  background: #f5f3ee;
  color: var(--dark);
}

.hero-card {
  background: linear-gradient(135deg, #0e1a16 0%, #213d33 100%);
  color: #f8faf9;
  border-radius: 18px;
  padding: 24px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  overflow: hidden;
  position: relative;
}
.hero-card small {
  color: #d4b96d;
  font-size: 12px;
}
.hero-card h2 { margin: 6px 0 8px; font-size: 28px; }
.hero-card p { margin: 0; color: #dfe8e3; max-width: 500px; }
.hero-icon {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
  color: #f0d279;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}
.metric-card {
  background: var(--panel);
  border-radius: 14px;
  padding: 18px 16px;
  border: 1px solid var(--line);
}
.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--muted);
  font-size: 12px;
}
.metric-icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f5f1e7;
  color: var(--gold);
}
.metric-card strong {
  display: block;
  margin-top: 10px;
  font-size: 22px;
}
.metric-card small { color: var(--muted); font-size: 11px; }

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 18px 14px;
  margin-bottom: 18px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.panel-head h3 { margin: 0; font-size: 20px; }
.panel-head p { margin: 4px 0 0; color: var(--muted); font-size: 12px; }

.price-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.price-box {
  background: #f8f7f4;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 12px;
}
.price-box span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}
.price-box strong {
  display: block;
  margin-top: 8px;
  font-size: 20px;
}

.toolbar {
  margin-bottom: 12px;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  background: #fafaf8;
  border-radius: 10px;
  padding: 8px 12px;
  max-width: 420px;
}
.search-box input {
  border: 0;
  background: transparent;
  width: 100%;
  outline: none;
  color: var(--dark);
}

.table-wrap {
  overflow: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}
th, td {
  text-align: right;
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
th {
  color: var(--muted);
  font-weight: 600;
  background: #fbfaf8;
}
.stock-ok, .stock-zero {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}
.stock-ok { background: var(--green-soft); color: var(--green); }
.stock-zero { background: var(--red-soft); color: var(--red); }

.sale-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}
.sale-grid label {
  display: grid;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
}
.sale-grid select,
.sale-grid input,
.price-editor-box input,
.form-grid input,
.form-grid select {
  width: 100%;
  border: 1px solid var(--line);
  background: #fbfaf8;
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--dark);
  outline: none;
}
.sale-grid select:focus,
.sale-grid input:focus,
.price-editor-box input:focus,
.form-grid input:focus,
.form-grid select:focus {
  border-color: #c7ab61;
  box-shadow: 0 0 0 3px rgba(182, 141, 53, 0.12);
}

.calc-box {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  border: 1px solid var(--line);
  background: #f9f7f3;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 18px;
}
.calc-box div {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12px;
  color: var(--muted);
}
.calc-box strong { color: var(--dark); font-size: 18px; }
.grand-total { background: rgba(182,141,53,0.08); border-radius: 10px; padding: 8px; }
.grand-total strong { color: var(--dark); }

.form-actions-row {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.price-editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.price-editor-box {
  display: grid;
  gap: 8px;
  background: #faf9f7;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
  color: var(--muted);
}
.price-editor-box div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.price-editor-box small { color: var(--muted); }

.backup-boxes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.backup-box {
  border: 1px solid var(--line);
  background: #faf9f6;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.backup-box > div {
  display: grid;
  gap: 2px;
}
.backup-box strong { font-size: 15px; }
.backup-box small { color: var(--muted); font-size: 12px; }
.file-label {
  position: relative;
  overflow: hidden;
}
.file-label input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.sync-note {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff4dd;
  color: #6c5323;
  border: 1px solid #f3dba7;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 32, 24, 0.46);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 20;
}
.modal-box {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--line);
  padding: 18px 18px 14px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.form-grid label {
  display: grid;
  gap: 7px;
  font-size: 12px;
  color: var(--muted);
}
.full-row { grid-column: 1 / -1; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px; }

.toast {
  position: fixed;
  left: 24px;
  bottom: 24px;
  background: rgba(16, 25, 22, 0.92);
  color: white;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 12px;
  z-index: 40;
}

@media (max-width: 980px) {
  .app-shell { flex-direction: column; }
  .sidebar { width: 100%; }
  .main-area { padding: 20px 14px 14px; }
  .stats-grid,
  .price-grid,
  .sale-grid,
  .calc-box,
  .backup-boxes,
  .price-editor-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .stats-grid,
  .price-grid,
  .sale-grid,
  .calc-box,
  .backup-boxes,
  .price-editor-grid,
  .form-grid { grid-template-columns: 1fr; }
  .hero-card { flex-direction: column; align-items: flex-start; }
  .header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .panel-head { align-items: flex-start; flex-direction: column; gap: 10px; }
}
