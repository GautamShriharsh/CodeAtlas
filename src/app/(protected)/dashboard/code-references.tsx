'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { shadesOfPurple  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FileReference = {
  fileName: string
  sourceCode: string
  summary?: string
}

type Props = {
  fileReferences: FileReference[]
}

const languageFromFileName = (fileName: string) => {
  if (fileName.endsWith('.ts')) return 'typescript'
  if (fileName.endsWith('.tsx')) return 'tsx'
  if (fileName.endsWith('.js')) return 'javascript'
  if (fileName.endsWith('.jsx')) return 'jsx'
  if (fileName.endsWith('.css')) return 'css'
  if (fileName.endsWith('.json')) return 'json'
  if (fileName.endsWith('.md')) return 'markdown'
  if (fileName.endsWith('.html')) return 'html'
  if (fileName.endsWith('.sh')) return 'bash'
  return 'text'
}

// Shorten long paths: keep only the last 2 segments
// "src/app/(protected)/dashboard/page.tsx" → "dashboard/page.tsx"
const shortName = (fileName: string) => {
  const parts = fileName.split('/')
  return parts.length > 2 ? `…/${parts.slice(-2).join('/')}` : fileName
}

const CodeReferences = ({ fileReferences }: Props) => {
  if (fileReferences.length === 0) return null

  const [activeTab, setActiveTab] = useState(fileReferences[0]?.fileName)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-3">
      {/* Scrollable tab bar — no wrapping, horizontal scroll on overflow */}
      <div className="overflow-x-auto pb-1">
        <TabsList className="inline-flex h-auto w-max gap-1 bg-muted/80 p-1">
          {fileReferences.map((file) => (
            <TabsTrigger
              key={file.fileName}
              value={file.fileName}
              title={file.fileName}        /* full path on hover */
              className="whitespace-nowrap px-3 py-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm hover:cursor-pointer"
            >
              {shortName(file.fileName)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {fileReferences.map((file) => (
        <TabsContent
          key={file.fileName}
          value={file.fileName}
          className="mt-0 rounded-xl border border-border  p-4"
        >
          {file.summary && (
            <p className="mb-3 text-sm text-muted-foreground">{file.summary}</p>
          )}
          <div className="overflow-y-auto rounded-lg border border-slate-800">
            <SyntaxHighlighter
              language={languageFromFileName(file.fileName)}
              style={shadesOfPurple}
              showLineNumbers
              customStyle={{
                background: 'transparent',
                margin: 0,
                padding: '1rem',
                fontSize: '0.8rem',
              }}
            >
              {file.sourceCode.trim() || '// No source code available'}
            </SyntaxHighlighter>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default CodeReferences