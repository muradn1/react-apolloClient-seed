import React, { useEffect } from 'react';
import { LinearProgress } from '@material-ui/core';

export default function ProgressBar() {
    const [completed, setCompleted] = React.useState(0);

  useEffect(() => {
    function progress() {
      setCompleted(oldCompleted => {
        if (oldCompleted === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <LinearProgress variant="determinate" value={completed} />
    </div>
  );
}