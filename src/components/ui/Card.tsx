type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div className="p-4 border rounded shadow bg-white">
      {children}
    </div>
  );
}