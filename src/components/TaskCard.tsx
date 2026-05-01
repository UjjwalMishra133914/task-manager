import Badge from "./ui/Badge";

type Props = {
  title: string;
  status: "Pending" | "In Progress" | "Done";
  onStatusChange: () => void;
};

export default function TaskCard({ title, status, onStatusChange }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition">
      
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">Click to update status</p>
      </div>

      <div onClick={onStatusChange} className="cursor-pointer">
        <Badge status={status} />
      </div>

    </div>
  );
}