type Props = {
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ placeholder, type = "text", onChange }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="border w-full p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}