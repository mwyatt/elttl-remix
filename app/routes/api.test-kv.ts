import type {Route} from "./+types/api.test-kv";

export async function loader({ request, context }: Route.LoaderArgs) {
  const cf = context.get("cloudflare")
  const kv = cf.kv
  const url = new URL(request.url);

  const deleteparam = url.searchParams.get("delete");

  if (deleteparam) {
    console.warn('deleting cache')
    await kv.delete('test-key');
    return Response.json({ ok: true, msg: 'deleted cache' });
  }

  let cached = await kv.get('test-key', { type: "json" });
  if (!cached) {
    console.warn('setting cache')
    await kv.put('test-key', JSON.stringify({hello: 'world'}), {
      expirationTtl: 60
    })
   cached = await kv.get('test-key', { type: "json" });
  }

  return Response.json({ ok: true, cached });
}