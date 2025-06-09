import { CSSProperties, useState } from 'react'
import GenericChart from './components/GenericChart'
import { BarLoader, ClipLoader, ScaleLoader } from 'react-spinners'

import company from './company.json'
import CompanyAnalysisSummary from './components/CompanyAnalysisSummary'
import { Button } from './components/Button'

const App = () => {
  const [companyData, setCompanyData] = useState(company[0])

  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const token2 =
    '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'

  const prompt =
    'Na podsatwie danych przeanalizuj kondycje finansową firmy i podaj rekomendacje. ' +
    'Odpowiedz w języku polskim. ' +
    'Dane: ' +
    `Przychody: ${companyData.income}` +
    `Zadłużenie: ${companyData.debts} ` +
    `Komentarze: ${companyData.comments} ` +
    `Negatywne komentarze: ${companyData.negativeComments} ` +
    `Lata: ${companyData.income.data.map((d) => d.year).join(', ')}` +
    `Lokalizacja: ${companyData.location} ` +
    `Branża: ${companyData.industry} ` +
    `Założona: ${companyData.established} ` +
    `Pracownicy: ${companyData.employees} ` +
    `Przychody: ${companyData.revenue} PLN ` +
    `Zysk: ${companyData.profit} PLN ` +
    `Dług: ${companyData.debt} PLN ` +
    `Aktywa: ${companyData.assets} PLN ` +
    'Odpowiedz w formie JSON z polami: ' +
    `"scoringData": { year: number, value: number }[] scoring dla poszczegolych lat` +
    '"analysis": analiza kondycji finansowej firmy '

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}` // ← tutaj wstaw swój klucz
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: prompt }]
        })
      })

      const data = await res.json()
      const aiMessage =
        data.choices?.[0]?.message?.content || 'Brak odpowiedzi.'

      const dataJSON = JSON.parse(
        aiMessage.replace('```json', '').trim().replace('```', '')
      )
      setResponse(dataJSON)
    } catch (err) {
      setIsError(true)
      console.error('Błąd podczas zapytania do API:', err)
    }

    setLoading(false)
  }

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
              )
              if (selectedCompany) {
                setCompanyData(selectedCompany)
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
            Branża: {companyData.industry} | Lokalizacja: {companyData.location}{' '}
            | Założona: {companyData.established} | Pracownicy:{' '}
            {companyData.employees}
          </p>
          <p className="text-gray-600">
            Przychody: {companyData.revenue} PLN | Zysk: {companyData.profit}{' '}
            PLN | Dług: {companyData.debt} PLN | Aktywa: {companyData.assets}{' '}
            PLN
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <GenericChart
            series={[companyData.income, companyData.debts]}
            onChange={(data) => {
              setCompanyData((prev) => ({ ...prev, ...data }))
            }}
            disabled={loading}
            minYear={2000}
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <GenericChart
            series={[companyData.negativeComments, companyData.comments]}
            onChange={(data) => {
              setCompanyData((prev) => ({ ...prev, ...data }))
            }}
            minYear={2000}
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
          style={{ width: '100%' }}
        >
          Analizuj
        </Button>

        {isError && (
          <div className="mt-4 text-red-600">
            Wystąpił błąd podczas analizy. Spróbuj ponownie później.
          </div>
        )}
        {response && !isError && (
          <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
            <strong>Odpowiedź AI:</strong>

            <CompanyAnalysisSummary
              scoringData={response?.scoringData}
              analysisText={response?.analysis}
              minYear={2000}
              maxYear={2025}
              minScore={0}
              maxScore={10}
            ></CompanyAnalysisSummary>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
