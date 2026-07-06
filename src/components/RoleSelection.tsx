import React from 'react';
import { 
  Smartphone, 
  Store, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Info 
} from 'lucide-react';

interface RoleSelectionProps {
  onSelectCustomer: () => void;
  onSelectAgent: () => void;
  onSelectAdmin: () => void;
}

export default function RoleSelection({ 
  onSelectCustomer, 
  onSelectAgent, 
  onSelectAdmin 
}: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-0 md:p-6 font-sans antialiased text-slate-800 w-full">
      
      {/* CENTER: Mobile Frame Mockup (390px iPhone-first container) */}
      <div className="w-full max-w-[390px] min-h-screen md:min-h-[820px] md:h-[820px] bg-slate-50 md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800 overflow-hidden flex flex-col justify-between relative transition-all">
        
        {/* Top App Status Bar */}
        <div className="bg-blue-700 text-white px-5 pt-2 pb-1 flex justify-between items-center text-[11px] font-semibold select-none z-30 shrink-0">
          <span className="font-mono">09:41 น.</span>
          <div className="w-16 h-3.5 bg-blue-800 rounded-full flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4.5 h-2.5 border border-white/80 rounded-[3px] p-[1.5px] flex items-center">
              <div className="h-full w-3 bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* ==========================================
            ROLE SELECTION SCREEN
            ========================================== */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 justify-between">
          {/* Elegant Hero Welcome Header */}
          <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white px-6 py-8 text-center shadow-lg relative shrink-0">
            <div className="absolute top-[-20px] left-[-20px] w-32 h-32 rounded-full border border-white/5 pointer-events-none"></div>
            <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 rounded-full border border-amber-400/5 pointer-events-none"></div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-prompt font-black text-3xl flex items-center justify-center rounded-[24px] shadow-lg border-2 border-white animate-pulse">
                N3
              </div>
              <div>
                <h1 className="font-prompt text-xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                  N3 Agent Marketplace
                </h1>
                <p className="font-prompt text-[10px] font-bold text-blue-200 mt-1 leading-relaxed">
                  ระบบจำลองตลาดตัวแทนจำหน่ายสลาก 3 หลัก
                </p>
              </div>
            </div>
          </div>

          {/* Role Cards List Container */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            <div className="text-center pb-2">
              <h2 className="font-prompt text-sm font-black text-slate-800">
                เลือกบทบาทเพื่อเข้าสู่ระบบตัวอย่าง
              </h2>
              <p className="text-[10px] text-slate-400 font-medium font-prompt mt-0.5">
                แตะที่ปุ่มบทบาทด้านล่างเพื่อเข้าสู่แต่ละส่วนงานจำลอง
              </p>
            </div>

            {/* 1. Customer Role Card */}
            <button
              onClick={onSelectCustomer}
              className="w-full bg-white border-2 border-slate-150 hover:border-blue-500 rounded-3xl p-4 flex items-center gap-4 text-left shadow-sm hover:shadow-md active:scale-98 transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Smartphone size={22} className="stroke-[2.5px]" />
              </div>
              
              <div className="flex-1 min-w-0 pr-2">
                <span className="font-prompt text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  สำหรับผู้ซื้อสลาก / ทั่วไป
                </span>
                <h3 className="font-prompt text-sm font-black text-slate-900 leading-tight">
                  เข้าสู่ฝั่งลูกค้า
                </h3>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-prompt mt-0.5">
                  ค้นหาร้านตัวแทน เลือกร้าน และดูประวัติรายการจองสิทธิ์ N3
                </p>
              </div>
              
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
            </button>

            {/* 2. Agent Role Card */}
            <button
              onClick={onSelectAgent}
              className="w-full bg-white border-2 border-slate-150 hover:border-emerald-500 rounded-3xl p-4 flex items-center gap-4 text-left shadow-sm hover:shadow-md active:scale-98 transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600"></div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Store size={22} className="stroke-[2.5px]" />
              </div>
              
              <div className="flex-1 min-w-0 pr-2">
                <span className="font-prompt text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  สำหรับผู้ค้าสลาก N3
                </span>
                <h3 className="font-prompt text-sm font-black text-slate-900 leading-tight">
                  เข้าสู่ฝั่งตัวแทน
                </h3>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-prompt mt-0.5">
                  จัดการหน้าร้าน ยืนยันคำขอจองสิทธิ์ และดูรายงานสถิติต่างๆ
                </p>
              </div>
              
              <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
            </button>

            {/* 3. Admin Role Card */}
            <button
              onClick={onSelectAdmin}
              className="w-full bg-white border-2 border-slate-150 hover:border-indigo-600 rounded-3xl p-4 flex items-center gap-4 text-left shadow-sm hover:shadow-md active:scale-98 transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={22} className="stroke-[2.5px]" />
              </div>
              
              <div className="flex-1 min-w-0 pr-2">
                <span className="font-prompt text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md inline-block mb-1">
                  สำหรับแอดมินแพลตฟอร์ม
                </span>
                <h3 className="font-prompt text-sm font-black text-slate-900 leading-tight">
                  เข้าสู่หลังบ้านแอดมิน
                </h3>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-prompt mt-0.5">
                  อนุมัติตัวแทน จัดการสมาชิกร้านค้า และดูรายงานควบคุมระบบ
                </p>
              </div>
              
              <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
            </button>
          </div>

          {/* Footer Notice */}
          <div className="p-4 bg-slate-100 border-t border-slate-200/60 text-center shrink-0">
            <span className="font-prompt text-[9px] text-slate-400 font-semibold leading-relaxed block">
              ระบบทดสอบจำลอง N3 Agent Marketplace v1.0.0
              <br />
              พัฒนาแบบไม่มีหลังบ้าน (Mock Data Interactive Demo)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
