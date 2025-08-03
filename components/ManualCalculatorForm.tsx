
import React, { useState } from 'react';
import { CalculatorIcon } from './icons';

interface ManualCalculatorFormProps {
  onCalculate: (totalGrams: number, carbsPer100g: number) => void;
}

const ManualCalculatorForm: React.FC<ManualCalculatorFormProps> = ({ onCalculate }) => {
  const [grams, setGrams] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalGramsNum = parseFloat(grams);
    const carbsPer100gNum = parseFloat(carbsPer100g);
    if (!isNaN(totalGramsNum) && !isNaN(carbsPer100gNum)) {
      onCalculate(totalGramsNum, carbsPer100gNum);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
        <CalculatorIcon className="h-6 w-6 text-brand-primary" />
        Manual Carb Calculator
      </h3>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="total-grams" className="sr-only">Total Grams</label>
            <input
              id="total-grams"
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              placeholder="Total Grams (e.g., 250)"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              step="any"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="carbs-per-100g" className="sr-only">Carbs per 100g</label>
            <input
              id="carbs-per-100g"
              type="number"
              value={carbsPer100g}
              onChange={(e) => setCarbsPer100g(e.target.value)}
              placeholder="Carbs per 100g (e.g., 15)"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              step="any"
              min="0"
            />
          </div>
        </div>
        <button type="submit" className="w-full px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300">
          Calculate & View Results
        </button>
      </form>
    </div>
  );
};

export default ManualCalculatorForm;
