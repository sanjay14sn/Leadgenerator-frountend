export async function checkJustDial(name, city = "Tamil Nadu") {
  const query = encodeURIComponent(name + " " + city);

  const proxyURL =
    "https://api.allorigins.win/raw?url=" +
    encodeURIComponent(`https://www.justdial.com/api/india_api_search.php?query=${query}`);

  try {
    const res = await fetch(proxyURL);
    const data = await res.json();

    if (!data.results || data.results.length === 0)
      return { found: false, number: "" };

    const jdPhone = data.results[0]?.contacts?.whatsapp || "";

    return {
      found: !!jdPhone,
      number: jdPhone
    };
  } catch {
    return { found: false, number: "" };
  }
}
