import React, { useState, useEffect } from "react";
import {
  Instagram, Facebook, Music2, Plus, X, Pencil,
  ExternalLink, Image as ImageIcon, Video, Trash2
} from "lucide-react";

const STORAGE_KEY = "bento-portal-data";

const ACCENTS = ["#7C6FE8", "#A6C261", "#F2966B", "#F0B429", "#4FB6A8", "#E8779F"];

const STATUS = {
  backlog: { label: "Por hacer", bg: "#EFEAE0", fg: "#8A8378" },
  inprogress: { label: "En proceso", bg: "#EDE9FB", fg: "#6952D6" },
  done: { label: "Listo", bg: "#EAF1DA", fg: "#5C7A2E" },
};
const STATUS_ORDER = ["backlog", "inprogress", "done"];

const PLATFORM_ICONS = { Instagram, Facebook, TikTok: Music2 };

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatMonth(value) {
  if (!value) return "";
  const [y, m] = value.split("-");
  return `${MESES[parseInt(m, 10) - 1]} ${y}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultClient(name, handle, accent) {
  return {
    id: uid(),
    name,
    handle,
    accent,
    platforms: [
      { id: uid(), name: "Instagram", active: true },
      { id: uid(), name: "TikTok", active: true },
      { id: uid(), name: "Facebook", active: true },
    ],
    drive: { posts: "", reels: "" },
    guidelines: [],
    objectives: [],
    pieces: [],
  };
}

function seedKukull() {
  const c = defaultClient("Kukull Foods", "@kukullfoods", "#F2966B");
  c.guidelines = [
    { id: uid(), text: "Tono bilingüe ES/EN", status: "done" },
    { id: uid(), text: "Carruseles comparativos", status: "inprogress" },
    { id: uid(), text: "Banco de 100+ ideas", status: "done" },
    { id: uid(), text: "Prompts de video con IA", status: "inprogress" },
  ];
  c.objectives = [
    { id: uid(), text: "Alcanzar comunidad latina en EUA", status: "inprogress" },
    { id: uid(), text: "Aumentar cupones canjeados", status: "inprogress" },
    { id: uid(), text: "Contenido bilingüe consistente", status: "done" },
  ];
  c.pieces = [
    { id: uid(), platform: "Instagram", type: "post", month: "2026-08", title: "Kukull vs. snacks gringos", caption: "Carrusel comparativo mostrando por qué Kukull gana en sabor y en nostalgia. Bilingüe, con datos de sabor.", status: "done" },
    { id: uid(), platform: "TikTok", type: "reel", month: "2026-08", title: "Receta rápida con Kukull", caption: "Reel de 15 seg, receta express usando el snack como ingrediente sorpresa.", status: "inprogress" },
    { id: uid(), platform: "Instagram", type: "post", month: "2026-08", title: "Cupón de temporada", caption: "Post anunciando el cupón del mes, link en bio, CTA claro.", status: "backlog" },
    { id: uid(), platform: "Facebook", type: "post", month: "2026-08", title: "Testimonios de la comunidad", caption: "Reposteo de comentarios y reviews de clientes reales de la comunidad latina.", status: "inprogress" },
  ];
  return c;
}

function defaultData() {
  const kukull = seedKukull();
  return { activeId: kukull.id, clients: { [kukull.id]: kukull } };
}

export default function BentoContentPortal() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [monthFilter, setMonthFilter] = useState("2026-08");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [modalPiece, setModalPiece] = useState(null);
  const [addingClient, setAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientHandle, setNewClientHandle] = useState("");
  const [newClientAccent, setNewClientAccent] = useState(ACCENTS[0]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          setData(JSON.parse(res.value));
        } else {
          setData(defaultData());
        }
      } catch (e) {
        setData(defaultData());
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded || !data) return;
    (async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        // best-effort persistence
      }
    })();
  }, [data, loaded]);

  if (!loaded || !data) {
    return (
      <div style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF6EC", fontFamily: "Inter, sans-serif", color: "#8A8378" }}>
        Cargando tu parrilla…
      </div>
    );
  }

  const client = data.clients[data.activeId];
  const clientList = Object.values(data.clients);

  function updateClient(patch) {
    setData((d) => ({
      ...d,
      clients: { ...d.clients, [client.id]: { ...d.clients[client.id], ...patch } },
    }));
  }

  function addClient() {
    if (!newClientName.trim()) return;
    const c = defaultClient(newClientName.trim(), newClientHandle.trim(), newClientAccent);
    setData((d) => ({ activeId: c.id, clients: { ...d.clients, [c.id]: c } }));
    setAddingClient(false);
    setNewClientName("");
    setNewClientHandle("");
    setNewClientAccent(ACCENTS[0]);
  }

  function switchClient(id) {
    setData((d) => ({ ...d, activeId: id }));
  }

  function updateGuideline(id, patch) {
    updateClient({ guidelines: client.guidelines.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
  }
  function addGuideline() {
    updateClient({ guidelines: [...client.guidelines, { id: uid(), text: "", status: "backlog" }] });
  }
  function removeGuideline(id) {
    updateClient({ guidelines: client.guidelines.filter((g) => g.id !== id) });
  }

  function updateObjective(id, patch) {
    updateClient({ objectives: client.objectives.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  }
  function addObjective() {
    updateClient({ objectives: [...client.objectives, { id: uid(), text: "", status: "backlog" }] });
  }
  function removeObjective(id) {
    updateClient({ objectives: client.objectives.filter((o) => o.id !== id) });
  }

  function togglePlatform(id) {
    updateClient({ platforms: client.platforms.map((p) => (p.id === id ? { ...p, active: !p.active } : p)) });
  }
  function addPlatform(name) {
    if (!name.trim()) return;
    updateClient({ platforms: [...client.platforms, { id: uid(), name: name.trim(), active: true }] });
  }

  function savePiece(piece) {
    const { isNew, ...clean } = piece;
    const exists = client.pieces.some((p) => p.id === clean.id);
    const pieces = exists ? client.pieces.map((p) => (p.id === clean.id ? clean : p)) : [...client.pieces, clean];
    updateClient({ pieces });
    setModalPiece(null);
  }
  function deletePiece(id) {
    updateClient({ pieces: client.pieces.filter((p) => p.id !== id) });
    setModalPiece(null);
  }

  const activePlatforms = client.platforms.filter((p) => p.active);
  const filteredPieces = client.pieces.filter(
    (p) => p.month === monthFilter && (platformFilter === "all" || p.platform === platformFilter)
  );

  return (
    <div style={{ background: "#FAF6EC", minHeight: "100%", fontFamily: "Inter, sans-serif", color: "#231F20", padding: "24px 16px 48px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap');`}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 18 }}>
          <span>🍱</span> Bentō Creativo
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {clientList.map((c) => (
            <button key={c.id} onClick={() => switchClient(c.id)}
              style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: c.id === client.id ? `2px solid ${c.accent}` : "2px solid transparent",
                background: c.id === client.id ? "#fff" : "#F1EBDC", color: "#231F20" }}>
              {c.name}
            </button>
          ))}
          <button onClick={() => setAddingClient((v) => !v)}
            style={{ padding: "6px 10px", borderRadius: 999, border: "2px dashed #C9BFA6", background: "transparent", color: "#8A8378", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <Plus size={14} /> Cliente
          </button>
        </div>
      </div>

      {addingClient && (
        <div style={{ maxWidth: 1080, margin: "0 auto 20px", background: "#fff", border: "1px solid #E7DFCF", borderRadius: 16, padding: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Nombre del cliente" value={newClientName} onChange={(e) => setNewClientName(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #E7DFCF", borderRadius: 8, fontSize: 14, flex: "1 1 180px" }} />
          <input placeholder="@handle" value={newClientHandle} onChange={(e) => setNewClientHandle(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #E7DFCF", borderRadius: 8, fontSize: 14, flex: "1 1 140px" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {ACCENTS.map((a) => (
              <button key={a} onClick={() => setNewClientAccent(a)}
                style={{ width: 24, height: 24, borderRadius: "50%", background: a, border: newClientAccent === a ? "2px solid #231F20" : "2px solid transparent", cursor: "pointer" }} />
            ))}
          </div>
          <button onClick={addClient} style={{ padding: "8px 16px", borderRadius: 8, background: "#231F20", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Crear</button>
          <button onClick={() => setAddingClient(false)} style={{ padding: "8px 12px", borderRadius: 8, background: "transparent", color: "#8A8378", border: "none", fontSize: 14, cursor: "pointer" }}>Cancelar</button>
        </div>
      )}

      <div style={{ maxWidth: 1080, margin: "0 auto 24px", position: "relative", background: "#fff", border: "1px solid #E7DFCF", borderRadius: 20, padding: "24px 28px" }}>
        <Tape color={client.accent} label="propuesta" />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: client.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
            {client.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A8378", fontWeight: 600, marginBottom: 4 }}>Propuesta de contenido</div>
            <input value={client.name} onChange={(e) => updateClient({ name: e.target.value })}
              style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 26, border: "none", outline: "none", background: "transparent", width: "100%", color: "#231F20" }} />
            <input value={client.handle} onChange={(e) => updateClient({ handle: e.target.value })}
              style={{ fontSize: 14, border: "none", outline: "none", background: "transparent", color: "#8A8378", width: "100%" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto 16px", display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: 11, color: "#8A8378", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Mes</label>
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #E7DFCF", borderRadius: 8, fontSize: 14, background: "#fff" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <FilterPill active={platformFilter === "all"} onClick={() => setPlatformFilter("all")} accent={client.accent}>Todo</FilterPill>
          {activePlatforms.map((p) => (
            <FilterPill key={p.id} active={platformFilter === p.name} onClick={() => setPlatformFilter(p.name)} accent={client.accent}>{p.name}</FilterPill>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto 28px" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15 }}>
          Calendario de publicaciones · {formatMonth(monthFilter)} · {filteredPieces.length} piezas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginTop: 12 }}>
          {filteredPieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} accent={client.accent} onClick={() => setModalPiece(piece)} />
          ))}
          <button onClick={() => setModalPiece({ id: uid(), platform: activePlatforms[0]?.name || "Instagram", type: "post", month: monthFilter, title: "", caption: "", status: "backlog", isNew: true })}
            style={{ border: "2px dashed #C9BFA6", borderRadius: 16, minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "#8A8378", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <Plus size={20} /> Agregar pieza
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ maxWidth: 1080, margin: "0 auto 24px" }}>
        <FolderCard label="posts" title="Posts" icon={ImageIcon} accent={client.accent} url={client.drive.posts} onUrlChange={(v) => updateClient({ drive: { ...client.drive, posts: v } })} />
        <FolderCard label="reels" title="Reels" icon={Video} accent={client.accent} url={client.drive.reels} onUrlChange={(v) => updateClient({ drive: { ...client.drive, reels: v } })} />
        <PlatformsCard client={client} onToggle={togglePlatform} onAdd={addPlatform} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 1080, margin: "0 auto" }}>
        <KanbanCard label="guías" title="Lineamientos de comunicación" items={client.guidelines}
          onUpdate={updateGuideline} onAdd={addGuideline} onRemove={removeGuideline} accent={client.accent} />
        <KanbanCard label="metas" title="Objetivos" items={client.objectives}
          onUpdate={updateObjective} onAdd={addObjective} onRemove={removeObjective} accent={client.accent} />
      </div>

      <div style={{ maxWidth: 1080, margin: "24px auto 0", textAlign: "center", fontSize: 11, color: "#B8B0A0" }}>
        Tus datos se guardan solo en este navegador, por cliente.
      </div>

      {modalPiece && (
        <PieceModal piece={modalPiece} accent={client.accent} platforms={activePlatforms} onSave={savePiece} onDelete={deletePiece} onClose={() => setModalPiece(null)} />
      )}
    </div>
  );
}

function Tape({ color, label }) {
  return (
    <div style={{ position: "absolute", top: -12, left: 24, background: color, color: "#fff", padding: "3px 14px", borderRadius: 4, fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: 16, transform: "rotate(-3deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
      {label}
    </div>
  );
}

function FilterPill({ active, onClick, accent, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
      border: active ? `2px solid ${accent}` : "1px solid #E7DFCF",
      background: active ? "#fff" : "#F1EBDC", color: "#231F20",
    }}>{children}</button>
  );
}

function PieceCard({ piece, accent, onClick }) {
  const Icon = PLATFORM_ICONS[piece.platform] || ImageIcon;
  const s = STATUS[piece.status] || STATUS.backlog;
  return (
    <button onClick={onClick} style={{ textAlign: "left", background: "#fff", border: "1px solid #E7DFCF", borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", padding: 0 }}>
      <div style={{ height: 100, background: `linear-gradient(135deg, ${accent}33, ${accent}66)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {piece.type === "reel" ? <Video color="#fff" size={26} /> : <ImageIcon color="#fff" size={26} />}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Icon size={13} color="#8A8378" />
          <span style={{ fontSize: 11, color: "#8A8378", fontWeight: 600 }}>{piece.platform}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{piece.title || "Sin título"}</div>
        <div style={{ fontSize: 12, color: "#8A8378", marginBottom: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{piece.caption || "Sin copy todavía…"}</div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: s.bg, color: s.fg }}>{s.label}</span>
      </div>
    </button>
  );
}

function FolderCard({ label, title, icon: Icon, accent, url, onUrlChange }) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ position: "relative", background: "#fff", border: "1px solid #E7DFCF", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
      <Tape color={accent} label={label} />
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
        <Icon size={22} color={accent} />
      </div>
      <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15 }}>{title}</div>
      {editing ? (
        <input autoFocus value={url} onChange={(e) => onUrlChange(e.target.value)} onBlur={() => setEditing(false)}
          placeholder="Pega el link de Drive"
          style={{ fontSize: 12, border: "1px solid #E7DFCF", borderRadius: 8, padding: "6px 10px", width: "100%" }} />
      ) : url ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>Abrir en Drive <ExternalLink size={12} /></a>
          <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8378" }}><Pencil size={12} /></button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} style={{ fontSize: 12, color: "#8A8378", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>+ agregar link</button>
      )}
    </div>
  );
}

function PlatformsCard({ client, onToggle, onAdd }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ position: "relative", background: "#fff", border: "1px solid #E7DFCF", borderRadius: 16, padding: 18 }}>
      <Tape color={client.accent} label="canales" />
      <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginTop: 8, marginBottom: 10 }}>Plataformas</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {client.platforms.map((p) => (
          <button key={p.id} onClick={() => onToggle(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: p.active ? "#5C7A2E" : "#B8B0A0" }}>{p.active ? "Activo ✓" : "Inactivo"}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="+ canal"
          style={{ fontSize: 12, border: "1px solid #E7DFCF", borderRadius: 8, padding: "5px 8px", flex: 1 }} />
        <button onClick={() => { onAdd(val); setVal(""); }} style={{ border: "none", background: client.accent, color: "#fff", borderRadius: 8, width: 26, cursor: "pointer" }}><Plus size={14} /></button>
      </div>
    </div>
  );
}

function KanbanCard({ label, title, items, onUpdate, onAdd, onRemove, accent }) {
  return (
    <div style={{ position: "relative", background: "#fff", border: "1px solid #E7DFCF", borderRadius: 16, padding: 18 }}>
      <Tape color={accent} label={label} />
      <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 15, marginTop: 8, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => {
          const s = STATUS[it.status];
          return (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input value={it.text} onChange={(e) => onUpdate(it.id, { text: e.target.value })} placeholder="Escribe aquí…"
                style={{ flex: 1, fontSize: 13, border: "none", borderBottom: "1px solid transparent", outline: "none", background: "transparent", padding: "4px 0" }}
                onFocus={(e) => (e.target.style.borderBottom = "1px solid #E7DFCF")} onBlur={(e) => (e.target.style.borderBottom = "1px solid transparent")} />
              <button onClick={() => onUpdate(it.id, { status: STATUS_ORDER[(STATUS_ORDER.indexOf(it.status) + 1) % 3] })}
                style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: s.bg, color: s.fg, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>{s.label}</button>
              <button onClick={() => onRemove(it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C9BFA6" }}><X size={14} /></button>
            </div>
          );
        })}
      </div>
      <button onClick={onAdd} style={{ marginTop: 10, fontSize: 12, color: "#8A8378", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
        <Plus size={13} /> Agregar
      </button>
    </div>
  );
}

function PieceModal({ piece, accent, platforms, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(piece);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(35,31,32,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, maxWidth: 440, width: "100%", padding: 24, maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 18 }}>{piece.isNew ? "Nueva pieza" : "Editar pieza"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <FieldLabel>Plataforma</FieldLabel>
        <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #E7DFCF", borderRadius: 8, marginBottom: 12, fontSize: 14 }}>
          {platforms.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        <FieldLabel>Tipo</FieldLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["post", "reel"].map((t) => (
            <button key={t} onClick={() => setForm({ ...form, type: t })}
              style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", border: form.type === t ? `2px solid ${accent}` : "1px solid #E7DFCF", background: form.type === t ? "#fff" : "#F1EBDC" }}>
              {t === "post" ? "Post" : "Reel"}
            </button>
          ))}
        </div>

        <FieldLabel>Mes</FieldLabel>
        <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #E7DFCF", borderRadius: 8, marginBottom: 12, fontSize: 14 }} />

        <FieldLabel>Título</FieldLabel>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #E7DFCF", borderRadius: 8, marginBottom: 12, fontSize: 14 }} />

        <FieldLabel>Copy</FieldLabel>
        <textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} rows={4}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #E7DFCF", borderRadius: 8, marginBottom: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />

        <FieldLabel>Estatus</FieldLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {STATUS_ORDER.map((st) => (
            <button key={st} onClick={() => setForm({ ...form, status: st })}
              style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: form.status === st ? `2px solid ${accent}` : "1px solid #E7DFCF", background: STATUS[st].bg, color: STATUS[st].fg }}>
              {STATUS[st].label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {!piece.isNew ? (
            <button onClick={() => onDelete(piece.id)} style={{ color: "#C0594A", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <Trash2 size={14} /> Eliminar
            </button>
          ) : <span />}
          <button onClick={() => onSave(form)} style={{ padding: "9px 20px", borderRadius: 10, background: "#231F20", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: "#8A8378", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{children}</div>;
}
