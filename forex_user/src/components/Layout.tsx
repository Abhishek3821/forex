import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
export default function Layout() {
    return (
        <div className="min-h-screen bg-background text-text flex w-full">
            <Navbar />
            <div className="w-full">
                <Header />
                <main className="min-h-[calc(100vh-4rem)] bg-background sm:p-2 custom-scrollbar">
                    <div className="mx-auto w-full max-w-[1600px] sm:p-0 p-2 sm:mb-0 mb-14">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
