function ActivityPanel() {

  const activities = [
    "AI generated monthly analytics report",
    "New enterprise client onboarded",
    "System performance increased by 18%",
    "Workflow automation deployed",
  ];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-2xl shadow-lg shadow-black/30">

      <h2 className="text-white text-2xl font-bold mb-8">
        Live Activity
      </h2>

      <div className="space-y-6">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex items-start gap-4"
          >

            <div className="w-3 h-3 rounded-full bg-violet-500 mt-2"></div>

            <p className="text-zinc-400 leading-relaxed">
              {activity}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ActivityPanel;