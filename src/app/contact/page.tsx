'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    category: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ full_name: '', email: '', phone: '', countryCode: '+91', category: 'general', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all duration-200 text-gray-800 bg-white text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF8C42]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-4">Reach Us</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
            Let's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
              Connect
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Our team of experts is ready to guide you toward the best financial decision.
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: MapPin, title: 'Our Office', lines: ['1st Floor, City Avenue, 107,', 'Wakad, Pune, MH 411057'] },
              { icon: Phone, title: 'Call Us', lines: ['+91 9145023840', '+91 7758955586'] },
              { icon: Mail, title: 'Email Us', lines: ['bharat@bankersdens.com', 'mayuri@bankersdens.com'] },
              { icon: Clock, title: 'Business Hours', lines: ['All Days', '10:00 AM – 6:30 PM'] },
            ].map((card) => (
              <div key={card.title} className="group bg-gray-50 hover:bg-orange-50 rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{card.title}</h3>
                {card.lines.map((l) => (<p key={l} className="text-xs text-gray-500 leading-relaxed">{l}</p>))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + SIDE */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* FORM — takes 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-500 text-sm mb-8">We'll get back to you within 24 hours.</p>

                {submitted && (
                  <div className="mb-6 flex flex-col items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                    <iframe
                      src="https://lottie.host/embed/c2ff2230-32d1-48ae-be9b-1938f40ffb5e/8AeiPdp8tT.lottie"
                      className="w-32 h-32"
                      style={{ border: 'none' }}
                      title="Message Sent Animation"
                    />
                    <p className="text-[#FF6B35] font-bold text-base">Message sent!</p>
                    <p className="text-gray-500 text-sm">We've received your message and will get back to you shortly.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="flex gap-2">
                      <select name="countryCode" value={formData.countryCode} onChange={handleChange}
                        className="w-28 px-2 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none text-sm bg-white">
                        {['+91 🇮🇳', '+1 🇺🇸', '+44 🇬🇧', '+971 🇦🇪', '+65 🇸🇬', '+61 🇦🇺'].map((c) => {
                          const val = c.split(' ')[0];
                          return <option key={val} value={val}>{c}</option>;
                        })}
                      </select>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                        pattern="^[0-9]{7,15}$" placeholder="Mobile number" className={`${inputClass} flex-1`} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                      <option value="general">General Inquiry</option>
                      <option value="loan_inquiry">Loan Inquiry</option>
                      <option value="complaint">Complaint</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                      placeholder="Tell us how we can help you..."
                      className={`${inputClass} resize-none`} />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</span>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* SIDE — takes 2 cols */}
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-start">
              {/* FAQ quick links */}
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Common Questions</h3>
                <ul className="space-y-4">
                  {[
                    'What documents are needed for a home loan?',
                    'How long does loan approval take?',
                    'Can I transfer my existing loan?',
                    'What is the maximum loan tenure?',
                    'Are there any hidden charges?',
                    'What is the eligibility criteria?',
                    'Can I get a loan for an under-construction property?',
                    'Do you provide business loans?',
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-3 text-sm text-gray-600 group cursor-pointer hover:text-[#FF6B35] transition-colors">
                      <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#FF6B35] transition-colors">
                        <CheckCircle className="w-3 h-3 text-[#FF6B35] group-hover:text-white transition-colors" />
                      </span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hours */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>All Days</span><span className="font-medium text-gray-800">10:00 AM – 6:30 PM</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="bg-white pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-72">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.089!2d73.76!3d18.60!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM2JzAwLjAiTiA3M8KwNDUnMzYuMCJF!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="BankersDen Office Location"
            />
          </div>
        </div>
      </section>

    </div>
  );
}