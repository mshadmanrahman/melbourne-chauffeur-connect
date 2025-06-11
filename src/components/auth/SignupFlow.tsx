import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, User, FileText, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  vehicleDetails: string;
  experience: string;
  agreeToTerms: boolean;
  agreeToBackground: boolean;
}

interface SignupFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

const SignupFlow = ({ onComplete, onCancel }: SignupFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    licenseNumber: '',
    vehicleDetails: '',
    experience: '',
    agreeToTerms: false,
    agreeToBackground: false,
  });

  const totalSteps = 3;

  const updateFormData = (field: keyof SignupData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.confirmPassword && 
                 formData.password === formData.confirmPassword && formData.password.length >= 6);
      case 2:
        return !!(formData.firstName && formData.lastName && formData.phone && formData.licenseNumber);
      case 3:
        return !!(formData.agreeToTerms && formData.agreeToBackground);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Make sure all information is filled out correctly.",
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            licenseNumber: formData.licenseNumber,
            vehicleDetails: formData.vehicleDetails,
            experience: formData.experience,
          }
        }
      });

      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to ChaufferLink. You can now start using the app.",
        });
        onComplete();
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error creating account",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-chauffer-mint" />
              <h3 className="text-lg font-semibold">Account Details</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-chauffer-mint" />
              <h3 className="text-lg font-semibold">Professional Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="John"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Smith"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+61 4XX XXX XXX"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="licenseNumber">Driver's License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                placeholder="License number"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="vehicleDetails">Vehicle Details (Optional)</Label>
              <Textarea
                id="vehicleDetails"
                value={formData.vehicleDetails}
                onChange={(e) => updateFormData('vehicleDetails', e.target.value)}
                placeholder="e.g., 2023 BMW 5 Series, Black, Luxury sedan"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Chauffeur Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => updateFormData('experience', e.target.value)}
                placeholder="Brief description of your experience as a professional chauffeur"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-chauffer-mint" />
              <h3 className="text-lg font-semibold">Verification & Terms</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData('agreeToTerms', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="text-sm font-medium">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                  <p className="text-xs text-chauffer-gray-500">
                    By joining ChaufferLink, you agree to our platform terms and commission structure.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="background"
                  checked={formData.agreeToBackground}
                  onCheckedChange={(checked) => updateFormData('agreeToBackground', !!checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="background" className="text-sm font-medium">
                    I consent to background and license verification
                  </Label>
                  <p className="text-xs text-chauffer-gray-500">
                    We'll verify your driving record and professional credentials for platform safety.
                  </p>
                </div>
              </div>
              
              <div className="bg-chauffer-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">What happens next?</h4>
                <ul className="text-xs text-chauffer-gray-600 space-y-1">
                  <li>• Your account will be reviewed by our team</li>
                  <li>• We'll verify your license and background</li>
                  <li>• You'll receive an email confirmation within 24-48 hours</li>
                  <li>• Once approved, you can start posting and claiming jobs</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join ChaufferLink</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-chauffer-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-chauffer-mint h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between space-x-4">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : () => setCurrentStep(currentStep - 1)}
              className="flex items-center space-x-2"
              disabled={isLoading}
            >
              <ArrowLeft size={16} />
              <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isLoading}
              className="flex items-center space-x-2 bg-chauffer-mint hover:bg-chauffer-mint/90"
            >
              <span>{currentStep === totalSteps ? (isLoading ? 'Creating...' : 'Create Account') : 'Next'}</span>
              {currentStep === totalSteps ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupFlow;
