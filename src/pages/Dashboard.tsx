// src/pages/Dashboard.tsx

import Leaderboard from "../components/Dashboard/Leaderboard";
import QuickActions from "../components/Dashboard/QuickActions";
import StatsGrid from "../components/Dashboard/StatsGrid";
import WelcomeCard from "../components/Dashboard/WelcomeCard";

const Dashboard = () => {
  return (
    <div className="">
      <WelcomeCard />
      <Leaderboard />
      <StatsGrid />
      <QuickActions />
      {/* <Footer /> */}
    </div>
  );
};

export default Dashboard;
