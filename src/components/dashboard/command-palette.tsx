import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Command as CommandIcon } from "lucide-react";
import { commandPaletteItems } from "@/lib/dashboard-navigation";
import { filterNavItems } from "@/lib/navigation-access";

export function CommandPalette({
  open,
  onOpenChange,
  permissions,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  permissions: string[];
}) {
  const navigate = useNavigate();
  const items = useMemo(
    () =>
      filterNavItems(commandPaletteItems, permissions).map((item) => ({
        label: item.title,
        to: item.url,
        icon: item.icon,
        group: item.group ?? "Ir para",
        keywords: item.keywords,
      })),
    [permissions],
  );
  const groups = Array.from(new Set(items.map((item) => item.group)));

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar rotas, ações, marcas…" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        {groups.map((group, idx) => (
          <div key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items
                .filter((item) => item.group === group)
                .map((item) => (
                  <CommandItem
                    key={item.to}
                    value={`${item.label} ${item.keywords ?? ""}`}
                    onSelect={() => go(item.to)}
                  >
                    <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </div>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Dica">
          <CommandItem disabled>
            <CommandIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            Pressione
            <CommandShortcut>⌘K</CommandShortcut>
            em qualquer tela
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
