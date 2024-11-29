import React, { useRef } from "react";
import WeeklyPlan from "./weekly-plan";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

const TableToPDF = ({ data }: any) => {
  const pdfContainerRef = useRef(null);
  const handleDownload = async () => {
    // @ts-ignore
    const html2pdf = await import("html2pdf.js");
    const pdfOptions = {
      margin: [10, 10, 10, 10], // Set margins [top, right, bottom, left]
    };

    html2pdf
      .default()
      .set(pdfOptions)
      .from(pdfContainerRef.current)
      .save("table.pdf");
  };

  return (
    <div className={"p-4 border border-gray-100 rounded-xl shadow-md"}>
      {data.length > 0 ? (
        <>
          <div className={"text-right"}>
            <Button
              onClick={handleDownload}
              type="button"
              className="rounded-md bg-blue-700"
            >
              <div className={"flex justify-center items-center gap-2"}>
                Baixar <Download />
              </div>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <div ref={pdfContainerRef}>
              <h1 className={"text-3xl text-center mb-5 "}>Plano Semanal</h1>
              <WeeklyPlan data={data} />
            </div>
          </div>
        </>
      ) : undefined}
    </div>
  );
};

export default TableToPDF;
