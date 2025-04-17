"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { TestCase } from "./endpoint-form"

const testCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
})

interface TestCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (testCase: TestCase) => void
}

export function TestCaseDialog({ open, onOpenChange, onSave }: TestCaseDialogProps) {
  const form = useForm<z.infer<typeof testCaseSchema>>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      input: "",
      expectedOutput: "",
    },
  })

  function handleSubmit(values: z.infer<typeof testCaseSchema>) {
    onSave({
      id: uuidv4(),
      ...values,
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Test Case</DialogTitle>
          <DialogDescription>Create a test case with input and expected output examples.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Example</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter test input example" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedOutput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Output</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter expected output example" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Test Case</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
