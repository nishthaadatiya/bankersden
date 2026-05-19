'use client';

const banks = [
  { name: 'Bank of Maharashtra', logo: '/bom.png' },
  { name: 'Canara Bank',         logo: '/canara.png' },
  { name: 'Bank of Baroda',      logo: '/bob.png' },
  { name: 'HDFC Bank',           logo: '/hdfc.png' },
  { name: 'ICICI Bank',          logo: '/icici.png' },
  { name: 'State Bank of India', logo: '/sbi.png' },
];

// Triple-duplicate for a seamless infinite loop
const tripled = [...banks, ...banks, ...banks];

export function BankLogosMarquee() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden border-t border-b border-gray-100">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#FF8C42] font-medium mb-3">
          TRUSTED LENDING PARTNERS
        </p>
        <h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
          style={{ letterSpacing: '-0.02em' }}
        >
          Loans from{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]">
            India's Top Banks
          </span>
        </h2>
        <p className="mt-4 text-gray-500 text-base max-w-lg mx-auto">
          We partner with leading public and private sector banks to bring you the best rates and fastest approvals.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l from-gray-50 to-transparent" />

        <div className="marquee-track flex items-center">
          {tripled.map((bank, i) => (
            <div key={`${bank.name}-${i}`} className="flex-shrink-0 mx-6 group">
              <div className="w-44 h-28 bg-white rounded-2xl border border-gray-100 shadow-sm
                              hover:shadow-lg hover:border-orange-200 transition-all duration-300
                              hover:-translate-y-1 flex flex-col items-center justify-center gap-3 px-5 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="max-h-12 max-w-[120px] w-auto object-contain"
                />
                <p className="text-[11px] text-gray-400 font-semibold text-center leading-tight">
                  {bank.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: marquee-scroll 24s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
