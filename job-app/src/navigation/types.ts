import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Jobs: { regionId?: string } | undefined;
  Applications: undefined;
  Learning: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  JobDetails: { jobId: string };
  ResumeAnalyzer: undefined;
  Ats: undefined;
};
