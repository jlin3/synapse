import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pipeline from "@/components/Pipeline";
import WhyRAG from "@/components/WhyRAG";
import ConcreteExample from "@/components/ConcreteExample";
import DesignLevers from "@/components/DesignLevers";
import FailureModes from "@/components/FailureModes";
import MathSection from "@/components/MathSection";
import InterviewTip from "@/components/InterviewTip";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Pipeline />
      <WhyRAG />
      <ConcreteExample />
      <DesignLevers />
      <FailureModes />
      <MathSection />
      <InterviewTip />
      <Footer />
    </main>
  );
}
