declare module 'react-media' {
  import { Component, ReactNode } from 'react';

  interface MediaProps {
    query: string | Record<string, any>;
    children?: (matches: boolean) => ReactNode;
    render?: (matches: boolean) => ReactNode;
    component?: any;
    targetWindow?: Window;
    defaultMatches?: boolean;
    onChange?: (matches: boolean) => void;
  }

  class Media extends Component<MediaProps> {}

  export default Media;
}