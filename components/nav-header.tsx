const NavHeader = () => {
  return (
    <header className="flex items-center h-16 bg-white-800 text-black px-4  border-b-4 border-green-500 ">
      <div className="flex items-center">
        <a href="/" className="block">
          <img src="/logo.png" alt="Greentrace Logo" className="h-8 w-auto fill-current" />
        </a>
        {/* <span className="ml-4 text-xl font-bold">Greentrace</span> */}
      </div>
      <nav className="flex space-x-4 pl-4">
        <a href="/upload" className="text-gray-500 hover:underline pr-4">
          Upload product
        </a>
        &nbsp;|&nbsp;
        <a href="/scan" className="text-gray-500 hover:underline">
          Scan
        </a>
      </nav>
    </header>
  );
};

export default NavHeader;
