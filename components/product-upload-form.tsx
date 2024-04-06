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
import RenderObject from "./render-object";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Product name must be at least 3 characters.",
  }),
  sku: z.string().min(10, {
    message: "Barcode must be at least 10 characters.",
  }),
  emissions: z.string().optional(),
  // notes
  notes: z.string().optional(),
  date: z.date().optional(),
});

function UploadForm() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Nature granola bars",
      sku: "1234567890",
      emissions: "0.42 kg/serving",
      // example notes for a product evaluation
      notes: "This product has a high carbon footprint relative to competitors.",
      date: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await setKey(values.sku, values);
      setResult({
        success:
          "Product uploaded successfully with barcode " +
          values.sku +
          ". Users can now discover this product when scanned.",
      });
      // scroll to result
      window.scrollTo(0, document.body.scrollHeight);

      form.setValue("name", "");
    } catch (err: any) {
      console.error(err);
      setResult({
        error: err?.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  const hasResult = !isEmpty(result);

  return (
    <div>
      {!hasResult && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nature granola bars" {...field} />
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
                  <FormLabel>Enter estimated CO2 emissions</FormLabel>
                  <FormControl>
                    <Input type="string" placeholder={"0.42 kg/serving"} {...field} />
                  </FormControl>
                  <FormDescription>Estimated Carbon Dioxide (CO2) emissions of producing the product.</FormDescription>
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

            <FormField
              control={form.control}
              name="date"
              disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date uploaded</FormLabel>
                  <FormControl>
                    <Input placeholder="Date uploaded" disabled={true} value={new Date().toLocaleDateString()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} type="submit">
              Submit
            </Button>
          </form>

          {/* error */}
          {/* {form.formState.errors && (
        <div className="pt-8">
          <div className="text-xl text-bold">Errors:</div>
          <div>{JSON.stringify(form.formState.errors)}</div>
        </div>
      )} */}

          {/* formState */}
        </Form>
      )}
      {hasResult && (
        <div className="pt-8">
          <Button onClick={() => setResult(null)}> ← Back to form</Button>
          <div className="mt-4">
            <RenderObject title="Result" obj={result} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
