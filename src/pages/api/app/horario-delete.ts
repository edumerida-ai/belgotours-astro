export const prerender = false;
import type { APIRoute } from 'astro';
import { verifySessionToken } from '../../../lib/app/auth';
import { can } from '../../../lib/app/permissions';
import { crmFetch } from '../../../lib/app/apiClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get('bt_session')?.value;
  if (!token) return redirect('/app/login');

  const user = await verifySessionToken(token);
  if (!user || !can(user.role, 'horarios', 'write')) {
    return new Response('Forbidden', { status: 403 });
  }

  const form       = await request.formData();
  const id         = Number(form.get('id'));
  const redirectTo = form.get('redirect') as string || '/app/horarios';

  try {
    await crmFetch(`/horarios/${id}`, user, { method: 'DELETE' });
  } catch (e: any) {
    // Si tiene reservas, redirigir con error
    return redirect(redirectTo + '&error=tiene_reservas');
  }

  return redirect(redirectTo);
};
