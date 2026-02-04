import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  product = null,
  collection = null
}) => {
  const siteUrl = 'https://reeown.eco-dispose.com';
  const siteName = 'Reeown by Eco Dispose';
  const defaultImage = `${siteUrl}/logo_light.png`;
  
  const fullTitle = title 
    ? `${title} | ${siteName}`
    : `${siteName} | Premium Refurbished Electronics - Buy, Sell, Repair, Recycle`;
  
  const fullDescription = description || 
    'Reeown by Eco Dispose - India\'s trusted platform for premium certified refurbished smartphones, laptops, tablets, and electronics. Buy quality tested devices, sell your old tech, repair services, and responsible e-waste recycling.';
  
  const fullKeywords = keywords || 
    'eco dispose, reeown, refurbished electronics, refurbished smartphones, refurbished laptops, certified pre-owned, eco-friendly electronics, sustainable tech, buy refurbished, sell old phones, repair electronics, e-waste recycling, tech products';
  
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || defaultImage;

  // Structured Data for Product
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || fullDescription,
    "image": product.images && product.images.length > 0 ? product.images : [ogImage],
    "brand": {
      "@type": "Brand",
      "name": product.type?.name || "Reeown"
    },
    "offers": {
      "@type": "Offer",
      "url": fullUrl,
      "priceCurrency": "INR",
      "price": product.discountPrice || product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": `https://schema.org/${product.condition?.replace(' ', '') || 'UsedCondition'}`
    },
    "aggregateRating": product.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 0
    } : undefined
  } : null;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Eco Dispose",
    "url": "https://www.eco-dispose.com",
    "logo": `${siteUrl}/logo_light.png`,
    "sameAs": [
      "https://www.eco-dispose.com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": "en"
    }
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = collection ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": collection.name || "Products",
        "item": `${siteUrl}/products/${collection.slug || ''}`
      }
    ]
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="theme-color" content="#10b981" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
