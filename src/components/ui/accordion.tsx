Sí, se puede. Aquí tienes un único archivo que define el acordeón y además un wrapper listo para usar como **barra izquierda plegable**.

```tsx
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Acordeón base (genérico)
// ---------------------------------------------------------------------------

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    variant?: "default" | "gold" | "danger" | "accent";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "group border-b border-[#22263a] last:border-b-0",
      "transition-colors duration-200 hover:border-[#3b4264]",
      variant === "gold" && "border-b border-[#877245]/60",
      variant === "danger" && "border-b border-red-500/40",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    leadingIcon?: React.ReactNode;
    meta?: React.ReactNode;
  }
>(({ className, children, leadingIcon, meta, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-2 py-3",
        "text-sm font-medium tracking-wide",
        "text-slate-100/80 hover:text-slate-50",
        "rounded-md bg-gradient-to-r from-[#0b0f1d]/40 via-[#101525]/60 to-[#0b0f1d]/40",
        "shadow-[0_0_12px_rgba(0,0,0,0.45)]",
        "ring-1 ring-transparent hover:ring-[#f5d36a33]",
        "transition-all duration-200",
        "[&[data-state=open]>div>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {leadingIcon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1b2136] text-[#f9e7a3] shadow-[0_0_10px_rgba(249,231,163,0.35)]">
            {leadingIcon}
          </span>
        )}
        <span className="flex-1 text-left">{children}</span>
      </div>

      <div className="flex items-center gap-2">
        {meta && <span className="text-[11px] text-slate-300/70">{meta}</span>}
        <ChevronDown className="h-4 w-4 shrink-0 text-[#f9e7a3] transition-transform duration-200 drop-shadow-[0_0_6px_rgba(249,231,163,0.6)]" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    )}
    {...props}
  >
    <div
      className={cn(
        "px-3 pt-2 pb-3",
        "rounded-b-md",
        "bg-gradient-to-b from-[#050712]/0 via-[#050712]/60 to-[#050712]/90",
        "border border-t-0 border-[#22263a]/80",
        "shadow-[0_8px_25px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// ---------------------------------------------------------------------------
// Wrapper: Barra izquierda plegable TAMV
// ---------------------------------------------------------------------------

type LeftSidebarAccordionProps = {
  className?: string;
};

const LeftSidebarAccordion: React.FC<LeftSidebarAccordionProps> = ({ className }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-[#1a2034] bg-[#050712]/95",
        "transition-all duration-300",
        open ? "w-64" : "w-8",
        className,
      )}
    >
      {/* Botón global para plegar/desplegar TODA la barra */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "absolute -right-3 top-4 z-20 flex h-6 w-6 items-center justify-center",
          "rounded-full bg-[#050712] text-[#f9e7a3]",
          "shadow-[0_0_14px_rgba(249,231,163,0.7)]",
          "border border-[#f9e7a377]",
          "hover:scale-105 hover:bg-[#0b0f1d] transition-transform duration-150",
        )}
        aria-label={open ? "Ocultar barra de navegación" : "Mostrar barra de navegación"}
      >
        {open ? "<" : ">"}
      </button>

      {/* Contenido sólo cuando está abierta */}
      {open && (
        <div className="mt-10 flex-1 overflow-y-auto px-2 pb-4">
          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="inicio" variant="gold">
              <AccordionTrigger leadingIcon={<span className="text-[11px]">🏛</span>}>
                Inicio / Dashboard
              </AccordionTrigger>
              <AccordionContent>
                {/* aquí van los links reales del dashboard */}
                <div className="space-y-1">
                  <button className="w-full rounded-md px-2 py-1 text-left text-xs text-slate-200/80 hover:bg-[#11162a]">
                    Visión general
                  </button>
                  <button className="w-full rounded-md px-2 py-1 text-left text-xs text-slate-200/80 hover:bg-[#11162a]">
                    Mi actividad
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experiencias" variant="gold">
              <AccordionTrigger
                leadingIcon={<span className="text-[11px]">XR</span>}
                meta="DreamSpaces · Conciertos · Subastas"
              >
                Experiencias XR
              </AccordionTrigger>
              <AccordionContent>
                {/* enlaces a DreamSpaces, Conciertos, Subastas, Marketplaces */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comunidad">
              <AccordionTrigger leadingIcon={<span className="text-[11px]">👥</span>} meta="Grupos · Canales">
                Comunidad
              </AccordionTrigger>
              <AccordionContent>
                {/* enlaces a Grupos, Canales, Puentes Oníricos, Mascotas */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="economia">
              <AccordionTrigger leadingIcon={<span className="text-[11px]">₿</span>} meta="Banco TAMV · Lotería">
                Economía TAMV
              </AccordionTrigger>
              <AccordionContent>
                {/* enlaces a Banco TAMV, Lotería, Marketplace, etc. */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ia_tools">
              <AccordionTrigger leadingIcon={<span className="text-[11px]">✨</span>} meta="Isabella · KAOS Audio">
                IA & Herramientas
              </AccordionTrigger>
              <AccordionContent>
                {/* enlaces a Isabella, KAOS, Tutoriales, Dev Hub, etc. */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </aside>
  );
};

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  LeftSidebarAccordion,
};
