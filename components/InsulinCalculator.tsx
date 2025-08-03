
import React from 'react';
import { SyringeIcon } from './icons';

interface InsulinCalculatorProps {
  cir: number;
  onCirChange: (value: number) => void;
  insulinDose: number;
}

const InsulinCalculator: React.FC<InsulinCalculatorProps> = ({ cir, onCirChange, insulinDose }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm mb-4">
      <h4 className="text-lg font-bold text-gray-800 flex items-center mb-3">
        <SyringeIcon className="h-6 w-6 mr-2 text-blue-600" />
        Insulin Dose Estimator
      </h4>

      <div className="space-y-4">
        <div>
          <label htmlFor="cir-slider" className="block text-sm font-medium text-gray-700 mb-1">
            Carb-to-Insulin Ratio (1:{cir})
          </label>
          <div className="flex items-center gap-4">
            <input
              id="cir-slider"
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={cir}
              onChange={(e) => onCirChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
             <span className="font-bold text-blue-800 text-lg w-12 text-center">{cir}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 text-center shadow-inner">
            <p className="text-sm text-gray-500 uppercase font-semibold">Estimated Insulin Dose</p>
            <p className="text-3xl font-bold text-blue-600 my-1">{insulinDose.toFixed(1)} <span className="text-xl">units</span></p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md p-2">
        <p>
          <span className="font-bold">Disclaimer:</span> This is an estimate based on the provided Carb-to-Insulin Ratio. It is not medical advice. Always consult with your healthcare provider before making decisions about your insulin dose.
        </p>
      </div>
    </div>
  );
};

export default InsulinCalculator;
