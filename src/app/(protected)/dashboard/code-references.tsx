'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FileReference = {
  fileName: string
  sourceCode: string
  summary?: string
}

type Props = {
  fileReferences: FileReference[]
}

const languageMap: Record<string, string> = {
  // JavaScript / TypeScript
  js: 'javascript',
  jsx: 'jsx',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',

  // Python
  py: 'python',

  // Java / JVM
  java: 'java',
  kt: 'kotlin',
  kts: 'kotlin',
  scala: 'scala',
  groovy: 'groovy',

  // C / C++
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cxx: 'cpp',
  cc: 'cpp',
  hpp: 'cpp',
  hh: 'cpp',
  hxx: 'cpp',

  // C#
  cs: 'csharp',

  // Go / Rust
  go: 'go',
  rs: 'rust',

  // Apple
  swift: 'swift',
  m: 'objectivec',
  mm: 'objectivec',

  // Web
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'scss',
  less: 'less',

  // Data
  json: 'json',
  jsonc: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  xml: 'xml',
  csv: 'csv',

  // Shell
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  fish: 'bash',

  // Databases
  sql: 'sql',

  // Scripting
  php: 'php',
  rb: 'ruby',
  pl: 'perl',
  lua: 'lua',
  r: 'r',

  // Functional
  ex: 'elixir',
  exs: 'elixir',
  erl: 'erlang',
  fs: 'fsharp',
  fsx: 'fsharp',
  clj: 'clojure',

  // Mobile
  dart: 'dart',

  // DevOps
  dockerfile: 'docker',
  tf: 'hcl',

  // Markup
  md: 'markdown',
  mdx: 'mdx',
  rst: 'markdown',

  // GraphQL
  gql: 'graphql',
  graphql: 'graphql',

  // Misc
  ini: 'ini',
  conf: 'ini',
  txt: 'text',
  log: 'text',
}


const languageFromFileName = (fileName: string) => {
  const name = fileName.toLowerCase()

  if (name.includes('dockerfile')) return 'docker'

  const ext = name.split('.').pop() ?? ''

  return languageMap[ext] ?? 'text'
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
      <div className="overflow-x-auto pb-1">
        <TabsList className="inline-flex h-auto w-max gap-1 bg-muted/80 p-1">
          {fileReferences.map((file) => (
            <TabsTrigger
              key={file.fileName}
              value={file.fileName}
              title={file.fileName}       
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
              style={a11yDark}
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