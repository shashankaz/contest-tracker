export const metadata = {
  title: "Contact Us",
  description: "Get in touch with us for any inquiries or support",
};

const ContactLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export default ContactLayout;
