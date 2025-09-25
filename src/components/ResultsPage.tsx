import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DecisionData } from './DecisionPage';

interface ResultsPageProps {
  username: string;
  decisionData: DecisionData;
  onBack: () => void;
  onSignOut: () => void;
}

// Mock analysis generation based on input parameters - returns percentage data and summaries
function generateAnalysis(data: DecisionData) {
  // Risk calculation factors
  const isHighRisk = data.priorConvictions.includes('VFO') || 
                     data.pendingCases.includes('Open Felony') ||
                     data.onSupervision === 'Yes';
  
  const isViolentCharge = data.topCharge.includes('Assault') || 
                          data.topCharge.includes('Robbery');
  
  const isSuperiorCourt = data.courtType === 'Superior';
  const hasPriorConvictions = data.priorConvictions !== 'No prior convictions';
  
  // Calculate base percentages and adjust based on factors
  const baseReleaseRate = 65;
  const baseBailRate = 45;
  const baseRearrestRate = 15;
  const baseConvictionRate = 75;
  const baseIncarcerationRate = 35;
  
  // Adjust percentages based on risk factors
  const releaseAdjustment = isHighRisk ? -25 : 10;
  const bailAdjustment = isSuperiorCourt ? 20 : -10;
  const rearrestAdjustment = isHighRisk ? 15 : -5;
  const convictionAdjustment = isViolentCharge ? 10 : -5;
  const incarcerationAdjustment = (isViolentCharge ? 20 : 0) + (hasPriorConvictions ? 15 : -10);
  
  const percentages = {
    releaseDecisions: {
      releasedOnRecognizance: Math.max(5, Math.min(95, baseReleaseRate + releaseAdjustment)),
      supervisedRelease: Math.max(5, Math.min(40, 25 + (isHighRisk ? 15 : -5))),
      detainedPretrial: Math.max(5, Math.min(45, 15 + (isHighRisk ? 20 : -5)))
    },
    
    bailRanges: {
      noBailSet: Math.max(5, Math.min(60, baseBailRate + bailAdjustment)),
      under5000: Math.max(10, Math.min(45, 30 + (isSuperiorCourt ? -15 : 10))),
      between5000and25000: Math.max(15, Math.min(50, 35 + (isSuperiorCourt ? 10 : -10))),
      over25000: Math.max(5, Math.min(35, 10 + (isSuperiorCourt ? 15 : -5)))
    },
    
    preTrialRearrest: {
      noRearrest: Math.max(60, Math.min(95, 85 - rearrestAdjustment)),
      rearrested: Math.max(5, Math.min(40, baseRearrestRate + rearrestAdjustment))
    },
    
    disposedCaseOutcomes: {
      dismissed: Math.max(10, Math.min(35, 25 + (isViolentCharge ? -10 : 5))),
      pleaBargain: Math.max(40, Math.min(75, 60 + (isViolentCharge ? -5 : 5))),
      trialConviction: Math.max(5, Math.min(25, 15 + (isViolentCharge ? 10 : -5)))
    },
    
    convictionsChargeLevel: {
      convictedAsChargedFelony: Math.max(20, Math.min(80, baseConvictionRate + convictionAdjustment)),
      convictedLesserCharge: Math.max(15, Math.min(45, 30 - (convictionAdjustment / 2))),
      acquitted: Math.max(5, Math.min(25, 15 - (convictionAdjustment / 3)))
    },
    
    seriousSentences: {
      probationOnly: Math.max(15, Math.min(60, 40 - incarcerationAdjustment)),
      shortTermIncarceration: Math.max(20, Math.min(55, 35 + (incarcerationAdjustment / 2))),
      longTermIncarceration: Math.max(5, Math.min(40, 10 + incarcerationAdjustment))
    },
    
    incarcerativeSentenceRanges: {
      under6Months: Math.max(25, Math.min(70, 50 - incarcerationAdjustment)),
      sixMonthsToTwoYears: Math.max(15, Math.min(50, 30 + (incarcerationAdjustment / 2))),
      overTwoYears: Math.max(5, Math.min(35, 8 + incarcerationAdjustment))
    }
  };

  // Generate text summaries
  const summaries = {
    releaseDecisions: `Based on similar cases, ${percentages.releaseDecisions.releasedOnRecognizance}% of defendants are typically released on their own recognizance, while ${percentages.releaseDecisions.detainedPretrial}% are detained pre-trial. Supervised release is granted in ${percentages.releaseDecisions.supervisedRelease}% of comparable cases.`,
    
    bailRanges: `In cases with similar characteristics, ${percentages.bailRanges.noBailSet}% have no bail set, while ${percentages.bailRanges.under5000}% receive bail under $5,000. Higher bail amounts of $5,000-$25,000 are set in ${percentages.bailRanges.between5000and25000}% of cases, with ${percentages.bailRanges.over25000}% receiving bail over $25,000.`,
    
    preTrialRearrest: `Historical data indicates that ${percentages.preTrialRearrest.noRearrest}% of defendants with similar profiles are not rearrested before trial. Pre-trial rearrest occurs in approximately ${percentages.preTrialRearrest.rearrested}% of comparable cases.`,
    
    disposedCaseOutcomes: `Similar cases result in dismissal ${percentages.disposedCaseOutcomes.dismissed}% of the time, while ${percentages.disposedCaseOutcomes.pleaBargain}% are resolved through plea bargaining. Trial convictions occur in ${percentages.disposedCaseOutcomes.trialConviction}% of cases that proceed to trial.`,
    
    convictionsChargeLevel: `Among convicted defendants with similar cases, ${percentages.convictionsChargeLevel.convictedAsChargedFelony}% are convicted as originally charged with a felony. ${percentages.convictionsChargeLevel.convictedLesserCharge}% receive convictions for lesser charges, while ${percentages.convictionsChargeLevel.acquitted}% are acquitted at trial.`,
    
    seriousSentences: `Sentencing patterns for comparable cases show ${percentages.seriousSentences.probationOnly}% receive probation-only sentences, avoiding incarceration. ${percentages.seriousSentences.shortTermIncarceration}% receive short-term incarceration, while ${percentages.seriousSentences.longTermIncarceration}% face long-term imprisonment.`,
    
    incarcerativeSentenceRanges: `Among defendants who receive incarceration, ${percentages.incarcerativeSentenceRanges.under6Months}% serve sentences under 6 months. ${percentages.incarcerativeSentenceRanges.sixMonthsToTwoYears}% receive sentences between 6 months and 2 years, while ${percentages.incarcerativeSentenceRanges.overTwoYears}% face sentences exceeding 2 years.`
  };

  return { percentages, summaries };
}

export function ResultsPage({ username, decisionData, onBack, onSignOut }: ResultsPageProps) {
  const analysis = generateAnalysis(decisionData);

  const analysisItems = [
    { 
      title: 'Release Decisions', 
      summary: analysis.summaries.releaseDecisions,
      data: [
        { label: 'Released on Recognizance', percentage: analysis.percentages.releaseDecisions.releasedOnRecognizance },
        { label: 'Supervised Release', percentage: analysis.percentages.releaseDecisions.supervisedRelease },
        { label: 'Detained Pre-trial', percentage: analysis.percentages.releaseDecisions.detainedPretrial }
      ]
    },
    { 
      title: 'Bail Ranges', 
      summary: analysis.summaries.bailRanges,
      data: [
        { label: 'No Bail Set', percentage: analysis.percentages.bailRanges.noBailSet },
        { label: 'Under $5,000', percentage: analysis.percentages.bailRanges.under5000 },
        { label: '$5,000 - $25,000', percentage: analysis.percentages.bailRanges.between5000and25000 },
        { label: 'Over $25,000', percentage: analysis.percentages.bailRanges.over25000 }
      ]
    },
    { 
      title: 'Pre-Trial Rearrest', 
      summary: analysis.summaries.preTrialRearrest,
      data: [
        { label: 'No Rearrest', percentage: analysis.percentages.preTrialRearrest.noRearrest },
        { label: 'Rearrested', percentage: analysis.percentages.preTrialRearrest.rearrested }
      ]
    },
    { 
      title: 'Disposed Case Outcomes', 
      summary: analysis.summaries.disposedCaseOutcomes,
      data: [
        { label: 'Case Dismissed', percentage: analysis.percentages.disposedCaseOutcomes.dismissed },
        { label: 'Plea Bargain', percentage: analysis.percentages.disposedCaseOutcomes.pleaBargain },
        { label: 'Trial Conviction', percentage: analysis.percentages.disposedCaseOutcomes.trialConviction }
      ]
    },
    { 
      title: 'Convictions-Charge Level', 
      summary: analysis.summaries.convictionsChargeLevel,
      data: [
        { label: 'Convicted as Charged (Felony)', percentage: analysis.percentages.convictionsChargeLevel.convictedAsChargedFelony },
        { label: 'Convicted of Lesser Charge', percentage: analysis.percentages.convictionsChargeLevel.convictedLesserCharge },
        { label: 'Acquitted', percentage: analysis.percentages.convictionsChargeLevel.acquitted }
      ]
    },
    { 
      title: 'Most Serious Sentences', 
      summary: analysis.summaries.seriousSentences,
      data: [
        { label: 'Probation Only', percentage: analysis.percentages.seriousSentences.probationOnly },
        { label: 'Short-term Incarceration', percentage: analysis.percentages.seriousSentences.shortTermIncarceration },
        { label: 'Long-term Incarceration', percentage: analysis.percentages.seriousSentences.longTermIncarceration }
      ]
    },
    { 
      title: 'Incarcerative Sentence Ranges', 
      summary: analysis.summaries.incarcerativeSentenceRanges,
      data: [
        { label: 'Under 6 Months', percentage: analysis.percentages.incarcerativeSentenceRanges.under6Months },
        { label: '6 Months - 2 Years', percentage: analysis.percentages.incarcerativeSentenceRanges.sixMonthsToTwoYears },
        { label: 'Over 2 Years', percentage: analysis.percentages.incarcerativeSentenceRanges.overTwoYears }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl">Analysis Results</h1>
            <p className="text-muted-foreground text-base mt-1">Case analysis for {username}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onBack} className="h-10 px-4">
              Back to Parameters
            </Button>
            <Button variant="outline" onClick={onSignOut} className="h-10 px-4">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Case Summary */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl">Case Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">County</p>
                <Badge variant="secondary" className="text-sm">{decisionData.county}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Court Type</p>
                <Badge variant="secondary" className="text-sm">{decisionData.courtType}</Badge>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-muted-foreground">Top Charge</p>
                <Badge variant="secondary" className="text-xs sm:text-sm break-words">{decisionData.topCharge}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pending Cases</p>
                <Badge variant="secondary" className="text-sm">{decisionData.pendingCases}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">On Supervision</p>
                <Badge variant="secondary" className="text-sm">{decisionData.onSupervision}</Badge>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-muted-foreground">Prior Convictions</p>
                <Badge variant="secondary" className="text-sm">{decisionData.priorConvictions}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {analysisItems.map((item, index) => (
            <Card key={index} className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 space-y-4">
                {/* Text Summary */}
                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                
                {/* Percentage Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Statistical Breakdown</h4>
                  <div className="space-y-2">
                    {item.data.map((dataPoint, dataIndex) => (
                      <div key={dataIndex} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-b-0">
                        <span className="text-xs sm:text-sm text-foreground flex-1 pr-3">{dataPoint.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 sm:w-12 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${dataPoint.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-right min-w-[2.5rem]">
                            {dataPoint.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm sm:text-base text-yellow-800 leading-relaxed">
            <strong>Disclaimer:</strong> These statistical summaries and percentages are generated for demonstration purposes only and should not be used for actual legal decision-making. Real criminal justice decisions require comprehensive case review by qualified legal professionals and should consider additional factors not captured in this simplified statistical model.
          </p>
        </div>
      </div>
    </div>
  );
}