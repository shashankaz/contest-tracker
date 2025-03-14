interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return <div className="px-4 sm:px-6 md:px-8 lg:px-10">{children}</div>;
};

export default HomeLayout;
