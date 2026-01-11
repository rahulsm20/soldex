"use client";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function Home() {
  const [data] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      name: `Page ${i + 1}`,
      av: Math.floor(Math.random() * 4000) + 1000,
      bv: Math.floor(Math.random() * 3000) + 1000,
      cv: Math.floor(Math.random() * 2000) + 1000,
    }))
  );

  const router = useRouter();

  return (
    <PageLayout>
      <div className="flex w-2/3 text-sm max-w-3xl lg:text-base flex-col items-center sm:items-start py-16 gap-5">
        <div>
          <h1 className="text-5xl font-bold mb-8 text-center sm:text-left">
            Welcome to <span className="text-purple-400">Soldex!</span>
          </h1>
          <p className="text-3xl text-center sm:text-left mb-16">
            A really smart solana indexer.
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300} className="mb-16">
          <AreaChart width={600} height={300} data={data}>
            <Area
              type="monotone"
              dataKey="av"
              stroke="var(--color-purple-500)"
              fill="var(--color-purple-400)"
            />
            <Area
              type="monotone"
              dataKey="bv"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
            />
            <Area
              type="monotone"
              dataKey="cv"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <blockquote className="border-l-4 border-purple-400 pl-4">
          <h2 className="text-xl font-semibold">How it works</h2>
          <div>
            Soldex is a real-time Solana transaction indexing and analytics
            platform.
            <ul>
              <li className="list-disc list-inside">
                It consists of a high-performance indexer service that ingests
                on-chain transaction data and a main API server that exposes
                structured, queryable endpoints for building dashboards and
                analytics features such as transaction charts, token activity,
                and historical trends.
              </li>
            </ul>
          </div>
        </blockquote>
        <Button
          size="lg"
          className="flex gap-0 bg-purple-500 hover:bg-purple-600 text-white"
          onClick={() => router.push("/transactions")}
        >
          <span>Get Started</span>
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </PageLayout>
  );
}
