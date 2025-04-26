interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  return <div>{children}</div>;
};

export default HomeLayout;
