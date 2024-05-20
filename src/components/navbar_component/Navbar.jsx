import { IoMdSearch } from "react-icons/io";

const Navbar = () => {
  return (
    <>
      <div className="flex h-12 w-full items-center justify-between text-center">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-80 rounded-3xl border bg-white px-4 py-2"
            placeholder="Tìm kiếm"
          />
          <button onClick={""} className="absolute right-3">
            <IoMdSearch className="size-5 text-gray-400" />
          </button>
        </div>
        <div>Tài khoản</div>
      </div>
      <div className="border-white-900 border-b-4"></div>
    </>
  );
};

export default Navbar;
