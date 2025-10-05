import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "ru">("en");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "en" ? "ru" : "en")}
      data-testid="button-language-toggle"
      className="font-medium"
    >
      {lang === "en" ? "EN" : "RU"}
    </Button>
  );
}
