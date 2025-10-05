import { CostCalculator } from "../cost-calculator";

export default function CostCalculatorExample() {
  return (
    <div className="p-6 bg-background max-w-md">
      <CostCalculator query="Elon Reeve Musk" limit={100} />
    </div>
  );
}
