export const prerender = false;
import type { APIRoute } from 'astro';
import { verifySessionToken } from '../../../lib/app/auth';
import { can } from '../../../lib/app/permissions';
import { crmApi } from '../../../lib/app/apiClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get('bt_session')?.value;
  if (!token) return redirect('/app/login');

  const user = await verifySessionToken(token);
  if (!user || !can(user.role, 'reviews', 'approve')) {
    return new Response('Forbidden', { status: 403 });
  }

  const form        = await request.formData();
  const id          = Number(form.get('id'));
  const estado      = form.get('estado') as string;
  const visible_web = form.get('visible_web') === 'true';
  const redirectTo  = form.get('redirect') as string || '/app/reviews';

  await crmApi.reviewEstado(user, id, estado, visible_web);
  return redirect(redirectTo);
};
