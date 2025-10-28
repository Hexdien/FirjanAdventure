

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { 'Accept': 'application/json', ...(opts.headers || {}) } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}
