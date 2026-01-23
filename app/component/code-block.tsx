'use client';

import { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

const resolveLanguage = (language: string) => {
  if (language in Prism.languages) {
    return Prism.languages[language];
  }
  return Prism.languages.tsx;
};

export default function CodeBlock({
  code,
  language = 'tsx',
  className = '',
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const highlighted = useMemo(() => {
    const grammar = resolveLanguage(language);
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  return (
    <pre className={className}>
      <code
        className={`language-${language}`}
        // Prism highlights via HTML spans.
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}
