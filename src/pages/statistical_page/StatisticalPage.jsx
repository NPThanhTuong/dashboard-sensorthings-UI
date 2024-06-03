import SidebarStatistical from "@/layout/statistical_layout/SidebarStatistical";

const Layout = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="bg-gray-100 p-4">
        <SidebarStatistical />
      </div>
      <div className="h-[600px] p-4">{children}</div>
    </div>
  );
};

export default Layout;
