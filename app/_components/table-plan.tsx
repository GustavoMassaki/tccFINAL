interface Exercise {
  exercise: string;
  sets: number | string;
  reps: string;
  weight: string;
  rest: string;
}

interface PlanTableProps {
  exercises: Exercise[];
}

interface PlanTableHeaderProps {
  colName: string;
}

interface PlanTableDataProps {
  data: string | number;
}

const PlanTableHeader = ({ colName }: PlanTableHeaderProps) => (
  <th className="p-4 text-left font-semibold">{colName}</th>
);

const PlanTableData = ({ data }: PlanTableDataProps) => (
  <td className="p-4 text-blue-500">{data}</td>
);

const PlanTable = ({ exercises }: PlanTableProps) => {
  return (
    <table className="table-fixed w-full text-sm mb-3">
      <thead>
        <tr className={""}>
          <PlanTableHeader colName={"Exercício"} />
          <PlanTableHeader colName={"Sets"} />
          <PlanTableHeader colName={"Repetições"} />
          <PlanTableHeader colName={"Peso"} />
          <PlanTableHeader colName={"Descanso entre sets"} />
        </tr>
      </thead>
      <tbody className="bg-white">
        {exercises.map(({ exercise, sets, reps, weight, rest }, index) => (
          <tr key={index}>
            <PlanTableData data={exercise} />
            <PlanTableData data={sets} />
            <PlanTableData data={reps} />
            <PlanTableData data={weight} />
            <PlanTableData data={rest} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlanTable;
