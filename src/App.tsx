import { CSSProperties, useState } from "react";
import GenericChart from "./components/GenericChart";
import RiseLoader from "react-spinners/RiseLoader";

import company from "./company.json";
import CompanyAnalysisSummary from "./components/CompanyAnalysisSummary";
import { Button } from "./components/Button";

interface PobabilityData {
  amount: number;
  predictions: {
    year: number;
    probability: number;
  }[];
}
interface ReponseData {
  probability: PobabilityData[];
  analysis: string;
}

const App = () => {
  const [companyData, setCompanyData] = useState(company[0]);

  const [probability, setPobability] = useState<PobabilityData[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const token2 =
    "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";

  const prompt =
    "Na podsatwie danych przeanalizuj kondycje finansową firmy i podaj rekomendacje. " +
    "Odpowiedz w języku polskim. " +
    "Dane: " +
    `Przychody: ${companyData.income}` +
    `Zadłużenie: ${companyData.debts} ` +
    `Komentarze: ${companyData.comments} ` +
    `Negatywne komentarze: ${companyData.negativeComments} ` +
    `Lata: ${companyData.income.data.map((d) => d.key).join(", ")}` +
    `Lokalizacja: ${companyData.location} ` +
    `Branża: ${companyData.industry} ` +
    `Założona: ${companyData.established} ` +
    `Zysk: ${companyData.profit} PLN ` +
    `Dług: ${companyData.debt} PLN ` +
    `Aktywa: ${companyData.assets} PLN ` +
    "Odpowiedz w formie JSON z polami: " +
    `'scoringData': { year: number, value: number }[] scoring dla poszczegolych lat` +
    `'analysis': analiza kondycji finansowej firmy `;

  const setDefaultState = () => {
    setCompanyData(company[0]);
    setPobability(null);
    setLoading(false);
    setIsError(false);
  };

  // const fetchAI = async (prompt: string) => {
  //   try {
  //     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token2}`, // ← tutaj wstaw swój klucz
  //       },
  //       body: JSON.stringify({
  //         model: "deepseek/deepseek-r1:free",
  //         messages: [{ role: "user", content: prompt }],
  //       }),
  //     });

  //     const data = await res.json();
  //     const aiMessage =
  //       data.choices?.[0]?.message?.content || "Brak odpowiedzi.";

  //     const dataJSON = JSON.parse(
  //       aiMessage.replace("```json", "").trim().replace("```", "")
  //     );
  //     console.log("Odpowiedź AI:", dataJSON);
  //     setResponse(dataJSON);
  //   } catch (err) {
  //     setIsError(true);
  //     console.error("Błąd podczas zapytania do API:", err);
  //   }
  // };
  const fetchService = async () => {
    try {
      const companyDataFetch = {
        industry: companyData.industry,
        location: companyData.location,
        established: companyData.established,
        employeeCount: companyData.employees,
        expectedInvoiceAmounts: [1000, 10000, 100000],
        expectedInvoiceYears: [2025, 2026, 2027],
        income: {
          interval: "year",
          name: "income",
          data: [...companyData.income.data],
        },
        debts: {
          interval: "year",
          name: "debts",
          data: [...companyData.debts.data],
        },
        positiveComments: {
          interval: "year",
          name: "positiveComments",
          data: [...companyData.comments.data],
        },
        negativeComments: {
          interval: "year",
          name: "negativeComments",
          data: [...companyData.negativeComments.data],
        },
      };
      const res = await fetch("http://172.20.10.6:7236/Analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token2}`, // ← tutaj wstaw swój klucz
        },
        body: JSON.stringify(companyDataFetch),
      });

      const data = await res.json();
      console.log("Odpowiedź serwisu:", JSON.stringify(data));
      // setPaymentDelayProbability(data?.paymentDelayProbability);
      if (data?.results) {
        setPobability(data?.results);
      }
    } catch (err) {
      setIsError(true);
      console.error("Błąd podczas zapytania do API:", err);
    }
    // setPobability([
    //   {
    //     amount: 1000,
    //     predictions: [
    //       { year: 2025, probability: 0.91 },
    //       { year: 2026, probability: 0.2 },
    //       { year: 2027, probability: 0.3 },
    //     ],
    //   },
    //   {
    //     amount: 10000,
    //     predictions: [
    //       { year: 2025, probability: 0.15 },
    //       { year: 2026, probability: 0.95 },
    //       { year: 2027, probability: 0.85 },
    //     ],
    //   },
    //   {
    //     amount: 100000,
    //     predictions: [
    //       { year: 2025, probability: 0.15 },
    //       { year: 2026, probability: 0.15 },
    //       { year: 2027, probability: 0.15 },
    //     ],
    //   },
    // ]);
  };

  const handleSubmit = async () => {
    // setDefaultState();
    setPobability(null);
    setLoading(true);
    console.log("Wysyłam zapytanie do API z promptem:", prompt);
    // const res = await fetchAI(prompt);
    const red = await fetchService();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <select
            className="block w-full p-2 border border-gray-300 rounded"
            value={companyData.name}
            onChange={(e) => {
              const selectedCompany = company.find(
                (c) => c.name === e.target.value
              );
              if (selectedCompany) {
                setCompanyData(selectedCompany);
                setPobability(null);
              }
            }}
          >
            {company.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{companyData.name}</h1>
          <p className="text-gray-600">
            Branża: {companyData.industry} | Lokalizacja: {companyData.location}{" "}
            | Założona: {companyData.established} | Pracownicy:{" "}
            {companyData.employees}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <GenericChart
            series={[companyData.income, companyData.debts]}
            onChange={(data) => {
              setCompanyData((prev) => ({ ...prev, ...data }));
            }}
            disabled={loading}
            minYear={2010}
            maxYear={2025}
            minValue={0}
            // Dynamically calculate maxValue based on data
            maxValue={
              Math.max(
                ...companyData.income.data.map((d) => d.value),
                ...companyData.debts.data.map((d) => d.value)
              ) + 100000
            }
          />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <GenericChart
            series={[companyData.negativeComments, companyData.comments]}
            onChange={(data) => {
              setCompanyData((prev) => ({ ...prev, ...data }));
            }}
            minYear={2010}
            maxYear={2025}
            minValue={0}
            maxValue={
              Math.max(
                ...companyData.comments.data.map((d) => d.value),
                ...companyData.negativeComments.data.map((d) => d.value)
              ) + 100
            }
          />
        </div>
        <h1 className="text-2xl font-bold mb-4"></h1>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
          style={{ width: "100%" }}
          className="w-full"
        >
          Analizuj
        </Button>

        {isError && (
          <div className="mt-4 text-red-600">
            Wystąpił błąd podczas analizy. Spróbuj ponownie później.
          </div>
        )}
        {loading && (
          <div
            className="mt-6 bg-gray-100 p-12 rounded whitespace-pre-wrap center"
            style={{
              textAlign: "center",
              justifyContent: "center",
              margin: "auto",
              padding: "200px",
            }}
          >
            <RiseLoader color="#a3a3a3" />
          </div>
        )}
        {probability && !isError && (
          <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {/* <strong>Odpowiedź AI:</strong> */}

            <CompanyAnalysisSummary
              probability100k={
                probability?.find((p) => p.amount === 100000)?.predictions || []
              }
              probability10k={
                probability?.find((p) => p.amount === 10000)?.predictions || []
              }
              probability1k={
                probability?.find((p) => p.amount === 1000)?.predictions || []
              }
              minYear={2025}
              maxYear={2027}
            ></CompanyAnalysisSummary>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
