interface GradeBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export default function GradeBadge({ grade, score, size = 'md', showScore = false }: GradeBadgeProps) {
  const gradeClass = `grade-${grade.toLowerCase()}`;
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl border-2',
    md: 'w-12 h-12 text-2xl border-3',
    lg: 'w-16 h-16 text-3xl border-4',
  };
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`grade-badge ${gradeClass} ${sizeClasses[size]} inline-flex items-center justify-center rounded-full font-bold`}
        title={`Accountability Score: ${score}/100`}
      >
        {grade}
      </div>
      {showScore && (
        <span className="text-xs text-slate-400">
          {score}/100
        </span>
      )}
    </div>
  );
}
