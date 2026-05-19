'use client';

import React, { useState } from 'react';
import { TrendingDown, IndianRupee, Calendar, Percent, Lightbulb } from 'lucide-react';

interface PartPaymentResult {
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  tenureReduction: number;
  newTenure: number;
  percentageSaved: number;
}

export const PartPaymentCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    loanAmount: '5000000',
    interestRate: '8.5',
    tenure: '20',
    partPaymentAmount: '500000',
    partPaymentFrequency: '12' // months
  });

  const [result, setResult] = useState<PartPaymentResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePartPayment = () => {
    const principal = parseFloat(formData.loanAmount) || 0;
    const rate = parseFloat(formData.interestRate) / 100 / 12;
    const tenure = parseInt(formData.tenure) * 12;
    const partPayment = parseFloat(formData.partPaymentAmount) || 0;
    const frequency = parseInt(formData.partPaymentFrequency);

    // Calculate original EMI and total interest
    const originalEMI = principal * (rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    const originalTotalPayment = originalEMI * tenure;
    const originalTotalInterest = originalTotalPayment - principal;

    // Calculate with part payments
    let remainingPrincipal = principal;
    let totalInterestPaid = 0;
    let month = 0;
    let partPaymentsMade = 0;

    while (remainingPrincipal > 0 && month < tenure) {
      month++;
      
      // Calculate interest for this month
      const monthlyInterest = remainingPrincipal * rate;
      totalInterestPaid += monthlyInterest;
      
      // Calculate principal payment
      const principalPayment = originalEMI - monthlyInterest;
      remainingPrincipal -= principalPayment;
      
      // Make part payment if it's time
      if (month % frequency === 0 && remainingPrincipal > partPayment) {
        remainingPrincipal -= partPayment;
        partPaymentsMade++;
      }
      
      // Break if loan is paid off
      if (remainingPrincipal <= 0) break;
    }

    const interestSaved = originalTotalInterest - totalInterestPaid;
    const tenureReduction = tenure - month;
    const percentageSaved = (interestSaved / originalTotalInterest) * 100;

    setResult({
      originalTotalInterest,
      newTotalInterest: totalInterestPaid,
      interestSaved,
      tenureReduction,
      newTenure: month,
      percentageSaved
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years ${remainingMonths} months`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
          <Lightbulb className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bankers Den Suggestion for Early Repayment
        </h2>
        <p className="text-gray-600">
          See how part payments can dramatically reduce your interest burden
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Loan Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Years)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                Part Payment Amount (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="partPaymentAmount"
                  value={formData.partPaymentAmount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Payment Frequency
              </label>
              <select
                name="partPaymentFrequency"
                value={formData.partPaymentFrequency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="6">Every 6 months</option>
                <option value="12">Every 12 months</option>
                <option value="24">Every 24 months</option>
                <option value="36">Every 36 months</option>
              </select>
            </div>

            <button
              onClick={calculatePartPayment}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
            >
              <TrendingDown className="w-5 h-5 mr-2" />
              Calculate Savings
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="animate-fade-in space-y-4">
              {/* Main Savings Card */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Total Interest Savings</h3>
                  <div className="text-4xl font-bold mb-2">
                    {formatCurrency(result.interestSaved)}
                  </div>
                  <div className="text-green-100">
                    {result.percentageSaved.toFixed(1)}% reduction in interest burden
                  </div>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-400">
                  <h4 className="font-semibold text-gray-900 mb-2">Without Part Payment</h4>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {formatCurrency(result.originalTotalInterest)}
                  </div>
                  <div className="text-sm text-gray-600">Total Interest</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
                  <h4 className="font-semibold text-gray-900 mb-2">With Part Payment</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(result.newTotalInterest)}
                  </div>
                  <div className="text-sm text-gray-600">Total Interest</div>
                </div>
              </div>

              {/* Tenure Reduction */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Tenure Reduction</h4>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatMonths(result.tenureReduction)}
                </div>
                <div className="text-sm text-blue-700">
                  New tenure: {formatMonths(result.newTenure)}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Bankers Den Pro Tips
                </h4>
                <ul className="space-y-2 text-yellow-700 text-sm">
                  <li>• Use bonuses, tax refunds, or windfalls for part payments</li>
                  <li>• Even small regular part payments create significant savings</li>
                  <li>• Part payments reduce principal, not just interest</li>
                  <li>• No prepayment penalty on floating rate home loans</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 text-center">
                <h4 className="font-semibold mb-2">Ready to Start Saving?</h4>
                <p className="text-blue-100 mb-4">Contact us to optimize your loan repayment strategy</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Get Expert Advice
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingDown className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter your loan details to see potential savings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};