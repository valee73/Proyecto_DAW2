import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [eventos, setEventos] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando eventos...");
  const [cargando, setCargando] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    descripcion: "",
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  async function cargarEventos() {
    setCargando(true);
    setMensaje("Cargando eventos...");

    const { data, error } = await supabase
      .from("Eventos")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) {
      setMensaje("Error cargando eventos: " + error.message);
      setEventos([]);
    } else {
      setEventos(data || []);
      setMensaje(`Eventos encontrados: ${data?.length ?? 0}`);
    }

    setCargando(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limpiarFormulario() {
    setForm({ nombre: "", fecha: "", lugar: "", descripcion: "" });
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nombre.trim()) {
      setMensaje("El nombre del evento es obligatorio.");
      return;
    }

    setCargando(true);

    if (editingId) {
      const { error } = await supabase
        .from("Eventos")
        .update({
          nombre: form.nombre,
          fecha: form.fecha,
          lugar: form.lugar,
          descripcion: form.descripcion,
        })
        .eq("id", editingId);

      if (error) {
        setMensaje("Error actualizando evento: " + error.message);
      } else {
        setMensaje("Evento actualizado correctamente.");
        limpiarFormulario();
        await cargarEventos();
      }
    } else {
      const { error } = await supabase.from("Eventos").insert([
        {
          nombre: form.nombre,
          fecha: form.fecha,
          lugar: form.lugar,
          descripcion: form.descripcion,
        },
      ]);

      if (error) {
        setMensaje("Error creando evento: " + error.message);
      } else {
        setMensaje("Evento creado correctamente.");
        limpiarFormulario();
        await cargarEventos();
      }
    }

    setCargando(false);
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Eliminar este evento?");
    if (!confirmar) return;

    setCargando(true);

    const { error } = await supabase.from("Eventos").delete().eq("id", id);

    if (error) {
      setMensaje("Error eliminando evento: " + error.message);
    } else {
      setMensaje("Evento eliminado correctamente.");
      await cargarEventos();
    }

    setCargando(false);
  }

  function handleEditar(evento) {
    setEditingId(evento.id);
    setForm({
      nombre: evento.nombre ?? "",
      fecha: evento.fecha ?? "",
      lugar: evento.lugar ?? "",
      descripcion: evento.descripcion ?? "",
    });
    setMensaje("Editando evento: " + evento.nombre);
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 16 }}>Sistema de Eventos</h1>

      <section style={{ marginBottom: 24, padding: 24, border: "1px solid #ddd", borderRadius: 12, background: "#fafafa" }}>
        <h2>{editingId ? "Editar evento" : "Crear evento"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
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
              onChange={handleChange}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Lugar
            <input
              name="lugar"
              value={form.lugar}
              onChange={handleChange}
              placeholder="Ubicación del evento"
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del evento"
              rows={4}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" disabled={cargando} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "white", cursor: "pointer" }}>
              {editingId ? "Actualizar evento" : "Guardar evento"}
            </button>
            {editingId && (
              <button type="button" onClick={limpiarFormulario} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #999", background: "white", cursor: "pointer" }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

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
                    <p style={{ margin: 0, color: "#555" }}>{evento.lugar || "Sin lugar"} • {evento.fecha || "Sin fecha"}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => handleEditar(evento)} disabled={cargando} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#1d4ed8", cursor: "pointer" }}>
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(evento.id)} disabled={cargando} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #dc2626", background: "#fee2e2", color: "#b91c1c", cursor: "pointer" }}>
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
    </div>
  );
}

export default App;
