import { useState } from "react";
import { z } from "zod";
import { Mail, MessageCircle, Phone, Calendar, Send, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const WHATSAPP_NUMBER = "5511999998888"; // placeholder
const EMAIL = "contato@radarbrand.com.br";
const PHONE_DISPLAY = "+55 (11) 99999-8888";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  company: z.string().trim().min(2, "Informe a empresa").max(120),
  phone: z.string().trim().min(8, "Telefone inválido").max(30),
  message: z.string().trim().min(10, "Conte um pouco mais").max(1000),
});

export function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    // Redireciona para WhatsApp já com contexto
    const msg = encodeURIComponent(
      `Olá! Sou ${parsed.data.name} da ${parsed.data.company}.\n\n${parsed.data.message}\n\nE-mail: ${parsed.data.email}\nTelefone: ${parsed.data.phone}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <section id="contato" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Fale com um especialista
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            Vamos proteger sua marca <span className="text-gradient">agora</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Escolha o canal que preferir. Respondemos em minutos, não em dias.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Canais rápidos */}
          <div className="space-y-4 lg:col-span-2">
            <ChannelCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="WhatsApp Business"
              subtitle="Resposta em minutos • Seg–Sex 8h às 22h"
              action="Abrir conversa"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Olá! Quero conhecer a Radar | brands.",
              )}`}
              accent
            />
            <ChannelCard
              icon={<Mail className="h-5 w-5" />}
              title="E-mail comercial"
              subtitle={EMAIL}
              action="Enviar e-mail"
              href={`mailto:${EMAIL}?subject=Quero%20conhecer%20a%20Radar | brands%20AI`}
            />
            <ChannelCard
              icon={<Phone className="h-5 w-5" />}
              title="Telefone / Ligação"
              subtitle={PHONE_DISPLAY}
              action="Ligar agora"
              href={`tel:+${WHATSAPP_NUMBER}`}
            />
            <ChannelCard
              icon={<Calendar className="h-5 w-5" />}
              title="Agendar demo executiva"
              subtitle="30 min com um brand security specialist"
              action="Reservar horário"
              href="#contato-form"
            />
            <div className="rounded-2xl glass p-5 ring-gradient">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-semibold">Enterprise & Jurídico</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Para grupos com mais de 5 marcas, atendimento dedicado com war room, contrato
                sob NDA e integração com seu time jurídico.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form
            id="contato-form"
            onSubmit={onSubmit}
            className="relative overflow-hidden rounded-3xl glass-strong ring-gradient p-6 md:p-8 lg:col-span-3"
          >
            <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
            <div className="relative">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <h3 className="mt-4 font-display text-2xl font-bold">Recebido!</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Abrimos o WhatsApp com o resumo do seu contato. Nosso time vai retornar em
                    poucos minutos.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSent(false)}
                  >
                    Enviar outra mensagem
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold md:text-2xl">
                    Solicite sua proposta personalizada
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preencha em 30 segundos. Zero spam, zero setup fee.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field label="Nome" name="name" placeholder="Como se chama?" error={errors.name} />
                    <Field
                      label="E-mail corporativo"
                      name="email"
                      type="email"
                      placeholder="voce@empresa.com"
                      error={errors.email}
                    />
                    <Field
                      label="Empresa / Marca"
                      name="company"
                      placeholder="Nome da sua marca"
                      error={errors.company}
                    />
                    <Field
                      label="WhatsApp / Telefone"
                      name="phone"
                      placeholder="(11) 99999-9999"
                      error={errors.phone}
                    />
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <Label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">
                      Como podemos ajudar?
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      maxLength={1000}
                      placeholder="Ex: já sofremos com anúncios falsos no Google e queremos monitoramento ativo…"
                      className="bg-background/40"
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-6 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Quero uma proposta personalizada
                  </Button>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Ao enviar você concorda com nossa política de privacidade LGPD.
                  </p>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ChannelCard({
  icon,
  title,
  subtitle,
  action,
  href,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`group flex items-center gap-4 rounded-2xl p-5 ring-gradient transition-all hover:-translate-y-0.5 ${
        accent ? "glass-strong glow-primary" : "glass"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          accent
            ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
            : "bg-muted text-primary"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <span className="hidden shrink-0 whitespace-nowrap text-xs font-mono uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100 md:inline">
        {action} →
      </span>
    </a>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={255}
        className="bg-background/40"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Olá! Vim pelo site da Radar | brands.",
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" strokeWidth={0} />
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
    </a>
  );
}
