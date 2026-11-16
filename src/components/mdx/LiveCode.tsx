import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

interface LiveCodeProps {
  code: string;
}

export default function LiveCode({ code }: LiveCodeProps) {
  return (
    <div className="live-code-block">
      <LiveProvider code={code}>
        <div className="live-code-editor">
          <LiveEditor />
        </div>
        <div className="live-code-preview">
          <LiveError />
          <LivePreview />
        </div>
      </LiveProvider>
    </div>
  );
}
