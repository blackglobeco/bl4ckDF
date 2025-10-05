import { ResultCard } from "../result-card";

export default function ResultCardExample() {
  const mockData = [
    {
      email: "user@example.com",
      password: "hash123abc",
      username: "johndoe",
      ip_address: "192.168.1.1",
    },
    {
      email: "another@example.com",
      password: "hash456def",
      username: "janedoe",
      ip_address: "192.168.1.2",
    },
  ];

  return (
    <div className="p-6 bg-background max-w-3xl space-y-4">
      <ResultCard
        databaseName="LinkedIn Breach 2021"
        infoLeak="Email addresses and hashed passwords leaked from LinkedIn in 2021"
        data={mockData}
        count={2}
      />
    </div>
  );
}
