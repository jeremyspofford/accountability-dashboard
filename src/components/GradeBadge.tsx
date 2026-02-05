interface GradeBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function GradeBadge({ grade, score, size = 'md', showLabel = false }: GradeBadgeProps) {
  const gradeClass = `grade-${grade.toLowerCase()}`;
  
  const gradeLabels = {
    A: 'Transparent',
    B: 'Trustworthy',
    C: 'Concerning',
    D: 'Questionable',
    F: 'Corrupt'
  };
  
  const sizeConfig = {
    sm: {
      badge: 'text-xl',
      container: 'px-3 py-1.5',
      label: 'text-xs'
    },
    md: {
      badge: 'text-3xl',
      container: 'px-4 py-2',
      label: 'text-xs'
    },
    lg: {
      badge: 'text-4xl',
      container: 'px-6 py-3',
      label: 'text-sm'
    }
  };
  
  const config = sizeConfig[size];
  
  if (showLabel) {
    return (
      <div className={`grade-badge ${gradeClass} ${config.container}`}>
        <span className={`${config.badge} font-bold`}>{grade}</span>
        <div className="flex flex-col">
          <span className={`${config.label} font-semibold uppercase tracking-wider`}>
            Accountability Score
          </span>
          <span className={`${config.label} font-medium`}>
            {gradeLabels[grade]}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`grade-badge ${gradeClass} ${config.container}`}
      title={`Accountability Score: ${gradeLabels[grade]} (${score}/100)`}
    >
      <span className={`${config.badge} font-bold`}>{grade}</span>
    </div>
  );
}
