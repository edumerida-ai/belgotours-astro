import type { AppUser, DashboardStats, Horario, Reserva, Review, MailJob, StrapiList, StrapiSingle } from './types';

const STRAPI_URL = import.meta.env.STRAPI_URL;

type Params = Record<string, string | number | boolean | undefined>;

export async function crmFetch<T>(
  path: string,
  user: AppUser,
  options: RequestInit & { params?: Params } = {}
): Promise<T> {
  const { params, ...rest } = options;

  let url = `${STRAPI_URL}/api/crm${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.strapiToken}`,
      'X-BT-Dashboard': '1',
      ...(rest.headers ?? {}),
    },
  });

  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (res.status === 403) throw new Error('FORBIDDEN');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CRM ${res.status}: ${text}`);
  }
  return res.json();
}

export const crmApi = {
  stats: (user: AppUser) =>
    crmFetch<{ data: DashboardStats }>('/dashboard/stats', user),

  horariosHoy: (user: AppUser) =>
    crmFetch<{ data: Horario[] }>('/horarios/hoy', user),

  reservas: (user: AppUser, filters?: Params) =>
    crmFetch<StrapiList<Reserva>>('/reservas', user, { params: filters }),

  reserva: (user: AppUser, id: number) =>
    crmFetch<StrapiSingle<Reserva>>(`/reservas/${id}`, user),

  reservaUpdate: (user: AppUser, id: number, body: Partial<Reserva>) =>
    crmFetch<StrapiSingle<Reserva>>(`/reservas/${id}`, user, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  sendReview: (user: AppUser, id: number) =>
    crmFetch<{ ok: boolean }>(`/reservas/${id}/send-review`, user, { method: 'POST' }),

  horarios: (user: AppUser, filters?: Params) =>
    crmFetch<{ data: Horario[] }>('/horarios', user, { params: filters }),

  horarioDisponibilidad: (user: AppUser, id: number, disponible: boolean) =>
    crmFetch(`/horarios/${id}/disponibilidad`, user, {
      method: 'PATCH',
      body: JSON.stringify({ disponible }),
    }),

  horarioCupo: (user: AppUser, id: number, cupoMaximo: number) =>
    crmFetch(`/horarios/${id}/cupo`, user, {
      method: 'PATCH',
      body: JSON.stringify({ cupoMaximo }),
    }),

  reviews: (user: AppUser, filters?: Params) =>
    crmFetch<StrapiList<Review>>('/reviews', user, { params: filters }),

  reviewEstado: (user: AppUser, id: number, estado: string, visible_web?: boolean) =>
    crmFetch(`/reviews/${id}/estado`, user, {
      method: 'PATCH',
      body: JSON.stringify({ estado, visible_web }),
    }),

  mailJobs: (user: AppUser, filters?: Params) =>
    crmFetch<StrapiList<MailJob>>('/mail-jobs', user, { params: filters }),

  mailJobRetry: (user: AppUser, id: number) =>
    crmFetch(`/mail-jobs/${id}/retry`, user, { method: 'POST' }),
};
