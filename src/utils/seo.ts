const BASE_URL = 'https://bhandarisanjeev.com.np/QuickTools'

const PERSON = {
  '@type': 'Person' as const,
  '@id': 'https://bhandarisanjeev.com.np/#person',
  name: 'Sanjeev Bhandari (@realsanjeev)',
  alternateName: 'realsanjeev',
  url: 'https://bhandarisanjeev.com.np/',
  image: 'https://avatars.githubusercontent.com/u/45820805?v=4',
  jobTitle: 'Machine Learning Engineer',
  sameAs: [
    'https://linkedin.com/in/realsanjeev',
    'https://github.com/realsanjeev',
    'https://x.com/realsanjeev2',
    'https://medium.com/@realsanjeev',
    'https://huggingface.co/realsanjeev',
  ],
  knowsAbout: [
    'Machine Learning',
    'Deep Learning',
    'Artificial Intelligence',
    'Computer Vision',
    'Natural Language Processing',
    'Large Language Models (LLMs)',
    'Retrieval-Augmented Generation (RAG)',
  ],
}

export function getHomeSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'QuickTools (@realsanjeev)',
      url: `${BASE_URL}/`,
      description:
        'Free online utility tools including QR code generator, bold text converter, AI text humanizer, and more. All tools are free, fast, and work directly in your browser.',
      author: { '@id': 'https://bhandarisanjeev.com.np/#person' },
      publisher: { '@id': 'https://bhandarisanjeev.com.np/#person' },
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      ...PERSON,
    },
  ]
}

export function getQrGeneratorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#qr-generator`,
    name: 'QuickTools QR Generator (@realsanjeev)',
    description:
      'Create professional QR codes for URLs, WiFi, Contact Cards, and more. Customize colors and add logos.',
    applicationCategory: 'WebApplication',
    operatingSystem: 'All',
    url: `${BASE_URL}/qr-generator`,
    author: { '@id': 'https://bhandarisanjeev.com.np/#person' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
  }
}

export function getTextFormatterSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#text-formatter`,
    name: 'QuickTools Text Formatter (@realsanjeev)',
    description:
      'Transform your text into bold, italic, and stylish Unicode fonts perfect for social media posts.',
    applicationCategory: 'WebApplication',
    operatingSystem: 'All',
    url: `${BASE_URL}/text-formatter`,
    author: { '@id': 'https://bhandarisanjeev.com.np/#person' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
  }
}

export function getAiTextHumanizerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#ai-text-humanizer`,
    name: 'QuickTools AI Text Humanizer (@realsanjeev)',
    description:
      'Detect and replace common LLM jargon, em-dashes, smart quotes, and invisible zero-width characters to make AI-generated text cleaner and more natural.',
    applicationCategory: 'WebApplication',
    operatingSystem: 'All',
    url: `${BASE_URL}/ai-text-humanizer`,
    author: { '@id': 'https://bhandarisanjeev.com.np/#person' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
  }
}
