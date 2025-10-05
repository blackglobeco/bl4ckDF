export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black">
            <img 
              src="/thumbprint-logo.svg" 
              alt="LeakOSINT Logo" 
              className="h-6 w-6"
            />
          </div>
          <h1 className="text-xl font-semibold">BlackAI ⚛ Digital Footprint</h1>
        </div>
      </div>
    </header>
  );
}
