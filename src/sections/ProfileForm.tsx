import { useState } from "react";

// GradientText component defined inline
const GradientText = ({ children, className }: { children: React.ReactNode; className: string }) => {
  const gradientClass = className === "pink-blue" 
    ? "bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"
    : "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent";
  
  return <span className={gradientClass}>{children}</span>;
};

interface FormData {
  age: string;
  dependents: string;
  occupation: string;
  annualIncome: string;
  smokingStatus: string;
  healthConditions: string;
  insuranceType: string;
  involvementLevel: string;
  name: string;
}

interface ProfileFormProps {
  onSubmit?: (data: FormData) => void;
}

export const ProfileForm = ({ onSubmit }: ProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    dependents: '',
    occupation: '',
    annualIncome: '',
    smokingStatus: '',
    healthConditions: '',
    insuranceType: '',
    involvementLevel: '',
    name: ''
  });

  const totalSteps = 9;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    if (onSubmit) {
      // Call the onSubmit prop to transition to ChatInterface
      onSubmit(formData);
    } else {
      // Fallback alert if no onSubmit prop is provided
      alert('Thank you! We\'ll analyze your profile and send your personalized analysis soon.');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">What is your age?</h2>
          <input type="number" value={formData.age} onChange={(e) => updateFormData('age', e.target.value)}
            placeholder="Enter your age"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg" />
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">How many dependents do you have?</h2>
          <div className="grid grid-cols-3 gap-4">
            {['0', '1', '2', '3', '4', '5+'].map((deps) => (
              <button key={deps} onClick={() => updateFormData('dependents', deps)}
                className={`p-4 border-2 rounded-xl text-center transition-all font-semibold ${
                  formData.dependents === deps ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                {deps}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">What is your occupation?</h2>
          <input type="text" value={formData.occupation} onChange={(e) => updateFormData('occupation', e.target.value)}
            placeholder="e.g., Software Engineer, Teacher, Doctor"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg" />
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">What is your annual income (SGD)?</h2>
          <div className="space-y-3">
            {['Below $50,000', '$50,000 - $100,000', '$100,000 - $200,000', 'Above $200,000'].map((income) => (
              <button key={income} onClick={() => updateFormData('annualIncome', income)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all font-semibold ${
                  formData.annualIncome === income ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                {income}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">Do you smoke?</h2>
          <div className="space-y-3">
            {['Never', 'Former smoker', 'Current smoker'].map((status) => (
              <button key={status} onClick={() => updateFormData('smokingStatus', status)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all font-semibold ${
                  formData.smokingStatus === status ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">Do you have any major health conditions?</h2>
          <textarea value={formData.healthConditions} onChange={(e) => updateFormData('healthConditions', e.target.value)}
            placeholder="List any major health conditions or type 'None'"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg h-24 resize-none" />
        </div>
      );
    }

    if (currentStep === 7) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">What type of insurance are you looking for?</h2>
          <div className="space-y-3">
            {['DPI (Digital Personalized)', 'Traditional Insurance', 'Help me decide'].map((type) => (
              <button key={type} onClick={() => updateFormData('insuranceType', type)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all font-semibold ${
                  formData.insuranceType === type ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 8) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">How involved do you want to be in selecting policies?</h2>
          <div className="space-y-3">
            {['I want full control', 'Suggest options, I choose', 'Decide everything for me'].map((level) => (
              <button key={level} onClick={() => updateFormData('involvementLevel', level)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all font-semibold ${
                  formData.involvementLevel === level ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                {level}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 9) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-left">What's your name?</h2>
          <input type="text" value={formData.name} onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="First and last name"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg" />
        </div>
      );
    }

    return null;
  };

  const isStepComplete = () => {
    const stepFields = ['age', 'dependents', 'occupation', 'annualIncome', 'smokingStatus', 'healthConditions', 'insuranceType', 'involvementLevel', 'name'];
    const currentField = stepFields[currentStep - 1];
    return formData[currentField as keyof typeof formData] !== '';
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-pink-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={handleBack} disabled={currentStep === 1}
          className="px-6 py-3 text-gray-600 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-800 transition-colors">
          ← Back
        </button>
        
        <button onClick={currentStep === totalSteps ? handleSubmit : handleNext} disabled={!isStepComplete()}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {currentStep === totalSteps ? 'Get Analysis →' : 'Next →'}
        </button>
      </div>
    </div>
  );
};