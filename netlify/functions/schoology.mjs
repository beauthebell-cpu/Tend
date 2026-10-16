// Fetches a Schoology calendar feed for the app.
// Browsers can't read Schoology's feed directly (it doesn't allow cross-site requests),
// so the app calls /api/schoology?url=<your calendar link> and this function fetches it server-side.
// Only Schoology links are accepted, so this can't be used to fetch arbitrary sites.

const MAX_BYTES = 5 * 1024 * 1024;

export default async (req) => {
  const raw = new URL(req.url).searchParams.get("url") || "";
  let target;
  try {
    target = new URL(raw.trim().replace(/^webcals?:\/\//i, "https://"));
  } catch {
    return text("That isn't a valid link.", 400);
  }
  if (!/^https?:$/.test(target.protocol) || !/(^|\.)schoology\.com$/i.test(target.hostname)) {
    return text("Only Schoology calendar links are allowed.", 400);
  }
  target.protocol = "https:";

  let res;
  try {
    res = await fetch(target, {
      redirect: "follow",
      headers: { "User-Agent": "Tend/1.0 (+calendar sync)", Accept: "text/calendar, */*" },
      signal: AbortSignal.timeout(15000)
    });
  } catch {
    return text("Couldn't reach Schoology. Try again in a minute.", 502);
  }
  if (!res.ok) return text(`Schoology answered with error ${res.status}. The link may be wrong or expired.`, 502);

  const body = await res.text();
  if (body.length > MAX_BYTES) return text("That calendar is too large to import.", 502);
  if (!body.includes("BEGIN:VCALENDAR")) return text("That link didn't return a calendar. Copy the iCal link from Schoology's Calendar page.", 502);

  return new Response(body, {
    headers: { "content-type": "text/calendar; charset=utf-8", "cache-control": "no-store" }
  });
};

function text(message, status) {
  return new Response(message, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

export const config = { path: "/api/schoology" };
