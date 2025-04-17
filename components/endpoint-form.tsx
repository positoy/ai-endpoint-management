"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Save, X, ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { TestCaseDialog } from "@/components/test-case-dialog"
import type { Endpoint } from "./endpoint-list"
import { cn } from "@/lib/utils"

const formSchema = z
  .object({
    endpointId: z.string().min(1, "Endpoint ID is required"),
    method: z.string().min(1, "Method is required"),
    description: z.string().min(1, "Description is required"),
    url: z.string().url("Please enter a valid URL"),
    promptExample: z.string().min(1, "Prompt example is required"),
    responseExample: z.string().min(1, "Response example is required"),
    isJsonResponse: z.boolean().default(true),
    creator: z.string().min(1, "Creator name is required"),
  })
  .refine(
    (data) => {
      // Only validate JSON if isJsonResponse is true
      if (data.isJsonResponse) {
        try {
          JSON.parse(data.responseExample)
          return true
        } catch (e) {
          return false
        }
      }
      return true
    },
    {
      message: "Invalid JSON format. Please check your response example.",
      path: ["responseExample"],
    },
  )

export type TestCase = {
  id: string
  input: string
  expectedOutput: string
}

export function EndpointForm() {
  const router = useRouter()
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpointId: "",
      method: "POST",
      description: "",
      url: "",
      promptExample: "",
      responseExample: "",
      isJsonResponse: true,
      creator: "",
    },
  })

  // Watch for changes to isJsonResponse
  const isJsonResponse = form.watch("isJsonResponse")

  // Validate responseExample when isJsonResponse changes
  React.useEffect(() => {
    if (isJsonResponse) {
      form.trigger("responseExample")
    }
  }, [isJsonResponse, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Create a new endpoint object
    const newEndpoint: Endpoint = {
      id: uuidv4(),
      endpointId: values.endpointId,
      method: values.method,
      description: values.description,
      url: values.url,
      creator: values.creator,
      createdAt: new Date().toISOString(),
    }

    // Get existing endpoints from localStorage
    const existingEndpointsJson = localStorage.getItem("endpoints")
    const existingEndpoints: Endpoint[] = existingEndpointsJson ? JSON.parse(existingEndpointsJson) : []

    // Add the new endpoint
    const updatedEndpoints = [...existingEndpoints, newEndpoint]

    // Save to localStorage
    localStorage.setItem("endpoints", JSON.stringify(updatedEndpoints))

    // Navigate back to the list page
    router.push("/")
  }

  function addTestCase(testCase: TestCase) {
    setTestCases([...testCases, testCase])
    setIsDialogOpen(false)
  }

  function removeTestCase(id: string) {
    setTestCases(testCases.filter((tc) => tc.id !== id))
  }

  function goBack() {
    router.push("/")
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={goBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add AI Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="endpointId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endpoint ID</FormLabel>
                      <FormControl>
                        <Input placeholder="my-ai-endpoint" {...field} />
                      </FormControl>
                      <FormDescription>A unique identifier for this endpoint</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTTP Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select HTTP method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="This endpoint provides answers to general knowledge questions..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Detailed explanation of what this AI endpoint does</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.example.com/ai" {...field} />
                    </FormControl>
                    <FormDescription>The endpoint URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promptExample"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt Input Example</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is the capital of France?" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>Example of the prompt that will be sent to the endpoint</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responseExample"
                render={({ field }) => {
                  // Check if there's a validation error for this field
                  const isInvalid = !!form.formState.errors.responseExample
                  const jsonError =
                    form.formState.errors.responseExample?.message ===
                    "Invalid JSON format. Please check your response example."

                  return (
                    <FormItem>
                      <FormLabel>Expected Response Example</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            form.getValues("isJsonResponse")
                              ? '{"result": "The capital of France is Paris."}'
                              : "The capital of France is Paris."
                          }
                          className={cn("min-h-[100px]", jsonError && "border-red-500 focus-visible:ring-red-500")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {form.getValues("isJsonResponse")
                          ? "Example of the expected JSON response from the endpoint"
                          : "Example of the expected response from the endpoint"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="isJsonResponse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">JSON Response</FormLabel>
                      <FormDescription>Toggle if the response from this endpoint is in JSON format</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creator</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>Name of the person creating this endpoint</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Test Cases</h3>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Test Case
                  </Button>
                </div>

                {testCases.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No test cases added yet. Click the button above to add one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCases.map((testCase) => (
                      <div key={testCase.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="font-medium">Input:</span>
                            <p className="mt-1 text-sm whitespace-pre-wrap">{testCase.input}</p>
                          </div>
                          <div>
                            <span className="font-medium">Expected Output:</span>
                            <p className="mt-1 text-sm whitespace-pre-wrap">{testCase.expectedOutput}</p>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTestCase(testCase.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Endpoint
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <TestCaseDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={addTestCase} />
    </div>
  )
}
