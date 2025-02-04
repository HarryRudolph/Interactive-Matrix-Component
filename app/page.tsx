import { InteractiveMatrix3D } from "@/components/interactive-matrix-3d"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-16">
      <h1 className="text-4xl font-bold mb-8">3D Interactive Matrix</h1>
      <InteractiveMatrix3D />
    </main>
  )
}
