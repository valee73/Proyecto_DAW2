function EventForm({ form, editingId, cargando, onChange, onSubmit, onCancel }) {
  return (
    <section style={{ marginBottom: 24, padding: 24, border: "1px solid #ddd", borderRadius: 12, background: "#fafafa" }}>
      <h2>{editingId ? "Editar evento" : "Crear evento"}</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Nombre del evento"
            required
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Fecha
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={onChange}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Lugar
          <input
            name="lugar"
            value={form.lugar}
            onChange={onChange}
            placeholder="Ubicación del evento"
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            placeholder="Descripción del evento"
            rows={4}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={cargando}
            style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}
          >
            {editingId ? "Actualizar evento" : "Guardar evento"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #999", background: "white", cursor: "pointer" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default EventForm;
