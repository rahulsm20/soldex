import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartAreaInteractiveSkeleton() {
  return (
    <Card className="pt-0 bg-transparent w-1/3 md:w-2/3 lg:w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="hidden h-9 w-40 rounded-lg sm:ml-auto sm:flex" />
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="w-full">
          <Skeleton className="h-62.5 w-full rounded-md" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
