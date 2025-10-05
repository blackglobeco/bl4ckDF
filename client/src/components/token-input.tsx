import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TokenInputProps {
  token: string;
  onTokenChange: (token: string) => void;
}

export function TokenInput({ token, onTokenChange }: TokenInputProps) {
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          request: "test",
          limit: 100,
          lang: "en",
          type: "json",
        }),
      });

      const data = await response.json();
      
      if (data["Error code"]) {
        setTestResult("error");
      } else {
        setTestResult("success");
      }
    } catch (error) {
      setTestResult("error");
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  return (
    <Card className="p-6 border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold">API Configuration</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Check className="h-3 w-3 mr-1" />
            100 free requests
          </Badge>
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-token" className="text-sm font-medium">
            API Token
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => onTokenChange(e.target.value)}
                placeholder="987654321:b42vAQjW"
                className="font-mono pr-10"
                data-testid="input-api-token"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowToken(!showToken)}
                data-testid="button-toggle-token-visibility"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!token || isTesting}
              data-testid="button-test-connection"
              className={
                testResult === "success"
                  ? "border-green-500 text-green-500"
                  : testResult === "error"
                  ? "border-red-500 text-red-500"
                  : ""
              }
            >
              {isTesting
                ? "Testing..."
                : testResult === "success"
                ? "Valid ✓"
                : testResult === "error"
                ? "Invalid ✗"
                : "Test"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your token by using the /api command in the bot
          </p>
        </div>
      </div>
    </Card>
  );
}
