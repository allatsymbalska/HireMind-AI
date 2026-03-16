import { Info } from "lucide-react";

export const EthicalAINotice = () => {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4 mb-6">
      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-primary mb-1">Ethical AI Scanning Notice</h4>
        <p className="text-xs text-muted-foreground">
          This system uses AI to analyze candidate match based on skills and resume content. 
          Please ensure all hiring decisions are made responsibly and equitably by a human reviewer. 
          Automated scores are intended to assist, not replace, human judgment.
        </p>
      </div>
    </div>
  );
};
