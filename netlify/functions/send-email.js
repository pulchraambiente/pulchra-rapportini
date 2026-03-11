exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const RESEND_KEY = "re_ASL5GDiu_5AWTKvNtiw8bjQLhvwtCP5wx";
  const EMAIL_RESP = "luca@pulchrambiente.it";

  try {
    const { rapportino, capoName, customHtml, subject: customSubject } = JSON.parse(event.body);

    const html = customHtml || `
      <h2 style="color:#1a3a2a">📋 Nuovo Rapportino – Pulchra Ambiente Srl</h2>
      <table border="0" cellpadding="6" style="font-family:sans-serif;font-size:14px">
        <tr><td><b>Data</b></td><td>${rapportino.data}</td></tr>
        <tr><td><b>Capo Squadra</b></td><td>${capoName}</td></tr>
        <tr><td><b>Orario</b></td><td>${rapportino.ore_inizio} – ${rapportino.ore_fine}</td></tr>
        <tr><td><b>Vie lavorate</b></td><td>${rapportino.vie.join(", ")}</td></tr>
        <tr><td><b>Attività</b></td><td>${rapportino.attivita.join(", ")}</td></tr>
        <tr><td><b>Mezzi</b></td><td>${rapportino.mezzi.join(", ")}</td></tr>
        <tr><td><b>Note/Anomalie</b></td><td>${rapportino.note || "–"}</td></tr>
        <tr><td><b>Foto allegate</b></td><td>${rapportino.foto_urls?.length || 0}</td></tr>
      </table>`;
    const subject = customSubject || `📋 Rapportino ${rapportino.data} – ${capoName}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Pulchra Ambiente <onboarding@resend.dev>",
        to: [EMAIL_RESP],
        subject: subject,
        html: html
      })
    });

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
