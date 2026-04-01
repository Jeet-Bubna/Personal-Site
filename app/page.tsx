import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="">
      <div className="grid grid-cols-[250px_1fr] h-screen ">
        <Navbar />
        <h1>Main Content</h1>
      </div>
    </div>
  );
}
