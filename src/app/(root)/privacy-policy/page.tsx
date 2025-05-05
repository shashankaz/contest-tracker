import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
      <Navbar />
      <div className="h-20 flex items-center">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif">
          Privacy Policy
        </h1>
      </div>
      <div className="space-y-3">
        <p>
          At Contest Tracker, we value and respect your privacy. We collect
          minimal personal information strictly necessary to provide you with
          real-time updates and personalized experiences related to coding
          contests. This may include your email address (for newsletter
          subscriptions), platform preferences, and profile data such as
          usernames and profile pictures. All user data is securely stored and
          never shared or sold to third parties. Authentication is handled via
          secure JWT tokens, and passwords are encrypted using industry-standard
          hashing.
        </p>
        <p>
          We use cookies and similar technologies to enhance functionality and
          track usage patterns for system improvement. Email communications are
          sent only with user consent, and every message includes a one-click
          unsubscribe option. Our servers follow best practices in security,
          including rate limiting, input validation, and CORS protection to
          ensure your data remains safe. By using this service, you consent to
          the collection and use of information in accordance with this policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
