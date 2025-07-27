// src/components/dashboard/StatsGrid.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type Stats = {
  correct_count: number;
  wrong_count: number;
  most_mistaken_letter: string | null;
  last_practice_at: string | null;
};

export default function StatsGrid() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select(
          "correct_count, wrong_count, most_mistaken_letter, last_practice_at"
        )
        .eq("id", user.id)
        .single();
      if (error) console.error(error);
      else setStats(data);
    })();
  }, [user]);

  if (!stats) return <div className="text-center py-10">Loading stats...</div>;

  const daysSince = stats.last_practice_at
    ? Math.floor(
        (Date.now() - new Date(stats.last_practice_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const cards = [
    {
      title: "Correct Answers",
      value: stats.correct_count,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Wrong Answers",
      value: stats.wrong_count,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Most Mistaken Letter",
      value: stats.most_mistaken_letter || "-",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Days Since Practice",
      value: `${daysSince} day${daysSince !== 1 ? "s" : ""}`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {cards.map((c, i) => (
        <div key={i} className={`p-4 rounded-xl shadow-sm border ${c.bg}`}>
          <p className="text-sm text-gray-600">{c.title}</p>
          <h2 className={`text-2xl font-bold ${c.color}`}>{c.value}</h2>
        </div>
      ))}
    </div>
  );
}
