import React, { useEffect, useRef } from "react";
import GenericChart from "./GenericChart";

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
  function setupColor(probability: number): React.CSSProperties | undefined {
    if (probability < 0.2) {
      return { color: "red" };
    } else if (probability < 0.6) {
      return { color: "orange" };
    } else if (probability < 0.8) {
      return { color: "#bdcb2b" };
    } else {
      return { color: "green" };
    }
  }

  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      {probability1k && probability10k && probability100k && (
        <>
          <div
            className="bg-gray-200 p-4 rounded whitespace-pre-wrap"
            ref={lastRef}
            style={{ marginTop: "1rem" }}
          >
            <h3>Prawdopodobienstwo spłaty faktury na dziś: </h3>

            <p>
              <div>
                1k PLN:{" "}
                <span style={setupColor(probability1k[0].probability)}>
                  <strong>{probability1k[0].probability}</strong>
                </span>
              </div>
              <div>
                10k PLN:{" "}
                <span style={setupColor(probability10k[0].probability)}>
                  <strong>{probability10k[0].probability}</strong>
                </span>
              </div>
              <div>
                100k PLN:{" "}
                <span style={setupColor(probability100k[0].probability)}>
                  <strong>{probability100k[0].probability}</strong>
                </span>
              </div>
            </p>
          </div>
          <div ref={lastRef} style={{ marginTop: "1rem" }}>
            <h3>Prawdopodobienstwo spłaty faktury w przyszłośći: </h3>
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
        </>
      )}
    </div>
  );
};

export default CompanyAnalysisSummary;
