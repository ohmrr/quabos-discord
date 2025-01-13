import StarBackground from "@/components/StarBackground";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 w-full h-full">
        <StarBackground />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl text-center font-bold">Quabos</h1>
        </div>
      </div>
    </div>
  );
}
