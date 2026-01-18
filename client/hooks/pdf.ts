import { queries } from "@/api/queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useExportTransactionsPDF = (
  variables: {
    page: number;
    pageSize: number;
    from_address?: string;
    address?: string;
    startTime?: string;
    endTime?: string;
  },
  enabled?: boolean,
  setEnabled?: (value: boolean) => void,
) => {
  const query = useQuery(queries.EXPORT_TRANSACTIONS({ variables, enabled }));

  useEffect(() => {
    if (query.data?.signedUrl && enabled) {
      const downloadPDF = async () => {
        try {
          const signedUrl = query.data.signedUrl;
          const res = await fetch(signedUrl);
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = query.data?.filename || "transactions.pdf";
          document.body.appendChild(a);
          a.click();

          a.remove();
          window.URL.revokeObjectURL(url);
          if (setEnabled) setEnabled(false);
        } catch (err) {
          console.error("Error downloading PDF:", err);
        }
      };

      downloadPDF();
    }
  }, [query.data, enabled]);

  return query;
};
