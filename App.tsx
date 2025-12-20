
import React, { useState } from 'react';
import { 
  YearGroup, 
  ResourceType, 
  Resource, 
  ForumPost, 
  ResourceComment,
  User,
  UserRole,
  ResourceStatus,
  ResourceFile,
  Subject,
  Notification
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadModal from './components/UploadModal';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';
import CurriculumView from './components/CurriculumView';
import YearGroupView from './components/YearGroupView';
import ResourceDetail from './components/ResourceDetail';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Inbox from './components/Inbox';
import ProfileModal from './components/ProfileModal';
import PDView from './components/PDView';

const INITIAL_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'The Industrial Revolution: Living Conditions',
    description: 'A complete lesson pack covering urbanisation and health in 19th-century Britain.',
    author: 'Ms. Thompson',
    yearGroup: YearGroup.YEAR_9,
    subject: Subject.HISTORY,
    type: ResourceType.LESSON_PLAN,
    date: '2024-03-15',
    downloads: 124,
    tags: ['History', 'Economics', 'Urbanisation'],
    status: ResourceStatus.APPROVED,
    files: [
      { id: 'f1', name: 'living_conditions_slides.pptx', size: '4.2MB', type: 'presentation' },
      { id: 'f2', name: 'student_worksheet_health.pdf', size: '1.1MB', type: 'document' }
    ],
    comments: []
  },
  {
    id: 'pd-1',
    title: 'AI in the Humanities Classroom',
    description: 'Workshop slides on using generative AI for prompt engineering in Social Studies.',
    author: 'Kelsey Lowe',
    yearGroup: YearGroup.IB_ALEVEL,
    subject: Subject.GENERAL,
    type: ResourceType.PROFESSIONAL_DEVELOPMENT,
    date: '2024-05-10',
    downloads: 42,
    tags: ['Pedagogy', 'AI & Tech'],
    status: ResourceStatus.APPROVED,
    files: [
      { id: 'f-pd1', name: 'AI_workshop_may.pptx', size: '5.5MB', type: 'presentation' }
    ],
    comments: []
  }
];

const INITIAL_STAFF: User[] = [
  { id: 'admin-1', name: 'Kelsey Lowe', email: 'kelsey.lowe@hk.ycef.com', role: UserRole.ADMIN, isApproved: true, subscriptions: [], notifications: [], school: 'Hong Kong', subjectsTaught: [Subject.GENERAL] },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [profileViewUser, setProfileViewUser] = useState<User | null>(null);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const handleUpload = (newResource: Resource) => {
    const resourceWithStatus = { ...newResource, status: ResourceStatus.PENDING };
    setResources(prev => [resourceWithStatus, ...prev]);
    setIsUploadOpen(false);
    alert("Resource submitted for review!");
  };

  const handleApproveResource = (resourceId: string) => {
    if (!isAdmin) return;
    setResources(prev => prev.map(res => 
      res.id === resourceId ? { ...res, status: ResourceStatus.APPROVED } : res
    ));
  };

  const handleDeleteResource = (resourceId: string) => {
    if (!isAdmin) return;
    if (window.confirm("Delete this resource?")) {
      setResources(prev => prev.filter(res => res.id !== resourceId));
      setSelectedResource(null);
    }
  };

  const handleAddComment = (resourceId: string, comment: ResourceComment) => {
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        return { ...res, comments: [comment, ...res.comments] };
      }
      return res;
    }));
  };

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  const approvedResources = resources.filter(r => r.status === ResourceStatus.APPROVED);

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 font-inter">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        currentUser={currentUser} 
        schoolLogo={schoolLogo} 
        onProfileClick={() => setProfileViewUser(currentUser)} 
      />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-y-auto">
        <Header 
          activeTab={activeTab} 
          onUploadClick={() => setIsUploadOpen(true)} 
          currentUser={currentUser} 
          onLogout={() => setCurrentUser(null)} 
          onInboxClick={() => setIsInboxOpen(true)} 
        />
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard resources={resources} posts={forumPosts} isAdmin={isAdmin} currentUser={currentUser} onResourceClick={setSelectedResource} />}
          {activeTab === 'curriculum' && <CurriculumView isAdmin={isAdmin} />}
          {activeTab === 'years-7-9' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="years" forumPosts={forumPosts} setForumPosts={setForumPosts} currentUser={currentUser} />}
          {activeTab === 'igcse' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="igcse" forumPosts={forumPosts} setForumPosts={setForumPosts} currentUser={currentUser} />}
          {activeTab === 'ib' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="ib" forumPosts={forumPosts} setForumPosts={setForumPosts} currentUser={currentUser} />}
          {activeTab === 'pd' && <PDView resources={approvedResources} onResourceClick={setSelectedResource} />}
          {activeTab === 'admin' && isAdmin && <AdminPanel resources={resources.filter(r => r.status === ResourceStatus.PENDING)} users={pendingUsers} onApproveResource={handleApproveResource} onDeleteResource={handleDeleteResource} onApproveUser={() => {}} schoolLogo={schoolLogo} onUpdateLogo={setSchoolLogo} />}
        </main>
        <AIAssistant />
      </div>
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} currentUser={currentUser} />
      {selectedResource && (
        <ResourceDetail 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
          onAddComment={handleAddComment}
          onAddFiles={() => {}}
          onApproveResource={handleApproveResource}
          onDeleteResource={handleDeleteResource}
          currentUser={currentUser}
        />
      )}
      {profileViewUser && <ProfileModal isOpen={!!profileViewUser} onClose={() => setProfileViewUser(null)} user={profileViewUser} isOwnProfile={profileViewUser.id === currentUser.id} onUpdate={setCurrentUser} />}
      <Inbox isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} user={currentUser} onMarkRead={() => {}} onClearAll={() => {}} onNavigate={() => {}} />
    </div>
  );
};

export default App;
