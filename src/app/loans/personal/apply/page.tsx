'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INDIAN_STATES, lookupPincode, lookupByCity } from '@/lib/location';
import { Select } from '@/components/Select';

export default function PersonalLoanApplicationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/loans/personal');
    }
  }, [isAuthenticated, router]);

  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    dateOfBirth: '',
    email: user?.email || '',
    phone: '',
    loanAmount: '',
    employmentType: '',
    monthlyIncome: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    companyName: '',
    workExperience: '',
    loanType: 'personal'
  });

  // Auto-fill City and State based on Pincode
  useEffect(() => {
    const fetchLocation = async () => {
      if (formData.pincode.length === 6) {
        const location = await lookupPincode(formData.pincode);
        if (location) {
          setFormData(prev => ({
            ...prev,
            city: location.city,
            state: location.state
          }));
        }
      }
    };
    fetchLocation();
  }, [formData.pincode]);

  // Handle City Change for Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.city.length >= 3) {
        const suggestions = await lookupByCity(formData.city);
        setCitySuggestions(suggestions);
      } else {
        setCitySuggestions([]);
      }
    }, 500); // Debounce to avoid excessive API calls

    return () => clearTimeout(timer);
  }, [formData.city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Check if a suggestion was selected
    if (name === 'city') {
      const selected = citySuggestions.find(s => `${s.area}, ${s.city}` === value);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          city: selected.city,
          state: selected.state,
          pincode: selected.pincode
        }));
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/loan-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setApplicationNumber(result.applicationNumber);
        setSubmitted(true);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Personal Loan Application Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Your personal loan application has been received. Our team will review it and get back to you within 24-48 hours via WhatsApp.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Application Number</p>
              <p className="text-2xl font-bold text-blue-600">{applicationNumber}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                📱 <strong>WhatsApp Notifications Sent!</strong><br />
                • Admin team notified for review<br />
                • Confirmation sent to your WhatsApp number<br />
                We'll contact you within 24-48 hours.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
              <Button onClick={() => router.push('/contact')}>Contact Us</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="outline"
                onClick={() => router.push('/loans/personal')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Personal Loan Application</h1>
                <p className="text-gray-600">Complete the form to apply for your personal loan</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                📱 <strong>Dual WhatsApp Notifications:</strong> Both you and our admin team receive instant WhatsApp updates for faster processing and transparency!
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} // Min 18 years old
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="^[6-9]\d{9}$"
                title="Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9"
                placeholder="10-digit mobile number"
              />
              <Input
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                required
                pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                title="Please enter a valid PAN number (e.g., ABCDE1234F)"
                placeholder="ABCDE1234F"
                className="uppercase"
              />
            </div>

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative">
                <Input
                  label="City / Area"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Type city or area name..."
                  list="city-options"
                  autoComplete="off"
                />
                <datalist id="city-options">
                  {citySuggestions.map((s, i) => (
                    <option key={i} value={`${s.area}, ${s.city}`}>
                      {s.pincode} - {s.state}
                    </option>
                  ))}
                </datalist>
              </div>
              <Select
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                options={INDIAN_STATES}
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                pattern="^\d{6}$"
                title="Please enter a valid 6-digit pincode"
                placeholder="123456"
              />
            </div>

            <Input
              label="Loan Amount (₹)"
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              min="25000"
              max="2000000"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Employment Type</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="business">Business Owner</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              <Input
                label="Work Experience (Years)"
                type="number"
                name="workExperience"
                value={formData.workExperience}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <Input
              label="Monthly Income (₹)"
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              required
              min="15000"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Personal Loan Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}