import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

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
  ConnectPlatforms: undefined;
  UploadCv: { jobId?: string } | undefined;
};
