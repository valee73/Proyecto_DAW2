import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { supabase, supabaseKey, supabaseUrl } from "./supabaseClient.ts";
import EventForm from "./components/EventForm.tsx";
import EventList from "./components/EventList.tsx";
import "./eventos.css";

type Evento = {
  id: number;
  nombre: string;
  fecha: string;
  lugar: string;
  precio: number | null;
  tipo: string;
  imagen: string | null;
  descripcion: string | null;
};

type FormState = {
  nombre: string;
  fecha: string;
  lugar: string;
  precio: string;
  tipo: string;
  descripcion: string;
  imagen: File | null;
};

function App() {
  const [eventosFuturos, setEventosFuturos] = useState<Evento[]>([]);
  const [eventosPasados, setEventosPasados] = useState<Evento[]>([]);
  const [mensaje, setMensaje] = useState("Cargando eventos...");
  const [cargando, setCargando] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [proximosEventos, setProximosEventos] = useState(0);
  const [form, setForm] = useState<FormState>({
    nombre: "",
    fecha: "",
    lugar: "",
    precio: "",
    tipo: "",
    descripcion: "",
    imagen: null,
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  // Contador dinámico que se actualiza cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todosEventos = [...eventosFuturos, ...eventosPasados];
      const futurosActualizados = todosEventos.filter(evento => new Date(evento.fecha) >= today);
      setProximosEventos(futurosActualizados.length);
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [eventosFuturos, eventosPasados]);

  async function cargarEventos() {
    setCargando(true);
    setMensaje("Cargando eventos...");

    const { data, error } = await supabase
      .from<Evento>("Eventos")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) {
      setMensaje("Error cargando eventos: " + error.message);
      setEventosFuturos([]);
      setEventosPasados([]);
      setProximosEventos(0);
    } else {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Fecha actual sin hora

      const futuros = data
        .filter(evento => new Date(evento.fecha) >= today)
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      const pasados = data
        .filter(evento => new Date(evento.fecha) < today)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      setEventosFuturos(futuros);
      setEventosPasados(pasados);
      setProximosEventos(futuros.length);
      setMensaje(`Eventos encontrados: ${data.length} (Próximos: ${futuros.length}, Pasados: ${pasados.length})`);
    }

    setCargando(false);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type, files } = event.target as HTMLInputElement;
    if (type === 'file' && files) {
      setForm((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function limpiarFormulario() {
    setForm({ nombre: "", fecha: "", lugar: "", precio: "", tipo: "", descripcion: "", imagen: null });
    setEditingId(null);
  }

  async function subirImagen(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `eventos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('imagenes-eventos')
        .upload(filePath, file);

      if (error) {
        console.error('Error subiendo imagen:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('imagenes-eventos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nombre.trim()) {
      setMensaje("El nombre del evento es obligatorio.");
      return;
    }

    if (!form.tipo.trim()) {
      setMensaje("Selecciona el tipo de evento.");
      return;
    }

    if (!form.precio.trim()) {
      setMensaje("El precio del evento es obligatorio.");
      return;
    }

    const precioValue = parseFloat(form.precio);
    if (Number.isNaN(precioValue) || precioValue < 0) {
      setMensaje("Ingresa un precio válido.");
      return;
    }

    setCargando(true);

    // Subir imagen si existe
    let imagenUrl = null;
    if (form.imagen) {
      setMensaje("Subiendo imagen...");
      imagenUrl = await subirImagen(form.imagen);
      if (!imagenUrl) {
        setMensaje("Error subiendo la imagen. Intenta de nuevo.");
        setCargando(false);
        return;
      }
    }

    const eventoData: {
      nombre: string;
      fecha: string;
      lugar: string;
      precio: number;
      descripcion: string;
      tipo: string;
      imagen?: string | null;
    } = {
      nombre: form.nombre,
      fecha: form.fecha,
      lugar: form.lugar,
      precio: precioValue,
      descripcion: form.descripcion,
      tipo: form.tipo,
      imagen: imagenUrl,
    };

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "return=representation",
    };

    if (editingId) {
      const response = await fetch(`${supabaseUrl}/rest/v1/Eventos?id=eq.${editingId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(eventoData),
      });

      const result = await response.json();
      if (!response.ok) {
        setMensaje("Error actualizando evento: " + (result?.message ?? response.statusText));
      } else {
        setMensaje("Evento actualizado correctamente.");
        limpiarFormulario();
        await cargarEventos();
      }
    } else {
      const response = await fetch(`${supabaseUrl}/rest/v1/Eventos`, {
        method: "POST",
        headers,
        body: JSON.stringify(eventoData),
      });

      const result = await response.json();
      if (!response.ok) {
        setMensaje("Error creando evento: " + (result?.message ?? response.statusText));
      } else {
        setMensaje("Evento creado correctamente.");
        limpiarFormulario();
        await cargarEventos();
      }
    }

    setCargando(false);
  }

  async function handleEliminar(id: number) {
    const confirmar = window.confirm("¿Eliminar este evento?");
    if (!confirmar) return;

    setCargando(true);

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/Eventos?id=eq.${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await response.json();
    if (!response.ok) {
      setMensaje("Error eliminando evento: " + (result?.message ?? response.statusText));
    } else {
      setMensaje("Evento eliminado correctamente.");
      await cargarEventos();
    }

    setCargando(false);
  }

  function handleEditar(evento: Evento) {
    setEditingId(evento.id);
    setForm({
      nombre: evento.nombre ?? "",
      fecha: evento.fecha ?? "",
      lugar: evento.lugar ?? "",
      precio: evento.precio != null ? String(evento.precio) : "",
      tipo: evento.tipo ?? "",
      descripcion: evento.descripcion ?? "",
    });
    setMensaje("Editando evento: " + evento.nombre);
  }

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <h1>Sistema de Eventos</h1>
        </header>

        <p className="app-message">
          {mensaje}
        </p>

        <EventForm form={form} editingId={editingId} cargando={cargando} onChange={handleChange} onSubmit={handleSubmit} onCancel={limpiarFormulario} />
        
        <section className="section-future">
          <h2 className="section-title">
            Proximos Eventos
            <span className="event-counter">
              {proximosEventos}
            </span>
          </h2>
          <EventList eventos={eventosFuturos} mensaje={eventosFuturos.length === 0 ? "No hay proximos eventos. Crea uno nuevo!" : ""} cargando={cargando} onDelete={handleEliminar} />
        </section>
        
        <section className="section-past">
          <h2 className="section-title">
            Eventos Pasados
          </h2>
          <EventList eventos={eventosPasados} mensaje={eventosPasados.length === 0 ? "No hay eventos pasados aun." : ""} cargando={cargando} onDelete={handleEliminar} />
        </section>
      </div>
    </div>
  );
}

export default App;
