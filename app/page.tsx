import { RouteButtons } from "@/components/route-buttons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "greentrace",
  description: "An app to help trace the origins of your food backed by Hedera",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {/* <h1 className="text-4xl font-bold">Welcome to greentrace</h1> */}
      <div>
        <img src="/logo.png" alt="greentrace" className="my-4" />
        <RouteButtons />
      </div>
      <p className="text-lg pt-8">{metadata.description}</p>
    </main>
  );
}
