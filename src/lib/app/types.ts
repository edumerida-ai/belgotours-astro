export type AppRole = 'super_admin' | 'operations_admin' | 'staff' | 'guide';

export interface AppUser {
  id: number;
  email: string;
  username: string;
  role: AppRole;
  strapiToken: string;
}

export interface Tour {
  id: number;
  titulo: string;
  slug: string;
  ciudad: 'bruselas' | 'brujas';
  tipo_tour: 'free' | 'privado' | 'especial';
  duracion: number;
  precio_base?: number;
  pago_libre: boolean;
  punto_encuentro: string;
  rating: number;
  locale: string;
}

export interface Guia {
  id: number;
  nombre: string;
  slug: string;
  idiomas: string;
  activo: boolean;
}

export interface Horario {
  id: number;
  fecha: string;
  hora: string;
  cupoMaximo: number;
  cupoOcupado: number;
  disponible: boolean;
  cupoLibre?: number;
  tour: Tour;
  recurrencia?: { id: number; idioma: string };
  reservas?: Reserva[];
}

export type PlataformaOrigen =
  | 'web' | 'guruwalk' | 'civitatis' | 'freetour'
  | 'tripadvisor' | 'getyourguide' | 'viator'
  | 'whatsapp' | 'instagram' | 'facebook' | 'youtube'
  | 'tiktok' | 'seo' | 'google_ads' | 'email'
  | 'qr' | 'flyer' | 'agencia_externa' | 'manual';

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada';

export type ComportamientoCliente =
  | 'normal' | 'conflictivo' | 'sospechoso'
  | 'agresivo' | 'borracho' | 'competencia' | 'otro';

export interface Reserva {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  ciudad?: string;
  pais?: string;
  idioma_cliente: 'es' | 'en' | 'it';
  idioma_tour: 'es' | 'en' | 'it';
  tipo_tour: 'free' | 'privado' | 'especial';
  fecha_hora_tour: string;
  adultos: number;
  ninos: number;
  estado: EstadoReserva;
  plataforma_origen: PlataformaOrigen;
  origen_reserva: 'web' | 'manual' | 'whatsapp' | 'agencia' | 'organico' | 'pagado';
  comportamiento_cliente: ComportamientoCliente;
  observaciones_guia?: string;
  comentarios_cliente?: string;
  notas_internas?: string;
  whatsapp_enviado: boolean;
  email_confirmacion_enviado: boolean;
  resena_enviada: boolean;
  comision_por_persona?: number;
  comision_total?: number;
  plataforma_fee?: number;
  external_reference_id?: string;
  synced_with_platform: boolean;
  tour: Tour;
  guia?: Guia;
  horario?: { id: number; fecha: string; hora: string };
  createdAt: string;
  updatedAt: string;
}

export type EstadoReview = 'pendiente' | 'aprobada' | 'rechazada';

export interface Review {
  id: number;
  rating_general: number;
  profesionalidad?: number;
  diversion?: number;
  comunicacion?: number;
  calidad?: number;
  ruta?: number;
  cliente_nombre: string;
  cliente_email: string;
  cliente_ciudad?: string;
  cliente_pais?: string;
  comentario_publico?: string;
  comentario_privado?: string;
  fecha_tour: string;
  idioma: 'es' | 'en' | 'it' | 'fr';
  numero_personas: number;
  estado: EstadoReview;
  visible_web: boolean;
  tour: Tour;
  reserva?: { id: number };
  guia?: Guia;
  es_verificada: boolean;
  origen: 'web' | 'whatsapp' | 'manual';
  tipo_experiencia?: 'free' | 'especial' | 'privado';
  sentiment_score?: number;
  fecha_publicacion?: string;
  createdAt: string;
}

export interface MailJob {
  id: number;
  email_to: string;
  subject: string;
  body?: string;
  status: 'pending' | 'sent' | 'failed';
  type: 'reservation' | 'review' | 'reminder' | 'other';
  related_reservation?: { id: number; nombre: string; email: string };
  related_review?: { id: number };
  scheduled_at?: string;
  sent_at?: string;
  retries: number;
  error_message?: string;
  createdAt: string;
}

export interface Recurrencia {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
  horarios: string;
  horariosPorDia?: Record<string, string[]>;
  cupoMaximo: number;
  idioma: 'es' | 'en' | 'it' | 'fr';
  tour: Tour;
  activo: boolean;
}

export interface CrmUser {
  id: number;
  nombre: string;
  email: string;
  rol: 'guide' | 'agency';
  guia?: Guia;
  activo: boolean;
  ultimo_login?: string;
}

export interface DashboardStats {
  reservas_hoy: number;
  pax_hoy: number;
  tours_hoy: number;
  horarios_abiertos_hoy: number;
  horarios_cerrados_hoy: number;
  reviews_pendientes: number;
  mail_jobs_fallidos: number;
  sin_resena_enviada: number;
}

export interface StrapiList<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingle<T> {
  data: T;
  meta: object;
}
