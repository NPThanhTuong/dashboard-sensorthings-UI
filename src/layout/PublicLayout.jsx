import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
