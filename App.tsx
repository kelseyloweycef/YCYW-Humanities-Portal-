
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
import Forum from './components/Forum';
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
    comments: [
      { id: 'c1', author: 'Mr. Davies', content: 'The map activity in the starter is fantastic! Do you have a higher res version?', date: '2 days ago', isQuestion: true }
    ]
  },
  {
    id: '2',
    title: 'Globalization: Trade Flows',
    description: 'Comprehensive test with multiple-choice and short answer sections on global trade.',
    author: 'Mr. Davies',
    yearGroup: YearGroup.YEAR_11,
    subject: Subject.GEOGRAPHY,
    type: ResourceType.ASSESSMENT,
    date: '2024-03-20',
    downloads: 85,
    tags: ['Geography', 'Sociology'],
    status: ResourceStatus.APPROVED,
    files: [
      { id: 'f3', name: 'globalization_midterm_A.pdf', size: '0.8MB', type: 'document' }
    ],
    comments: []
  },
  {
    id: 'ib-hist-1',
    title: 'IB History: Cold War Origins',
    description: 'Detailed analysis of post-WWII tensions for IB Paper 2.',
    author: 'Mr. Thompson',
    yearGroup: YearGroup.YEAR_12,
    subject: Subject.HISTORY,
    type: ResourceType.PRESENTATION,
    curriculum: 'IB',
    date: '2024-04-01',
    downloads: 56,
    tags: ['IB', 'Cold War', 'Paper 2'],
    status: ResourceStatus.APPROVED,
    files: [
      { id: 'f-ib1', name: 'cold_war_origins_notes.pdf', size: '2.1MB', type: 'document' }
    ],
    comments: []
  },
  {
    id: 'pd-1',
    title: 'AI in the Humanities Classroom',
    description: 'Workshop slides on using generative AI for prompt engineering in Social Studies.',
    author: 'Kelsey Lowe',
    yearGroup: YearGroup.YEAR_13,
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
  { id: 'u1', name: 'Ms. Thompson', email: 'athompson@hk.ycef.com', role: UserRole.STAFF, isApproved: true, subscriptions: [], notifications: [], school: 'Hong Kong', subjectsTaught: [Subject.HISTORY] },
  { id: 'u2', name: 'Mr. Davies', email: 'rdavies@hk.ycef.com', role: UserRole.STAFF, isApproved: true, subscriptions: [], notifications: [], school: 'Puxi', subjectsTaught: [Subject.GEOGRAPHY] },
  { id: 'u3', name: 'Mr. Thompson', email: 'mthompson@hk.ycef.com', role: UserRole.STAFF, isApproved: true, subscriptions: [], notifications: [], school: 'Hong Kong', subjectsTaught: [Subject.HISTORY] },
  { id: 'admin-1', name: 'Kelsey Lowe', email: 'kelsey.lowe@hk.ycef.com', role: UserRole.ADMIN, isApproved: true, subscriptions: [], notifications: [], school: 'Hong Kong', subjectsTaught: [Subject.GENERAL] },
];

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'p1',
    title: 'How are you teaching the local elections?',
    content: 'I am looking for some interactive ways to explain the local voting system to Year 7s. Any successful activities?',
    author: 'Mr. Davies',
    date: '2024-04-12',
    yearGroup: YearGroup.YEAR_7,
    replies: [
      { id: 'r1', author: 'Ms. Thompson', content: 'We did a mock election in our assembly hall, worked great!', date: '2024-04-13' }
    ]
  }
];

const INITIAL_PENDING_USERS: User[] = [
  { id: 'u4', name: 'Sarah Wilson', email: 'swilson@hk.ycef.com', role: UserRole.STAFF, isApproved: false, subscriptions: [], notifications: [], school: 'Hong Kong', subjectsTaught: [Subject.HISTORY] },
  { id: 'u5', name: 'James Black', email: 'jblack@hk.ycef.com', role: UserRole.STAFF, isApproved: false, subscriptions: [], notifications: [], school: 'Beijing', subjectsTaught: [Subject.BUSINESS] },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allStaff, setAllStaff] = useState<User[]>(INITIAL_STAFF);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [pendingUsers, setPendingUsers] = useState<User[]>(INITIAL_PENDING_USERS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [profileViewUser, setProfileViewUser] = useState<User | null>(null);
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const createNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    if (!currentUser) return;
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: 'Just now',
      isRead: false
    };
    setCurrentUser(prev => prev ? ({ ...prev, notifications: [newNotif, ...prev.notifications] }) : null);
  };

  const handleToggleSubscription = (subject: string) => {
    if (!currentUser) return;
    const isSubscribed = currentUser.subscriptions.includes(subject);
    const updatedSubscriptions = isSubscribed
      ? currentUser.subscriptions.filter(s => s !== subject)
      : [...currentUser.subscriptions, subject];
    setCurrentUser({ ...currentUser, subscriptions: updatedSubscriptions });
    alert(isSubscribed ? `Unsubscribed from ${subject} notifications.` : `You will now receive notifications for ${subject}!`);
  };

  const handleUpload = (newResource: Resource) => {
    // All uploads start as Pending
    const resourceWithStatus = { ...newResource, status: ResourceStatus.PENDING };
    setResources(prev => [resourceWithStatus, ...prev]);
    setIsUploadOpen(false);
    alert("Resource submitted! It will be shared with the team once a Curriculum Officer (Admin) approves it.");
  };

  const handleApproveResource = (resourceId: string) => {
    if (!isAdmin) return;
    setResources(prev => prev.map(res => 
      res.id === resourceId ? { ...res, status: ResourceStatus.APPROVED } : res
    ));
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      alert(`Resource "${resource.title}" has been approved and is now live.`);
    }
  };

  const handleDeleteResource = (resourceId: string) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to permanently delete this resource? This action cannot be undone.")) {
      setResources(prev => prev.filter(res => res.id !== resourceId));
      setSelectedResource(null);
    }
  };

  const handleApproveUser = (userId: string, role: UserRole) => {
    if (!isAdmin) return;
    const userToApprove = pendingUsers.find(u => u.id === userId);
    if (userToApprove) {
      setAllStaff(prev => [...prev, { ...userToApprove, isApproved: true, role }]);
    }
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    alert(`User approved with ${role} access.`);
  };

  const handleAddComment = (resourceId: string, comment: ResourceComment) => {
    const resource = resources.find(r => r.id === resourceId);
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        const updated = { ...res, comments: [comment, ...res.comments] };
        if (selectedResource?.id === resourceId) setSelectedResource(updated);
        return updated;
      }
      return res;
    }));
    if (resource && currentUser && comment.author !== currentUser.name) {
      createNotification({
        type: 'comment',
        title: `New comment on ${resource.title}`,
        message: comment.content,
        authorName: comment.author,
        targetType: 'resource',
        linkId: resourceId
      });
    }
  };

  const handleAddFilesToResource = (resourceId: string, newFiles: ResourceFile[]) => {
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        const updated = { ...res, files: [...res.files, ...newFiles] };
        if (selectedResource?.id === resourceId) setSelectedResource(updated);
        return updated;
      }
      return res;
    }));
  };

  const handleReplyToPost = (postId: string, content: string) => {
    const post = forumPosts.find(p => p.id === postId);
    if (!content.trim() || !currentUser) return;
    const reply = { id: Math.random().toString(36).substr(2, 9), author: currentUser.name, content, date: 'Just now' };
    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, replies: [...p.replies, reply] };
      return p;
    }));
    if (post && post.author !== currentUser.name) {
      createNotification({
        type: 'reply',
        title: `New reply to: ${post.title}`,
        message: content,
        authorName: currentUser.name,
        targetType: 'post',
        linkId: postId
      });
    }
  };

  const handleUpdateProfile = (updated: User) => {
    setCurrentUser(updated);
    setAllStaff(prev => prev.map(u => u.id === updated.id ? updated : u));
    alert("Profile updated successfully!");
  };

  const findUserAndShowProfile = (name: string) => {
    const staff = allStaff.find(s => s.name === name);
    if (staff) setProfileViewUser(staff);
  };

  const handleMarkNotifRead = (id: string) => {
    setCurrentUser(prev => prev ? ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) }) : null);
  };

  const handleClearNotifs = () => {
    setCurrentUser(prev => prev ? ({ ...prev, notifications: [] }) : null);
  };

  const handleNavigateFromNotif = (notif: Notification) => {
    handleMarkNotifRead(notif.id);
    setIsInboxOpen(false);
    if (notif.targetType === 'resource' && notif.linkId) {
      const res = resources.find(r => r.id === notif.linkId);
      if (res) setSelectedResource(res);
    } else if (notif.targetType === 'post') {
      setActiveTab('years-7-9');
    }
  };

  if (!currentUser) return <Login onLogin={(u) => { setCurrentUser(u); setAllStaff(prev => prev.some(s => s.id === u.id) ? prev : [...prev, u]); }} />;

  const renderContent = () => {
    // Crucial: Only approved resources are shown in curriculum sections
    const approvedResources = resources.filter(r => r.status === ResourceStatus.APPROVED);
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard resources={resources} posts={forumPosts} isAdmin={isAdmin} currentUser={currentUser} onUserClick={findUserAndShowProfile} onResourceClick={setSelectedResource} />;
      case 'curriculum': return <CurriculumView isAdmin={isAdmin} />;
      case 'years-7-9': return <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="years" forumPosts={forumPosts} setForumPosts={setForumPosts} onReplyToPost={handleReplyToPost} currentUser={currentUser} onToggleSubscription={handleToggleSubscription} onUserClick={findUserAndShowProfile} />;
      case 'igcse': return <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="igcse" forumPosts={forumPosts} setForumPosts={setForumPosts} onReplyToPost={handleReplyToPost} currentUser={currentUser} onToggleSubscription={handleToggleSubscription} onUserClick={findUserAndShowProfile} />;
      case 'ib': return <YearGroupView resources={approvedResources} onResourceClick={setSelectedResource} mode="ib" forumPosts={forumPosts} setForumPosts={setForumPosts} onReplyToPost={handleReplyToPost} currentUser={currentUser} onToggleSubscription={handleToggleSubscription} onUserClick={findUserAndShowProfile} />;
      case 'pd': return <PDView resources={approvedResources} onResourceClick={setSelectedResource} />;
      case 'admin': return isAdmin ? <AdminPanel resources={resources.filter(r => r.status === ResourceStatus.PENDING)} users={pendingUsers} onApproveResource={handleApproveResource} onDeleteResource={handleDeleteResource} onApproveUser={handleApproveUser} schoolLogo={schoolLogo} onUpdateLogo={setSchoolLogo} onUserClick={findUserAndShowProfile} /> : null;
      default: return <Dashboard resources={resources} posts={forumPosts} isAdmin={isAdmin} currentUser={currentUser} onUserClick={findUserAndShowProfile} onResourceClick={setSelectedResource} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 font-inter">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} currentUser={currentUser} schoolLogo={schoolLogo} onProfileClick={() => setProfileViewUser(currentUser)} />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-y-auto overflow-x-hidden">
        <Header activeTab={activeTab} onUploadClick={() => setIsUploadOpen(true)} currentUser={currentUser} onLogout={() => setCurrentUser(null)} onInboxClick={() => setIsInboxOpen(true)} />
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">{renderContent()}</main>
        <AIAssistant />
      </div>
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} currentUser={currentUser} />
      <Inbox isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} user={currentUser} onMarkRead={handleMarkNotifRead} onClearAll={handleClearNotifs} onNavigate={handleNavigateFromNotif} />
      {selectedResource && (
        <ResourceDetail 
          resource={selectedResource} 
          onClose={() => setSelectedResource(null)} 
          onAddComment={handleAddComment} 
          onAddFiles={handleAddFilesToResource} 
          onApproveResource={handleApproveResource}
          onDeleteResource={handleDeleteResource}
          currentUser={currentUser} 
          onUserClick={findUserAndShowProfile} 
        />
      )}
      {/* Fix: Changed onAddUpdate to onUpdate to match ProfileModalProps. */}
      {profileViewUser && <ProfileModal isOpen={!!profileViewUser} onClose={() => setProfileViewUser(null)} user={profileViewUser} isOwnProfile={profileViewUser.id === currentUser.id} onUpdate={handleUpdateProfile} />}
    </div>
  );
};

export default App;
