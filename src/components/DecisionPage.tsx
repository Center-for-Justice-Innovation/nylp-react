import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Mock data for New York State Penal Codes (abbreviated list)
const penalCodes = [
  'PL 120.00 - Assault 3rd',
  'PL 120.05 - Assault 2nd',
  'PL 120.10 - Assault 1st',
  'PL 140.20 - Burglary 3rd',
  'PL 140.25 - Burglary 2nd',
  'PL 140.30 - Burglary 1st',
  'PL 155.25 - Petit Larceny',
  'PL 155.30 - Grand Larceny 4th',
  'PL 155.35 - Grand Larceny 3rd',
  'PL 155.40 - Grand Larceny 2nd',
  'PL 155.42 - Grand Larceny 1st',
  'PL 160.05 - Robbery 3rd',
  'PL 160.10 - Robbery 2nd',
  'PL 160.15 - Robbery 1st',
  'PL 220.03 - Criminal Possession Controlled Substance 7th',
  'PL 220.06 - Criminal Possession Controlled Substance 5th',
  'PL 220.09 - Criminal Possession Controlled Substance 4th',
  'PL 220.16 - Criminal Possession Controlled Substance 3rd',
  'PL 220.18 - Criminal Possession Controlled Substance 2nd',
  'PL 220.21 - Criminal Possession Controlled Substance 1st'
];

export interface DecisionData {
  county: string;
  courtType: string;
  topCharge: string;
  pendingCases: string;
  onSupervision: string;
  priorConvictions: string;
}

interface DecisionPageProps {
  username: string;
  onSubmit: (data: DecisionData) => void;
  onSignOut: () => void;
}

export function DecisionPage({ username, onSubmit, onSignOut }: DecisionPageProps) {
  const [formData, setFormData] = useState<DecisionData>({
    county: '',
    courtType: '',
    topCharge: '',
    pendingCases: '',
    onSupervision: '',
    priorConvictions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(value => value !== '');
    if (!allFieldsFilled) {
      alert('Please fill in all fields before proceeding.');
      return;
    }
    
    onSubmit(formData);
  };

  const updateField = (field: keyof DecisionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl">Decision Analysis System</h1>
            <p className="text-muted-foreground text-base mt-1">Welcome, {username}</p>
          </div>
          <Button variant="outline" onClick={onSignOut} className="h-10 px-4 self-end sm:self-auto">
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">Case Parameters</CardTitle>
            <CardDescription className="text-base">
              Select the appropriate parameters for this case to generate analysis summaries
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="county" className="text-base">County Name</Label>
                  <Select value={formData.county} onValueChange={(value) => updateField('county', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bronx">Bronx</SelectItem>
                      <SelectItem value="Kings">Kings</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Queens">Queens</SelectItem>
                      <SelectItem value="Richmond">Richmond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="courtType" className="text-base">Court Type</Label>
                  <Select value={formData.courtType} onValueChange={(value) => updateField('courtType', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select court type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Superior">Superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <Label htmlFor="topCharge" className="text-base">Top Charge at Arraignment</Label>
                  <Select value={formData.topCharge} onValueChange={(value) => updateField('topCharge', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select top charge" />
                    </SelectTrigger>
                    <SelectContent>
                      {penalCodes.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="pendingCases" className="text-base">Pending Cases at Arraignment</Label>
                  <Select value={formData.pendingCases} onValueChange={(value) => updateField('pendingCases', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select pending cases status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Missing/null">Missing/null</SelectItem>
                      <SelectItem value="No open cases">No open cases</SelectItem>
                      <SelectItem value="Open Felony">Open Felony</SelectItem>
                      <SelectItem value="Open Misdemeanor">Open Misdemeanor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="onSupervision" className="text-base">On Supervision Time at Arraignment</Label>
                  <Select value={formData.onSupervision} onValueChange={(value) => updateField('onSupervision', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select supervision status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Null">Null</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <Label htmlFor="priorConvictions" className="text-base">Prior Convictions</Label>
                  <Select value={formData.priorConvictions} onValueChange={(value) => updateField('priorConvictions', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select prior convictions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No prior convictions">No prior convictions</SelectItem>
                      <SelectItem value="Prior Misdemeanor">Prior Misdemeanor</SelectItem>
                      <SelectItem value="Prior NVFO">Prior NVFO (Non-Violent Felony Offense)</SelectItem>
                      <SelectItem value="Prior VFO">Prior VFO (Violent Felony Offense)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-stretch sm:justify-end pt-6">
                <Button type="submit" size="lg" className="w-full sm:w-auto h-12 text-base">
                  Generate Analysis
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}