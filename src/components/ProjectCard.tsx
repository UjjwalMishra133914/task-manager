type Props = {
  name: string;
};

export default function ProjectCard({ name }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-500 text-sm mt-2">
        Manage tasks and team
      </p>
    </div>
  );
}