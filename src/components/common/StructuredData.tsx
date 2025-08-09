'use client';

interface StructuredDataProps {
  type: 'Person' | 'WebSite' | 'Article';
  data: any;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateStructuredData = () => {
    switch (type) {
      case 'Person':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Arthur Wei",
          "jobTitle": "Engineer, Photographer, Storyteller",
          "description": "Creating immersive digital experiences at the intersection of technology and creativity.",
          "url": "https://arthurwei.com",
          "sameAs": [
            "https://linkedin.com/in/arthurwei",
            "https://github.com/arthurwei",
            "https://twitter.com/arthurwei"
          ],
          "knowsAbout": [
            "Web Development",
            "3D Graphics",
            "Photography",
            "Motion Design",
            "Creative Technology"
          ]
        };
      
      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Arthur Wei - Portfolio",
          "description": "Personal portfolio of Arthur Wei - Engineer, Photographer, and Storyteller.",
          "url": "https://arthurwei.com",
          "author": {
            "@type": "Person",
            "name": "Arthur Wei"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://arthurwei.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
      
      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.headline,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": "Arthur Wei"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Arthur Wei",
            "logo": {
              "@type": "ImageObject",
              "url": "https://arthurwei.com/logo.png"
            }
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified,
          "image": data.image
        };
      
      default:
        return {};
    }
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};