type Props = {
  placeholder?: string;
  type?: string;
  value?: string; // ✅ ADD THIS
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
}: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value} // ✅ FIX
      onChange={onChange}
      className="w-full border p-2 rounded mb-2"
    />
  );
}