import { useEffect } from 'react';
import { useIdleTimer, type IIdleTimer } from 'react-idle-timer';
import { useAuth } from 'react-oidc-context';

const SessionMonitor = ({ timeout = 1000 * 60 * 0.2 }) => {
  const auth = useAuth();

  const onIdle = (_?:Event, idleTimer?: IIdleTimer): void => {
    // Only logout if the user is actually authenticated
    if (auth.isAuthenticated /*&& idleTimer?.isLeader()*/) {
      console.log('User is idle. Initiating logout...');
      auth.signoutRedirect();
    }
  };

  const { start, pause, getRemainingTime, getLastActiveTime } = useIdleTimer({
    onIdle,
    timeout,
    throttle: 500,
    startManually: true,
    /*leaderElection: true,*/
    crossTab: true,
    syncTimers: 200,
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      // User logged in: Start/Reset the timer
      console.log('Started idle timer');
      start(); 
    } else {
      // User logged out: Stop the timer and clear listeners
      console.log('Stopped idle timer');
      pause();
    }
  }, [auth.isAuthenticated, start, pause]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth.isAuthenticated) {
        console.log(`Remaining time [${getRemainingTime()}] Last Active Time [${getLastActiveTime()}]`)
      }
    }, 1000); // Log every second
  
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, getRemainingTime, getLastActiveTime]);



  return null; // This component handles logic, no UI needed
};

export default SessionMonitor;