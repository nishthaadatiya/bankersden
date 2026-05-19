'use client';

import { useEffect, useState, useRef } from 'react';

export interface NavSection {
  id: string;
  label: string;
}

interface SecondaryNavProps {
  sections: NavSection[];
}

export function SecondaryNav({ sections }: SecondaryNavProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isHeaderVisibleRef = useRef(true);

  useEffect(() => {
    // Set initial active section
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track header visibility matching the Header component logic
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY.current && isHeaderVisibleRef.current) {
          setIsHeaderVisible(false); // scrolling down
          isHeaderVisibleRef.current = false;
        } else if (currentScrollY < lastScrollY.current && !isHeaderVisibleRef.current) {
          setIsHeaderVisible(true); // scrolling up
          isHeaderVisibleRef.current = true;
        }
      } else {
        setIsHeaderVisible(true);
        isHeaderVisibleRef.current = true;
      }
      lastScrollY.current = currentScrollY;

      // Offset for the fixed header + secondary nav + some padding
      const scrollPosition = currentScrollY + 180; 

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - (isHeaderVisible ? 140 : 60), // adjust for header presence
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`sticky ${isHeaderVisible ? 'top-[88px]' : 'top-0'} z-40 w-full bg-white border-b border-gray-200 shadow-sm transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {sections.map((section, index) => (
            <div key={section.id} className={`py-4 ${index !== 0 ? 'border-l-2 border-gray-200' : ''}`}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`whitespace-nowrap px-4 sm:px-6 text-xs sm:text-sm font-bold tracking-wide uppercase transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'text-[#E11D48]'
                    : 'text-gray-400 hover:text-gray-800'
                } ${index === 0 ? 'pl-0' : ''}`}
              >
                {section.label}
              </button>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
