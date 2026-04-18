import type { AppRole } from './types';

export type Resource =
  | 'reservas' | 'tours' | 'horarios' | 'recurrencias'
  | 'reviews' | 'clientes' | 'usuarios' | 'mail_jobs' | 'stats';

export type Action = 'read' | 'write' | 'delete' | 'export' | 'approve';

const matrix: Record<AppRole, Partial<Record<Resource, Action[]>>> = {
  super_admin: {
    reservas:     ['read', 'write', 'delete', 'export'],
    tours:        ['read', 'write', 'delete'],
    horarios:     ['read', 'write', 'delete'],
    recurrencias: ['read', 'write', 'delete'],
    reviews:      ['read', 'write', 'delete', 'approve'],
    clientes:     ['read', 'export'],
    usuarios:     ['read', 'write', 'delete'],
    mail_jobs:    ['read', 'write'],
    stats:        ['read'],
  },
  operations_admin: {
    reservas:     ['read', 'write', 'export'],
    tours:        ['read', 'write'],
    horarios:     ['read', 'write'],
    recurrencias: ['read', 'write'],
    reviews:      ['read', 'write', 'approve'],
    clientes:     ['read'],
    usuarios:     ['read'],
    mail_jobs:    ['read'],
    stats:        ['read'],
  },
  staff: {
    reservas:     ['read', 'write'],
    tours:        ['read'],
    horarios:     ['read', 'write'],
    recurrencias: ['read', 'write'],
    reviews:      ['read', 'write', 'approve'],
    clientes:     ['read'],
    usuarios:     [],
    mail_jobs:    ['read'],
    stats:        ['read'],
  },
  guide: {
    reservas:     ['read'],
    tours:        ['read'],
    horarios:     ['read'],
    recurrencias: [],
    reviews:      [],
    clientes:     [],
    usuarios:     [],
    mail_jobs:    [],
    stats:        ['read'],
  },
};

export function can(role: AppRole, resource: Resource, action: Action): boolean {
  return matrix[role]?.[resource]?.includes(action) ?? false;
}
