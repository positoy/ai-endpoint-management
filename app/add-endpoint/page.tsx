import { EndpointForm } from "@/components/endpoint-form"

export default function AddEndpointPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Add AI Endpoint</h1>
      <EndpointForm />
    </main>
  )
}
