// import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center h-[80vh] px-6">
        
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Manage Your Team <br />
          <span className="text-blue-600">Smarter & Faster 🚀</span>
        </h1>

        <p className="mt-4 text-gray-500 max-w-xl">
          A powerful task management system to assign tasks, track progress,
          and collaborate with your team efficiently.
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="border px-6 py-2 rounded hover:bg-gray-100"
          >
            Login
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-3 gap-6 px-10 pb-10">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">Task Management</h3>
          <p className="text-gray-500 mt-2">
            Create, assign and track tasks easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">Team Collaboration</h3>
          <p className="text-gray-500 mt-2">
            Work with your team in real-time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">Analytics Dashboard</h3>
          <p className="text-gray-500 mt-2">
            Track performance and productivity.
          </p>
        </div>

      </div>
    </div>
  );
}