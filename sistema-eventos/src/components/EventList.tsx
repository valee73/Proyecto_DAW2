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

type EventListProps = {
  eventos: Evento[];
  mensaje: string;
  cargando: boolean;
  onDelete: (id: number) => void;
};

function EventList({ eventos, mensaje, cargando, onDelete }: EventListProps) {
  return (
    <section>
      {mensaje && <p className="empty-message">{mensaje}</p>}

      {eventos.length === 0 ? null : (
        <div className="events-grid">
          {eventos.map((evento) => (
            <article key={evento.id} className="event-card">
              <div className="event-card-accent" />

              <div className="event-card-content">
                <h3 className="event-title">
                  {evento.nombre || "Evento sin nombre"}
                  <span className={`event-badge ${evento.tipo}`}>
                    {evento.tipo}
                  </span>
                </h3>

                {evento.imagen && (
                  <div className="event-image">
                    <img src={evento.imagen} alt={evento.nombre} />
                  </div>
                )}

                <div className="event-details">
                  <p className="event-detail">
                    <strong>Fecha:</strong> {evento.fecha || "Sin fecha"}
                  </p>
                  <p className="event-detail">
                    <strong>Lugar:</strong> {evento.lugar || "Sin lugar"}
                  </p>
                  {evento.precio != null && (
                    <p className="event-detail event-price">
                      <strong>Precio:</strong> {evento.precio.toFixed(2)}
                    </p>
                  )}
                </div>

                {evento.descripcion && (
                  <p className="event-description">{evento.descripcion}</p>
                )}

                <div className="event-actions">
                  <button className="btn-delete" onClick={() => onDelete(evento.id)} disabled={cargando}>
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default EventList;
