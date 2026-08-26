export default function Sidebar({ showSidebar }) {
  return (
    <div
      className={`
        bg-slate-900
        text-white
        h-screen
        p-6
        transition-all
        duration-500
        overflow-hidden
        ${showSidebar ? 'w-64' : 'w-0 p-0'}
      `}
    >
      {showSidebar && (
        <>
          <h2 className="text-2xl font-bold mb-10">
            AI Dashboard
          </h2>

          <ul className="space-y-4 text-lg">
            <li>Upload Dataset</li>
            <li>Train Model</li>
            <li>Prediction</li>
          </ul>
        </>
      )}
    </div>
  )
}