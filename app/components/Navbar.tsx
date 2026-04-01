function Navbar() {
  return (
    <div className="my-auto py-2.5">
      <nav className="rounded-xl text-2xl">
        <ul className="list-none px-10 py-4 space-y-5">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#programming">Programming</a>
          </li>
          <li>
            <a href="#blog">Blog</a>
          </li>
          <li>
            <a href="#other">Other</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
