import { useState } from 'react';
import { SignInPage } from './components/SignInPage';
import { DecisionPage, DecisionData } from './components/DecisionPage';
import { ResultsPage } from './components/ResultsPage';

type AppState = 'signin' | 'decision' | 'results';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('signin');
  const [username, setUsername] = useState<string>('');
  const [decisionData, setDecisionData] = useState<DecisionData | null>(null);

  const handleSignIn = (user: string) => {
    setUsername(user);
    setCurrentState('decision');
  };

  const handleDecisionSubmit = (data: DecisionData) => {
    setDecisionData(data);
    setCurrentState('results');
  };

  const handleBack = () => {
    setCurrentState('decision');
  };

  const handleSignOut = () => {
    setUsername('');
    setDecisionData(null);
    setCurrentState('signin');
  };

  return (
    <div className="min-h-screen">
      {currentState === 'signin' && (
        <SignInPage onSignIn={handleSignIn} />
      )}
      
      {currentState === 'decision' && (
        <DecisionPage 
          username={username}
          onSubmit={handleDecisionSubmit}
          onSignOut={handleSignOut}
        />
      )}
      
      {currentState === 'results' && decisionData && (
        <ResultsPage 
          username={username}
          decisionData={decisionData}
          onBack={handleBack}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}