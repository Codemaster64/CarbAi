
import React, { useState, useCallback, useMemo } from 'react';
import { AnalysisResult } from './types';
import { analyzeFoodImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import Spinner from './components/Spinner';
import InsulinCalculator from './components/InsulinCalculator';
import ManualCalculatorForm from './components/ManualCalculatorForm';
import { LogoIcon, NutritionIcon, ChevronDownIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [cir, setCir] = useState<number>(25); // Carb-to-Insulin Ratio
  
  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageBase64) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const results = await analyzeFoodImage(imageBase64);
      setAnalysisResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setAnalysisResults([]); // Set to empty array on error to show results screen with error
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64]);
  
  const handleManualCalculate = (totalGrams: number, carbsPer100g: number) => {
    const totalCarbs = (totalGrams / 100) * carbsPer100g;
    if (isNaN(totalCarbs) || totalCarbs < 0) {
        setError("Please enter valid positive numbers for calculation.");
        return;
    }
    setError(null);
    const manualResult: AnalysisResult[] = [{
      foodName: 'Manual Entry',
      size: `${totalGrams}g`,
      carbohydrates: totalCarbs,
      protein: 0,
      fat: 0,
      calories: 0
    }];
    setAnalysisResults(manualResult);
    setImageFile(null);
    setImageBase64(null);
  };
  
  const handleReset = () => {
      setImageFile(null);
      setImageBase64(null);
      setAnalysisResults(null);
      setError(null);
      setIsLoading(false);
      setShowDetails(false);
      setCir(25); // Reset CIR to default
  };

  const totals = useMemo(() => {
    if (!analysisResults || analysisResults.length === 0) {
      return { carbs: 0, protein: 0, fat: 0, calories: 0 };
    }
    return analysisResults.reduce((acc, result) => {
        acc.carbs += result.carbohydrates;
        acc.protein += result.protein;
        acc.fat += result.fat;
        acc.calories += result.calories;
        return acc;
    }, { carbs: 0, protein: 0, fat: 0, calories: 0 });
  }, [analysisResults]);

  const handleToggleDetails = () => setShowDetails(prev => !prev);
  
  const insulinDose = useMemo(() => {
    if (totals.carbs > 0 && cir > 0) {
      return totals.carbs / cir;
    }
    return 0;
  }, [totals.carbs, cir]);

  const isManualEntry = analysisResults?.length === 1 && analysisResults[0].foodName === 'Manual Entry';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-4xl mx-auto flex items-center justify-center sm:justify-start mb-8">
        <LogoIcon className="h-10 w-10 text-brand-primary" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 ml-3">
          Carb Vision <span className="text-brand-primary">AI</span>
        </h1>
      </header>

      <main className="w-full max-w-4xl mx-auto flex-grow">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
            {!analysisResults ? (
              // ===== INPUT VIEW =====
              <>
                {!imageFile ? (
                   <div>
                      <div className="text-center">
                          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Upload a Food Image</h2>
                          <p className="text-gray-500 mb-6">Let AI analyze your meal's nutritional content.</p>
                          <ImageUploader onImageSelect={handleImageSelect} />
                      </div>
                      <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 font-semibold">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      <ManualCalculatorForm onCalculate={handleManualCalculate} />
                      {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-lg mt-4">{error}</p>}
                   </div>
                ) : (
                  <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Confirm Your Image</h3>
                      <div className="w-full max-w-sm aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                         <img src={URL.createObjectURL(imageFile)} alt="Food" className="w-full h-full object-cover"/>
                      </div>
                      <div className="mt-6 flex flex-col sm:flex-row gap-4">
                          <button onClick={handleAnalyzeClick} disabled={isLoading} className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto">
                             {isLoading ? <Spinner /> : "Analyze Nutrition"}
                          </button>
                           <button onClick={() => { setImageFile(null); setImageBase64(null); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 w-full sm:w-auto">
                              Change Image
                          </button>
                      </div>
                      {isLoading && <div className="text-center p-8"><p className="text-gray-600">Analyzing your meal... this may take a moment.</p></div>}
                  </div>
                )}
              </>
            ) : (
                // ===== RESULTS VIEW =====
                <div className="flex flex-col lg:flex-row gap-8">
                    {imageFile && (
                         <div className="lg:w-1/2 flex flex-col items-center">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Image</h3>
                            <div className="w-full max-w-sm aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                               <img src={URL.createObjectURL(imageFile)} alt="Food" className="w-full h-full object-cover"/>
                            </div>
                        </div>
                    )}
                    <div className={imageFile ? "lg:w-1/2" : "w-full"}>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                               <NutritionIcon className="h-6 w-6 mr-2 text-brand-primary" />
                               Analysis Results
                            </h3>
                            {analysisResults.length > 0 && !isManualEntry && (
                                <button onClick={handleToggleDetails} className="text-sm font-semibold text-brand-primary hover:text-brand-dark flex items-center gap-1 transition-colors">
                                  {showDetails ? 'Hide' : 'Show'} Details
                                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                         </div>
                         <div className="space-y-4">
                            {error && <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}
                            
                            {analysisResults.length > 0 ? (
                                <>
                                  <div className="mb-4 pb-4 border-b-2 border-dashed border-gray-200">
                                      <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
                                        <div className="flex justify-between items-center">
                                          <h4 className="text-lg font-bold text-gray-800">Total Carbs</h4>
                                          <p className="text-2xl font-bold text-brand-dark">{totals.carbs.toFixed(1)}g</p>
                                        </div>
                                        {showDetails && !isManualEntry && (
                                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                                                <div><p className="text-xs text-gray-500 uppercase font-semibold">Protein</p><p className="font-bold text-gray-700">{totals.protein.toFixed(1)}g</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase font-semibold">Fat</p><p className="font-bold text-gray-700">{totals.fat.toFixed(1)}g</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase font-semibold">Calories</p><p className="font-bold text-gray-700">{totals.calories.toFixed(0)}</p></div>
                                            </div>
                                        )}
                                      </div>
                                  </div>

                                  <InsulinCalculator cir={cir} onCirChange={setCir} insulinDose={insulinDose} />

                                  <div className="space-y-4 pt-4">
                                    {analysisResults.map((result, index) => (
                                      <ResultCard key={index} result={result} showDetails={showDetails && !isManualEntry} />
                                    ))}
                                  </div>
                                </>
                            ) : (
                                <p className="text-gray-500 bg-gray-100 p-4 rounded-lg">Could not identify any food items in the image. Please try another one or use the manual calculator.</p>
                            )}

                             <div className="mt-8 flex justify-center">
                                <button onClick={handleReset} className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300">
                                    Start Over
                                </button>
                            </div>
                         </div>
                     </div>
                </div>
            )}
        </div>
      </main>
       <footer className="w-full max-w-4xl mx-auto text-center text-gray-500 mt-8 text-sm">
        <p>&copy; {new Date().getFullYear()} Carb Vision AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
