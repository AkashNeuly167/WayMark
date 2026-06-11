import Sidebar from "../components/navigation/Sidebar";


function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white flex">
      <Sidebar />

      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      
    </div>
  );
}

export default MainLayout;