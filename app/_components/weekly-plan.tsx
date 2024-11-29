import PlanTable from "./table-plan";
import { Card, CardContent } from "./ui/card";

interface Exercise {
  exercise: string;
  sets: number;
  reps: string;
  weight: string;
  rest: string;
}

interface DayPlan {
  day: string;
  exercises: Exercise[];
}

interface WeeklyPlanProps {
  data: DayPlan[];
}

const ExerciseDay = ({ day }: { day: string }) => (
  <div className="w-full text-large text-center py-2 font-medium text-blue-700 text-2xl">
    {day}
  </div>
);

export default function WeeklyPlan({ data }: WeeklyPlanProps) {
  return (
    <Card>
      <CardContent className="p-4">
        {data.map(({ day, exercises }) => (
          <div
            key={day}
            className="mb-8 border border-gray-200 shadow-md rounded-lg"
          >
            <ExerciseDay day={day} />
            <PlanTable exercises={exercises} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
