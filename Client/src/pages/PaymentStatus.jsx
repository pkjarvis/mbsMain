import { Link, useSearchParams } from "react-router-dom";

const PaymentStatus = () => {
  const [params] = useSearchParams();
  const success = params.get("success");

  return (
    <div className="p-4 text-center">
      {success === "true" ? (
        <h2 className="text-green-500 text-3xl mt-[16vw]">✅ Payment Successful!</h2>
      ) : (
        <h2 className="text-red-500 text-3xl mt-[16vw]">❌ Payment Failed</h2>
      )}
      {success === "true" && (
        <span className="w-[auto] p-2 mt-[0.5vw] flex flex-col items-center justify-center">
          <Link to="history" className="text-md font-normal bg-pink-500 p-3 rounded-md text-white mt-[2vw]">
            Press to view ticket
          </Link>
        </span>
      )}
    </div>
  );
};

export default PaymentStatus;