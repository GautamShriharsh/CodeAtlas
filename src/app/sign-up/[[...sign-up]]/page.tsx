"use client"
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-background">
      <SignUp />
    </div>
  );
}