export default function Head() {
  return (
    <>
      {/* Font preloads removed; fonts are provided via @fontsource in layout */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Get saved theme from localStorage
                var theme = localStorage.getItem('theme');
                
                // Default to dark if no theme is saved
                if (!theme) {
                  theme = 'dark';
                  localStorage.setItem('theme', 'dark');
                }
                
                // Apply theme immediately to prevent flash
                if (theme === 'dark' || theme === 'system') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Set color scheme
                document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
              } catch (e) {
                // Fallback to dark mode
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              }
            })();
          `,
        }}
      />
    </>
  );
} 