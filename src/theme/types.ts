import { MD3Theme } from 'react-native-paper';

export type AppTheme = MD3Theme & {
  custom: {
    metrics: {
      radius: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        pill: number;
      };
      spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        xxxl: number;
      };
      icon: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      elevation: {
        card: number;
        modal: number;
        floating: number;
      };
    };
    semantic: {
      text: {
        primary: string;
        secondary: string;
        muted: string;
        danger: string;
        inverse: string;
      };
      action: {
        primaryBg: string;
        primaryText: string;
        dangerBg: string;
        dangerText: string;
        dangerTonalBg: string;
        dangerTonalText: string;
        ghostText: string;
      };
      border: {
        subtle: string;
        strong: string;
        accent: string;
      };
      feedback: {
        errorBg: string;
        errorText: string;
        infoBg: string;
        infoText: string;
      };
      alpha: {
        overlay: string;
        glass: string;
        glassBorder: string;
      };
      divider: string;
    };
  };
};
