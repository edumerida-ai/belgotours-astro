export const prerender = false;
import type { APIRoute } from 'astro';
import { verifySessionToken } from '../../../lib/app/auth';
import { can } from '../../../lib/app/permissions';
import { crmFetch } from '../../../lib/app/apiClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get('bt_session')?.value;
  if (!token) return redirect('/app/login');
  const user = await verifySessionToken(token);
  if (!user || !can(user.role, 'horarios', 'write')) return new Response('Forbidden', { status: 403 });

  const form       = await request.formData();
  const redirectTo = form.get('redirect') as string || '/app/horarios';

  try {
    await crmFetch('/horarios', user, {
      method: 'POST',
      body: JSON.stringify({
        tour_id:    Number(form.get('tour_id')),
        fecha:      form.get('fecha'),
        hora:       form.get('hora'),
        cupoMaximo: Number(form.get('cupoMaximo') || 25),
        disponible: true,
      }),
    });
  } catch (e: any) {
    return redirect(redirectTo + '&error=duplicado');
  }
  return redirect(redirectTo + '&success=creado');
};
