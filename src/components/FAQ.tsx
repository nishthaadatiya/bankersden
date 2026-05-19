'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const FAQ: React.FC<FAQProps> = ({ items, title, subtitle }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'What is the maximum home loan amount I can get?',
      answer: 'The maximum home loan amount depends on your income, credit score (preferably 750+), existing liabilities, and property value. Generally, banks offer 75-90% of the property\'s market value. Your EMI should not exceed 40-50% of your monthly income.',
      category: 'Home Loans'
    },
    {
      id: '2',
      question: 'What is the minimum and maximum age limit for loans?',
      answer: 'For most loans, the minimum age is 21-23 years and maximum age is 65-70 years at the time of loan maturity. The exact limits vary based on your employment type (salaried vs self-employed) and the specific bank\'s policy.',
      category: 'General'
    },
    {
      id: '3',
      question: 'What is a good CIBIL score for loan approval?',
      answer: 'A CIBIL score of 750+ is considered excellent and ensures better loan approval chances with lower interest rates. Scores between 650-749 are acceptable but may result in higher interest rates. Below 650, loan approval becomes challenging.',
      category: 'Credit Score'
    },
    {
      id: '4',
      question: 'Can I have a co-applicant for my loan?',
      answer: 'Yes, you can add a co-applicant (spouse, parent, or sibling) to your loan application. This improves your eligibility by combining both incomes and offers tax benefits for both applicants. The co-applicant becomes equally responsible for loan repayment.',
      category: 'General'
    },
    {
      id: '5',
      question: 'What types of properties qualify for home loans?',
      answer: 'Home loans are available for new/resale apartments, independent houses, plots with construction, home construction, renovation, extension, and balance transfer from other banks. The property should have clear title and necessary approvals.',
      category: 'Home Loans'
    },
    {
      id: '6',
      question: 'Fixed or Floating interest rate - which is better?',
      answer: 'Fixed rates offer predictable EMIs but are typically higher initially. Floating rates change with market conditions and are generally lower initially. Choose fixed if you prefer certainty, floating if you can handle rate fluctuations and want to benefit from potential rate cuts.',
      category: 'Interest Rates'
    },
    {
      id: '7',
      question: 'Can I prepay or foreclose my loan?',
      answer: 'Yes, you can prepay or foreclose your loan. For floating rate loans, there\'s no penalty as per RBI guidelines. Fixed rate loans may have prepayment charges. Part-payments help reduce interest burden and loan tenure significantly.',
      category: 'Repayment'
    },
    {
      id: '8',
      question: 'What happens if I miss an EMI payment?',
      answer: 'Missing EMI payments affects your credit score negatively and attracts penalty charges. Banks typically charge 2-3% penalty on overdue amount. Consistent defaults can lead to loan recall and legal action. Contact your bank immediately if facing payment difficulties.',
      category: 'Repayment'
    },
    {
      id: '9',
      question: 'How long does the loan approval process take?',
      answer: 'Personal loans can be approved within 24-48 hours with proper documentation. Home loans typically take 7-15 days, while business loans may take 3-7 days. The timeline depends on documentation completeness and property verification (for secured loans).',
      category: 'Process'
    },
    {
      id: '10',
      question: 'What documents are required for loan applications?',
      answer: 'Common documents include: Identity proof (Aadhaar/PAN), Address proof, Income proof (salary slips/ITR), Bank statements (3-6 months), Employment certificate, and photographs. Additional documents may be required based on loan type and amount.',
      category: 'Documentation'
    }
  ];

  const actualData = items || faqData;

  const categories = ['All', ...Array.from(new Set(actualData.map(item => item.category || 'General')))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All'
    ? actualData
    : actualData.filter(item => (item.category || 'General') === selectedCategory);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gray-800 text-white rounded-full mb-4 md:mb-6">
            <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle || 'Get answers to common questions about loans, eligibility, and our services'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 md:space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-4 md:px-6 py-3 md:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full mr-2 md:mr-3">
                      {item.category || 'General'}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-2 md:pr-4">
                    {item.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-800" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {openItems.includes(item.id) && (
                <div className="px-4 md:px-6 pb-3 md:pb-4 animate-fade-in">
                  <div className="border-t border-gray-100 pt-3 md:pt-4">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="bg-gray-800 text-white rounded-xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-4 md:mb-6">
              Our expert team is here to help you with personalized advice
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="tel:+919145023840"
                className="inline-block bg-transparent text-white border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};