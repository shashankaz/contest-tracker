export const metadata = {
  title: "Documentation",
  description: "Documentation for the application",
};

const DocsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default DocsLayout;
