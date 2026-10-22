import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toPng } from "html-to-image";
import { Check, Copy, Download, Mail, Phone, UserRound, BriefcaseBusiness, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import datacrestBanner from "@/assets/datacrest-signature-banner.png.asset.json";
import { DEFAULT_SIGNATURE, FIXED_COMPANY_DETAILS, SPACING_PRESETS, signatureHtml, validateSignatureDetails, type SignatureDetails, type SpacingPreset } from "@/lib/signature";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Datacrest Signature Studio" },
      { name: "description", content: "Create a polished Datacrest email signature using the official company template." },
      { property: "og:title", content: "Datacrest Signature Studio" },
      { property: "og:description", content: "Create a polished Datacrest email signature using the official company template." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignatureStudio,
});

type FieldKey = keyof SignatureDetails;

const fields: { key: FieldKey; label: string; placeholder: string; icon: typeof UserRound; required?: boolean }[] = [
  { key: "name", label: "Full name", placeholder: "Enter your full name", icon: UserRound, required: true },
  { key: "title", label: "Job title", placeholder: "Enter your job title", icon: BriefcaseBusiness, required: true },
  { key: "department", label: "Department", placeholder: "e.g. Technology", icon: BriefcaseBusiness },
  { key: "phone", label: "Phone number", placeholder: "Enter your phone number", icon: Phone },
  { key: "email", label: "Email address", placeholder: "name@datacrestgroup.com", icon: Mail, required: true },
];

function SignatureStudio() {
  const [details, setDetails] = useState<SignatureDetails>(DEFAULT_SIGNATURE);
  const [spacing, setSpacing] = useState<SpacingPreset>("balanced");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const [appOrigin, setAppOrigin] = useState("https://datacrestgroup.com");
  useEffect(() => setAppOrigin(window.location.origin), []);
  const html = signatureHtml(details, new URL(datacrestBanner.url, appOrigin).href, spacing);

  const updateField = (key: FieldKey, value: string) => {
    setDetails((current) => ({ ...current, [key]: value, website: FIXED_COMPANY_DETAILS.website, address: FIXED_COMPANY_DETAILS.address }));
    setCopied(false);
    setMessage("");
  };

  const validationError = () => {
    const error = validateSignatureDetails(details);
    setMessage(error);
    return Boolean(error);
  };

  const copySignature = async () => {
    if (validationError()) return;
    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([`${details.name}\n${details.title}\n${details.email}\n${details.phone}\n${details.website}`], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(html);
      }
      setCopied(true);
      setMessage("Ready to paste into your email settings.");
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const range = document.createRange();
      const preview = document.querySelector<HTMLElement>("#signature-preview");
      if (!preview) return;
      range.selectNodeContents(preview);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
      setCopied(true);
      setMessage("Ready to paste into your email settings.");
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  const downloadSignature = () => {
    if (validationError()) return;
    const blob = new Blob([`<!doctype html><html><head><meta charset="utf-8"><title>Datacrest email signature</title></head><body>${html}</body></html>`], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${details.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "datacrest"}-signature.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = async () => {
    if (validationError() || !previewRef.current) return;
    try {
      const backgroundColor = getComputedStyle(previewRef.current).backgroundColor;
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor });
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = `${details.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "datacrest"}-signature.png`;
      anchor.click();
      setMessage("PNG signature downloaded.");
    } catch {
      setMessage("The PNG could not be created. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <span className="text-lg font-bold tracking-normal">D</span>
            </div>
            <div>
              <p className="text-sm font-bold tracking-normal text-foreground">DATACREST</p>
              <p className="text-[10px] font-medium tracking-normal text-muted-foreground">SIGNATURE STUDIO</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Official company template
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-9 sm:px-8 sm:pt-12">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-accent-foreground">People &amp; Culture · Datacrest</p>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">Email signature</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Create your professional Datacrest signature with the official company design.</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(350px,420px)_minmax(0,1fr)] xl:gap-12">
          <section aria-labelledby="details-title" className="min-w-0">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 id="details-title" className="text-lg font-semibold">Your details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Add your contact information below.</p>
              </div>
            </div>
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {fields.map(({ key, label, placeholder, icon: Icon, required }) => (
                <div key={key} className={key === "address" ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}>
                  <Label htmlFor={key} className="mb-2 block text-xs font-semibold text-foreground">{label}{required ? <span className="ml-1 text-accent-foreground">*</span> : null}</Label>
                  <div className="relative">
                    <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id={key} type={key === "email" ? "email" : "text"} value={details[key]} onChange={(event) => updateField(key, event.target.value)} placeholder={placeholder} className="pl-10" required={required} pattern={key === "email" ? "[^@\\s]+@datacrestgroup\\.com" : undefined} title={key === "email" ? "Use an email ending in @datacrestgroup.com" : undefined} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <Label htmlFor="website" className="mb-2 block text-xs font-semibold text-foreground">Company website</Label>
                <Input id="website" value={FIXED_COMPANY_DETAILS.website} readOnly aria-readonly="true" />
              </div>
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <Label htmlFor="address" className="mb-2 block text-xs font-semibold text-foreground">Office address</Label>
                <Input id="address" value={FIXED_COMPANY_DETAILS.address} readOnly aria-readonly="true" />
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button className="h-11 flex-1" onClick={copySignature}>
                {copied ? <Check /> : <Copy />}
                {copied ? "Copied to clipboard" : "Copy signature"}
              </Button>
              <Button variant="outline" className="h-11 flex-1" onClick={downloadSignature}>
                <Download />
                Download HTML
              </Button>
              <Button variant="outline" className="h-11 flex-1" onClick={downloadPng}>
                <ImageDown />
                Download PNG
              </Button>
            </div>
            <p aria-live="polite" className="mt-3 min-h-5 text-xs text-muted-foreground">
              {message || (copied ? "Ready to paste into your email settings." : "Your information stays in this browser.")}
            </p>
          </section>

          <section aria-labelledby="preview-title" className="min-w-0 border-t border-border pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-12">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 id="preview-title" className="text-lg font-semibold">Live preview</h2>
                <p className="mt-1 text-sm text-muted-foreground">A look at your finished signature.</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Label className="text-[11px] font-medium text-muted-foreground">Spacing</Label>
                <div role="group" aria-label="Signature spacing" className="flex rounded-sm border border-border p-0.5">
                  {SPACING_PRESETS.map((preset) => (
                    <Button key={preset} type="button" size="sm" variant={spacing === preset ? "secondary" : "ghost"} aria-pressed={spacing === preset} onClick={() => setSpacing(preset)} className="h-7 px-2 text-xs capitalize">
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-sm border border-border bg-card shadow-sm">
              <div className="flex h-11 items-center gap-1.5 border-b border-border bg-muted px-4">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="ml-3 text-[11px] text-muted-foreground">New message</span>
              </div>
              <div className="min-h-[310px] overflow-x-auto p-5 sm:p-8">
                <div className="mb-8 space-y-3 text-xs text-muted-foreground">
                  <div className="flex gap-3"><span className="w-12">To</span><span className="h-px flex-1 self-end bg-border" /></div>
                  <div className="flex gap-3"><span className="w-12">Subject</span><span className="h-px flex-1 self-end bg-border" /></div>
                </div>
                <div ref={previewRef} id="signature-preview" className="min-w-[460px] max-w-[760px] bg-card" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
            <div className="mt-5 flex gap-3 border-l-2 border-accent pl-4">
              <div className="pt-0.5 text-accent-foreground">✳</div>
              <p className="text-xs leading-5 text-muted-foreground">For best results, copy your signature and paste it into your email app’s signature settings.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}