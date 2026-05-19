'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { FileText, MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'applications' | 'queries'>('applications');
  
  const [applications, setApplications] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Query State
  const [isRaisingQuery, setIsRaisingQuery] = useState(false);
  const [newQuery, setNewQuery] = useState({ subject: '', message: '', applicationNumber: '' });
  const [submittingQuery, setSubmittingQuery] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch Applications
      const appRes = await fetch(`/api/user/applications?email=${user?.email}`);
      const appData = await appRes.json();
      if (appData.success) {
        setApplications(appData.applications);
      }

      // Fetch Queries
      const queryRes = await fetch(`/api/user/queries?email=${user?.email}`);
      const queryData = await queryRes.json();
      if (queryData.success) {
        setQueries(queryData.queries);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRaiseQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuery(true);
    try {
      const res = await fetch('/api/user/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newQuery,
          userEmail: user?.email
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsRaisingQuery(false);
        setNewQuery({ subject: '', message: '', applicationNumber: '' });
        fetchDashboardData(); // Refresh list
      } else {
        alert('Failed to submit query. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setSubmittingQuery(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            My Applications
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'queries'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Support Queries
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[400px]">
          
          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Loan Applications</h2>
              {applications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">You haven't submitted any loan applications yet.</p>
                  <Button onClick={() => router.push('/#loans')}>Explore Loans</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border border-gray-100 bg-gray-50 p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                            {app.loanType || app.type}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">
                            App No: {app.applicationNumber}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {app.loanAmount ? `₹${app.loanAmount.toLocaleString()}` : 'Query / Request'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === 'completed' ? 'bg-green-100 text-green-700' :
                          app.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Queries Tab */}
          {activeTab === 'queries' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Support Queries</h2>
                <Button onClick={() => setIsRaisingQuery(!isRaisingQuery)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {isRaisingQuery ? 'Cancel' : 'Raise New Query'}
                </Button>
              </div>

              {isRaisingQuery && (
                <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-4">Submit a New Query</h3>
                  <form onSubmit={handleRaiseQuery} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Subject"
                        value={newQuery.subject}
                        onChange={(e) => setNewQuery({...newQuery, subject: e.target.value})}
                        required
                        placeholder="E.g., Loan status update"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Related Application (Optional)
                        </label>
                        <select
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newQuery.applicationNumber}
                          onChange={(e) => setNewQuery({...newQuery, applicationNumber: e.target.value})}
                        >
                          <option value="">Select an application</option>
                          {applications.map(app => (
                            <option key={app._id} value={app.applicationNumber}>
                              {app.applicationNumber} - {app.loanType || app.type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                        value={newQuery.message}
                        onChange={(e) => setNewQuery({...newQuery, message: e.target.value})}
                        required
                        placeholder="Describe your issue or question here..."
                      />
                    </div>
                    <Button type="submit" disabled={submittingQuery}>
                      {submittingQuery ? 'Submitting...' : 'Submit Query'}
                    </Button>
                  </form>
                </div>
              )}

              {queries.length === 0 && !isRaisingQuery ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">You haven't raised any support queries yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queries.map((query) => (
                    <div key={query._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">{query.subject}</h4>
                          <p className="text-sm text-gray-500">
                            Raised on {new Date(query.createdAt).toLocaleDateString()}
                            {query.applicationNumber && ` • App Ref: ${query.applicationNumber}`}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          query.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          query.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {query.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{query.message}</p>
                        
                        {query.adminResponse && (
                          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                              <AlertCircle className="w-4 h-4" />
                              Response from Admin
                            </div>
                            <p className="text-blue-900 whitespace-pre-wrap">{query.adminResponse}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
