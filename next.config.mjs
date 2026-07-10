/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Preserve old exported .dc.html deep links → new routes
    return [
      { source: "/TruKode-Landing.dc.html", destination: "/", permanent: true },
      { source: "/TruKode-All-Reads.dc.html", destination: "/products", permanent: true },
      { source: "/TruKode-Product-Personal-Read.dc.html", destination: "/reads/personal-read", permanent: true },
      { source: "/TruKode-How-It-Works.dc.html", destination: "/how-it-works", permanent: true },
      { source: "/TruKode-About.dc.html", destination: "/about", permanent: true },
      { source: "/TruKode-FAQ.dc.html", destination: "/faq", permanent: true },
      { source: "/TruKode-Intake.dc.html", destination: "/intake", permanent: true },
      { source: "/TruKode-Confirmation.dc.html", destination: "/confirmation", permanent: true },
    ];
  },
};

export default nextConfig;
