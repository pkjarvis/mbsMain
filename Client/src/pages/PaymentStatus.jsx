import { Link, useSearchParams } from "react-router-dom";

const PaymentStatus = () => {
  const [params] = useSearchParams();
  const success = params.get("success");

  return (
    <div className="p-4 text-center">
      {success === "true" ? (
        <h2 className="text-green-500 text-2xl">✅ Payment Successful!</h2>
      ) : (
        <h2 className="text-red-500 text-2xl">❌ Payment Failed</h2>
      )}
     {success==="true" && <Link to="/history">View Ticket</Link>}
    </div>
  );
};

export default PaymentStatus;