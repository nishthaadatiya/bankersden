'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, IndianRupee, Clock, Percent } from 'lucide-react';

interface EligibilityResult {
  maxLoanAmount: number;
  recommendedEMI: number;
  eligibilityScore: number;
  recommendations: string[];
}

export const EligibilityCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    existingEMI: '',
    loanTenure: '20',
    interestRate: '8.5',
    loanType: 'home'
  });

  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateEligibility = () => {
    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;
      const existingEMI = parseFloat(formData.existingEMI) || 0;
      const tenure = parseInt(formData.loanTenure) || 20;
      const rate = parseFloat(formData.interestRate) || 8.5;

      let foir = 0.50;
      if (monthlyIncome <= 100000) foir = 0.65;
      else if (monthlyIncome <= 200000) foir = 0.70;
      else if (monthlyIncome <= 500000) foir = 0.75;
      else foir = 0.80;

      // Calculate available income for EMI
      const availableForEMI = (monthlyIncome * foir) - existingEMI;

      // Calculate maximum loan amount using EMI formula
      const monthlyRate = rate / (12 * 100);
      const numberOfPayments = tenure * 12;
      const maxLoanAmount = availableForEMI * ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)));

      // Calculate eligibility score
      let eligibilityScore = 0;
      if (monthlyIncome >= 25000) eligibilityScore += 25;
      if (monthlyIncome >= 50000) eligibilityScore += 25;
      if (monthlyIncome >= 100000) eligibilityScore += 25;
      if (existingEMI / monthlyIncome < 0.3) eligibilityScore += 25;

      // Generate recommendations
      const recommendations = [];
      if (monthlyIncome < 25000) {
        recommendations.push('Consider increasing your income or adding a co-applicant');
      }
      if (existingEMI / monthlyIncome > 0.4) {
        recommendations.push('Reduce existing EMIs before applying for a new loan');
      }
      if (eligibilityScore >= 75) {
        recommendations.push('Excellent eligibility! You qualify for premium rates');
      }
      if (tenure > 25) {
        recommendations.push('Consider shorter tenure to save on interest');
      }

      setResult({
        maxLoanAmount: Math.max(0, maxLoanAmount),
        recommendedEMI: availableForEMI,
        eligibilityScore,
        recommendations
      });

      setIsCalculating(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
          <Calculator className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Loan Eligibility Calculator
        </h2>
        <p className="text-gray-600">
          Check your loan eligibility and get personalized recommendations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                placeholder="50,000"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing EMI (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="existingEMI"
                value={formData.existingEMI}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Tenure (Years)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="loanTenure"
                value={formData.loanTenure}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% p.a.)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                step="0.1"
                min="6"
                max="20"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Type
            </label>
            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="home">Home Loan</option>
              <option value="personal">Personal Loan</option>
              <option value="business">Business Loan</option>
              <option value="car">Car Loan</option>
            </select>
          </div>

          <button
            onClick={calculateEligibility}
            disabled={isCalculating || !formData.monthlyIncome}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Eligibility
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="animate-fade-in">
              {/* Eligibility Score */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Eligibility Score</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(result.eligibilityScore)}`}>
                    {result.eligibilityScore}/100
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.eligibilityScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">Maximum Loan Amount</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.maxLoanAmount)}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center mb-2">
                    <IndianRupee className="w-6 h-6 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-800">Recommended EMI</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.recommendedEMI)}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-800 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start text-yellow-700">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 text-center">
                <h4 className="font-semibold mb-2">Ready to Apply?</h4>
                <p className="text-blue-100 mb-4">Get pre-approved in just 24 hours</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter your details to calculate eligibility</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};