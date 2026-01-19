
import React, { useState, useRef, useEffect } from 'react';
import { Resource, YearGroup, ResourceType, User, ResourceStatus, ResourceFile, Subject } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (resource: Resource) => void;
  currentUser: User;
  presets?: Partial<Resource>;
}

const SENIOR_CURRICULUM_SUBJECTS = [
  Subject.HISTORY, Subject.ECONOMICS, Subject.BUSINESS, Subject.GEOGRAPHY, Subject.PSYCHOLOGY
];

const DSE_ELIGIBLE_SUBJECTS = [Subject.ECONOMICS, Subject.BUSINESS];

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, currentUser, presets }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    yearGroup: YearGroup.YEAR_7,
    subject: Subject.GENERAL,
    type: ResourceType.LESSON_PLAN,
    curriculum: 'IB',
    tags: '',
    examPaper: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<ResourceFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && presets) {
      setFormData(prev => ({
        ...prev,
        yearGroup: presets.yearGroup || prev.yearGroup,
        subject: presets.subject || prev.subject,
        type: presets.type || prev.type,
        tags: presets.tags ? presets.tags.join(', ') : prev.tags
      }));
    }
  }, [isOpen, presets]);

  if (!isOpen) return null;

  const isSeniorContext = [YearGroup.IGCSE, YearGroup.IB_ALEVEL, YearGroup.YEAR_10, YearGroup.YEAR_11, YearGroup.YEAR_12, YearGroup.YEAR_13].includes(formData.yearGroup);
  const isExamType = [ResourceType.ASSESSMENT, ResourceType.MARK_SCHEME, ResourceType.EXAM_PACKAGE].includes(formData.type);
  const showExamIdentifier = isSeniorContext && isExamType;

  const showCurriculumField = [YearGroup.YEAR_12, YearGroup.YEAR_13, YearGroup.IB_ALEVEL].includes(formData.yearGroup) && 
                               SENIOR_CURRICULUM_SUBJECTS.includes(formData.subject);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles: ResourceFile[] = filesArray.map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
        type: file.type.includes('presentation') || file.name.endsWith('.pptx') ? 'presentation' : 'document'
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }
    
    if (showExamIdentifier && !formData.examPaper.trim()) {
      alert("Please indicate which exam paper this is for (e.g. Paper 1).");
      return;
    }
    
    const newResource: Resource = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      yearGroup: formData.yearGroup,
      subject: formData.subject,
      type: formData.type,
      curriculum: showCurriculumField ? formData.curriculum : undefined,
      author: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      comments: [],
      status: ResourceStatus.APPROVED,
      files: selectedFiles,
      examPaper: showExamIdentifier ? formData.examPaper : undefined
    };
    
    onUpload(newResource);
    setFormData({
      title: '',
      description: '',
      yearGroup: YearGroup.YEAR_7,
      subject: Subject.GENERAL,
      type: ResourceType.LESSON_PLAN,
      curriculum: 'IB',
      tags: '',
      examPaper: ''
    });
    setSelectedFiles([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Contribute Resource</h2>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
              <i className="fa-solid fa-circle-check mr-1"></i> Instant Publishing Enabled
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Topic Title</label>
              <input 
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
                placeholder="e.g. Industrial Revolution Case Studies"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Year Group</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
                  value={formData.yearGroup}
                  onChange={e => setFormData({...formData, yearGroup: e.target.value as YearGroup})}
                >
                  {Object.values(YearGroup).map(yg => <option key={yg} value={yg}>{yg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subject</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value as Subject})}
                >
                  {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${showCurriculumField || showExamIdentifier ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Resource Type</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as ResourceType})}
                >
                  {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              {showCurriculumField && (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Exam Board</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
                    value={formData.curriculum}
                    onChange={e => setFormData({...formData, curriculum: e.target.value})}
                  >
                    <option value="IB">IB</option>
                    <option value="A-Level">A-Level</option>
                    {DSE_ELIGIBLE_SUBJECTS.includes(formData.subject) && <option value="DSE">DSE</option>}
                  </select>
                </div>
              )}

              {showExamIdentifier && (
                <div>
                  <label className="block text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Which Exam Paper?</label>
                  <input 
                    required
                    className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold placeholder:text-indigo-200"
                    placeholder="e.g. Paper 1"
                    value={formData.examPaper}
                    onChange={e => setFormData({...formData, examPaper: e.target.value})}
                  />
                </div>
              )}

              <div className={!(showCurriculumField || showExamIdentifier) ? 'sm:col-span-1' : ''}>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tags (Comma separated)</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
                  placeholder="History, Exam Prep..."
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                {formData.type === ResourceType.COURSEWORK || formData.type === ResourceType.INTERNAL_ASSESSMENT || formData.type === ResourceType.EXAMPLE_WORK ? 'Sample Context & Feedback Request' : 'Topic Description'}
              </label>
              <textarea 
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 h-32 focus:border-indigo-500 focus:outline-none transition-all font-medium"
                placeholder={formData.type === ResourceType.COURSEWORK || formData.type === ResourceType.INTERNAL_ASSESSMENT ? "Explain why you are sharing this sample..." : "Describe the content and any teaching notes..."}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                {formData.type === ResourceType.EXAM_PACKAGE ? 'Upload Paper & Mark Scheme' : 'Upload Files'}
              </label>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 rounded-[2rem] p-8 text-center bg-indigo-50/30 hover:border-indigo-500 transition-all cursor-pointer group"
              >
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-indigo-300 mb-4 block group-hover:scale-110 transition-transform"></i>
                <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  {formData.type === ResourceType.EXAM_PACKAGE ? 'Select Paper and Mark Scheme together' : 'Click to select files (Multiple allowed)'}
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${file.type === 'presentation' ? 'fa-file-powerpoint text-orange-500' : 'fa-file-pdf text-rose-500'}`}></i>
                        <span className="text-xs font-bold text-slate-700">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-rose-500">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
              Post to Hub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
