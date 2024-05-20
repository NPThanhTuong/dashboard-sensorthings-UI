// import Navbar from "../components/navbar_component/Navbar";
import Sidebar from "../components/sidebar_component/Sidebar";

import UserRoutes from "../routes/UserRoutes";

const DefaultLayout = () => {
  return (
    <>
      <div className="flex">
        <div className="h-dvh w-[10%] rounded-sm border bg-gradient-to-t from-cyan-400 to-blue-500 text-white">
          <Sidebar />
        </div>
        <div className="w-[90%] p-2">
          {/* <Navbar /> */}
          <UserRoutes />
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
