// netlify/functions/geocode.js

exports.handler = async (event) => {
  try {
    const q = (event.queryStringParameters?.q || "").trim();
    const type = (event.queryStringParameters?.type || "country").trim(); // "country" | "city"
    const lang = (event.queryStringParameters?.lang || "es").trim();

    if (q.length < 2) {
      return json(200, []);
    }

    // Nominatim exige User-Agent identificable
    const headers = {
      "Accept": "application/json",
      "Accept-Language": lang,
      "User-Agent": "BelgoToursBooking/1.0 (Netlify Function; contact@belgotours.com)",
      "Referer": "https://belgotours.com",
    };

    // Una sola URL robusta:
    // - country: búsqueda general
    // - city: forzamos class=place&type=city para no mezclar con direcciones
    const base = "https://nominatim.openstreetmap.org/search";
    const params = new URLSearchParams({
      format: "json",
      limit: "5",
      addressdetails: "1",
    });

    if (type === "city") {
      params.set("city", q);
      params.set("class", "place");
      params.set("type", "city");
    } else {
      params.set("q", q);
    }

    const url = `${base}?${params.toString()}`;

    const res = await fetch(url, { headers });

    if (!res.ok) {
      return json(200, []); // silencioso para no romper UX
    }

    const data = await res.json();
    if (!Array.isArray(data)) return json(200, []);

    // Normalizamos la respuesta a lo que tu UI necesita
    const out = data.map((item) => ({
      label: (item.display_name || "").split(",")[0] || "",
      display_name: item.display_name || "",
    })).filter(x => x.label);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        // cache corto para reducir llamadas
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify(out),
    };
  } catch (e) {
    return json(200, []);
  }
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    },
    body: JSON.stringify(obj),
  };
}