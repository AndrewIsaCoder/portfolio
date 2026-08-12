// Proiectele, în ordinea în care apar în teanc.
// `video` e opțional: dacă există, rulează în locul imaginii (pe card și în
// panoul de detaliu), iar `screenshot` / `detail` devin poster-ul lui.
// `card-bg.svg` e gradientul placeholder comun — înlocuiește-l per proiect când
// ai imagini reale (poți folosi .png sau .jpg, actualizează doar căile aici).
const projects = [
  {
    title: 'Axiobyte',
    subtitle: 'Digital Product Agency',
    screenshot: '/work/axiobyte.jpg',
    detail: '/work/axiobyte.jpg',
    video: '/work/axiobyte.mp4',
    background: '/work/card-bg.svg',
    description:
      'Agency site built on Next.js — animated hero, scroll-driven sections, an orbiting production-stack ring, a selected-work gallery and a multi-step contact flow. Bucharest, since 2026.',
    url: 'https://axiobyte.online',
  },
  {
    title: 'Furdeco',
    subtitle: 'E-commerce Furniture Platform',
    screenshot: '/work/furdeco.jpg',
    detail: '/work/furdeco.jpg',
    video: '/work/furdeco.mp4',
    background: '/work/card-bg.svg',
    description:
      'Multi-page storefront for a premium furniture brand — product catalogue, category browsing, detail pages and a layout that holds up across breakpoints. Built with HTML, CSS and JavaScript.',
    url: 'https://example.com',
  },
  {
    title: 'Product Category Classifier',
    subtitle: 'Machine Learning',
    screenshot: '/work/placeholder.svg',
    detail: '/work/placeholder.svg',
    background: '/work/card-bg.svg',
    description:
      'End-to-end pipeline that predicts a product’s category from its title: data cleaning, model training and an interactive prediction tool. Built with Python, pandas and scikit-learn.',
    url: 'https://example.com',
  },
  {
    title: 'Glorious',
    subtitle: 'Shoemaking Workshop',
    screenshot: '/work/placeholder.svg',
    detail: '/work/placeholder.svg',
    background: '/work/glorious-bg.jpg',
    description:
      'Bilingual (EN/ES) site for a shoemaking workshop — full-bleed hero over the craftsman at work, an about section, and three service cards for repair, restoration and custom design. Built with HTML, CSS and JavaScript.',
    url: 'https://glorious-cobbler-website.vercel.app/',
  },
]

export default projects
