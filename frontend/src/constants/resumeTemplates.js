export const RESUME_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with subtle colors and modern typography',
    category: 'Popular',
    bestFor: 'Tech, Startups, Creative roles',
    features: ['Color accents', 'Modern fonts', 'Icon support'],
    preview: '📱'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional format that works for any industry',
    category: 'Popular',
    bestFor: 'Finance, Law, Corporate',
    features: ['Conservative layout', 'Black & white', 'ATS-friendly'],
    preview: '📄'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum white space and minimal elements',
    category: 'Popular',
    bestFor: 'Design, Architecture, Consulting',
    features: ['Lots of white space', 'Simple typography', 'Focus on content'],
    preview: '⚪'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Polished business format with structured sections',
    category: 'Popular',
    bestFor: 'Management, Business, Sales',
    features: ['Structured sections', 'Professional colors', 'Easy to scan'],
    preview: '💼'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and artistic design to showcase your creativity',
    category: 'Creative',
    bestFor: 'Designers, Artists, Marketing',
    features: ['Unique layout', 'Creative elements', 'Stand-out design'],
    preview: '🎨'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium design for senior-level positions and leadership roles',
    category: 'Professional',
    bestFor: 'C-Suite, Directors, Senior Management',
    features: ['Sophisticated layout', 'Premium feel', 'Leadership focus'],
    preview: '👔'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for technical roles with emphasis on skills and projects',
    category: 'Specialized',
    bestFor: 'Software Engineers, Data Scientists, DevOps',
    features: ['Skills-focused', 'Project highlights', 'Tech-friendly'],
    preview: '💻'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Comprehensive format for academic and research positions',
    category: 'Specialized',
    bestFor: 'Researchers, Professors, PhD candidates',
    features: ['Publication section', 'Research focus', 'Detailed format'],
    preview: '🎓'
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Straightforward design that gets straight to the point',
    category: 'Basic',
    bestFor: 'Entry-level, Students, Career changers',
    features: ['Easy to read', 'No frills', 'Quick to create'],
    preview: '📝'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined design with sophisticated typography and spacing',
    category: 'Creative',
    bestFor: 'Fashion, Luxury brands, Publishing',
    features: ['Elegant fonts', 'Refined spacing', 'Sophisticated look'],
    preview: '✨'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Eye-catching design with strong visual hierarchy',
    category: 'Creative',
    bestFor: 'Sales, Marketing, Media',
    features: ['Strong headers', 'Bold typography', 'High contrast'],
    preview: '⚡'
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Space-efficient design that fits more content on one page',
    category: 'Specialized',
    bestFor: 'Experienced professionals, Multiple roles',
    features: ['Dense layout', 'Efficient spacing', 'Fits more content'],
    preview: '📋'
  },
  {
    id: 'infographic',
    name: 'Infographic',
    description: 'Visual resume with charts, graphs, and visual elements',
    category: 'Creative',
    bestFor: 'Marketing, Design, Data visualization',
    features: ['Visual elements', 'Skill charts', 'Eye-catching'],
    preview: '📊'
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Chronological layout with visual timeline of your career',
    category: 'Specialized',
    bestFor: 'Career progression showcase, Project managers',
    features: ['Visual timeline', 'Chronological focus', 'Career journey'],
    preview: '📅'
  },
  {
    id: 'two-column',
    name: 'Two-Column',
    description: 'Efficient two-column layout with sidebar for key information',
    category: 'Professional',
    bestFor: 'All industries, Versatile use',
    features: ['Sidebar layout', 'Efficient use of space', 'Modern structure'],
    preview: '📑'
  }
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', count: 15 },
  { id: 'popular', name: 'Popular', count: 4 },
  { id: 'professional', name: 'Professional', count: 2 },
  { id: 'creative', name: 'Creative', count: 4 },
  { id: 'specialized', name: 'Specialized', count: 3 },
  { id: 'basic', name: 'Basic', count: 1 }
];

export const getTemplateById = (id) => {
  return RESUME_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category) => {
  if (category === 'all') return RESUME_TEMPLATES;
  return RESUME_TEMPLATES.filter(template => 
    template.category.toLowerCase() === category.toLowerCase()
  );
};
