import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);

  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Anatomy Atelier application", async () => {
  const response = await render();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );

  const html = await response.text();

  assert.match(
    html,
    /<title>Anatomy Atelier — Learn anatomy like an artist<\/title>/i,
  );

  assert.match(html, /Anatomy Atelier/i);
  assert.match(html, /Learn anatomy like an artist/i);
  assert.match(html, /Primary navigation/i);
  assert.match(html, /Explore/i);
  assert.match(html, /Systems/i);
  assert.match(html, /Lessons/i);
  assert.match(html, /Organ library/i);
  assert.match(html, /Heart/i);
});

test("does not render the legacy starter placeholder", async () => {
  const response = await render();
  const html = await response.text();

  assert.doesNotMatch(html, /Your site is taking shape/i);
  assert.doesNotMatch(html, /Building your site/i);
  assert.doesNotMatch(html, /codex-preview/i);
});