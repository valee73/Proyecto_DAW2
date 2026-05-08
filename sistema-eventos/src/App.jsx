import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import EventForm from "./components/EventForm.jsx";
import EventList from "./components/EventList.jsx";

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
      <EventForm form={form} editingId={editingId} cargando={cargando} onChange={handleChange} onSubmit={handleSubmit} onCancel={limpiarFormulario} />
      <EventList eventos={eventos} mensaje={mensaje} cargando={cargando} onEdit={handleEditar} onDelete={handleEliminar} />
    </div>
  );
}

export default App;
