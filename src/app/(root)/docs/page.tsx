import Navbar from "@/components/Navbar";

const Docs = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-10">
      <Navbar />
      <div className="h-20 flex items-center">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif">
          Documentation for API
        </h1>
      </div>
      <div className="space-y-3">
        <p>Coming soon...</p>
      </div>
    </div>
  );
};

export default Docs;
