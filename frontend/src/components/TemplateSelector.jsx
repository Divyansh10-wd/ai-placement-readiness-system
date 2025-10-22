import { useState } from 'react';
import { Check, Info, HelpCircle } from 'lucide-react';
import { RESUME_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory } from '../constants/resumeTemplates';
import TemplateGuide from './TemplateGuide';

export default function TemplateSelector({ selectedTemplate, onSelectTemplate, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const filteredTemplates = getTemplatesByCategory(activeCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Resume Template</h2>
              <p className="text-gray-600 mt-1">Select from 15 professionally designed templates</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <HelpCircle className="w-4 h-4" />
                Need Help?
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
                <span className={`ml-2 text-xs ${
                  activeCategory === category.id ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => onSelectTemplate(template.id)}
                className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-600 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {/* Preview Card */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  {/* Template Icon/Preview */}
                  <div className="flex items-center justify-center h-32 mb-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <span className="text-6xl">{template.preview}</span>
                  </div>

                  {/* Template Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                      {selectedTemplate === template.id && (
                        <div className="bg-blue-600 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    
                    <div className="pt-2">
                      <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {template.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Info on Hover */}
                {hoveredTemplate === template.id && (
                  <div className="absolute inset-0 bg-white rounded-xl p-6 border-2 border-blue-400 shadow-xl z-10">
                    <div className="h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                        <span className="text-3xl">{template.preview}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Best For:</div>
                        <div className="text-sm text-gray-600">{template.bestFor}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Features:</div>
                        <ul className="space-y-1">
                          {template.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-1">
                              <span className="text-blue-600">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => onSelectTemplate(template.id)}
                        className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>Hover over templates to see more details</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Template Guide Modal */}
      {showGuide && <TemplateGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}
