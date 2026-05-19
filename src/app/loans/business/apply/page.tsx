'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INDIAN_STATES, lookupPincode } from '@/lib/location';
import { Select } from '@/components/Select';

export default function BusinessLoanApplicationPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    loanAmount: '',
    employmentType: 'business',
    monthlyIncome: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    companyName: '',
    workExperience: '',
    businessType: '',
    businessVintage: '',
    loanType: 'business'
  });

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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/loans/business');
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
              Business Loan Application Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Your business loan application has been received. Our team will review it and get back to you within 24-48 hours via WhatsApp.
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
                onClick={() => router.push('/loans/business')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Loan Application</h1>
                <p className="text-gray-600">Complete the form to apply for your business loan</p>
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
              <Input label="Full Name"
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
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
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
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Auto-filled from pincode"
              />
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
              min="100000"
              max="50000000"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                placeholder="e.g., Manufacturing, Trading, Services"
              />
              <Input
                label="Business Vintage (Years)"
                type="number"
                name="businessVintage"
                value={formData.businessVintage}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <Input
              label="Business Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />

            <Input
              label="Monthly Business Income (₹)"
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              required
              min="50000"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Business Loan Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}