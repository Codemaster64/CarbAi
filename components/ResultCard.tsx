
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  showDetails: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, showDetails }) => {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-primary">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{result.foodName}</h4>
          <p className="text-sm text-gray-600 mt-1">{result.size}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-2xl font-bold text-brand-dark">{result.carbohydrates.toFixed(1)}g</p>
          <p className="text-xs text-gray-500 uppercase font-medium">Carbs</p>
        </div>
      </div>
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-emerald-200 grid grid-cols-3 gap-2 text-center">
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Protein</p>
                <p className="font-bold text-gray-700">{result.protein.toFixed(1)}g</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Fat</p>
                <p className="font-bold text-gray-700">{result.fat.toFixed(1)}g</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Calories</p>
                <p className="font-bold text-gray-700">{result.calories.toFixed(0)}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
