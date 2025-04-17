"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type Endpoint = {
  id: string
  endpointId: string
  method: string
  description: string
  url: string
  creator: string
  createdAt: string
}

export function EndpointList() {
  const router = useRouter()
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [deleteEndpointId, setDeleteEndpointId] = useState<string | null>(null)

  // Load endpoints from localStorage on component mount
  useEffect(() => {
    const storedEndpoints = localStorage.getItem("endpoints")
    if (storedEndpoints) {
      setEndpoints(JSON.parse(storedEndpoints))
    } else {
      // Add some sample data if no endpoints exist
      const sampleEndpoints: Endpoint[] = [
        {
          id: "1",
          endpointId: "text-generation",
          method: "POST",
          description: "Generates text based on a prompt",
          url: "https://api.example.com/generate",
          creator: "John Doe",
          createdAt: new Date(2023, 5, 15).toISOString(),
        },
        {
          id: "2",
          endpointId: "image-analysis",
          method: "POST",
          description: "Analyzes images and returns detected objects",
          url: "https://api.example.com/analyze-image",
          creator: "Jane Smith",
          createdAt: new Date(2023, 6, 22).toISOString(),
        },
        {
          id: "3",
          endpointId: "sentiment-analysis",
          method: "GET",
          description: "Analyzes the sentiment of provided text",
          url: "https://api.example.com/sentiment",
          creator: "Alex Johnson",
          createdAt: new Date(2023, 7, 10).toISOString(),
        },
      ]
      setEndpoints(sampleEndpoints)
      localStorage.setItem("endpoints", JSON.stringify(sampleEndpoints))
    }
  }, [])

  const handleDelete = (id: string) => {
    setDeleteEndpointId(id)
  }

  const confirmDelete = () => {
    if (deleteEndpointId) {
      const updatedEndpoints = endpoints.filter((endpoint) => endpoint.id !== deleteEndpointId)
      setEndpoints(updatedEndpoints)
      localStorage.setItem("endpoints", JSON.stringify(updatedEndpoints))
      setDeleteEndpointId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteEndpointId(null)
  }

  const navigateToAddEndpoint = () => {
    router.push("/add-endpoint")
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500"
      case "POST":
        return "bg-blue-500"
      case "PUT":
        return "bg-yellow-500"
      case "DELETE":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Endpoint List</CardTitle>
        </CardHeader>
        <CardContent>
          {endpoints.length === 0 ? (
            <div className="text-center p-10 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No endpoints have been added yet.</p>
              <Button onClick={navigateToAddEndpoint}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Endpoint
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-24">Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((endpoint, index) => (
                  <TableRow key={endpoint.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Badge className={`${getMethodColor(endpoint.method)} text-white`}>{endpoint.method}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{endpoint.endpointId}</TableCell>
                    <TableCell className="max-w-xs truncate">{endpoint.description}</TableCell>
                    <TableCell>{endpoint.creator}</TableCell>
                    <TableCell>{formatDate(endpoint.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(endpoint.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={navigateToAddEndpoint}>
          <Plus className="mr-2 h-5 w-5" />
          Add New Endpoint
        </Button>
      </div>

      <AlertDialog open={deleteEndpointId !== null} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the endpoint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
