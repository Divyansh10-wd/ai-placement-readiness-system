import { X, Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, FolderGit2, Award, Star } from 'lucide-react';
import { getTemplateById } from '../constants/resumeTemplates';

export default function ResumePreview({ resume, onClose }) {
  const template = getTemplateById(resume.template);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{template?.preview || '📄'}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
                <p className="text-sm text-gray-600">
                  Template: <span className="font-semibold">{template?.name || resume.template}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
            {/* Personal Info Header */}
            <div className="border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {resume.personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {resume.personalInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{resume.personalInfo.email}</span>
                  </div>
                )}
                {resume.personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{resume.personalInfo.phone}</span>
                  </div>
                )}
                {resume.personalInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{resume.personalInfo.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-600">
                {resume.personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="w-4 h-4" />
                    <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
                {resume.personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    <a href={resume.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      GitHub
                    </a>
                  </div>
                )}
                {resume.personalInfo.portfolio && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={resume.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {resume.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-lg text-gray-700">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && exp.description.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-2">
                          {exp.description.filter(d => d.trim()).map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6" />
                  Education
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                          <p className="text-lg text-gray-700">{edu.institution}</p>
                          {edu.field && <p className="text-gray-600">{edu.field}</p>}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {edu.startDate && edu.endDate && (
                            <p>{edu.startDate} - {edu.endDate}</p>
                          )}
                          {edu.gpa && <p className="font-semibold">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FolderGit2 className="w-6 h-6" />
                  Projects
                </h2>
                <div className="space-y-4">
                  {resume.projects.map((proj, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-xl font-bold text-gray-900">{proj.name}</h3>
                      {proj.description && (
                        <p className="text-gray-700 mt-1">{proj.description}</p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {proj.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-blue-600">
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Live Demo
                          </a>
                        )}
                        {proj.github && (
                          <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.skills && (resume.skills.technical?.length > 0 || resume.skills.frameworks?.length > 0 || resume.skills.tools?.length > 0) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Skills
                </h2>
                <div className="space-y-3">
                  {resume.skills.technical && resume.skills.technical.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.technical.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resume.skills.frameworks && resume.skills.frameworks.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Frameworks</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.frameworks.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resume.skills.tools && resume.skills.tools.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.tools.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h2>
                <div className="space-y-2">
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{cert.name}</h3>
                        {cert.issuer && <p className="text-gray-600">{cert.issuer}</p>}
                      </div>
                      {cert.date && <p className="text-sm text-gray-600">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {resume.achievements && resume.achievements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {resume.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              This is a preview. Download or export for final formatting.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
