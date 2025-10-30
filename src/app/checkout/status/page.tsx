import { Suspense } from "react";
import PaymentStatus from "./PaymentStatus";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentStatus />
    </Suspense>
  );
}
