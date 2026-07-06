"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CreditCard, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/lib/stripe";

const PRESETS = [100, 250, 500, 1000];
const CREDITS_PER_DOLLAR = 50;
const LOW_BALANCE_THRESHOLD = 20;

export default function BillingPage() {
  const { data: credits, isLoading } = api.project.getCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const creditsToBuyAmount = creditsToBuy[0]!;
  const price = (creditsToBuyAmount / CREDITS_PER_DOLLAR).toFixed(2);
  const currentBalance = credits?.credits ?? 0;
  const isLowBalance = !isLoading && currentBalance < LOW_BALANCE_THRESHOLD;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const data = await createCheckoutSession(creditsToBuyAmount)
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your compute credits and repository indexing capacity.
        </p>
      </div>

      {/* Balance Card */}
      <div className="rounded-lg border bg-sidebar p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Current balance
            </h3>
            <p className="text-3xl font-bold mt-2 text-foreground">
              {isLoading ? (
                <span className="inline-block h-9 w-24 rounded bg-muted animate-pulse" />
              ) : (
                `${currentBalance.toLocaleString()} credits`
              )}
            </p>
          </div>
          {isLowBalance && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
              <AlertTriangle className="h-3.5 w-3.5" />
              Running low
            </span>
          )}
        </div>
      </div>

      {/* Indexing Disclaimer */}
      <Alert className="bg-cyan-500/5 border-cyan-500/20">
        <Info className="h-4 w-4 text-cyan-400" />
        <AlertTitle className="text-cyan-400">How credits work</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Indexing a repository costs 1 credit per file. A 100-file repo
          uses 100 credits. Check your balance before a full sync.
        </AlertDescription>
      </Alert>

      {/* Purchase Section */}
      <div className="space-y-4 rounded-lg border p-5">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium">Buy credits</span>
          <span className="text-xs text-muted-foreground">
            {CREDITS_PER_DOLLAR} credits = $1
          </span>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setCreditsToBuy([amount])}
              className={cn(
                "rounded-md border py-2 text-sm font-medium transition-colors hover:cursor-pointer",
                creditsToBuyAmount === amount
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted",
              )}
            >
              {amount}
            </button>
          ))}
        </div>

        <Slider
          value={creditsToBuy}
          max={1000}
          min={50}
          step={50}
          onValueChange={setCreditsToBuy}
          className="py-2 hover:cursor-pointer"
          aria-label="Credits to buy"
        />

        <div className="flex justify-between items-center rounded-lg bg-sidebar/50 p-4">
          <div>
            <p className="text-sm font-medium">{creditsToBuyAmount} credits</p>
            <p className="text-xs text-muted-foreground">
              ≈ {creditsToBuyAmount} files indexed
            </p>
          </div>
          <span className="text-xl font-bold">${price}</span>
        </div>

        <Button
          className="w-full gap-2 hover:cursor-pointer"
          size="lg"
          onClick={handlePurchase}
          disabled={isPurchasing}
        >
          {isPurchasing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Buy {creditsToBuyAmount} credits
            </>
          )}
        </Button>
      </div>
    </div>
  );
}