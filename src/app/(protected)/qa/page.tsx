"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/trpc/react";
import { useState } from "react";
import AskQuestionCard from "../dashboard/ask-question-card";
import useProject from "@/hooks/use-projects";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { QuestionsSkeleton } from "@/components/skeleton";
import EmptyState from "../dashboard/empty-state";

// 1. Define the explicit shape of your JSON object
type FileReference = {
  fileName: string;
  sourceCode: string;
  summary: string;
};

const QAPage = () => {
  const { project, projects, isLoading: projectLoading } = useProject();
  const { data: questionAnswers, isLoading: qaLoading } = api.project.getQuestions.useQuery({
    projectId: project?.id ?? "",
  });
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const questionAnswer =
    questionIndex !== null ? questionAnswers?.[questionIndex] : null;

  const selectedFileReferences = questionAnswer?.fileReferences as
    | FileReference[]
    | null;
  
  if (projectLoading) {
      return (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400/20" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading workspace data...
          </p>
        </div>
      );
    }
  
  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState /> 
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">Please select a project from the sidebar to view insights.</p>
      </div>
    );
  }
    

  return (
    <div className="space-y-6">
      {/* Ask Question Card at top */}
      <AskQuestionCard />

      {/* Saved Questions */}
      <div className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Saved Answers
          {questionAnswers && questionAnswers.length > 0 && (
            <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
              {questionAnswers.length}
            </span>
          )}
        </h2>
         
        {qaLoading ? (
          <QuestionsSkeleton/>
        ):
        (!questionAnswers || questionAnswers.length === 0) ? (
          <p className="text-muted-foreground text-sm">
            No saved answers yet. Ask a question above and save the answer.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {questionAnswers.map((qa, index) => {
            
              return (
                <div
                  key={qa.id}
                  onClick={() => {
                    setQuestionIndex(index);
                    setOpen(true);
                  }}
                  className="group border-border bg-card relative cursor-pointer rounded-xl border px-5 py-4 transition-colors hover:border-gray-500/40"
                >
                  {/* Delete button — visible on hover */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // deleteQuestion.mutate({ id: qa.id })
                    }}
                    className="hover:bg-destructive/10 hover:text-destructive hover:cursor-pointer absolute top-3 right-3 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>

                  {/* User info + timestamp */}
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={qa.user.imageUrl ?? ""}
                      alt={qa.user.firstName ?? "User"}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(qa.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-foreground mb-1.5 line-clamp-2 leading-snug font-medium">
                    {qa.question}
                  </p>

                  {/* Answer preview */}
                  <p className="text-muted-foreground mb-3 line-clamp-1 text-sm">
                    {qa.answer.slice(0, 180)}
                    {qa.answer.length > 180 ? "..." : ""}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sheet — slides in on card click */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          style={{ width: "79vw", maxWidth: "79vw" }}
          className="flex flex-col gap-0 overflow-hidden p-0"
        >
          <SheetHeader className="shrink-0 border-b px-6 py-4">
            <SheetTitle className="line-clamp-2 text-base leading-snug font-medium">
              {questionAnswer?.question}
            </SheetTitle>
          </SheetHeader>

          {/* Split layout inside sheet */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left — Answer */}
            <div className="flex w-1/2 flex-col border-r">
              <div className="shrink-0 border-b px-4 py-2">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Answer
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div data-color-mode="dark">
                  <MDEditor.Markdown
                    source={questionAnswer?.answer ?? ""}
                    style={{ background: "transparent" }}
                    className="prose prose-invert max-w-none !bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right — Code References */}
            <div className="flex w-1/2 flex-col">
              <div className="shrink-0 border-b px-4 py-2">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Sources
                  {selectedFileReferences &&
                    selectedFileReferences.length > 0 && (
                      <span className="bg-muted ml-2 rounded-full px-1.5 py-0.5 text-xs">
                        {selectedFileReferences.length}
                      </span>
                    )}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {selectedFileReferences && selectedFileReferences.length > 0 ? (
                  <CodeReferences fileReferences={selectedFileReferences} />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No references saved.
                  </p>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default QAPage;
