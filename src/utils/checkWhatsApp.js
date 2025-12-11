export async function checkWhatsApp(phone) {
  if (!phone) return false;

  const clean = phone.replace(/\D/g, "");

  const url = `https://api.whatsapp.com/send/?phone=${clean}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual"
    });

    return res.status === 200 || res.status === 302;
  } catch {
    return false;
  }
}
