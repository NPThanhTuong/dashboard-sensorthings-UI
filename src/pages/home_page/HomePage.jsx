const HomePage = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="h-[600px] p-1">{children}</div>
    </div>
  );
};

export default HomePage;
