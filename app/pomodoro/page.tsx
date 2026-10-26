import type { Metadata } from "next";
import BackHomeLink from "../back-home-link";
import PomodoroTimer from "./pomodoro-timer";

export const metadata: Metadata = {
  title: "番茄鐘",
  description: "番茄工作法計時器，幫助你專注工作",
};

export default function PomodoroPage() {
  return (
    <>
      <BackHomeLink className="bg-white/20 text-white hover:bg-white/30" />
      <PomodoroTimer />
    </>
  );
}
