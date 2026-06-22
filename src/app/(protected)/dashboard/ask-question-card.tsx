"use client";

import useProject from '@/hooks/use-projects';
import { api } from '@/trpc/react';
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const PLACEHOLDER_QUESTIONS = [
  "How does the authentication session propagate to the client layers?",
  "Where is the database schema defined, and how do I add a new model?",
  "What is the token rate limit security wrapper setup for our AI routes?",
  "Explain the file routing structure inside the (protected) group.",
  "How are the tRPC mutations wired up to handle PostgreSQL transactions?"
];

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState('');

  const [randomPlaceholder, setRandomPlaceholder] = useState("Ask a question about this repository...");

  // 2. Safely swap to a random question ONLY after mounting on the client side
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length);
    setRandomPlaceholder(PLACEHOLDER_QUESTIONS[randomIndex] || "");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Temporary alert action before wiring up the tRPC RAG mutation
    alert(`Submitting Question for ${project?.name || 'Project'}:\n\n"${question}"`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ask CodeAtlas</CardTitle>
        <CardDescription>
          Query your indexed files, schemas, and architecture patterns inside <span>{project?.name || "this repository"}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={randomPlaceholder}
            className="min-h-[100px] resize-none items-start alignment-top"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!question.trim()}
              className="px-6"
            >
              Ask Question
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AskQuestionCard;