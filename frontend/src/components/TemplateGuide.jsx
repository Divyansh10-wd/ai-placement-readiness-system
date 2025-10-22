import { X, Briefcase, GraduationCap, Palette, Code, Building } from 'lucide-react';

export default function TemplateGuide({ onClose }) {
  const industryRecommendations = [
    {
      icon: <Code className="w-6 h-6" />,
      industry: 'Tech & IT',
      templates: ['Modern 📱', 'Technical 💻', 'Two-Column 📑'],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Building className="w-6 h-6" />,
      industry: 'Finance & Corporate',
      templates: ['Classic 📄', 'Professional 💼', 'Executive 👔'],
      color: 'bg-gray-50 border-gray-200'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      industry: 'Creative & Design',
      templates: ['Creative 🎨', 'Elegant ✨', 'Bold ⚡', 'Infographic 📊'],
      color: 'bg-pink-50 border-pink-200'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      industry: 'Academic & Research',
      templates: ['Academic 🎓', 'Classic 📄', 'Simple 📝'],
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      industry: 'Business & Sales',
      templates: ['Professional 💼', 'Bold ⚡', 'Two-Column 📑'],
      color: 'bg-green-50 border-green-200'
    }
  ];

  const experienceLevels = [
    {
      level: 'Entry-Level',
      description: 'Starting your career',
      templates: ['Simple 📝', 'Modern 📱', 'Minimal ⚪']
    },
    {
      level: 'Mid-Level',
      description: '2-7 years experience',
      templates: ['Professional 💼', 'Technical 💻', 'Two-Column 📑']
    },
    {
      level: 'Senior/Executive',
      description: '8+ years or leadership',
      templates: ['Executive 👔', 'Compact 📋', 'Timeline 📅']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Template Selection Guide</h2>
              <p className="text-gray-600 mt-1">Find the perfect template for your industry and experience</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* By Industry */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended by Industry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industryRecommendations.map((item, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-xl p-4 ${item.color}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-gray-700">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-900">{item.industry}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.templates.map((template, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
                      >
                        {template}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Experience Level */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended by Experience Level</h3>
            <div className="space-y-3">
              {experienceLevels.map((item, idx) => (
                <div
                  key={idx}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.level}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.templates.map((template, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700"
                      >
                        {template}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>ATS-Friendly:</strong> Classic, Professional, and Simple templates work best with Applicant Tracking Systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Stand Out:</strong> Creative, Bold, and Infographic templates help you make a memorable impression</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Maximize Space:</strong> Compact and Two-Column templates fit more content on one page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Match Culture:</strong> Research the company culture and choose a template that aligns with it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span><strong>Test Multiple:</strong> Try different templates to see which presents your experience best</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Got it, let me choose a template
          </button>
        </div>
      </div>
    </div>
  );
}
