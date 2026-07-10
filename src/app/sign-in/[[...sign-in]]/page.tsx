"use client"

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-background">
      <SignIn />
    </div>
  );
}