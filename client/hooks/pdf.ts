import { queries } from "@/api/queries";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useExportTransactionsPDF = (variables: {
  page: number;
  pageSize: number;
  from_address?: string;
  address?: string;
  startTime?: string;
  endTime?: string;
}) => {
  const { refetch, data, isLoading, isFetching } = useQuery(
    queries.EXPORT_TRANSACTIONS({ variables, enabled: false }),
  );

  const downloadPDF = async () => {
    try {
      const data = await refetch().then((res) => res.data);
      if (!data || !data.filename || !data.signedUrl) {
        throw new Error("No data received for PDF export");
      }
      const signedUrl = data.signedUrl;
      const res = await fetch(signedUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = data?.filename || "transactions.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download PDF");
      console.error("Error downloading PDF:", err);
    }
  };

  return {
    downloadPDF,
    data,
    isLoading,
    isFetching,
  };
};
