import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({ subsets: ["latin"], weight: "700" });

const Feedback = () => {
  return (
    <div className="min-h-screen">
      <div className="h-20 flex items-center">
        <h1
          className={`text-3xl md:text-4xl font-semibold ${comfortaa.className}`}
        >
          Feedback
        </h1>
      </div>
    </div>
  );
};

export default Feedback;
