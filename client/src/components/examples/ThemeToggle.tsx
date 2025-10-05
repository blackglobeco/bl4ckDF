import { ThemeToggle } from "../theme-toggle";
import { ThemeProvider } from "../theme-provider";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 bg-background">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
