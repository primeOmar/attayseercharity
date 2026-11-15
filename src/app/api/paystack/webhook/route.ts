import { validWebhookSignature } from "@/lib/paystack";

/**
 * Paystack webhook — set this URL in Paystack Dashboard → Settings → API Keys & Webhooks:
 *   https://<your-domain>/api/paystack/webhook
 *
 * Every event is authenticated with the `x-paystack-signature` HMAC before use.
 * Paystack's dashboard is the system of record for gifts; events are logged here
 * (visible in Vercel → Logs). Hook in email/CRM notifications where marked.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!validWebhookSignature(raw, request.headers.get("x-paystack-signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const d = event.data ?? {};
  switch (event.event) {
    case "charge.success":
      console.info("[paystack] gift received", {
        reference: d.reference,
        amount: typeof d.amount === "number" ? d.amount / 100 : d.amount,
        currency: d.currency,
        channel: d.channel,
        frequency: (d.metadata as { frequency?: string } | undefined)?.frequency,
      });
      // TODO(notifications): email the team / add to CRM here.
      break;
    case "subscription.create":
    case "subscription.disable":
    case "invoice.payment_failed":
      console.info(`[paystack] ${event.event}`, { code: (d as { subscription_code?: string }).subscription_code });
      break;
    default:
      break;
  }

  // Acknowledge quickly; Paystack retries non-2xx responses.
  return new Response(null, { status: 200 });
}
