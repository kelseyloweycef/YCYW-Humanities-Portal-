
import React, { useState, useRef, useEffect } from 'react';
import { Resource, YearGroup, ResourceType, User, ResourceStatus, ResourceFile, Subject } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (resource: Resource) => void;
  currentUser: User;
  presets?: Partial<Resource>;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, currentUser, presets }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    yearGroup: YearGroup.YEAR_7,
    subject: Subject.GENERAL,
    type: ResourceType.LESSON_PLAN,
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
        type: presets.type || prev.type
      }));
    }
  }, [isOpen, presets]);

  if (!isOpen) return null;

  const isExamContext = [YearGroup.IGCSE, YearGroup.IB_ALEVEL].includes(formData.yearGroup);
  const isAssessment = [ResourceType.ASSESSMENT, ResourceType.MARK_SCHEME, ResourceType.EXAM_PACKAGE].includes(formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      yearGroup: formData.yearGroup,
      subject: formData.subject,
      type: formData.type,
      author: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      comments: [],
      status: ResourceStatus.APPROVED,
      files: selectedFiles,
      examPaper: isExamContext && isAssessment ? formData.examPaper : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Contribute Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="Topic Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none" value={formData.yearGroup} onChange={e => setFormData({...formData, yearGroup: e.target.value as YearGroup})}>
              {Object.values(YearGroup).map(yg => <option key={yg} value={yg}>{yg}</option>)}
            </select>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value as Subject})}>
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ResourceType})}>
              {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {isExamContext && isAssessment && (
              <input className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-4 outline-none font-bold" placeholder="Which Paper? (e.g. Paper 1)" value={formData.examPaper} onChange={e => setFormData({...formData, examPaper: e.target.value})} />
            )}
          </div>

          <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 h-32 outline-none" placeholder="Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold">Post to Hub</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
