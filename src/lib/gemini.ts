import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
});

export const summariseCommit = async (diff: string) => {
    
    const prompt = `
                    You are an expert software engineer reviewing a git diff.

                    Your task is to write a concise summary of the changes introduced by the commit.

                    Reminders about the git diff format:
                    - For every file, there are metadata lines indicating which files were modified.
                    - A line starting with '+' was added.
                    - A line starting with '-' was removed.
                    - Lines starting with neither are context lines and not part of the change itself.

                    Guidelines:
                    - Produce a short list of a MAXIMUM of 2 to 3 bullet points.
                    - Focus on what changed and why it matters.
                    - Prioritize behavior changes, new features, bug fixes, and architectural changes.
                    - Group related file changes into a single bullet point whenever possible.
                    - Include affected file names in square brackets when there are one or two clearly relevant files.
                    - If more than two files are involved in a change, omit file names for readability.
                    - Ignore email headers, subject lines, and timestamps at the top of the diff file.
                    - Ignore formatting-only changes and lockfile noise (package-lock.json, yarn.lock, etc.).
                    - Prefer describing outcomes over code mechanics.
                    - Keep each bullet concise (ideally under 25 words).
                    - Output ONLY the bullet list. No intro text, no headings, no explanations.

                    Example summaries:
                    * Raised the amount of returned recordings from '10' to '100' [packages/server/recordings_api.ts]
                    * Fixed a typo in the GitHub Action workflow name [.github/workflows/summarizer.yml]
                    * Moved the 'octokit' initialization into a dedicated module [src/octokit.ts], [src/index.ts]

                    Now summarize the following git diff: \n
                    ${diff}
                    `;
    
    //https://github.com/docker/genai-stack/commit/<commitHash>.diff
     const response = await model.generateContent(prompt)

     return response.response.text();
}
