function EventList({ eventos, mensaje, cargando, onEdit, onDelete }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2>Lista de eventos</h2>
      <p>{mensaje}</p>

      {eventos.length === 0 ? (
        <p>No hay eventos registrados.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {eventos.map((evento) => (
            <article key={evento.id} style={{ padding: 18, border: "1px solid #ddd", borderRadius: 12, background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px" }}>{evento.nombre || "Evento sin nombre"}</h3>
                  <p style={{ margin: 0, color: "#555" }}>
                    {evento.lugar || "Sin lugar"} • {evento.fecha || "Sin fecha"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => onEdit(evento)}
                    disabled={cargando}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#1d4ed8", cursor: "pointer" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(evento.id)}
                    disabled={cargando}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #dc2626", background: "#fee2e2", color: "#b91c1c", cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              {evento.descripcion && <p style={{ marginTop: 12 }}>{evento.descripcion}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default EventList;
