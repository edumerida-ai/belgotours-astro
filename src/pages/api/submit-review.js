export const prerender = false;

export async function POST({ request, redirect }) {
  const formData = await request.formData();
  const token = formData.get("token");

  const apiUrl = import.meta.env.PUBLIC_STRAPI_URL + "/reviews/submit";

  // Forward form-data to Strapi
  const response = await fetch(apiUrl, {
    method: "POST",
    body: formData,
  });

  const json = await response.json();

  // Always redirect to Gracias page (no JSON shown to user)
  return redirect(`/es/resenas/gracias?ok=1`);
}
