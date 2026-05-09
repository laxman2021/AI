import { useState } from "react";
import {
  Menu,
  Home,
  Upload,
  Brain,
  PieChart,
  Database,
  Info,
  Folder,
  TrendingUp,
  CircleCheck,
  Activity,
  Moon,
  ChevronDown,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import UploadDataset from "./components/UploadDataset";
import TrainModel from "./components/TrainModel";
import PredictForm from "./components/PredictForm";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-[#0f172a]">
      {/* SIDEBAR */}
      <aside className="flex w-[260px] flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
        {/* LOGO */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg">
            <Database className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold leading-tight text-white">
              Institutional
            </h1>
            <p className="text-2xl font-extrabold leading-tight text-white">
              Data Explorer
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            {[
              { icon: Home, label: "Dashboard", active: true },
              { icon: Upload, label: "Upload Dataset" },
              { icon: Brain, label: "Train Model" },
              { icon: PieChart, label: "Make Prediction" },
              { icon: TrendingUp, label: "Results" },
              { icon: Database, label: "Datasets" },
              { icon: Info, label: "About" },
            ].map((item, index) => (
              <li key={index}>
                <button
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left font-medium transition-all duration-300 ease-out ${
                    item.active
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="mt-auto px-4 pb-5">
          {/* AI Insight Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#132850] via-[#102346] to-[#0b1730] p-6 shadow-2xl">
            {/* Glow */}
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/20 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt="AI"
                  className="h-10 w-10"
                />
              </div>

              <h3 className="text-lg font-bold text-white">
                AI Powered Insights
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Train, predict and explore your institutional data easily.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-white/10"></div>

          {/* User Footer */}
          <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white shadow-lg">
                AD
              </div>

              <div>
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-10 py-8">
        {/* TOPBAR */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button className="rounded-xl bg-white p-3 shadow-sm">
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900">Dashboard</h1>
              <p className="mt-1 text-base font-medium text-slate-500">
                Welcome back! Here's what's happening with your data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="rounded-full bg-white p-3 shadow-sm">
              <Moon className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-lg font-bold text-white shadow-lg">
              AD
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              icon: Folder,
              value: "12",
              label: "Datasets Uploaded",
              color: "from-violet-100 to-violet-50",
              iconColor: "text-violet-600",
            },
            {
              icon: Brain,
              value: "5",
              label: "Models Trained",
              color: "from-green-100 to-green-50",
              iconColor: "text-green-600",
            },
            {
              icon: TrendingUp,
              value: "92.4%",
              label: "Best Accuracy",
              color: "from-blue-100 to-blue-50",
              iconColor: "text-blue-600",
            },
            {
              icon: Activity,
              value: "28",
              label: "Predictions Made",
              color: "from-orange-100 to-orange-50",
              iconColor: "text-orange-500",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-slate-200/70 bg-white/90 backdrop-blur-xl p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color}`}
                >
                  <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                </div>

                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900">
                    {card.value}
                  </h2>
                  <p className="mt-2 text-base font-semibold text-slate-700">
                    {card.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 bg-white border border-slate-100 rounded-[28px] shadow-sm px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Institutional Data Explorer
              </h2>

              <p className="text-slate-500 mt-1">
                AI-powered analytics dashboard
              </p>
            </div>

            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                📊
              </div>

              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                🤖
              </div>

              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                📁
              </div>
            </div>

            <div className="text-sm text-slate-400">© 2026 IDE Platform</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
