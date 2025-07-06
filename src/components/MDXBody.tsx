import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { MDXBodyProps } from '../types';
import MDXContext from './MDXContext';
import Heading from './Heading';
import Table from './Table';
import TableHeader from './TableHeader';
import TableData from './TableData';
import Image from './Image';
import Picture from './Picture';
import Paragraph from './Paragraph';
import List from './List';
import Blockquote from './Blockquote';
import SegmentSeparator from './SegmentSeparator';
import Checkbox from './Checkbox';
import Strong from './Strong';
import Footnotes from './Footnotes';
import Superscript from './Superscript';
import CodeBlock from './CodeBlock';
import InlineCode from './InlineCode';
import MathBlock from './MathBlock';
import InlineMath from './InlineMath';
import Anchor from './Anchor';
import Span from './Span';
import Figure from './Figure';
import FigureCaption from './FigureCaption';
import PreFormattedBlock from './PreFormattedBlock';
import Geometry from './Geometry';

import {
  pToImage,
  pToPicture,
  preToMathBlock,
  preToCodeBlock,
  pToFigure,
} from '../utils';

interface HeadingProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface ParagraphProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface PreProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface ListProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface InputProps {
  type?: string;
  [key: string]: any;
}

interface DivProps {
  className?: string;
  [key: string]: any;
}

// Component mappings for MDX
const h1: React.FC<HeadingProps> = (props) => <Heading level={1} {...props} />;
const h2: React.FC<HeadingProps> = (props) => <Heading level={2} {...props} />;
const h3: React.FC<HeadingProps> = (props) => <Heading level={3} {...props} />;
const h4: React.FC<HeadingProps> = (props) => <Heading level={4} {...props} />;
const h5: React.FC<HeadingProps> = (props) => <Heading level={5} {...props} />;
const h6: React.FC<HeadingProps> = (props) => <Heading level={6} {...props} />;

const p: React.FC<ParagraphProps> = (props) => {
  const image = pToImage(props);
  if (image) {
    return <Geometry {...props} />;
  }
  const picture = pToPicture(props);
  if (picture) {
    return <Geometry {...props} />;
  }
  const figure = pToFigure(props);
  if (figure) {
    return <Geometry {...props} />;
  }
  return <Paragraph {...props} />;
};

const pre: React.FC<PreProps> = (props) => {
  const codeBlock = preToCodeBlock(props);
  const mathBlock = preToMathBlock(props);
  
  if (codeBlock) {
    return <CodeBlock {...codeBlock} />;
  } else if (mathBlock) {
    return <MathBlock {...mathBlock} />;
  } else {
    return <PreFormattedBlock {...props} />;
  }
};

const ol: React.FC<ListProps> = (props) => <List type="orderedList" {...props} />;
const ul: React.FC<ListProps> = (props) => <List type="unorderedList" {...props} />;

const input: React.FC<InputProps> = (props) => {
  if (props.type === 'checkbox') {
    return <Checkbox {...props} />;
  }
  return <input {...props} />;
};

const div: React.FC<DivProps> = (props) => {
  if (props.className === 'footnotes') {
    return <Footnotes {...props} />;
  }
  return <div {...props} />;
};

const components = {
  wrapper: React.Fragment,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  inlineCode: InlineCode,
  pre,
  strong: Strong,
  hr: SegmentSeparator,
  ol,
  ul,
  table: Table,
  th: TableHeader,
  td: TableData,
  blockquote: Blockquote,
  input,
  div,
  sup: Superscript,
  a: Anchor,
  span: Span,
  picture: Picture,
  img: Image,
  figure: Figure,
  figcaption: FigureCaption,
  mathblock: MathBlock,
  inlinemath: InlineMath,
};

const MDXBody: React.FC<MDXBodyProps> = ({ textStyle, code }) => {
  // In Gatsby v5, we need to use the MDX component directly
  const MDXContent = React.useMemo(() => {
    // eslint-disable-next-line no-new-func
    const func = new Function(code.body);
    return func.call({ ...code.scope });
  }, [code.body, code.scope]);

  return (
    <MDXContext.Provider value={textStyle}>
      <MDXProvider components={components}>
        <MDXContent />
      </MDXProvider>
    </MDXContext.Provider>
  );
};

export default MDXBody;