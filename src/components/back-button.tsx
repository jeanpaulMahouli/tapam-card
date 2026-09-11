"use client";
import {useRouter} from "next/navigation";
export function BackButton({fallback="/dashboard"}:{fallback?:string}){const router=useRouter();return <button type="button" onClick={()=>window.history.length>1?router.back():router.push(fallback)} className="mb-6 flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white">← Retour</button>}
