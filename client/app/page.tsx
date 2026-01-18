"use client";
import ArchitectureImage from "@/components/arch";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowRight,
  ArrowUp,
  Bookmark,
  BookOpen,
  LucideComputer,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
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
    })),
  );
  const router = useRouter();
  const features = [
    {
      title: "Real-time Indexing",
      description:
        "Instantly index and query Solana transactions as they occur on the blockchain.",
      icon: <Bookmark />,
    },
    {
      title: "Scalable Architecture",
      description:
        "Built to handle high throughput and large volumes of transaction data.",
      icon: <ArrowUp />,
    },
    {
      title: "Developer Friendly",
      description:
        "Easy-to-use APIs and comprehensive documentation for seamless integration.",
      icon: <LucideComputer />,
    },
    {
      title: "Secure and Reliable",
      description:
        "Robust security measures to protect your data and ensure uptime.",
      icon: <ShieldCheck />,
    },
    {
      title: "Open Source",
      description:
        "Transparent and community-driven development for continuous improvement.",
      icon: <BookOpen />,
    },
    {
      title: "Free to Use",
      description:
        "Access hosted version for free (with rate limits), clone and self-host for full control.",
      icon: <BookOpen />,
    },
  ];

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <PageLayout>
      <div className="flex w-2/3 text-sm max-w-5xl lg:text-base flex-col items-center sm:items-start py-16 gap-5">
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
        <Card className="mb-8 w-full bg-transparent">
          <CardHeader className="text-3xl font-semibold border-b">
            Features
          </CardHeader>
          <CardContent className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 mb-16">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="mb-4 w-full bg-transparent hover:-translate-y-1.5 transition-transform"
              >
                <CardHeader className="text-2xl font-semibold">
                  {feature.title}
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>{feature.icon}</CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Card className="mb-8 w-full bg-transparent">
          <CardHeader className="text-3xl font-semibold border-b">
            How it works
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <blockquote className="border-l-4 border-purple-400 pl-4">
              <section>
                <ul className="flex flex-col gap-1 mt-2 list-disc pl-5">
                  <li>
                    Soldex is a real-time Solana transaction indexing and
                    analytics platform.
                  </li>
                  <li>
                    It consists of a high-performance indexer service that
                    ingests on-chain transaction data and a main API server that
                    exposes structured, queryable endpoints for building
                    dashboards and analytics features such as transaction
                    charts, token activity, and historical trends.
                  </li>
                  <li>
                    The indexer continuously monitors the Solana blockchain for
                    new transactions, processes them, and updates the indexed
                    data in near real-time through the use of webhooks.
                  </li>
                  <li>
                    Developers can interact with the Soldex API to fetch
                    up-to-date transaction data and build custom analytics
                    solutions on top of Solana.
                  </li>
                  <li>
                    The platform is designed to be scalable, secure, and
                    developer-friendly, making it easy to integrate Solana
                    transaction data into various applications.
                  </li>
                  <li>
                    Soldex is open source and can be self-hosted for full
                    control, or used via the hosted version with rate limits.
                  </li>
                </ul>
              </section>
            </blockquote>
          </CardContent>
        </Card>
        <Card className="mb-8 w-full bg-transparent">
          <CardHeader className="text-3xl font-semibold border-b">
            Architecture
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <ArchitectureImage />
          </CardContent>
        </Card>
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
