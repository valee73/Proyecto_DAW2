import type { ChangeEvent, FormEvent } from "react";

type FormState = {
  nombre: string;
  fecha: string;
  lugar: string;
  precio: string;
  tipo: string;
  descripcion: string;
  imagen: File | null;
};

type EventFormProps = {
  form: FormState;
  editingId: number | null;
  cargando: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function EventForm({ form, editingId, cargando, onChange, onSubmit, onCancel }: EventFormProps) {
  return (
    <section className="event-form">
      <h2 className="form-title">
        {editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}
      </h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label className="form-label">
          Nombre
          <input
            className="form-input"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            placeholder="Nombre del evento"
            required
          />
        </label>
        <label className="form-label">
          Fecha
          <input
            className="form-input"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={onChange}
          />
        </label>
        <label className="form-label">
          Lugar
          <input
            className="form-input"
            name="lugar"
            value={form.lugar}
            onChange={onChange}
            placeholder="Ubicacion del evento"
          />
        </label>
        <label className="form-label">
          Precio
          <input
            className="form-input"
            type="number"
            min="0"
            step="0.01"
            name="precio"
            value={form.precio}
            onChange={onChange}
            placeholder="Precio del evento"
          />
        </label>
        <label className="form-label">
          Tipo
          <select
            className="form-select"
            name="tipo"
            value={form.tipo}
            onChange={onChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            <option value="concierto">Concierto</option>
            <option value="show">Show</option>
            <option value="festival">Festival</option>
          </select>
        </label>
        <label className="form-label">
          Imagen (opcional)
          <input
            className="form-input"
            type="file"
            name="imagen"
            accept="image/*"
            onChange={onChange}
          />
        </label>
        <label className="form-label full-width">
          Descripcion
          <textarea
            className="form-textarea"
            name="descripcion"
            value={form.descripcion}
            onChange={onChange}
            placeholder="Descripcion del evento"
            rows={4}
          />
        </label>
        <div className="form-buttons">
          <button className="btn-submit" type="submit" disabled={cargando}>
            {editingId ? 'Actualizar Evento' : 'Guardar Evento'}
          </button>
          {editingId && (
            <button className="btn-cancel" type="button" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default EventForm;
