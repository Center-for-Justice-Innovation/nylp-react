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

// Mock analysis generation based on input parameters - returns percentage data
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
  
  return {
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
}

export function ResultsPage({ username, decisionData, onBack, onSignOut }: ResultsPageProps) {
  const analysis = generateAnalysis(decisionData);

  const analysisItems = [
    { 
      title: 'Release Decisions', 
      data: [
        { label: 'Released on Recognizance', percentage: analysis.releaseDecisions.releasedOnRecognizance },
        { label: 'Supervised Release', percentage: analysis.releaseDecisions.supervisedRelease },
        { label: 'Detained Pre-trial', percentage: analysis.releaseDecisions.detainedPretrial }
      ]
    },
    { 
      title: 'Bail Ranges', 
      data: [
        { label: 'No Bail Set', percentage: analysis.bailRanges.noBailSet },
        { label: 'Under $5,000', percentage: analysis.bailRanges.under5000 },
        { label: '$5,000 - $25,000', percentage: analysis.bailRanges.between5000and25000 },
        { label: 'Over $25,000', percentage: analysis.bailRanges.over25000 }
      ]
    },
    { 
      title: 'Pre-Trial Rearrest', 
      data: [
        { label: 'No Rearrest', percentage: analysis.preTrialRearrest.noRearrest },
        { label: 'Rearrested', percentage: analysis.preTrialRearrest.rearrested }
      ]
    },
    { 
      title: 'Disposed Case Outcomes', 
      data: [
        { label: 'Case Dismissed', percentage: analysis.disposedCaseOutcomes.dismissed },
        { label: 'Plea Bargain', percentage: analysis.disposedCaseOutcomes.pleaBargain },
        { label: 'Trial Conviction', percentage: analysis.disposedCaseOutcomes.trialConviction }
      ]
    },
    { 
      title: 'Convictions-Charge Level', 
      data: [
        { label: 'Convicted as Charged (Felony)', percentage: analysis.convictionsChargeLevel.convictedAsChargedFelony },
        { label: 'Convicted of Lesser Charge', percentage: analysis.convictionsChargeLevel.convictedLesserCharge },
        { label: 'Acquitted', percentage: analysis.convictionsChargeLevel.acquitted }
      ]
    },
    { 
      title: 'Most Serious Sentences', 
      data: [
        { label: 'Probation Only', percentage: analysis.seriousSentences.probationOnly },
        { label: 'Short-term Incarceration', percentage: analysis.seriousSentences.shortTermIncarceration },
        { label: 'Long-term Incarceration', percentage: analysis.seriousSentences.longTermIncarceration }
      ]
    },
    { 
      title: 'Incarcerative Sentence Ranges', 
      data: [
        { label: 'Under 6 Months', percentage: analysis.incarcerativeSentenceRanges.under6Months },
        { label: '6 Months - 2 Years', percentage: analysis.incarcerativeSentenceRanges.sixMonthsToTwoYears },
        { label: 'Over 2 Years', percentage: analysis.incarcerativeSentenceRanges.overTwoYears }
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {analysisItems.map((item, index) => (
            <Card key={index} className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-3">
                  {item.data.map((dataPoint, dataIndex) => (
                    <div key={dataIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm sm:text-base text-foreground flex-1 pr-4">{dataPoint.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${dataPoint.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm sm:text-base text-right min-w-[3rem]">
                          {dataPoint.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm sm:text-base text-yellow-800 leading-relaxed">
            <strong>Disclaimer:</strong> These percentages are generated for demonstration purposes only and should not be used for actual legal decision-making. Real criminal justice decisions require comprehensive case review by qualified legal professionals and should consider additional factors not captured in this simplified statistical model.
          </p>
        </div>
      </div>
    </div>
  );
}