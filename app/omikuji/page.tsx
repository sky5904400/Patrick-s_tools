import type { Metadata } from "next";
import BackHomeLink from "../back-home-link";
import Omikuji from "./omikuji";

export const metadata: Metadata = {
  title: "神社抽籤",
  description: "日本神社風格的御神籤，抽出今日運勢",
};

export default function OmikujiPage() {
  return (
    <>
      <BackHomeLink className="border-2 border-stone-900 bg-[#fffaf0]/90 font-serif text-[#c8102e] hover:bg-white" />
      <Omikuji />
    </>
  );
}
