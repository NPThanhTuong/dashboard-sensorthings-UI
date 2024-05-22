import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
