import Link from 'next/link';
import { ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-800 bg-black/50 p-4 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-800/30">
                    XG Boost System Active
                </p>
            </div>

            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-sky-900 after:via-[#0141ff] after:opacity-40 after:blur-2xl after:content-['']">
                <h1 className="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 z-10">
                    XG BOOST
                </h1>
            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left mt-20 gap-8">
                <Link
                    href="/admin/dashboard"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold flex items-center gap-2`}>
                        Admin Dashboard <LayoutDashboard className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none" size={20} />
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Create campaigns, manage numbers, and view analytics.
                    </p>
                </Link>

                <a
                    href="https://github.com/google-deepmind"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold flex items-center gap-2`}>
                        System Health <ShieldCheck className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none" size={20} />
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Backend: <span className="text-neon-green">Online</span> <br />
                        Database: <span className="text-neon-green">Connected</span>
                    </p>
                </a>
            </div>
        </main>
    );
}
