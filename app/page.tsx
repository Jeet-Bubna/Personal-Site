// app/page.tsx
import Navbar from "./components/Navbar";
import Title from "./components/Title";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar />
      <Title />
    </div>
  );
}