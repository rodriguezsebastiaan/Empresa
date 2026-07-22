import { ArrowRight, MessageCircle } from 'lucide-react'

export function CallToAction() {
  return (
    <section
      id="contacto"
      className="relative border-t border-border/60 bg-secondary/20"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-lg">
            <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-primary">
              HABLEMOS SOBRE SU EMPRESA
            </p>
            <h2 className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
              Conversemos sobre el proceso que quiere mejorar.
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              No necesita saber qué tecnología requiere. Empezamos entendiendo
              su necesidad y diseñamos el siguiente paso.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
            >
              AGENDAR ASESORÍA
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-widest text-foreground transition-colors hover:border-primary/50"
            >
              SOLICITAR DIAGNÓSTICO
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-widest text-foreground transition-colors hover:border-primary/50"
            >
              <MessageCircle className="size-4" />
              HABLAR POR WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
