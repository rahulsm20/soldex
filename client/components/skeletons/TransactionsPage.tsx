import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACCOUNTS } from "@/lib/constants";
import { Download, Filter } from "lucide-react";
import Image from "next/image";
import { TransactionColumns } from "../columns";
import { ChartAreaInteractiveSkeleton } from "./charts-skeleton";
import LoadingTransactionsTable from "./transactions-skeleton";

const TransactionsPageSkeleton = () => {
  return (
    <div className="w-full max-w-5xl px-4 flex flex-col gap-5">
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-xl font-semibold lg:w-full">Transactions</h1>
        <div className="flex gap-2 items-center justify-between lg:w-full">
          <Select>
            <SelectTrigger className="w-52">
              <SelectValue
                placeholder={
                  <div className="flex items-center gap-2">
                    <span>Filter by accounts</span>
                    <Filter className="h-2 w-2" />
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Accounts</SelectLabel>
                {ACCOUNTS.map((account) => (
                  <SelectItem key={account.sig} value={account.sig}>
                    <div className="flex items-center gap-2 w-full justify-between">
                      <span>{account.label}</span>
                      <Image
                        src={account.icon}
                        alt={account.label}
                        width={20}
                        height={20}
                      />
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <Button
                className="w-full px-2"
                variant="secondary"
                size="sm"
                disabled
              >
                Clear
              </Button>
            </SelectContent>
          </Select>
          <Button variant="outline" disabled>
            <Download />
            <span>Download</span>
          </Button>
        </div>
        <ChartAreaInteractiveSkeleton />
        <LoadingTransactionsTable
          data={[]}
          columns={TransactionColumns(1, 10)}
          pageCount={0}
          pageIndex={0}
          pageSize={10}
          filter={""}
        />
      </div>
    </div>
  );
};

export default TransactionsPageSkeleton;
