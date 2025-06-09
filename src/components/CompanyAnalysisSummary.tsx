import React, { useEffect, useRef } from "react";
import GenericChart from "./GenericChart";
import { Button } from "./Button";

interface probabilityData {
  year: number;
  probability: number;
}
interface CompanyAnalysisSummaryProps {
  minYear: number;
  maxYear: number;
  probability1k?: probabilityData[];
  probability10k?: probabilityData[];
  probability100k?: probabilityData[];
}

const CompanyAnalysisSummary = ({
  minYear,
  maxYear,
  probability1k,
  probability10k,
  probability100k,
}: CompanyAnalysisSummaryProps) => {
  const [value, setValue] = React.useState<boolean>(false);

  const lastRef = useRef(null);

  useEffect(() => {
    if (lastRef.current) {
      lastRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [probability1k, probability10k, probability100k]);
  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      {probability1k && probability10k && probability100k && (
        <div ref={lastRef} style={{ marginTop: "1rem" }}>
          <h3>Prawdopodobienstwo spłaty faktury </h3>
          <GenericChart
            series={[
              {
                id: "probability",
                name: "1k[PLN]",
                color: "#94a3ab",
                editable: false,
                data: [
                  ...probability1k.map((d) => ({
                    key: d.year,
                    value: d.probability,
                  })),
                ],
              },
              {
                id: "probability",
                name: "10k[PLN]",
                color: "#005061",
                editable: false,
                data: [
                  ...probability10k.map((d) => ({
                    key: d.year,
                    value: d.probability,
                  })),
                ],
              },
              {
                id: "probability",
                name: "100k[PLN]",
                color: "#3a102f",
                editable: false,
                data: [
                  ...probability100k.map((d) => ({
                    key: d.year,
                    value: d.probability,
                  })),
                ],
              },
            ]}
            onChange={() => {}}
            minYear={minYear}
            maxYear={maxYear}
            minValue={0}
            maxValue={1}
          />
        </div>
      )}

      {
        // <GenericChart
        //   series={series}
        //   onChange={() => {}}
        //   minYear={minYear}
        //   maxYear={maxYear}
        //   minValue={minScore}
        //   maxValue={maxScore}
        // />
      }

      {/* <div style={{ marginTop: "2rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
        <h3>Podsumowanie</h3>
        {<p>{analysisText}</p>}
      </div> */}
    </div>
  );
};

export default CompanyAnalysisSummary;
