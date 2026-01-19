
import React, { useState, useEffect } from 'react';
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
  Notification,
  CalendarEvent
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadModal from './components/UploadModal';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';
import YearGroupView from './components/YearGroupView';
import ResourceDetail from './components/ResourceDetail';
import AdminPanel from './components/AdminPanel';
import Inbox from './components/Inbox';
import ProfileModal from './components/ProfileModal';
import PDView from './components/PDView';

const DEFAULT_USER: User = {
  id: 'staff-1',
  email: 'staff@ycyw.edu',
  name: 'Humanities Educator',
  role: UserRole.ADMIN,
  isApproved: true,
  avatar: '',
  school: 'Hong Kong Campus',
  subjectsTaught: [Subject.HISTORY, Subject.GEOGRAPHY],
  subscriptions: [],
  notifications: []
};

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
    title: 'Generative AI in the Humanities Classroom',
    description: 'Join us for a hands-on session on using AI to personalize learning. Sign up by clicking below.',
    author: 'Curriculum Office',
    yearGroup: YearGroup.IB_ALEVEL,
    subject: Subject.GENERAL,
    type: ResourceType.PROFESSIONAL_DEVELOPMENT,
    date: '2024-04-12',
    downloads: 45,
    tags: ['Pedagogy', 'AI & Tech'],
    status: ResourceStatus.APPROVED,
    files: [{ id: 'pd-f1', name: 'workshop_outline.pdf', size: '0.8MB', type: 'document' }],
    comments: []
  }
];

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'IGCSE History Paper 1 Internal Deadline', date: '2024-03-28', type: 'deadline' },
  { id: 'e2', title: 'Generative AI Workshop', date: '2024-04-12', type: 'pd', resourceId: 'pd-1' },
  { id: 'e3', title: 'Department Moderation Meeting', date: '2024-04-05', type: 'deadline' }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_USER);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSubTab, setSelectedSubTab] = useState<string | undefined>(undefined);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [calendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPresets, setUploadPresets] = useState<Partial<Resource> | null>(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [profileViewUser, setProfileViewUser] = useState<User | null>(null);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(localStorage.getItem('ycyw_school_logo'));
  const [appName, setAppName] = useState<string>(localStorage.getItem('ycyw_app_name') || 'YCYW Humanities');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    if (schoolLogo) {
      localStorage.setItem('ycyw_school_logo', schoolLogo);
    } else {
      localStorage.removeItem('ycyw_school_logo');
    }
  }, [schoolLogo]);

  useEffect(() => {
    localStorage.setItem('ycyw_app_name', appName);
    document.title = appName;
  }, [appName]);

  // Utility to create a notification for current user (Mock: in real app, this targets other users)
  const addNotification = (notif: Partial<Notification>) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'system',
      title: 'Update',
      message: '',
      authorName: 'System',
      timestamp: 'Just now',
      isRead: false,
      targetType: 'resource',
      ...notif
    };
    setCurrentUser(prev => prev ? ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }) : null);
  };

  const handleUpload = (newResource: Resource) => {
    const approvedResource = { ...newResource, status: ResourceStatus.APPROVED };
    setResources(prev => [approvedResource, ...prev]);
    setIsUploadOpen(false);
    setUploadPresets(null);

    // Mock: Notify subscribers of this context OR for PD
    const context = (newResource.yearGroup as string) === 'IGCSE' || (newResource.yearGroup as string) === 'IB / A-Level' 
      ? newResource.subject 
      : newResource.yearGroup;

    if (currentUser?.subscriptions.includes(context as string) || newResource.type === ResourceType.PROFESSIONAL_DEVELOPMENT) {
      let msg = `New resource: ${newResource.title}`;
      if (newResource.type === ResourceType.COURSEWORK || newResource.type === ResourceType.INTERNAL_ASSESSMENT) {
        msg += " - This requires moderation.";
      }
      addNotification({
        type: 'system',
        title: newResource.type === ResourceType.PROFESSIONAL_DEVELOPMENT ? `PD Hub Update` : `New Upload in ${context}`,
        message: msg,
        authorName: newResource.author,
        linkId: newResource.id,
        targetType: 'resource'
      });
    }
  };

  const handleOpenUploadWithPresets = (presets: Partial<Resource>) => {
    setUploadPresets(presets);
    setIsUploadOpen(true);
  };

  const handleCalendarEventClick = (event: CalendarEvent) => {
    if (event.type === 'pd' && event.resourceId) {
      const res = resources.find(r => r.id === event.resourceId);
      if (res) {
        setActiveTab('pd');
        setSelectedResource(res);
      }
    }
  };

  const handleToggleSubscription = (subId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const isSubbed = prev.subscriptions.includes(subId);
      const nextSubs = isSubbed 
        ? prev.subscriptions.filter(s => s !== subId) 
        : [...prev.subscriptions, subId];
      return { ...prev, subscriptions: nextSubs };
    });
  };

  const handleAddForumPost = (post: ForumPost) => {
    setForumPosts(prev => [post, ...prev]);
    const context = post.yearGroup || post.subject;
    if (context && currentUser?.subscriptions.includes(context as string)) {
      addNotification({
        type: 'comment',
        title: `New Discussion in ${context}`,
        message: `${post.author} started: ${post.title}`,
        authorName: post.author,
        linkId: post.id,
        targetType: 'post'
      });
    }
  };

  const handleAddResourceComment = (resourceId: string, comment: ResourceComment) => {
    setResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        // Notify resource author if it's not them
        if (r.author !== currentUser?.name) {
          addNotification({
            type: 'comment',
            title: `New Comment on your resource`,
            message: `${comment.author}: ${comment.content}`,
            authorName: comment.author,
            linkId: r.id,
            targetType: 'resource'
          });
        }
        return { ...r, comments: [...r.comments, comment] };
      }
      return r;
    }));
  };

  if (!currentUser) {
    setCurrentUser(DEFAULT_USER);
    return null;
  }

  const approvedResources = resources.filter(r => r.status === ResourceStatus.APPROVED);

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 font-inter">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        currentUser={currentUser} 
        schoolLogo={schoolLogo} 
        appName={appName}
        onProfileClick={() => setProfileViewUser(currentUser)} 
        onSubTabSelect={setSelectedSubTab}
        activeSubTab={selectedSubTab}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-y-auto">
        <Header 
          activeTab={activeTab} 
          onUploadClick={() => setIsUploadOpen(true)} 
          currentUser={currentUser} 
          onLogout={() => setCurrentUser(null)} 
          onInboxClick={() => setIsInboxOpen(true)} 
          searchTerm={globalSearchTerm}
          setSearchTerm={setGlobalSearchTerm}
          appName={appName}
        />
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard 
              resources={resources} 
              posts={forumPosts} 
              calendarEvents={calendarEvents}
              isAdmin={isAdmin} 
              currentUser={currentUser} 
              onResourceClick={setSelectedResource} 
              onEventClick={handleCalendarEventClick}
              globalSearchTerm={globalSearchTerm} 
            />
          )}
          {activeTab === 'primary' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="primary" forumPosts={forumPosts} setForumPosts={handleAddForumPost as any} currentUser={currentUser} globalSearchTerm={globalSearchTerm} initialSubTab={selectedSubTab} isAdmin={isAdmin} onToggleSubscription={handleToggleSubscription} />}
          {activeTab === 'years-7-9' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="years" forumPosts={forumPosts} setForumPosts={handleAddForumPost as any} currentUser={currentUser} globalSearchTerm={globalSearchTerm} initialSubTab={selectedSubTab} isAdmin={isAdmin} onToggleSubscription={handleToggleSubscription} />}
          {activeTab === 'igcse' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="igcse" forumPosts={forumPosts} setForumPosts={handleAddForumPost as any} currentUser={currentUser} onContributePreset={handleOpenUploadWithPresets} globalSearchTerm={globalSearchTerm} initialSubTab={selectedSubTab} isAdmin={isAdmin} onToggleSubscription={handleToggleSubscription} />}
          {activeTab === 'ib' && <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="ib" forumPosts={forumPosts} setForumPosts={handleAddForumPost as any} currentUser={currentUser} onContributePreset={handleOpenUploadWithPresets} globalSearchTerm={globalSearchTerm} initialSubTab={selectedSubTab} isAdmin={isAdmin} onToggleSubscription={handleToggleSubscription} />}
          {activeTab === 'pd' && <PDView resources={approvedResources} onResourceClick={setSelectedResource} globalSearchTerm={globalSearchTerm} />}
          {activeTab === 'admin' && isAdmin && (
            <AdminPanel 
              resources={[]} 
              users={pendingUsers} 
              onApproveResource={(id) => {}} 
              onDeleteResource={(id) => {}} 
              onApproveUser={() => {}} 
              schoolLogo={schoolLogo} 
              onUpdateLogo={setSchoolLogo} 
              appName={appName}
              onUpdateAppName={setAppName}
            />
          )}
        </main>
        <AIAssistant />
      </div>
      <UploadModal isOpen={isUploadOpen} onClose={() => { setIsUploadOpen(false); setUploadPresets(null); }} onUpload={handleUpload} currentUser={currentUser} presets={uploadPresets || undefined} />
      {selectedResource && (
        <ResourceDetail 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
          onAddComment={handleAddResourceComment}
          onAddFiles={(id, files) => {}}
          onApproveResource={(id) => {}}
          onDeleteResource={(id) => {
            setResources(prev => prev.filter(r => r.id !== id));
            setSelectedResource(null);
          }}
          currentUser={currentUser}
        />
      )}
      {profileViewUser && (
        <ProfileModal 
          isOpen={!!profileViewUser} 
          onClose={() => setProfileViewUser(null)} 
          user={profileViewUser} 
          isOwnProfile={profileViewUser.id === currentUser.id} 
          onUpdate={(updated) => {
            if (updated.id === currentUser.id) setCurrentUser(updated);
            setProfileViewUser(null);
          }}
        />
      )}
      <Inbox 
        isOpen={isInboxOpen} 
        onClose={() => setIsInboxOpen(false)} 
        user={currentUser} 
        onMarkRead={(id) => {
          setCurrentUser(prev => prev ? {
            ...prev,
            notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
          } : null);
        }}
        onClearAll={() => {
          setCurrentUser(prev => prev ? { ...prev, notifications: [] } : null);
        }}
        onNavigate={(notif) => {
          setIsInboxOpen(false);
          // Auto route logic could go here
        }}
      />
    </div>
  );
};

export default App;
