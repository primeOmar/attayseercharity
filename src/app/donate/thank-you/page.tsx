import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { routes } from "@/content/routes";
import { campaigns, causes } from "@/content/home";
import { site } from "@/content/site";
import { PageHeader } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { fromSubunit, PaystackError, verifyTransaction, type VerifiedTransaction } from "@/lib/paystack";
import { formatCurrency } from "@/lib/utils";
import type { CurrencyCode } from "@/types/content";

export const metadata: Metadata = pageMetadata({
  title: "Thank you",
  description: "Confirmation of your gift to the Attayseer Development Foundation.",
  path: "/donate/thank-you",
  noIndex: true,
});

/**
 * Paystack returns the donor here with ?reference=… (and ?trxref=…).
 * We never trust the URL: the outcome shown comes from Paystack's verify API.
 */
export default function ThankYouPage({ searchParams }: PageProps<"/donate/thank-you">) {
  return (
    <>
      <PageHeader
        eyebrow="Your gift"
        title="Thank you."
        path="/donate/thank-you"
        image={routes.donate.image}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Donate", path: "/donate" },
          { name: "Thank you", path: "/donate/thank-you" },
        ]}
      />
      <section className="bg-wash-green py-[calc(var(--spacing-section)*0.7)] text-ink-950">
        <div className="container-site max-w-3xl">
          <Suspense fallback={<Card tone="pending" title="Confirming your gift…" body="This only takes a moment." />}>
            <Outcome searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function Outcome({ searchParams }: Pick<PageProps<"/donate/thank-you">, "searchParams">) {
  const q = await searchParams;
  const raw = q.reference ?? q.trxref;
  const reference = typeof raw === "string" ? raw.slice(0, 100) : "";

  if (!reference) {
    return <Card tone="failed" title="We couldn’t find a payment." body="If you completed a gift, check your email for the receipt — or contact us and we’ll confirm it." />;
  }

  let tx: VerifiedTransaction | null = null;
  try {
    tx = await verifyTransaction(reference);
  } catch (err) {
    if (!(err instanceof PaystackError)) console.error("[thank-you]", err);
  }

  if (!tx) {
    return (
      <Card
        tone="pending"
        title="We’re still confirming your payment."
        body="If you were charged, your gift is safe — confirmation can take a few minutes. Your receipt will arrive by email."
        reference={reference}
      />
    );
  }

  if (tx.status === "success") {
    const charged = formatCurrency(fromSubunit(tx.amount), tx.currency as CurrencyCode);
    const pledged = tx.metadata?.pledged_currency === "USD" && tx.metadata.pledged_amount;
    const amount = pledged ? `${formatCurrency(pledged, "USD")} (charged as ${charged})` : charged;
    const name = tx.metadata?.donor_name?.split(" ")[0];
    const designation = tx.metadata?.designation;
    const destination =
      [...causes, ...campaigns].find((c) => c.slug === designation)?.title ?? "where it’s needed most";
    return (
      <Card
        tone="success"
        title={name ? `Thank you, ${name}.` : "Thank you for your gift."}
        body={`We’ve received ${amount}${tx.metadata?.frequency === "monthly" ? " — your first monthly gift" : ""}, directed to ${destination}. A receipt has been sent to ${tx.customer.email}.`}
        reference={tx.reference}
      />
    );
  }

  if (["ongoing", "pending", "processing", "queued"].includes(tx.status)) {
    return (
      <Card
        tone="pending"
        title="Your payment is processing."
        body="M-Pesa and bank payments can take a few minutes to confirm. You’ll receive an email receipt as soon as it completes."
        reference={tx.reference}
      />
    );
  }

  return (
    <Card
      tone="failed"
      title="Your payment didn’t go through."
      body="No money was taken. You can try again — or contact us if the problem continues."
      reference={tx.reference}
      retry
    />
  );
}

const tones = {
  success: { Icon: CheckCircle2, color: "text-green-700" },
  pending: { Icon: Clock, color: "text-gold-700" },
  failed: { Icon: XCircle, color: "text-red-600" },
} as const;

function Card({
  tone,
  title,
  body,
  reference,
  retry,
}: {
  tone: keyof typeof tones;
  title: string;
  body: string;
  reference?: string;
  retry?: boolean;
}) {
  const { Icon, color } = tones[tone];
  return (
    <div role="status" className="rounded-lg bg-white p-6 shadow-[0_40px_80px_-40px_rgb(11_10_8/0.3)] sm:p-10">
      <Icon aria-hidden="true" className={`size-10 ${color}`} />
      <h2 className="mt-5 font-display text-display-sm">{title}</h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-700">{body}</p>
      {reference && (
        <p className="mt-6 text-sm text-ink-500">
          Reference: <span className="font-mono break-all text-ink-700">{reference}</span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        {retry ? (
          <ButtonLink href="/donate#give">Try again</ButtonLink>
        ) : (
          <ButtonLink href="/impact">See our impact</ButtonLink>
        )}
        <ButtonLink href={`mailto:${site.contact.email}`} variant="ghost-dark" arrow={false}>
          Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
