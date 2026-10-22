'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { 
  LogOut, 
  Users, 
  FileText, 
  Phone, 
  Mail, 
  Calendar,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Bot,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AdminWhatsAppChats } from '@/components/admin/AdminWhatsAppChats';

interface Lead {
  _id: string;
  applicationNumber: string;
  type: 'contact' | 'loan' | 'bd-partner';
  status: 'active' | 'processing' | 'completed';
  full_name: string;
  email: string;
  phone?: string;
  category?: string;
  message?: string;
  loanType?: string;
  loanAmount?: number;
  monthlyIncome?: number;
  employmentType?: string;
  companyName?: string;
  workExperience?: number;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isAuthenticated?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Query {
  _id: string;
  userEmail: string;
  applicationNumber?: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatSessionMsg {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface ChatSession {
  _id: string;
  sessionId: string;
  messages: ChatSessionMsg[];
  extractedName?: string;
  extractedPhone?: string;
  extractedEmail?: string;
  extractedLoanType?: string;
  extractedLoanAmount?: string;
  extractedIncome?: string;
  intentSignals: string[];
  leadGenerated: boolean;
  leadGeneratedAt?: string;
  startedAt: string;
  lastActivityAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'queries' | 'chatsessions' | 'whatsapp'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatLeadCount, setChatLeadCount] = useState(0);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    processing: 0,
    completed: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (activeTab === 'leads') {
      fetchLeads();
    } else if (activeTab === 'queries') {
      fetchQueries();
    } else if (activeTab === 'chatsessions') {
      fetchChatSessions();
    }
  }, [router, filters, activeTab]);

  const fetchChatSessions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/chat-sessions?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setChatSessions(data.sessions);
        setChatLeadCount(data.leadCount);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/queries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQueries(data.queries);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      
      const response = await fetch(`/api/admin/leads?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        let filteredLeads = data.leads;
        
        // Client-side search filter
        if (filters.search) {
          filteredLeads = filteredLeads.filter((lead: Lead) =>
            lead.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.applicationNumber.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setLeads(filteredLeads);
        
        // Calculate stats
        const stats = {
          total: data.leads.length,
          active: data.leads.filter((l: Lead) => l.status === 'active').length,
          processing: data.leads.filter((l: Lead) => l.status === 'processing').length,
          completed: data.leads.filter((l: Lead) => l.status === 'completed').length
        };
        setStats(stats);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchLeads();
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleReplyQuery = async () => {
    if (!selectedQuery || !adminReply) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/queries/${selectedQuery._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'resolved', adminResponse: adminReply })
      });
      if (response.ok) {
        fetchQueries();
        setSelectedQuery(null);
        setAdminReply('');
      }
    } catch (error) {
      console.error('Error replying to query:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-orange-100 text-orange-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Banker's Den - Lead Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="text-blue-900 text-sm">
                  <p><strong>📱 WhatsApp Lead System:</strong> +91 9145023840</p>
                  <p className="text-xs text-blue-700 mt-1">New leads → Your WhatsApp → Follow up directly</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 border-t pt-4">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'leads' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5" />
              Leads
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'queries' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Support Queries
            </button>
            <button
              onClick={() => setActiveTab('chatsessions')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'chatsessions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bot className="w-5 h-5" />
              Chat Sessions
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'whatsapp' ? 'bg-[#25D366] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              WhatsApp Live Chats
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'leads' ? (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or application number..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">All Types</option>
              <option value="loan">Loan Applications</option>
              <option value="contact">Contact Forms</option>
              <option value="bd-partner">BD Partner</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.applicationNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.type.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.full_name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.type === 'loan' ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.loanType?.toUpperCase()} LOAN
                          </div>
                          {lead.loanAmount && (
                            <div className="text-sm text-gray-500">
                              {formatCurrency(lead.loanAmount)}
                            </div>
                          )}
                          {lead.monthlyIncome && (
                            <div className="text-xs text-gray-400">
                              Income: {formatCurrency(lead.monthlyIncome)}/mo
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-900">{lead.category}</div>
                          <div className="text-xs text-gray-500">Contact Form</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)}
                        <span className="ml-1">{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(lead.createdAt).toLocaleTimeString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
                        >
                          <option value="active">Active</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No leads found matching your criteria.</p>
          </div>
        )}
        </>
        ) : activeTab === 'queries' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queries.map((query) => (
                    <tr key={query._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{query.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {query.subject}
                        {query.applicationNumber && <span className="block text-xs text-blue-600 mt-1">Ref: {query.applicationNumber}</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          query.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          query.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setSelectedQuery(query)} className="text-blue-600 hover:text-blue-900">
                          View & Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {queries.length === 0 && (
                <div className="text-center py-12 text-gray-500">No support queries found.</div>
              )}
            </div>
          </div>
        ) : activeTab === 'whatsapp' ? (
          <AdminWhatsAppChats />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Chatbot Sessions</h2>
                <p className="text-sm text-gray-500">View live and past conversations with the Banker's Den AI</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                <Zap className="w-4 h-4" />
                {chatLeadCount} Auto-Generated Leads
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extracted Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chatSessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSession(session)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={session.sessionId}>
                          {session.sessionId}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                          {session.intentSignals.slice(0, 2).map((signal, idx) => (
                            <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded-full">{signal}</span>
                          ))}
                          {session.intentSignals.length > 2 && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full">+{session.intentSignals.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{session.extractedName || '-'}</div>
                        <div className="text-sm text-gray-500">{session.extractedPhone || session.extractedEmail || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.messages.length} messages
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {session.leadGenerated ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Lead Generated
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            No Lead
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.lastActivityAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {chatSessions.length === 0 && (
                <div className="text-center py-12 text-gray-500">No chat sessions found.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chat Session Details</h2>
                <p className="text-sm text-gray-500">{selectedSession.sessionId}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Sidebar with extracted info */}
              <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Extracted Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Contact</p>
                    <p className="text-sm font-medium">{selectedSession.extractedName || 'Unknown'}</p>
                    <p className="text-sm">{selectedSession.extractedPhone || 'No phone'}</p>
                    <p className="text-sm">{selectedSession.extractedEmail || 'No email'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Loan Details</p>
                    <p className="text-sm"><span className="font-medium">Type:</span> {selectedSession.extractedLoanType || 'Not specified'}</p>
                    <p className="text-sm"><span className="font-medium">Amount:</span> {selectedSession.extractedLoanAmount || 'Not specified'}</p>
                    <p className="text-sm"><span className="font-medium">Income:</span> {selectedSession.extractedIncome || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Intent Signals</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.intentSignals.length > 0 ? (
                        selectedSession.intentSignals.map((signal, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {signal}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No strong signals</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 uppercase mb-2">Lead Status</p>
                    {selectedSession.leadGenerated ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-800 font-medium text-sm mb-1">
                          <CheckCircle className="w-4 h-4" /> Lead Generated
                        </div>
                        <p className="text-xs text-green-600">
                          {new Date(selectedSession.leadGeneratedAt || '').toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                        Lead threshold not met during this conversation.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Chat Transcript */}
              <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 sticky top-0 bg-gray-100 py-2">Conversation Transcript</h3>
                <div className="space-y-4">
                  {selectedSession.messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 border shadow-sm rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Lead Details - {selectedLead.applicationNumber}
                </h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedLead.full_name}</p>
                    <p><strong>Email:</strong> {selectedLead.email}</p>
                    {selectedLead.phone && <p><strong>Phone:</strong> {selectedLead.phone}</p>}
                    <p><strong>Verified User:</strong> {selectedLead.isAuthenticated ? <span className="text-green-600 font-semibold">✅ Yes</span> : <span className="text-gray-500">❌ No</span>}</p>
                    {selectedLead.address && (
                      <p><strong>Address:</strong> {selectedLead.address}, {selectedLead.city}, {selectedLead.state} - {selectedLead.pincode}</p>
                    )}
                  </div>
                </div>
                
                {selectedLead.type === 'loan' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Loan Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Loan Type:</strong> {selectedLead.loanType?.toUpperCase()}</p>
                      {selectedLead.loanAmount && <p><strong>Amount:</strong> {formatCurrency(selectedLead.loanAmount)}</p>}
                      {selectedLead.monthlyIncome && <p><strong>Monthly Income:</strong> {formatCurrency(selectedLead.monthlyIncome)}</p>}
                      {selectedLead.employmentType && <p><strong>Employment:</strong> {selectedLead.employmentType}</p>}
                      {selectedLead.companyName && <p><strong>Company:</strong> {selectedLead.companyName}</p>}
                      {selectedLead.workExperience && <p><strong>Experience:</strong> {selectedLead.workExperience} years</p>}
                      {selectedLead.panNumber && <p><strong>PAN:</strong> {selectedLead.panNumber}</p>}
                    </div>
                  </div>
                )}

                {selectedLead.type === 'contact' && selectedLead.message && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedLead.message}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}</p>
                    <p>Updated: {new Date(selectedLead.updatedAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => updateLeadStatus(selectedLead._id, 'processing')}
                      disabled={selectedLead.status === 'processing'}
                    >
                      Mark Processing
                    </Button>
                    <Button
                      onClick={() => updateLeadStatus(selectedLead._id, 'completed')}
                      disabled={selectedLead.status === 'completed'}
                    >
                      Mark Completed
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Support Query</h2>
              <button onClick={() => setSelectedQuery(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">From: {selectedQuery.userEmail}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedQuery.subject}</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>

              {selectedQuery.adminResponse ? (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Your Response:</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-900 whitespace-pre-wrap">{selectedQuery.adminResponse}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">Reply to User:</h4>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Type your response here... (This will mark the query as resolved)"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleReplyQuery} disabled={!adminReply}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}