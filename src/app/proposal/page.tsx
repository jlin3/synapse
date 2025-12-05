"use client";

import ProposalHeader from "@/components/proposal/ProposalHeader";
import ProposalHero from "@/components/proposal/ProposalHero";
import SummaryTable from "@/components/proposal/SummaryTable";
import MVPScope from "@/components/proposal/MVPScope";
import BaselineArchitecture from "@/components/proposal/BaselineArchitecture";
import OptionA from "@/components/proposal/OptionA";
import OptionB from "@/components/proposal/OptionB";
import OptionC from "@/components/proposal/OptionC";
import PeoplePlan from "@/components/proposal/PeoplePlan";
import Timeline from "@/components/proposal/Timeline";
import BudgetRecommendation from "@/components/proposal/BudgetRecommendation";
import NextSteps from "@/components/proposal/NextSteps";
import ProposalFooter from "@/components/proposal/ProposalFooter";

export default function ProposalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <ProposalHeader />
      <ProposalHero />
      <SummaryTable />
      <MVPScope />
      <BaselineArchitecture />
      <OptionA />
      <OptionB />
      <OptionC />
      <PeoplePlan />
      <Timeline />
      <BudgetRecommendation />
      <NextSteps />
      <ProposalFooter />
    </main>
  );
}

