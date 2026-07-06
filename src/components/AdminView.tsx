import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Store, 
  ShieldCheck, 
  FileText, 
  Settings as SettingsIcon, 
  Plus, 
  Check, 
  X, 
  Search, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Smartphone,
  Layers,
  Calendar,
  DollarSign,
  Tag,
  Bell,
  ArrowLeft,
  Sliders,
  Trash2,
  Info,
  ChevronDown,
  User,
  Activity,
  FileCheck
} from 'lucide-react';
import { 
  mockShops, 
  mockApprovals, 
  mockUsers, 
  mockCustomersEntityList, 
  mockAgentsEntityList, 
  mockSubscriptionsList, 
  mockAddOnServicesList 
} from '../data';
import { 
  AdminTab, 
  ApprovalRequest, 
  Shop, 
  User as UserType, 
  Customer, 
  Agent, 
  Subscription, 
  AddOnService 
} from '../types';

interface AdminViewProps {
  onBackToRoles: () => void;
}

type MobileAdminTab = 'overview' | 'approvals' | 'agents' | 'shops' | 'reports';

export default function AdminView({ onBackToRoles }: AdminViewProps) {
  // Mobile tab states
  const [activeTab, setActiveTab] = useState<MobileAdminTab>('overview');
  
  // Backoffice entity states
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomersEntityList);
  const [agents, setAgents] = useState<Agent[]>(mockAgentsEntityList);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptionsList);
  const [addOnServices, setAddOnServices] = useState<AddOnService[]>(mockAddOnServicesList);
  
  // UI filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState<'all' | 'Active' | 'Pending' | 'Suspended'>('all');
  const [shopFilter, setShopFilter] = useState<'all' | 'open' | 'verified' | 'unverified'>('all');
  const [approvalSubTab, setApprovalSubTab] = useState<'register' | 'upgrade' | 'docs' | 'complaints'>('register');
  
  // Notification Toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');
  
  // Settings parameter states
  const [autoApproval, setAutoApproval] = useState(false);
  const [commissionRate, setCommissionRate] = useState(5);
  const [quotaCap, setQuotaCap] = useState(2000);

  // Modals visibility states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [selectedAgentProfile, setSelectedAgentProfile] = useState<Agent | null>(null);
  const [selectedShopDetail, setSelectedShopDetail] = useState<Shop | null>(null);
  
  // Simulated request input
  const [showRequestInfoId, setShowRequestInfoId] = useState<string | null>(null);
  const [requestInfoText, setRequestInfoText] = useState('');

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Handle Approve Agent / Shop Upgrade Request
  const handleApprove = (id: string, name: string, level?: string) => {
    setApprovals(approvals.filter(app => app.id !== id));
    
    // Add approved agent to agents list
    const newAgent: Agent = {
      agentId: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
      shopName: `ร้านค้า ${name} N3`,
      ownerName: name,
      package: (level?.includes('Gold') ? 'Pro' : level?.includes('Premium') ? 'Premium' : 'Basic') as 'Basic' | 'Pro' | 'Premium',
      quotaTotal: level?.includes('Premium') ? 10000 : level?.includes('Gold') ? 5000 : 2000,
      quotaRemaining: level?.includes('Premium') ? 10000 : level?.includes('Gold') ? 5000 : 2000,
      todaySales: 0,
      totalCustomers: 0,
      status: 'Active'
    };
    setAgents([newAgent, ...agents]);

    // Add corresponding shop
    const newShop: Shop = {
      shopId: `shop${shops.length + 1}`,
      shopName: `ร้านค้า ${name} N3`,
      rating: 5.0,
      verified: true,
      packageBadge: newAgent.package,
      location: 'ปากเกร็ด นนทบุรี',
      description: 'ร้านตัวแทนสัญจรยุคใหม่ที่ได้รับอนุญาตอย่างเปิดเผย มีบริการแนะนำดูแลใกล้ชิด',
      id: `shop${shops.length + 1}`,
      name: `ร้านค้า ${name} N3`,
      address: 'ปากเกร็ด นนทบุรี ประเทศไทย',
      phone: '081-444-9999',
      logo: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=120',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      reviewsCount: 1,
      isVerified: true,
      isOpen: true,
      openTime: '08:00',
      closeTime: '20:00',
      level: (level?.includes('Gold') ? 'Gold Agent' : level?.includes('Premium') ? 'Premium Agent' : 'Basic Agent') as 'Gold Agent' | 'Pro Agent' | 'Basic Agent' | 'Premium Agent'
    };
    setShops([newShop, ...shops]);

    showToast(`✓ อนุมัติสิทธิ์ตัวแทนและเปิดร้าน "${name}" แล้ว`, 'success');
  };

  // 2. Handle Reject Agent Request
  const handleReject = (id: string, name: string) => {
    setApprovals(approvals.filter(app => app.id !== id));
    showToast(`✕ ปฏิเสธการลงทะเบียนของ "${name}" แล้ว`, 'warning');
  };

  // 3. Toggle Store Verification Badge
  const handleToggleVerify = (shopId: string, name: string, currentStatus: boolean) => {
    setShops(shops.map(shop => 
      shop.shopId === shopId ? { ...shop, verified: !currentStatus, isVerified: !currentStatus } : shop
    ));
    showToast(`${!currentStatus ? '🛡️ ยืนยันสิทธิ์' : '⚠️ ยกเลิกสิทธิ์'} ของ "${name}" เรียบร้อย`, 'info');
  };

  // 4. Cycle Agent Status (Active -> Suspended -> Pending -> Active)
  const handleToggleAgentStatus = (agentId: string, currentStatus: 'Active' | 'Pending' | 'Suspended') => {
    const nextStatusMap: Record<string, 'Active' | 'Pending' | 'Suspended'> = {
      'Active': 'Suspended',
      'Suspended': 'Pending',
      'Pending': 'Active'
    };
    const nextStatus = nextStatusMap[currentStatus];
    setAgents(agents.map(a => 
      a.agentId === agentId ? { ...a, status: nextStatus } : a
    ));
    showToast(`⚙️ อัปเดตสถานะ ${agentId} เป็น "${nextStatus}"`, 'info');
  };

  // 5. Toggle Addon Active/Inactive State
  const handleToggleAddonStatus = (serviceName: string, currentStatus: 'Active' | 'Inactive') => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setAddOnServices(addOnServices.map(addon => 
      addon.serviceName === serviceName ? { ...addon, status: nextStatus } : addon
    ));
    showToast(`✓ บริการ "${serviceName}" เปลี่ยนเป็น ${nextStatus === 'Active' ? 'เปิดบริการ' : 'ปิดชั่วคราว'}`, 'success');
  };

  // 6. Change Agent Package Directly
  const handleChangeAgentPackage = (agentId: string, newPackage: 'Basic' | 'Pro' | 'Premium') => {
    const quotaMap = { 'Basic': 2000, 'Pro': 5000, 'Premium': 10000 };
    setAgents(agents.map(a => 
      a.agentId === agentId ? { 
        ...a, 
        package: newPackage,
        quotaTotal: quotaMap[newPackage],
        quotaRemaining: quotaMap[newPackage] // Reset quota to full on upgrade
      } : a
    ));
    showToast(`👑 ปรับแพ็กเกจ ${agentId} เป็น "${newPackage}" เรียบร้อย`, 'success');
  };

  // Search filter implementations
  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.agentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = agentFilter === 'all' || a.status === agentFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredShops = shops.filter(s => {
    const matchesSearch = s.shopName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (shopFilter === 'open') matchesFilter = s.isOpen;
    else if (shopFilter === 'verified') matchesFilter = s.verified;
    else if (shopFilter === 'unverified') matchesFilter = !s.verified;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-0 md:p-6 font-sans antialiased text-slate-800 w-full" id="admin_root">
      
      {/* CENTER: Mobile Frame Mockup (390px centered container) */}
      <div className="w-full max-w-[390px] min-h-screen md:min-h-[820px] md:h-[820px] bg-slate-50 md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800 overflow-hidden flex flex-col justify-between relative transition-all">
        
        {/* Toast Warning Alert Banner inside Phone Container */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-purple-500/50 animate-bounce">
            {toastType === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
            {toastType === 'info' && <Sparkles size={16} className="text-purple-400 shrink-0" />}
            {toastType === 'warning' && <AlertCircle size={16} className="text-amber-400 shrink-0" />}
            <span className="font-prompt font-black text-[10px] leading-tight">{toastMessage}</span>
          </div>
        )}

        {/* Top App Status Bar (Purple Theme for Admin) */}
        <div className="bg-purple-850 text-white px-5 pt-2 pb-1 flex justify-between items-center text-[11px] font-semibold select-none z-30 shrink-0">
          <span className="font-mono">09:41 น.</span>
          <div className="w-16 h-3.5 bg-purple-950 rounded-full flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4.5 h-2.5 border border-white/80 rounded-[3px] p-[1.5px] flex items-center">
              <div className="h-full w-3 bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Header Top App Bar */}
        <header className="bg-purple-800 text-white px-4 py-3 flex justify-between items-center shadow-md z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-prompt font-black text-base flex items-center justify-center border border-white/20 shadow-inner shrink-0">
              N3
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-prompt text-sm font-black tracking-tight leading-none text-white">
                  {activeTab === 'overview' ? 'ภาพรวมระบบ' : 
                   activeTab === 'approvals' ? 'พิจารณาอนุมัติ' : 
                   activeTab === 'agents' ? 'ตัวแทนทั้งหมด' : 
                   activeTab === 'shops' ? 'ร้านค้าในระบบ' : 'รายงานส่วนกลาง'}
                </h1>
                <span className="bg-purple-950 text-amber-300 font-prompt font-black text-[8px] px-1.5 py-0.5 rounded-md leading-none">แอดมิน</span>
              </div>
              <p className="text-[9px] text-purple-100 font-medium mt-1 font-prompt">ระบบผู้ดูแลแพลตฟอร์ม Backoffice</p>
            </div>
          </div>
          
          <button 
            id="btn-switch-role"
            onClick={onBackToRoles}
            className="text-[10px] font-prompt font-black bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
          >
            เปลี่ยนบทบาท
          </button>
        </header>

        {/* Scrollable Screen Content Container (Centered 390px Mobile view) */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-24 scrollbar-none">
          
          {/* ====================================================
              VIEW 1: OVERVIEW SCREEN (ภาพรวม)
              ==================================================== */}
          {activeTab === 'overview' && (
            <div className="p-4 space-y-4 animate-fade-in" id="panel_overview">
              
              {/* Profile Greeting Area */}
              <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-white/5 rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border-2 border-white/20 overflow-hidden shrink-0 shadow-md">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Mt1T3vBAGnwxXXpwkTDNnKGDs50v3wVBLMRw2M3X7abdBMKLUQ2uN_mdFOAOMz0EBeb0gLEp3IPUdvyhharPA1wWqqu0sz00NAyvTlCs4xDh4B6XIPWr_gLj3kTyKptOVQ9dX0-BxYa1vU8oRsAjxTDI5urjPWE661Ss-tewSMi_f_vNNbCLPC-bLRDlT6kuVUYy57bpQau-uqeCD0YMAiWwIr9H9Jyh-Qr9BlN6rEFIRkt0ZYPggWZjcY0yEULnY2gNeci8Czpl" className="w-full h-full object-cover" alt="Admin headshot" />
                  </div>
                  <div>
                    <span className="text-[8px] font-prompt font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded uppercase">SUPER ADMIN</span>
                    <h2 className="font-prompt text-sm font-black text-white mt-0.5">สวัสดี, แอดมินสมชาย</h2>
                    <p className="text-[9px] text-indigo-200">ตรวจสอบความถูกต้องระบบตลาดตัวแทน N3</p>
                  </div>
                </div>
              </div>

              {/* KPI Stats Grid (4 cards in 2 columns - highly legible) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-600 text-white p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-24">
                  <span className="text-[9px] font-prompt font-black opacity-80">รายได้รวมแพลตฟอร์ม</span>
                  <h3 className="font-mono text-base font-black leading-none">฿2,450,000</h3>
                  <span className="text-[8px] bg-white/25 px-1.5 py-0.5 rounded-md font-bold w-fit mt-1">
                    +12% งวดนี้
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-24">
                  <span className="text-[9px] font-prompt font-black text-slate-400">ตัวแทนหน้าร้านทั้งหมด</span>
                  <h3 className="font-mono text-base font-black text-slate-800 leading-none">{agents.length} ราย</h3>
                  <span className="text-[8px] text-indigo-600 font-black font-prompt mt-1 block">
                    Active: {agents.filter(a => a.status === 'Active').length}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-24">
                  <span className="text-[9px] font-prompt font-black text-slate-400">ร้านค้าจดทะเบียน</span>
                  <h3 className="font-mono text-base font-black text-slate-800 leading-none">{shops.length} บูธ</h3>
                  <span className="text-[8px] text-emerald-600 font-black font-prompt mt-1 block">
                    ผ่านเกณฑ์: {shops.filter(s => s.verified).length}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-24">
                  <span className="text-[9px] font-prompt font-black text-slate-400">งานรอดำเนินการ</span>
                  <h3 className="font-mono text-base font-black text-rose-500 leading-none">{approvals.length} รายการ</h3>
                  <span className="text-[8px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded font-black font-prompt w-fit mt-1 animate-pulse">
                    อนุมัติด่วน!
                  </span>
                </div>
              </div>

              {/* Today's Tasks (งานที่ต้องทำวันนี้) */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2.5">
                <h3 className="font-prompt text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Activity size={14} className="text-amber-600" />
                  งานเร่งด่วนที่ต้องทำวันนี้
                </h3>
                
                <div className="space-y-1.5 font-prompt text-[11px] font-bold text-slate-700">
                  <button 
                    onClick={() => { setActiveTab('approvals'); setApprovalSubTab('register'); }}
                    className="w-full flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm active:scale-98 transition-transform cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      อนุมัติตัวแทนสมัครใหม่ค้างอยู่
                    </span>
                    <span className="text-rose-500 font-mono text-[10px] font-black">{approvals.filter(a => a.type === 'register').length} รายการ →</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('approvals'); setApprovalSubTab('upgrade'); }}
                    className="w-full flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm active:scale-98 transition-transform cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                      ตรวจสอบคำขออัปเกรดบูธ
                    </span>
                    <span className="text-indigo-600 font-mono text-[10px] font-black">{approvals.filter(a => a.type === 'upgrade').length} คำขอ →</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('approvals'); setApprovalSubTab('complaints'); }}
                    className="w-full flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm active:scale-98 transition-transform cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      คำร้องเรียนจากผู้ใช้จำลอง
                    </span>
                    <span className="text-red-500 font-mono text-[10px] font-black">1 ค้างอยู่ →</span>
                  </button>
                </div>
              </div>

              {/* Bento-Grid Quick Menu (เมนูด่วน - 6 Large Cards, 2 columns) */}
              <div className="space-y-2">
                <h3 className="font-prompt text-xs font-black text-slate-800 px-0.5 flex items-center gap-1">
                  <Sliders size={14} className="text-indigo-600" />
                  เมนูจัดการความปลอดภัยทางด่วน
                </h3>
                
                <div className="grid grid-cols-2 gap-3 font-prompt">
                  {/* Item 1 */}
                  <button 
                    onClick={() => setActiveTab('approvals')}
                    className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">อนุมัติตัวแทน</span>
                      <span className="text-[8px] text-slate-400 font-bold">ตรวจ KYC สิทธิ์ขายสลาก</span>
                    </div>
                  </button>

                  {/* Item 2 */}
                  <button 
                    onClick={() => setActiveTab('shops')}
                    className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Store size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">จัดการจุดขาย</span>
                      <span className="text-[8px] text-slate-400 font-bold">ตรวจสอบและติดป้ายทอง</span>
                    </div>
                  </button>

                  {/* Item 3 */}
                  <button 
                    onClick={() => setShowMembersModal(true)}
                    className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">สมาชิก & แพ็กเกจ</span>
                      <span className="text-[8px] text-slate-400 font-bold">ข้อมูล Customer / ระดับสัญญา</span>
                    </div>
                  </button>

                  {/* Item 4 */}
                  <button 
                    onClick={() => setShowAddonsModal(true)}
                    className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Plus size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">บริการเสริม SMS</span>
                      <span className="text-[8px] text-slate-400 font-bold">สวิตช์เปิดปิดบริการ Add-on</span>
                    </div>
                  </button>

                  {/* Item 5 */}
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">รายงานสถิติ</span>
                      <span className="text-[8px] text-slate-400 font-bold">สรุปงบประมาณและยอดขาย</span>
                    </div>
                  </button>

                  {/* Item 6 */}
                  <button 
                    onClick={() => setShowSettingsModal(true)}
                    className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <SettingsIcon size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">ตั้งค่าระบบ</span>
                      <span className="text-[8px] text-slate-400 font-bold">ค่าธรรมเนียม / อนุมัติอัตโนมัติ</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Entity Schema Validation Notice (N3 guidelines) */}
              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-150 flex items-start gap-2.5">
                <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[10px] text-indigo-900 leading-normal font-semibold font-prompt">
                  <p className="font-black text-indigo-950">โครงสร้างข้อมูลเอนทิตีสมบูรณ์ 100%</p>
                  <p className="text-slate-500 font-medium">แผงควบคุมหลังบ้านจำลองประมวลผลผ่านโมเดลสัญญาร่วมที่เชื่อมระหว่างตัวแทนจำหน่าย ร้านค้า สัญญาแพ็กเกจ และลูกค้าผู้ถือครองสิทธิ์ N3</p>
                </div>
              </div>

              {/* Recent Activity Log (รายการความเคลื่อนไหวล่าสุด) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 font-prompt">
                <h3 className="text-xs font-prompt font-black text-slate-800 border-b border-slate-100 pb-2">
                  📝 บันทึกประวัติสถานการณ์ล่าสุด
                </h3>
                
                <div className="space-y-3 text-[10px] font-bold text-slate-600 leading-normal">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[8px] shrink-0">●</span>
                    <div>
                      <p className="text-slate-900 font-black">"คุณนลินี รักดี" ยื่นคำขอเลือกสลาก N3 ผ่านระบบสำเร็จ</p>
                      <p className="text-[8px] text-slate-400 font-semibold font-mono mt-0.5">วันนี้ • 10:30 น.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start border-t border-slate-50 pt-2.5">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[8px] shrink-0">●</span>
                    <div>
                      <p className="text-slate-900 font-black">"คุณเจ๊นุช บางใหญ่" ได้รับการปรับยอดโควตาสำรองเพิ่ม</p>
                      <p className="text-[8px] text-slate-400 font-semibold font-mono mt-0.5">วันนี้ • 09:45 น.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start border-t border-slate-50 pt-2.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[8px] shrink-0">●</span>
                    <div>
                      <p className="text-slate-900 font-black">เซิร์ฟเวอร์สำรองข้อมูล Cloud สลากรัฐบาลเสร็จสิ้น</p>
                      <p className="text-[8px] text-slate-400 font-semibold font-mono mt-0.5">เมื่อวานนี้ • 18:00 น.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ====================================================
              VIEW 2: APPROVALS SCREEN (อนุมัติ)
              ==================================================== */}
          {activeTab === 'approvals' && (
            <div className="p-4 space-y-4 animate-fade-in" id="panel_approvals">
              <div>
                <h2 className="font-prompt text-base font-black text-indigo-950">คิวงานตรวจสอบสิทธิ์</h2>
                <p className="text-[10px] text-slate-400 font-medium font-prompt">อนุมัติลงทะเบียนตัวแทนรายย่อย ดำเนินการยืนยันสถานะ</p>
              </div>

              {/* Sub tabs selector (Horizontal layout) */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10.5px] font-prompt font-black text-slate-600 gap-1 shrink-0">
                <button
                  onClick={() => setApprovalSubTab('register')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${approvalSubTab === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-indigo-600'}`}
                >
                  ตัวแทน ({approvals.filter(a => a.type === 'register').length})
                </button>
                <button
                  onClick={() => setApprovalSubTab('upgrade')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${approvalSubTab === 'upgrade' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-indigo-600'}`}
                >
                  อัปเกรด ({approvals.filter(a => a.type === 'upgrade').length})
                </button>
                <button
                  onClick={() => setApprovalSubTab('docs')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${approvalSubTab === 'docs' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-indigo-600'}`}
                >
                  เอกสาร KYC
                </button>
                <button
                  onClick={() => setApprovalSubTab('complaints')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${approvalSubTab === 'complaints' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-indigo-600'}`}
                >
                  ข้อพิพาท
                </button>
              </div>

              {/* Approvals list based on sub tab */}
              <div className="space-y-3">
                {approvalSubTab === 'register' && (
                  <>
                    {approvals.filter(a => a.type === 'register').length > 0 ? (
                      approvals.filter(a => a.type === 'register').map(req => (
                        <div key={req.id} className="bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-sm space-y-3 font-prompt">
                          <div className="flex gap-3 items-start">
                            <img src={req.image} className="w-11 h-11 rounded-full object-cover border shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-1.5 py-0.5 rounded uppercase font-mono">ID: {req.id}</span>
                              <h4 className="text-xs font-black text-slate-900 truncate mt-0.5">{req.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium">{req.typeText}</p>
                              <p className="text-[10px] text-indigo-600 font-black mt-1">ระดับ: {req.level}</p>
                            </div>
                          </div>

                          {/* Request detail viewer shortcut */}
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-[10px] text-slate-500 font-medium leading-relaxed">
                            <strong>🗄️ ตรวจสอบหลักฐานจำลอง:</strong> บัตรประชาชนเลขที่ 11002xxxxxx, สมุดบัญชีธนาคารพร้อมสลาก 3 หลักระบุตัวตนถูกต้อง
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleReject(req.id, req.name)}
                              className="px-3.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-600 rounded-xl text-[10.5px] font-black cursor-pointer h-11"
                            >
                              ปฏิเสธ
                            </button>
                            <button
                              onClick={() => setShowRequestInfoId(req.id)}
                              className="px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-600 rounded-xl text-[10.5px] font-black cursor-pointer h-11"
                            >
                              ขอข้อมูลเพิ่ม
                            </button>
                            <button
                              onClick={() => handleApprove(req.id, req.name, req.level)}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10.5px] font-black cursor-pointer shadow-md active:scale-95 transition-transform h-11 flex items-center justify-center gap-1"
                            >
                              <Check size={14} className="stroke-[3px]" />
                              อนุมัติสิทธิ์
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-4 font-prompt">
                        <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
                        <h4 className="text-xs font-black text-slate-800 mt-2">เรียบร้อยครบถ้วนแล้ว!</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">ไม่มีคำขอลงทะเบียนสมัครสลากใหม่ค้างตรวจสอบในระบบ</p>
                      </div>
                    )}
                  </>
                )}

                {approvalSubTab === 'upgrade' && (
                  <>
                    {approvals.filter(a => a.type === 'upgrade').length > 0 ? (
                      approvals.filter(a => a.type === 'upgrade').map(req => (
                        <div key={req.id} className="bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-sm space-y-3 font-prompt">
                          <div className="flex gap-3 items-start">
                            <img src={req.image} className="w-11 h-11 rounded-full object-cover border shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] bg-purple-50 border border-purple-100 text-purple-600 font-bold px-1.5 py-0.5 rounded uppercase font-mono">ID: {req.id}</span>
                              <h4 className="text-xs font-black text-slate-900 truncate mt-0.5">{req.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium">{req.typeText}</p>
                              <p className="text-[10px] text-purple-600 font-black mt-1">ขออัปเกรดโควตา: {req.level}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleReject(req.id, req.name)}
                              className="px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-600 rounded-xl text-[10.5px] font-black cursor-pointer h-11"
                            >
                              ปฏิเสธ
                            </button>
                            <button
                              onClick={() => handleApprove(req.id, req.name, req.level)}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10.5px] font-black cursor-pointer shadow-md active:scale-95 transition-transform h-11 flex items-center justify-center gap-1"
                            >
                              <Check size={14} className="stroke-[3px]" />
                              อนุมัติอัปเกรด
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-4 font-prompt">
                        <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
                        <h4 className="text-xs font-black text-slate-800 mt-2">เรียบร้อยครบถ้วนแล้ว!</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">ไม่มีรายการขออัปเกรดโควตาค้างพิจารณา</p>
                      </div>
                    )}
                  </>
                )}

                {approvalSubTab === 'docs' && (
                  <div className="space-y-3 font-prompt">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">รอตรวจสอบใบตั้งบูธ</span>
                        <span className="text-[9px] font-mono text-slate-400">DOC-2026-904</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">เอกสารอนุญาตจำหน่ายสลากทางกายภาพจุดปากเกร็ด</h4>
                      <p className="text-[10px] text-slate-500">ผู้ส่ง: คุณป้าศรี มั่งมี (ตัวแทน N3)</p>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => showToast("✕ ปฏิเสธเอกสารของป้าศรีแล้ว", "warning")} className="flex-1 py-2 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl text-[10px] font-black">ปฏิเสธ</button>
                        <button onClick={() => showToast("✓ อนุมัติเอกสารใบตั้งบูธเรียบร้อย", "success")} className="flex-1 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black">อนุมัติให้ผ่าน</button>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">รอตรวจ KYC ตัวตน</span>
                        <span className="text-[9px] font-mono text-slate-400">DOC-2026-812</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">ถ่ายภาพถ่ายบุคคลคู่กับบัตรประชาชน (ใบสมัครซ่อมแซม)</h4>
                      <p className="text-[10px] text-slate-500">ผู้ส่ง: คุณสมเกียรติ ยอดเยี่ยม</p>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => showToast("✕ สั่งส่งเอกสารซ่อมแซมตัวตนใหม่แล้ว", "warning")} className="flex-1 py-2 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl text-[10px] font-black">ปฏิเสธ</button>
                        <button onClick={() => showToast("✓ ยืนยันตัวตน (KYC) ผ่านสมบูรณ์", "success")} className="flex-1 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black">อนุมัติให้ผ่าน</button>
                      </div>
                    </div>
                  </div>
                )}

                {approvalSubTab === 'complaints' && (
                  <div className="space-y-3 font-prompt">
                    <div className="bg-white border-2 border-red-200 p-4 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded font-black">ข้อพิพาทรุนแรง</span>
                        <span className="font-mono text-[9px] text-slate-400">RE-90145</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-snug">ลูกค้าร้องเรียนโควตาจองสลากดิจิทัลไม่ตัดเข้าระบบเป๋าตังจริง</h4>
                        <p className="text-[9px] text-slate-500 mt-1">ผู้ร้องเรียน: คุณนลินี รักดี • ร้านตัวแทนกรณีพิพาท: ร้านเจ๊นุช บางใหญ่</p>
                      </div>
                      <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-[10px] text-slate-600 font-medium leading-relaxed">
                        <strong>ข้อความผู้ร้องเรียน:</strong> "ทำการโอนสลากให้เจ๊นุชตัดสิทธิ์ไปแล้ว รอผ่านไป 3 ชั่วโมงเลขยังไม่เด้งขึ้นหน้ารายการสั่งซื้อของฉันเลยค่ะ เจ๊ไม่ตอบไลน์เลย"
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => showToast("✕ ยกคำร้อง เนื่องจากเจ๊นุชเคลียร์โควตาแล้ว", "info")} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black">ยกฟ้อง</button>
                        <button onClick={() => showToast("⚖️ ดำเนินการระงับสิทธิ์ร้านค้านั้นชั่วคราวเพื่อรอตรวจสอบ", "warning")} className="flex-1 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl text-[10px] font-black">สั่งระงับสิทธิ์ตรวจสอบ</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              VIEW 3: AGENTS SCREEN (ตัวแทน)
              ==================================================== */}
          {activeTab === 'agents' && (
            <div className="p-4 space-y-4 animate-fade-in" id="panel_agents">
              <div className="flex justify-between items-center gap-2">
                <div>
                  <h2 className="font-prompt text-base font-black text-indigo-950">ตัวแทนจำหน่าย ({filteredAgents.length} ราย)</h2>
                  <p className="text-[10px] text-slate-400 font-medium font-prompt">ฐานข้อมูล Agent: รหัสตัวแทน, ระดับแพ็กเกจ, โควตาสะสม</p>
                </div>
                <button
                  onClick={() => {
                    const newId = `AG-${Math.floor(100000 + Math.random() * 900000)}`;
                    const owner = `คุณจำลอง มั่งคง ${agents.length + 1}`;
                    const mockAgent: Agent = {
                      agentId: newId,
                      shopName: `ร้าน ${owner}`,
                      ownerName: owner,
                      package: 'Basic',
                      quotaTotal: 2000,
                      quotaRemaining: 2000,
                      todaySales: 12500,
                      totalCustomers: 25,
                      status: 'Active'
                    };
                    setAgents([mockAgent, ...agents]);
                    showToast(`✓ จำลองการสร้างข้อมูล Agent สำเร็จ`, 'success');
                  }}
                  className="bg-indigo-600 text-white p-2 rounded-full shadow-md active:scale-90 transition-transform flex items-center justify-center shrink-0"
                  title="จำลองการเพิ่ม Agent ใหม่"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Search input for Agent */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="พิมพ์ค้นหาชื่อตัวแทน / รหัสประจำตัว..."
                  className="w-full h-10 bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl pl-9 pr-4 text-xs font-prompt font-medium outline-none transition-all shadow-sm"
                />
              </div>

              {/* Filter Chips row */}
              <div className="flex gap-1.5 overflow-x-auto text-[10px] font-prompt font-black text-slate-500 pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'Active', label: 'Active' },
                  { id: 'Pending', label: 'Pending' },
                  { id: 'Suspended', label: 'Suspended' }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setAgentFilter(chip.id as any)}
                    className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${agentFilter === chip.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Agent card listing */}
              <div className="space-y-3">
                {filteredAgents.map(agent => (
                  <div key={agent.agentId} className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 font-prompt">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase font-mono border">ID: {agent.agentId}</span>
                        <h4 className="text-xs font-black text-slate-900 truncate mt-0.5">{agent.shopName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">เจ้าของ: {agent.ownerName}</p>
                      </div>
                      
                      {/* Interactive pill toggling status */}
                      <button
                        onClick={() => handleToggleAgentStatus(agent.agentId, agent.status)}
                        className={`text-[9px] font-black px-2.5 py-1 rounded-full border transition-colors shadow-inner ${
                          agent.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : agent.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        ● {agent.status}
                      </button>
                    </div>

                    {/* Quota breakdown indicator bar */}
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border">
                      <div className="flex justify-between text-[8px] font-bold text-slate-400">
                        <span>โควตารวมคงเหลือสิทธิ์สำรอง</span>
                        <span className="font-mono text-slate-700 font-black">{agent.quotaRemaining.toLocaleString()} / {agent.quotaTotal.toLocaleString()} ใบ</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            (agent.quotaRemaining / agent.quotaTotal) < 0.25 
                              ? 'bg-rose-500' 
                              : (agent.quotaRemaining / agent.quotaTotal) < 0.6 
                              ? 'bg-amber-400' 
                              : 'bg-indigo-600'
                          }`}
                          style={{ width: `${(agent.quotaRemaining / agent.quotaTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Sales Metrics display */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 font-mono">
                      <div className="bg-slate-50 border p-2 rounded-xl text-center">
                        <span className="block text-[8px] font-prompt text-slate-400">ยอดขายสะสมวันนี้</span>
                        <span className="text-emerald-600 font-black">฿{agent.todaySales.toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-50 border p-2 rounded-xl text-center">
                        <span className="block text-[8px] font-prompt text-slate-400">ลูกค้าผ่านจุดบริการ</span>
                        <span className="text-slate-800 font-black">{agent.totalCustomers} ราย</span>
                      </div>
                    </div>

                    {/* Action buttons (Package selector and Profile view) */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      {/* Package Select box */}
                      <div className="relative">
                        <select
                          value={agent.package}
                          onChange={(e) => handleChangeAgentPackage(agent.agentId, e.target.value as any)}
                          className="w-full h-9 bg-slate-150 hover:bg-slate-200 border text-[10px] font-black rounded-lg px-2 outline-none text-slate-800 cursor-pointer appearance-none text-center"
                        >
                          <option value="Basic">Basic Package</option>
                          <option value="Pro">Pro Package</option>
                          <option value="Premium">Premium Package</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
                          <ChevronDown size={11} />
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedAgentProfile(agent)}
                        className="py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-[10px] font-black rounded-lg text-center h-9 active:scale-95 transition-transform cursor-pointer"
                      >
                        ดูข้อมูลโปรไฟล์
                      </button>
                    </div>
                  </div>
                ))}

                {filteredAgents.length === 0 && (
                  <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-4 font-prompt">
                    <p className="text-xs font-bold text-slate-400">ไม่พบข้อมูลตัวแทนจำหน่ายที่ค้นหา</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setAgentFilter('all'); }}
                      className="mt-3 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-[10px] font-black"
                    >
                      แสดงทั้งหมด
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              VIEW 4: SHOPS SCREEN (ร้านค้า)
              ==================================================== */}
          {activeTab === 'shops' && (
            <div className="p-4 space-y-4 animate-fade-in" id="panel_shops">
              <div>
                <h2 className="font-prompt text-base font-black text-indigo-950">บูธจำหน่าย N3 ({filteredShops.length} ร้าน)</h2>
                <p className="text-[10px] text-slate-400 font-medium font-prompt">รายชื่อบูธจุดบริการสลากดิจิทัลจำลอง การติดแบรนด์ แบนเนอร์</p>
              </div>

              {/* Search bar for shops */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาร้านค้าตามชื่อ หรือสถานที่ตั้ง..."
                  className="w-full h-10 bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-xl pl-9 pr-4 text-xs font-prompt font-medium outline-none transition-all shadow-sm"
                />
              </div>

              {/* Shop Filter chips */}
              <div className="flex gap-1.5 overflow-x-auto text-[10px] font-prompt font-black text-slate-500 pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'open', label: 'เปิดบริการอยู่' },
                  { id: 'verified', label: 'Verified เท่านั้น' },
                  { id: 'unverified', label: 'Unverified เท่านั้น' }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setShopFilter(chip.id as any)}
                    className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${shopFilter === chip.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Shop card displays */}
              <div className="space-y-3">
                {filteredShops.map(shop => (
                  <div key={shop.shopId} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between font-prompt">
                    
                    {/* Cover Photo area with details overlaid */}
                    <div className="h-28 relative bg-slate-200 shrink-0">
                      <img src={shop.coverImage} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-2.5 left-3 text-white">
                        <span className="text-[7.5px] bg-indigo-600 text-white font-mono px-1.5 py-0.5 rounded font-black border border-indigo-400">ID: {shop.shopId}</span>
                        <h3 className="font-prompt font-black text-xs mt-1 leading-none text-white">{shop.shopName}</h3>
                        <p className="text-[8px] text-amber-300 mt-0.5">⭐ เรตติ้งจำลอง: {shop.rating} ({shop.reviewsCount} รีวิว)</p>
                      </div>

                      {/* Package ribbon badge */}
                      <div className="absolute top-2.5 right-2.5 bg-indigo-950/80 backdrop-blur-sm border border-amber-400/50 text-amber-300 font-prompt font-black text-[7.5px] px-2 py-0.5 rounded-full shadow-sm">
                        {shop.packageBadge} Agent
                      </div>
                    </div>

                    {/* Brief desc & location details */}
                    <div className="p-3 space-y-2">
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed truncate">
                        <strong>รายละเอียด:</strong> {shop.description}
                      </p>

                      <div className="flex gap-1.5 text-[9.5px] font-bold text-slate-600">
                        <MapPin size={11} className="text-indigo-600 shrink-0" />
                        <span className="truncate">{shop.location}</span>
                      </div>
                    </div>

                    {/* Bottom buttons: Toggle Verification Badge & details view */}
                    <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold">
                      
                      <div className="flex items-center gap-1">
                        <span>สถานะจำลอง:</span>
                        <button
                          onClick={() => handleToggleVerify(shop.shopId, shop.shopName, shop.verified)}
                          className={`px-2 py-1 rounded-md text-[8.5px] font-black shadow-sm transition-colors cursor-pointer ${shop.verified ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}
                        >
                          {shop.verified ? '🛡️ ยืนยันสิทธิ์' : '⚠️ ยกเลิกสิทธิ์'}
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedShopDetail(shop)}
                        className="text-indigo-600 hover:text-indigo-800 font-black text-[9.5px] flex items-center gap-0.5 active:scale-95 transition-transform"
                      >
                        ดูข้อมูลเพิ่มเติม →
                      </button>
                    </div>

                  </div>
                ))}

                {filteredShops.length === 0 && (
                  <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-4 font-prompt">
                    <p className="text-xs font-bold text-slate-400">ไม่พบข้อมูลบูธจำหน่ายที่ค้นหา</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setShopFilter('all'); }}
                      className="mt-3 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-[10px] font-black"
                    >
                      แสดงทั้งหมด
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              VIEW 5: REPORTS SCREEN (รายงาน)
              ==================================================== */}
          {activeTab === 'reports' && (
            <div className="p-4 space-y-4 animate-fade-in animate-fade-in-up" id="panel_reports">
              <div>
                <h2 className="font-prompt text-base font-black text-indigo-950">รายงานผลลัพธ์การทำงาน</h2>
                <p className="text-[10px] text-slate-400 font-medium font-prompt">สถิติสะสม ยอดจำหน่ายสลาก N3 และผลงานจำลองส่วนกลาง</p>
              </div>

              {/* Key performance metrics cards (2 columns) */}
              <div className="grid grid-cols-2 gap-3 font-prompt">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[8px] text-slate-400 font-bold block">อัตราเติบโตแพลตฟอร์ม</span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-indigo-600 font-mono">+18.5%</h3>
                    <TrendingUp className="text-indigo-600 shrink-0" size={14} />
                  </div>
                  <p className="text-[8px] text-slate-400 font-medium leading-relaxed">สูงกว่าเป้าหมายที่ตั้งไว้สะท้อนถึงการซื้อสิทธิ์ต่อเนื่อง</p>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm space-y-1">
                  <span className="text-[8px] text-slate-400 font-bold block">ดัชนีความอุ่นใจลูกค้า</span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-emerald-600 font-mono">4.85 / 5</h3>
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={14} />
                  </div>
                  <p className="text-[8px] text-slate-400 font-medium leading-relaxed">ประเมินผ่านความพึงพอใจการได้รับสลากเข้าระบบ</p>
                </div>
              </div>

              {/* Dynamic CSS Bar Chart (Gorgeously polished) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 font-prompt">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800">📊 ยอดจำหน่ายสัปดาห์ปัจจุบัน (จำลอง)</h4>
                  <span className="text-[8px] text-indigo-600 font-bold">อัปเดตเรียลไทม์</span>
                </div>
                
                <div className="flex items-end justify-between h-32 pt-2 pb-1 font-mono text-[9px]">
                  {[
                    { label: 'สัปดาห์ 1', value: 40, amt: '400k' },
                    { label: 'สัปดาห์ 2', value: 75, amt: '750k' },
                    { label: 'สัปดาห์ 3', value: 60, amt: '600k' },
                    { label: 'สัปดาห์ 4', value: 95, amt: '950k' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className="text-[8px] font-bold text-slate-400">{item.amt}</span>
                      <div className="w-6 bg-indigo-50 rounded-t-md relative h-20 overflow-hidden">
                        <div 
                          className="bg-gradient-to-t from-indigo-500 to-indigo-600 w-full absolute bottom-0 rounded-t-md transition-all duration-500" 
                          style={{ height: `${item.value}%` }}
                        ></div>
                      </div>
                      <span className="text-[8px] font-prompt text-slate-500 font-bold whitespace-nowrap">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Chart (Subscription tiers) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 font-prompt">
                <h4 className="text-xs font-black text-slate-800">👑 สัดส่วนการใช้บริการแพ็กเกจของเอเย่นต์</h4>
                
                <div className="space-y-3 text-[10px] font-bold text-slate-600">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Premium Package (โควตา 10,000 สิทธิ์)</span>
                      <span className="font-mono text-indigo-600">40%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Pro Package (โควตา 5,000 สิทธิ์)</span>
                      <span className="font-mono text-amber-500">50%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Basic Package (โควตา 2,000 สิทธิ์)</span>
                      <span className="font-mono text-slate-500">10%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Buttons CTAs */}
              <div className="space-y-2 pt-1 font-prompt">
                <button
                  onClick={() => {
                    showToast("📤 จำลอง: กำลังรวบรวมข้อมูล PDF และดาวน์โหลด...");
                  }}
                  className="w-full py-3 bg-white border-2 border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-black rounded-xl text-center active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText size={14} className="text-indigo-600" />
                  <span>ดาวน์โหลดรายงานฉบับย่อ (PDF)</span>
                </button>

                <button
                  onClick={() => {
                    showToast("🖨️ จำลอง: กำลังสั่งพิมพ์ผ่าน Wi-Fi Printer...");
                  }}
                  className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-xl text-center flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
                >
                  <span>พิมพ์สรุปรายงานงวดล่าสุด</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom 5-Tab Navigation Bar (Fixed at Bottom of Phone Frame, Purple Theme) */}
        <nav className="absolute bottom-5 left-4 right-4 bg-purple-950 text-white rounded-2xl px-1.5 py-2.5 shadow-xl flex justify-around items-center z-30 border border-purple-900">
          {[
            { id: 'overview', label: 'ภาพรวม', icon: BarChart3 },
            { id: 'approvals', label: 'อนุมัติ', icon: ShieldCheck, badge: approvals.length },
            { id: 'agents', label: 'ตัวแทน', icon: Users },
            { id: 'shops', label: 'ร้านค้า', icon: Store },
            { id: 'reports', label: 'รายงาน', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery('');
                }}
                className={`flex flex-col items-center gap-1 flex-1 relative transition-all active:scale-95 ${isActive ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="relative">
                  <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-1.5'} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[7.5px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono border border-purple-950">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[8px] font-prompt leading-none font-black">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Visual Simulated Mobile Home Indicator Bar */}
        <div className="h-5 w-full bg-slate-50 flex justify-center items-center shrink-0 relative z-30 pb-1.5 border-t border-slate-100">
          <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
        </div>

      </div>

      {/* ====================================================
          MODAL 1: SYSTEM SETTINGS OVERLAY SHEET
          ==================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-indigo-100 animate-zoom-in text-slate-800 font-prompt">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-indigo-700 flex items-center gap-1.5">
                <SettingsIcon size={16} /> ตั้งค่าระบบ (N3 Backoffice)
              </span>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Toggle 1: Auto Approval */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1">
                  <span className="block font-black text-slate-800 text-[11px]">อนุมัติตัวแทนอัตโนมัติ</span>
                  <p className="text-[9px] text-slate-400 font-medium leading-relaxed">ผ่านเกณฑ์จดทะเบียนทันทีที่ส่งเอกสาร KYC</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAutoApproval(!autoApproval);
                    showToast(`⚙️ เปลี่ยนระบบอนุมัติอัตโนมัติเป็น: ${!autoApproval ? "เปิดใช้งาน" : "ปิดการใช้งาน"}`, 'info');
                  }}
                  className={`w-12 h-6.5 rounded-full transition-all relative p-0.5 cursor-pointer ${autoApproval ? "bg-indigo-600" : "bg-slate-200"}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${autoApproval ? "translate-x-5.5" : "translate-x-0"}`}></div>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-[11px] font-black text-slate-800">
                  <span>อัตราส่วนแบ่งคอมมิชชันตัวแทน</span>
                  <span className="text-indigo-600 font-mono">{commissionRate}% จากยอด</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="15"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseInt(e.target.value))}
                  onMouseUp={() => showToast(`⚙️ ปรับคอมมิชชันเป็น: ${commissionRate}%`, 'info')}
                  className="w-full accent-indigo-600 h-1.5 rounded-lg bg-slate-100 cursor-pointer"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-[11px] font-black text-slate-800">
                  <span>โควตาสำรองพื้นฐานร้านค้า (Basic)</span>
                  <span className="text-indigo-600 font-mono">{quotaCap.toLocaleString()} ใบ</span>
                </div>
                <input 
                  type="range"
                  min="1000"
                  max="5000"
                  step="500"
                  value={quotaCap}
                  onChange={(e) => setQuotaCap(parseInt(e.target.value))}
                  onMouseUp={() => showToast(`⚙️ ปรับโควตาสำรองพื้นฐานเป็น: ${quotaCap.toLocaleString()} ใบ`, 'info')}
                  className="w-full accent-indigo-600 h-1.5 rounded-lg bg-slate-100 cursor-pointer"
                />
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-[10px] text-amber-900 leading-normal font-medium">
                ⚠️ <strong>บันทึกระบบ:</strong> ข้อมูลสิทธิ์สลากทั้งหมดจะถูกบันทึกสำรองในไฟล์ data.ts บนเซิร์ฟเวอร์จำลอง ทุกครั้งที่มีการแก้ไข
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer text-center block"
            >
              บันทึกการปรับตั้งค่า
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: MEMBERS & CUSTOMERS LIST OVERLAY SHEET
          ==================================================== */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-indigo-100 animate-zoom-in text-slate-800 font-prompt">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-indigo-700 flex items-center gap-1.5">
                <Users size={16} /> สมาชิกผู้ซื้อสลาก ({customers.length} คน)
              </span>
              <button 
                onClick={() => setShowMembersModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Scrollable list inside modal */}
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 scrollbar-none">
              {customers.map(cust => (
                <div key={cust.customerId} className="bg-slate-50 border p-3 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-1.5 py-0.5 rounded font-mono">CUST-ID: {cust.customerId}</span>
                    <span className="text-[9px] font-bold text-indigo-700">จองรวม: {cust.historyCount} ครั้ง</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{cust.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">เบอร์โทร: {cust.phone}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
                    <span className="text-[8px] font-bold text-slate-400 self-center">ร้านโปรด:</span>
                    {cust.favoriteShops.map(fs => (
                      <span key={fs} className="bg-white border px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-600">
                        {fs === 'shop1' ? 'ร้านเจ๊นุช' : fs === 'shop2' ? 'สมชาย N3' : fs === 'shop3' ? 'บ้านสลาก N3' : 'โชคดี N3'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowMembersModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs rounded-xl cursor-pointer text-center block"
            >
              ปิดหน้ารายการนี้
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 3: ADDONS LIST AND TOGGLE MODAL
          ==================================================== */}
      {showAddonsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-indigo-100 animate-zoom-in text-slate-800 font-prompt">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-indigo-700 flex items-center gap-1.5">
                <Plus size={16} /> บริการเสริม (Addon Services)
              </span>
              <button 
                onClick={() => setShowAddonsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* List add-on services with quick interactive switch toggling */}
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 scrollbar-none">
              {addOnServices.map((addon, index) => (
                <div key={index} className="bg-slate-50 border p-3 rounded-2xl space-y-2 text-xs flex flex-col justify-between">
                  <div className="flex justify-between items-center gap-1">
                    <h4 className="font-black text-slate-800 truncate max-w-[170px]">{addon.serviceName}</h4>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${addon.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
                      {addon.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-medium">{addon.description}</p>
                  
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center font-mono">
                    <span className="text-[11px] font-black text-indigo-600">฿{addon.price} / งวด</span>
                    <button
                      onClick={() => handleToggleAddonStatus(addon.serviceName, addon.status)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black border cursor-pointer ${addon.status === 'Active' ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700'}`}
                    >
                      {addon.status === 'Active' ? '⏸️ ปิดชั่วคราว' : '▶️ เปิดใช้งาน'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddonsModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs rounded-xl cursor-pointer text-center block"
            >
              ปิดเมนูบริการเสริม
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 4: AGENT PROFILE VIEW DETAIL
          ==================================================== */}
      {selectedAgentProfile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-indigo-100 animate-zoom-in text-slate-800 font-prompt">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-indigo-700 flex items-center gap-1.5">
                <User size={16} /> รายละเอียดโปรไฟล์ตัวแทนจำหน่าย
              </span>
              <button 
                onClick={() => setSelectedAgentProfile(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Profile layout */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-3 text-xs border relative">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400 font-bold">รหัสประจำตัว:</span>
                <span className="font-mono text-slate-800 font-black">{selectedAgentProfile.agentId}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">ชื่อจุดจำหน่าย:</span>
                  <span className="text-slate-900 font-black">{selectedAgentProfile.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">ชื่อผู้ประกอบการ:</span>
                  <span className="text-slate-900 font-black">{selectedAgentProfile.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">ระดับแพ็กเกจ:</span>
                  <span className="text-indigo-600 font-black bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{selectedAgentProfile.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">ยอดขายรวมวันนี้:</span>
                  <span className="text-emerald-600 font-mono font-bold">฿{selectedAgentProfile.todaySales.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">จำนวนลูกค้าสแกน:</span>
                  <span className="text-slate-800 font-mono font-bold">{selectedAgentProfile.totalCustomers} ราย</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">สถานะทำงาน:</span>
                  <span className="text-slate-800 font-bold">{selectedAgentProfile.status}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed space-y-1.5">
                <p className="text-[10px] text-slate-400">📞 ช่องทางจำลองการติดต่อกลับของระบบ:</p>
                <p className="font-mono text-[10.5px] font-black text-slate-700 bg-white p-2 rounded-lg border">โทร: 089-{Math.floor(100 + Math.random()*900)}-{Math.floor(1000 + Math.random()*9000)}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedAgentProfile(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs rounded-xl cursor-pointer text-center block"
            >
              ปิดหน้าโปรไฟล์
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 5: SHOP VIEW DETAIL
          ==================================================== */}
      {selectedShopDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-indigo-100 animate-zoom-in text-slate-800 font-prompt">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-indigo-700 flex items-center gap-1.5">
                <Store size={16} /> รายละเอียดจุดบูธบริการจำหน่าย
              </span>
              <button 
                onClick={() => setSelectedShopDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Shop layout details */}
            <div className="space-y-3 text-xs">
              <img src={selectedShopDetail.coverImage} className="w-full h-24 object-cover rounded-xl border shrink-0" alt="" />
              
              <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 border">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">ชื่อบูธหลัก:</span>
                  <span className="text-slate-900 font-black">{selectedShopDetail.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">จังหวัด / พื้นที่บริการ:</span>
                  <span className="text-slate-900 font-black text-right">{selectedShopDetail.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">เบอร์โทรศัพท์:</span>
                  <span className="text-slate-800 font-mono font-bold">{selectedShopDetail.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">เวลาเปิดทำการ:</span>
                  <span className="text-slate-800 font-mono font-bold">{selectedShopDetail.openTime} - {selectedShopDetail.closeTime} น.</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-slate-400 font-bold block mb-1">คำอธิบายเพิ่มเติม:</span>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed font-medium">{selectedShopDetail.description}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedShopDetail(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs rounded-xl cursor-pointer text-center block"
            >
              ปิดหน้าข้อมูลร้าน
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 6: SEND REQUEST MORE INFO DIALOG MODAL
          ==================================================== */}
      {showRequestInfoId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-indigo-100 animate-zoom-in text-slate-800 font-prompt">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-indigo-700 flex items-center gap-1.5">
                <FileCheck size={16} /> ขอเอกสารหรือข้อมูลเพิ่มเติม
              </span>
              <button 
                onClick={() => { setShowRequestInfoId(null); setRequestInfoText(''); }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 font-medium">ระบุสิ่งที่ท่านต้องการส่งคำขอไปถึงเอเย่นต์ผู้สมัครคนดังกล่าว:</p>
              
              <textarea
                value={requestInfoText}
                onChange={(e) => setRequestInfoText(e.target.value)}
                placeholder="เช่น 'ขอสำเนารายการจดทะเบียนบูธปากเกร็ดงวดก่อนหน้านี้ด้วยค่ะ เพื่ออัพเดทโควตา'"
                className="w-full text-xs font-prompt font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 h-24 outline-none focus:border-indigo-500 focus:bg-white resize-none transition-all placeholder:text-slate-400 shadow-inner"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setShowRequestInfoId(null); setRequestInfoText(''); }}
                className="px-4 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (!requestInfoText.trim()) {
                    showToast("⚠️ กรุณาระบุข้อความรายละเอียดด้วยค่ะ", "warning");
                    return;
                  }
                  showToast(`✓ ส่งคำขอข้อมูลเพิ่มเติมไปยังผู้ใช้เรียบร้อย`, 'success');
                  setShowRequestInfoId(null);
                  setRequestInfoText('');
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer text-center block"
              >
                ส่งความประสงค์
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
