"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { isEmpty } from "@/lib/utils";
import { setKey } from "@/util/api";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Product name must be at least 3 characters.",
  }),
  sku: z.string().min(10, {
    message: "Barcode must be at least 10 characters.",
  }),
  emissions: z.number().optional(),
  // notes
  notes: z.string().optional(),
});

function UploadForm() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Nature valley bars",
      sku: "1234567890",
      emissions: 10,
      // example notes for a product evaluation
      notes: "This product has a high carbon footprint.",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await setKey(values.sku, values);
      setResult({
        success: "Product uploaded successfully",
      });
      form.setValue("name", "");
    } catch (error) {
      console.error(error);
      setResult({
        error: error?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter product name</FormLabel>
              <FormControl>
                <Input placeholder="Nature Valley Muffin Bars" {...field} />
              </FormControl>
              <FormDescription>Name of the product to index.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Barcode */}

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter barcode</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormDescription>Barcode of the product to index.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emissions */}
        <FormField
          control={form.control}
          name="emissions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter emissions</FormLabel>
              <FormControl>
                <Input type="number" placeholder={"0"} {...field} />
              </FormControl>
              <FormDescription>Carbon emissions of the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter notes</FormLabel>
              <FormControl>
                <Input placeholder="Notes" {...field} />
              </FormControl>
              <FormDescription>Notes about the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          Submit
        </Button>
      </form>

      {!isEmpty(result) && (
        <div className="pt-8">
          <div className="text-xl text-bold">Result:</div>
          <div>{JSON.stringify(result)}</div>
        </div>
      )}

      {/* error */}
      {/* {form.formState.errors && (
        <div className="pt-8">
          <div className="text-xl text-bold">Errors:</div>
          <div>{JSON.stringify(form.formState.errors)}</div>
        </div>
      )} */}

      {/* formState */}
    </Form>
  );
}

export default UploadForm;
