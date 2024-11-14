import Navbar from "../../components/Navbar";

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="font-work-sans">
            <Navbar />
            {children}
        </main>
    )
}