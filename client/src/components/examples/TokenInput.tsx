import { TokenInput } from "../token-input";
import { useState } from "react";

export default function TokenInputExample() {
  const [token, setToken] = useState("987654321:b42vAQjW");

  return (
    <div className="p-6 bg-background max-w-2xl">
      <TokenInput token={token} onTokenChange={setToken} />
    </div>
  );
}
