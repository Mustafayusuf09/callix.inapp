import React from 'react';

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export type ViewState = 'dashboard' | 'chat' | 'calendar' | 'analysis' | 'avatars' | 'creatives' | 'settings';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}