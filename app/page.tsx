import { Metadata } from "next";

export const metadata: Metadata = {
  title: "greentrace",
  description: "An app to help trace the origins of your food backed by Hedera",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to greentrace</h1>
      <p className="text-lg">An app to help trace the origins of your food backed by Hedera</p>
    </main>
  );
}
