export const prerender = false;
import type { APIRoute } from 'astro';
import { verifySessionToken } from '../../../lib/app/auth';
import { can } from '../../../lib/app/permissions';
import { crmFetch } from '../../../lib/app/apiClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get('bt_session')?.value;
  if (!token) return redirect('/app/login');
  const user = await verifySessionToken(token);
  if (!user || !can(user.role, 'reviews', 'approve')) return new Response('Forbidden', { status: 403 });

  const form       = await request.formData();
  const id         = Number(form.get('id'));
  const redirectTo = form.get('redirect') as string || '/app/reviews';

  const body: Record<string, any> = {};
  const comentario = form.get('comentario_publico');
  const rating     = form.get('rating_general');
  if (comentario !== null) body.comentario_publico = comentario;
  if (rating     !== null) body.rating_general     = Number(rating);

  await crmFetch(`/reviews/${id}/editar`, user, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return redirect(redirectTo);
};
