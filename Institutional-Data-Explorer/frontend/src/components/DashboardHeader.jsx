export default function DashboardHeader({ toggleSidebar }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1
        className="text-4xl font-bold text-slate-900 cursor-pointer"
        onClick={toggleSidebar}
      >
        Dashboard
      </h1>
    </div>
  )
}