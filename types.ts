
export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Staff'
}

export enum ResourceStatus {
  PENDING = 'Pending Approval',
  APPROVED = 'Approved'
}

export interface Notification {
  id: string;
  type: 'comment' | 'reply' | 'system';
  title: string;
  message: string;
  authorName: string;
  timestamp: string;
  isRead: boolean;
  linkId?: string;
  targetType: 'resource' | 'post';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  avatar?: string;
  school?: string;
  subjectsTaught?: Subject[];
  subscriptions: string[];
  notifications: Notification[];
}

export enum YearGroup {
  YEAR_1 = 'Year 1',
  YEAR_2 = 'Year 2',
  YEAR_3 = 'Year 3',
  YEAR_4 = 'Year 4',
  YEAR_5 = 'Year 5',
  YEAR_6 = 'Year 6',
  YEAR_7 = 'Year 7',
  YEAR_8 = 'Year 8',
  YEAR_9 = 'Year 9',
  YEAR_10 = 'Year 10',
  YEAR_11 = 'Year 11',
  YEAR_12 = 'Year 12',
  YEAR_13 = 'Year 13',
  IGCSE = 'IGCSE',
  IB_ALEVEL = 'IB / A-Level'
}

export enum Subject {
  YEAR_1_6 = 'Primary Humanities',
  YEAR_7_9 = 'Year 7-9',
  HISTORY = 'History',
  GEOGRAPHY = 'Geography',
  PSYCHOLOGY = 'Psychology',
  SOCIOLOGY = 'SOCIOLOGY',
  ECONOMICS = 'Economics',
  BUSINESS = 'Business',
  ENTERPRISE = 'Enterprise',
  PHILOSOPHY = 'Philosophy',
  GENERAL = 'General'
}

export enum ResourceType {
  SCHEME_OF_WORK = 'Scheme of Work',
  LESSON_PLAN = 'Lesson Plan',
  ASSESSMENT = 'Assessment',
  MARK_SCHEME = 'Mark Scheme',
  EXAM_PACKAGE = 'Exam & Mark Scheme',
  PRESENTATION = 'Presentation',
  WORKSHEET = 'Worksheet',
  EXAMPLE_WORK = 'Example Assessment',
  COURSEWORK = 'Coursework',
  INTERNAL_ASSESSMENT = 'Internal Assessment (IA)',
  PROFESSIONAL_DEVELOPMENT = 'Professional Development'
}

export interface ResourceFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface ResourceComment {
  id: string;
  author: string;
  content: string;
  date: string;
  isQuestion?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  author: string;
  yearGroup: YearGroup;
  subject: Subject;
  type: ResourceType;
  curriculum?: string;
  date: string;
  downloads: number;
  tags: string[];
  comments: ResourceComment[];
  status: ResourceStatus;
  files: ResourceFile[];
  examPaper?: string; // simplified identifier e.g., "Paper 1"
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  type: 'pd' | 'deadline';
  resourceId?: string; // Links to a PD resource
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  replies: ForumReply[];
  date: string;
  yearGroup?: YearGroup;
  subject?: Subject;
}

export interface ForumReply {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}
