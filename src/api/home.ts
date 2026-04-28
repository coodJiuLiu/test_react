import request from '@/utils/request';

export interface OverviewMetric {
  title: string;
  value: number;
  suffix?: string;
  precision?: number;
  trend?: 'up' | 'neutral';
}

export interface AnnouncementItem {
  id: string;
  content: string;
}

export interface HomeOverview {
  welcomeTitle: string;
  welcomeDescription: string;
  metrics: OverviewMetric[];
  announcements: AnnouncementItem[];
}

export interface HomeOverviewResult {
  code: number;
  message: string;
  data: HomeOverview;
}

export function getHomeOverview() {
  return request.get<HomeOverviewResult, HomeOverviewResult>('/home/overview');
}
