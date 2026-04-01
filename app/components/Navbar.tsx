function Navbar() {

  const listItems = {
    "Home":"#home",
    "Programming":"#programming",
    "Blog":"#blog",
    "Other":"#other",
    "Contact":"#contact"
  };
  
  return (
    <div className="my-auto py-2.5 font-navbar">
      <nav className="rounded-xl text-2xl">
        <ul className="list-none px-10 py-4 space-y-5">
          {Object.entries(listItems).map(([label, url]) => (
            <li className="transition-transform hover:text-green-200 hover:scale-150 origin-left ">
            <a href={url}>{label}</a>
          </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
