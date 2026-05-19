interface StructuredDataProps {
  type: 'organization' | 'loanProduct' | 'calculator' | 'contactPage'
  data?: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseOrganization = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "Bankers Den",
      "url": "https://bankersdens.com",
      "logo": "https://bankersdens.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9145023840",
        "contactType": "customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1st Floor, City Avenue, 107, Wakad",
        "addressLocality": "Pune",
        "addressRegion": "Maharashtra",
        "postalCode": "411057",
        "addressCountry": "IN"
      }
    }

    switch (type) {
      case 'organization':
        return baseOrganization

      case 'loanProduct':
        return {
          ...baseOrganization,
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": data?.productName || "Loan Products",
            "itemListElement": [{
              "@type": "Offer",
              "itemOffered": {
                "@type": "LoanOrCredit",
                "name": data?.productName,
                "description": data?.description,
                "amount": data?.maxAmount,
                "interestRate": data?.interestRate
              }
            }]
          }
        }

      case 'calculator':
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": data?.name || "Loan Calculator",
          "description": data?.description,
          "url": data?.url,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any"
        }

      default:
        return baseOrganization
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
}