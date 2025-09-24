import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface SignInPageProps {
  onSignIn: (username: string) => void;
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    
    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onSignIn(username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-3 pb-6">
          <CardTitle className="text-xl sm:text-2xl leading-tight">Criminal Justice Decision Support</CardTitle>
          <CardDescription className="text-base">
            Sign in to access the decision analysis system
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-base">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 text-base"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}