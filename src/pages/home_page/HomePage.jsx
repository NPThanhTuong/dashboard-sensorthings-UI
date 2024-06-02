import SidebarHome from "@/layout/home_layout/SidebarHome";

const HomePage = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="bg-gray-100 p-1">
        <SidebarHome />
      </div>
      <div className="h-[600px] p-1">{children}</div>
    </div>
  );
};

export default HomePage;
