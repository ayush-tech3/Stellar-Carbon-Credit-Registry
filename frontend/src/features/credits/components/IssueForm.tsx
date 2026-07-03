"use client";

import { useState } from "react";
import { useIssueCredits } from "../hooks/use-credits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function IssueForm() {
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [vintageYear, setVintageYear] = useState("");
  const [methodology, setMethodology] = useState("");

  const issueMutation = useIssueCredits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !amount || !vintageYear || !methodology) return;

    issueMutation.mutate({
      project,
      amount: BigInt(amount),
      vintageYear: parseInt(vintageYear, 10),
      methodology,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-emerald-400">Issue Credits</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Project Name</label>
        <Input 
          required 
          value={project} 
          onChange={(e) => setProject(e.target.value)} 
          placeholder="e.g. Amazon Reforestation"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Amount (Tons CO₂)</label>
        <Input 
          required 
          type="number" 
          min="1"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="1000"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Vintage Year</label>
        <Input 
          required 
          type="number"
          min="1900"
          max="2100"
          value={vintageYear} 
          onChange={(e) => setVintageYear(e.target.value)} 
          placeholder="2024"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Methodology</label>
        <Input 
          required 
          value={methodology} 
          onChange={(e) => setMethodology(e.target.value)} 
          placeholder="e.g. VCS VM0015"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={issueMutation.isPending}
      >
        {issueMutation.isPending ? "Issuing..." : "Issue Credits"}
      </Button>

      {issueMutation.isError && (
        <p className="text-red-400 text-sm mt-2">Error issuing credits</p>
      )}
      {issueMutation.isSuccess && (
        <p className="text-emerald-400 text-sm mt-2">Credits issued successfully!</p>
      )}
    </form>
  );
}
