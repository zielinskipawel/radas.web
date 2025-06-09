import React from 'react'
import GenericChart from './GenericChart'

interface DataPoint {
  year: number
  value: number
}

interface CompanyAnalysisSummaryProps {
  scoringData: {
    year: number
    value: number
  }[]
  analysisText: string
  minYear: number
  maxYear: number
  minScore?: number
  maxScore?: number
}

const CompanyAnalysisSummary = ({
  scoringData,
  analysisText,
  minYear,
  maxYear,
  minScore = 0,
  maxScore = 100
}: CompanyAnalysisSummaryProps) => {
  const series = [
    {
      id: 'scoring',
      name: 'Scoring',
      color: '#007acc',
      editable: false,
      data: scoringData
    }
  ]

  return (
    <div
      style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Analiza scoringu firmy</h2>
      <GenericChart
        series={series}
        onChange={() => {}}
        minYear={minYear}
        maxYear={maxYear}
        minValue={minScore}
        maxValue={maxScore}
      />
      <div style={{ marginTop: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
        <h3>Podsumowanie</h3>
        <p>{analysisText}</p>
      </div>
    </div>
  )
}

export default CompanyAnalysisSummary
