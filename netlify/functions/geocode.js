exports.handler = async (event) => {
  try {
    const q    = (event.queryStringParameters?.q    || "").trim();
    const type = (event.queryStringParameters?.type || "country").trim();
    const lang = (event.queryStringParameters?.lang || "es").trim();

    if (q.length < 2) return json(200, []);

    const headers = {
      "Accept": "application/json",
      "Accept-Language": lang,
      "User-Agent": "BelgoToursBooking/1.0 (contact@belgotours.com)",
      "Referer": "https://belgotours.com",
    };

    const base = "https://nominatim.openstreetmap.org/search";
    const params = new URLSearchParams({ format: "json", limit: "6", addressdetails: "1" });

    if (type === "country") {
      // Solo países — featureType=country fuerza resultados de nivel país
      params.set("q", q);
      params.set("featuretype", "country");
    } else {
      // Solo ciudades
      params.set("city", q);
      params.set("featuretype", "city");
    }

    const res = await fetch(`${base}?${params.toString()}`, { headers });
    if (!res.ok) return json(200, []);

    const data = await res.json();
    if (!Array.isArray(data)) return json(200, []);

    // Para países: mostrar solo el nombre del país (último fragmento del display_name)
    // Para ciudades: mostrar ciudad + país
    const out = data.map((item) => {
      const parts = (item.display_name || "").split(",").map(s => s.trim());
      let label = "";
      if (type === "country") {
        label = parts[parts.length - 1] || parts[0];
      } else {
        label = parts[0] + (parts[parts.length - 1] ? ", " + parts[parts.length - 1] : "");
      }
      return { label, display_name: item.display_name };
    }).filter(x => x.label);

    // Deduplicar
    const seen = new Set();
    const unique = out.filter(x => {
      if (seen.has(x.label)) return false;
      seen.add(x.label);
      return true;
    });

    return json(200, unique);
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
      "Cache-Control": "public, max-age=300",
    },
    body: JSON.stringify(obj),
  };
}
