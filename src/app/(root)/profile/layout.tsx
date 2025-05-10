export const metadata = {
  title: "Profile",
  description: "User profile and settings",
};

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export default ProfileLayout;
