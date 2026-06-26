"use client";

import useProject from "@/hooks/use-projects";
import { api } from "@/trpc/react";
import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { askQuestion, type AskQuestionResult } from "./actions";
import { readStreamableValue } from "@ai-sdk/rsc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-Refetch";

const PLACEHOLDER_QUESTIONS = [
  "How does the authentication session propagate to the client layers?",
  "Where is the database schema defined, and how do I add a new model?",
  "What is the token rate limit security wrapper setup for our AI routes?",
  "Explain the file routing structure inside the (protected) group.",
  "How are the tRPC mutations wired up to handle PostgreSQL transactions?",
];

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileReferences, setFileReferences] = useState<
    AskQuestionResult["fileReferences"]
  >([]);
  const [answer, setAnswer] = useState("");

  const [randomPlaceholder, setRandomPlaceholder] = useState(
    "Ask a question about this repository...",
  );

  const refetch = useRefetch();

  const saveAnswer = api.project.saveAnswer.useMutation({
    onSuccess: () => {
      toast.success("Answer saved");
      refetch();
    },
    onError: () => {
      toast.error("Failed to save answer");
    },
  });

  useEffect(() => {
    const randomIndex = Math.floor(
      Math.random() * PLACEHOLDER_QUESTIONS.length,
    );
    setRandomPlaceholder(PLACEHOLDER_QUESTIONS[randomIndex] || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project?.id) return;
    if (!question.trim()) return;

    setAnswer("");
    setFileReferences([]);
    setLoading(true);
    setOpen(true);

    const { output, fileReferences } = await askQuestion(question, project.id);
    setFileReferences(fileReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* ↓ wider dialog, flex-col so children stack, fixed height with internal scroll */}
        <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col gap-0 overflow-hidden sm:max-w-[1400px]">
          <DialogHeader className="shrink-0 border-b px-6 py-3">
            <DialogTitle className="text-sm font-semibold">
              {question || "Answer"}
            </DialogTitle>
          </DialogHeader>

          {/* Main split layout */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left — Answer */}
            <div className="flex w-1/2 flex-col border-r">
              <div className="shrink-0 border-b px-4 py-2">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Answer
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {loading && !answer ? (
                  <div className="text-muted-foreground flex items-center gap-2 pt-1 text-sm">
                    <span>Analyzing codebase</span>
                    <span className="flex gap-1">
                      <span className="animate-bounce [animation-delay:0ms]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:150ms]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:300ms]">
                        .
                      </span>
                    </span>
                  </div>
                ) : (
                  <div data-color-mode="dark">
                    <MDEditor.Markdown
                      source={answer}
                      style={{ background: "transparent" }}
                      className="prose prose-invert max-w-none !bg-transparent"
                    />
                  </div>
                )}
              </div>
              {/* Left panel footer — Save action lives here */}
              <div className="flex shrink-0 items-center justify-between border-t px-4 pt-2 py-0">
                <span className="text-muted-foreground text-xs">
                  {loading ? "Generating..." : answer ? "Answer complete" : ""}
                </span>
                <Button
                  disabled={saveAnswer.isPending || loading || !answer}
                  className="hover:cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    saveAnswer.mutate({
                      answer,
                      projectId: project!.id,
                      question,
                      fileReferences,
                    })
                  }
                >
                  {saveAnswer.isPending ? "Saving..." : "Save Answer"}
                </Button>
              </div>
            </div>

            {/* Right — Code References */}
            <div className="flex w-1/2 flex-col">
              <div className="shrink-0 border-b px-4 py-2">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Sources
                  {fileReferences.length > 0 && (
                    <span className="bg-muted text-muted-foreground ml-2 rounded-full px-1.5 py-0.5 text-xs">
                      {fileReferences.length}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {fileReferences.length > 0 ? (
                  <CodeReferences fileReferences={fileReferences} />
                ) : loading ? (
                  <div className="space-y-3 p-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-28 rounded-md" />
                      <Skeleton className="h-7 w-24 rounded-md" />
                      <Skeleton className="h-7 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No references found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ask CodeAtlas</CardTitle>
          <CardDescription>
            Query your indexed files, schemas, and architecture patterns inside{" "}
            <span>{project?.name || "this repository"}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={randomPlaceholder}
              className="alignment-top min-h-[100px] resize-none items-start"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!question.trim() || loading}
                className="px-6 hover:cursor-pointer"
              >
                Ask Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
