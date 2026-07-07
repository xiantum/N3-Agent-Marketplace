import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  TrendingUp, 
  Search, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  Phone, 
  Check, 
  Store, 
  X, 
  FileText,
  AlertCircle,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  ThumbsUp,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  Download,
  Printer,
  BellRing,
  Heart,
  Send
} from 'lucide-react';
import { mockOrders } from '../data';
import { AgentTab, Order } from '../types';

interface AgentViewProps {
  onBackToRoles: () => void;
  agentAccounts?: any[];
  onUpdateAgentAccounts?: (accounts: any[]) => void;
  loggedInAgentPhone?: string | null;
  onSetLoggedInAgentPhone?: (phone: string | null) => void;
}

export default function AgentView({ 
  onBackToRoles,
  agentAccounts = [],
  onUpdateAgentAccounts = () => {},
  loggedInAgentPhone = null,
  onSetLoggedInAgentPhone = () => {}
}: AgentViewProps) {
  const currentAgent = agentAccounts.find(acc => acc.phone === loggedInAgentPhone) || null;

  // Navigation State
  const [activeTab, setActiveTab] = useState<AgentTab>('home');
  const [orderFilter, setOrderFilter] = useState<'pending' | 'processing' | 'success'>('pending');
  const [customerTabFilter, setCustomerTabFilter] = useState<'all' | 'regular' | 'new'>('all');
  const [customerSearch, setCustomerSearch] = useState('');
  
  // Custom interactive states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState<string>('pro'); // default is Pro
  const [storeStatusOpen, setStoreStatusOpen] = useState<boolean>(true); // Store open/closed toggle
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false); // Store preview mode toggle
  const [reportPeriod, setReportPeriod] = useState<'today' | 'period' | 'month' | 'custom'>('period');
  
  // Store management form inputs (Thai, senior-friendly, large fields)
  const [storeName, setStoreName] = useState('ร้านเจ๊แมว N3');
  const [storeDesc, setStoreDesc] = useState('ศูนย์รวมสลากกินแบ่งและเลข N3 แท้ 100% จัดส่งรวดเร็ว ปลอดภัย ได้โควตาตรงจากรัฐบาล มั่นใจบริการเป็นกันเอง');
  const [storeHours, setStoreHours] = useState('เปิดบริการทุกวัน 07:00 น. - 21:00 น.');
  const [storePhone, setStorePhone] = useState('089-124-5124');
  const [storeArea, setStoreArea] = useState('บริการจัดส่งฟรีในเขตหนองแขมและพื้นที่ใกล้เคียงใน 5 กม.');

  // Sync inputs with logged in agent
  React.useEffect(() => {
    if (currentAgent) {
      setStoreName(currentAgent.shopName || 'ร้านเจ๊แมว N3');
      setStoreDesc(currentAgent.desc || 'ศูนย์รวมสลากกินแบ่งและเลข N3 แท้ 100% จัดส่งรวดเร็ว ปลอดภัย ได้โควตาตรงจากรัฐบาล มั่นใจบริการเป็นกันเอง');
      setStoreHours(currentAgent.hours || 'เปิดบริการทุกวัน 07:00 น. - 21:00 น.');
      setStorePhone(currentAgent.shopPhone || '089-124-5124');
      setStoreArea(currentAgent.area || 'บางใหญ่, นนทบุรี');
    }
  }, [loggedInAgentPhone, currentAgent]);

  // Auth / Reg screens states
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3 | 4>(1);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Reg form states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [regShopName, setRegShopName] = useState('');
  const [regArea, setRegArea] = useState('');
  const [regHours, setRegHours] = useState('เปิดบริการทุกวัน 07:00 - 21:00 น.');
  const [regShopPhone, setRegShopPhone] = useState('');
  const [regDesc, setRegDesc] = useState('ศูนย์รวมสลากกินแบ่งและเลข N3 แท้ 100% จัดส่งรวดเร็ว ปลอดภัย ได้โควตาตรงจากรัฐบาล มั่นใจบริการเป็นกันเอง');

  const [uploadedDocs, setUploadedDocs] = useState({
    idCard: false,
    idCardWithFace: false,
    agentLicense: false,
    shopPhoto: false
  });

  const [confirmInfoCorrect, setConfirmInfoCorrect] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  
  // Status check for approved agent
  const [hasAcknowledgedApproval, setHasAcknowledgedApproval] = useState(() => {
    if (loggedInAgentPhone) {
      return localStorage.getItem(`n3_approved_ack_${loggedInAgentPhone}`) === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    if (loggedInAgentPhone) {
      setHasAcknowledgedApproval(localStorage.getItem(`n3_approved_ack_${loggedInAgentPhone}`) === 'true');
    } else {
      setHasAcknowledgedApproval(false);
    }
  }, [loggedInAgentPhone]);

  const handleEnterDashboard = () => {
    if (loggedInAgentPhone) {
      localStorage.setItem(`n3_approved_ack_${loggedInAgentPhone}`, 'true');
      setHasAcknowledgedApproval(true);
      showToast("🎉 ยินดีต้อนรับเข้าสู่แผงจัดการตัวแทน N3!");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setAuthError('⚠️ กรุณากรอกเบอร์โทรศัพท์/อีเมล และรหัสผ่าน');
      return;
    }

    const found = agentAccounts.find(
      acc => (acc.phone === loginPhone || acc.email === loginPhone) && acc.password === loginPassword
    );

    if (found) {
      onSetLoggedInAgentPhone(found.phone);
      setLoginPhone('');
      setLoginPassword('');
      showToast(`🔓 เข้าสู่ระบบสำเร็จ: ${found.name}`);
    } else {
      setAuthError('❌ เบอร์โทรศัพท์ อีเมล หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleNextStep1 = () => {
    setAuthError(null);
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setAuthError('⚠️ กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน');
      return;
    }
    const phoneRegex = /^0\d{8,9}$/;
    if (!phoneRegex.test(regPhone.replace(/[- ]/g, ''))) {
      setAuthError('⚠️ กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0891234567)');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('⚠️ รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (agentAccounts.some(acc => acc.phone === regPhone)) {
      setAuthError('⚠️ เบอร์โทรศัพท์นี้ถูกใช้ลงทะเบียนเป็นตัวแทนอื่นแล้ว');
      return;
    }
    setRegisterStep(2);
  };

  const handleNextStep2 = () => {
    setAuthError(null);
    if (!regShopName.trim() || !regArea.trim() || !regHours.trim() || !regShopPhone.trim() || !regDesc.trim()) {
      setAuthError('⚠️ กรุณากรอกข้อมูลร้านตัวแทนให้ครบถ้วน');
      return;
    }
    setRegisterStep(3);
  };

  const handleNextStep3 = () => {
    setAuthError(null);
    if (!uploadedDocs.idCard || !uploadedDocs.idCardWithFace || !uploadedDocs.agentLicense || !uploadedDocs.shopPhoto) {
      setAuthError('⚠️ กรุณาอัปโหลดเอกสารยืนยันตัวตนให้ครบถ้วนทุกรายการ');
      return;
    }
    setRegisterStep(4);
  };

  const handleSubmitRegister = () => {
    setAuthError(null);
    if (!confirmInfoCorrect) {
      setAuthError('⚠️ กรุณากดยอมรับว่าข้อมูลทั้งหมดถูกต้องและเป็นความจริง');
      return;
    }

    const newAgentId = `AG-00${1245 + agentAccounts.length}`;
    const newAccount = {
      id: newAgentId,
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      shopName: regShopName,
      area: regArea,
      hours: regHours,
      shopPhone: regShopPhone,
      desc: regDesc,
      status: 'Pending Review',
      level: 'Basic',
      submittedAt: new Date().toLocaleDateString('th-TH') + ' • ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      notes: '',
      documents: {
        idCard: 'uploaded',
        idCardWithFace: 'uploaded',
        agentLicense: 'uploaded',
        shopPhoto: 'uploaded',
      }
    };

    onUpdateAgentAccounts([...agentAccounts, newAccount]);
    onSetLoggedInAgentPhone(regPhone);
    
    // Reset inputs
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegShopName('');
    setRegArea('');
    setRegHours('เปิดบริการทุกวัน 07:00 - 21:00 น.');
    setRegShopPhone('');
    setRegDesc('ศูนย์รวมสลากกินแบ่งและเลข N3 แท้ 100% จัดส่งรวดเร็ว ปลอดภัย ได้โควตาตรงจากรัฐบาล มั่นใจบริการเป็นกันเอง');
    setUploadedDocs({ idCard: false, idCardWithFace: false, agentLicense: false, shopPhoto: false });
    setConfirmInfoCorrect(false);
    setRegisterStep(1);
    setAuthScreen('login');
    showToast('🚀 ส่งใบสมัครตัวแทนสำเร็จ! กรุณารอตรวจสอบเอกสาร');
  };

  const handleLogout = () => {
    onSetLoggedInAgentPhone(null);
    setAuthScreen('login');
    showToast('🔒 ออกจากระบบตัวแทนเรียบร้อย');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Mock Customers Data optimized for senior-friendliness
  const mockCustomers = [
    { id: 'c1', name: 'คุณนลินี รักดี', phone: '089-765-4321', level: 'ทอง', notes: 'ชอบซื้อเลขเบิ้ล ท้าย 3 ตัวตรง', orderCount: 12, lastOrder: '123', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop' },
    { id: 'c2', name: 'คุณวิภาดา แสนดี', phone: '081-333-4444', level: 'ใหม่', notes: 'สะดวกจ่ายผ่านคิวอาร์โอนเงิน', orderCount: 3, lastOrder: '789', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop' },
    { id: 'c3', name: 'คุณสมเกียรติ ยอดเยี่ยม', phone: '086-555-6666', level: 'ทอง', notes: 'ชอบบริการจัดส่งเช้าตรู่', orderCount: 25, lastOrder: '555', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
    { id: 'c4', name: 'คุณป้าอรวรรณ ใฝ่ดี', phone: '082-444-5555', level: 'ทอง', notes: 'เน้นคุยโทรศัพท์ สั่งทีละหลายใบ', orderCount: 42, lastOrder: '999', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=150&auto=format&fit=crop' }
  ];

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.phone.includes(customerSearch);
    const matchesTab = 
      customerTabFilter === 'all' ||
      (customerTabFilter === 'regular' && customer.level === 'ทอง') ||
      (customerTabFilter === 'new' && customer.level === 'ใหม่');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-0 md:p-6 font-sans antialiased text-slate-800">
      
      {/* CENTER: Mobile Frame Mockup (390px iPhone-first container) */}
      <div className="w-full max-w-[390px] min-h-screen md:min-h-[820px] md:h-[820px] bg-slate-50 md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800 overflow-hidden flex flex-col justify-between relative transition-all">
        
        {/* Top App Status Bar (Simulating Native Mobile App Top Status) */}
        <div className={`text-white px-5 pt-2 pb-1 flex justify-between items-center text-[11px] font-semibold select-none z-30 shrink-0 transition-all ${isPreviewMode ? 'bg-blue-700' : 'bg-emerald-800'}`}>
          <span className="font-mono">09:41 น.</span>
          <div className={`w-16 h-3.5 rounded-full flex items-center justify-center opacity-60 ${isPreviewMode ? 'bg-blue-800' : 'bg-emerald-950'}`}>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4.5 h-2.5 border border-white/80 rounded-[3px] p-[1.5px] flex items-center">
              <div className="h-full w-3 bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {isPreviewMode ? (
          /* PREVIEW MODE SCREEN - CUSTOMER SHOP DETAIL PREVIEW */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative font-prompt">
            
            {/* Top Label Banner */}
            <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-[11px] font-semibold shrink-0 z-20 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Preview Mode: มุมมองที่ลูกค้าเห็น
              </span>
              <button 
                onClick={() => {
                  setIsPreviewMode(false);
                  showToast("✏️ กลับมาแก้ไขข้อมูลร้านค้าต่อ");
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-black transition-all active:scale-95"
              >
                กลับไปแก้ไขร้าน
              </button>
            </div>

            {/* A. Header แบบลูกค้า */}
            <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-md z-20 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <button 
                  onClick={() => {
                    setIsPreviewMode(false);
                    showToast("✏️ กลับมาแก้ไขข้อมูลร้านค้าต่อ");
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-white shrink-0"
                  title="กลับไปแก้ไขร้าน"
                >
                  <ArrowLeft size={18} className="stroke-[2.5px]" />
                </button>
                <div className="min-w-0">
                  <h1 className="font-prompt text-xs font-black tracking-tight leading-none text-amber-300">ตัวอย่างหน้าร้าน (มุมมองลูกค้า)</h1>
                  <h2 className="font-prompt text-sm font-black tracking-tight leading-none text-white mt-1 truncate">{storeName}</h2>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => showToast("❤️ กดติดตาม/บันทึกร้านเป็นร้านโปรดแล้ว (ระบบจำลองสำหรับลูกค้า)")}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Heart size={16} className="text-white fill-none stroke-[2.5px]" />
                </button>
                <button 
                  onClick={() => showToast("🔗 จำลองการคัดลอกลิงก์ร้านเพื่อแชร์ไปยัง LINE")}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </header>

            {/* Scrollable Shop Content */}
            <div className="flex-1 overflow-y-auto pb-28">
              
              {/* B. Hero section ร้าน */}
              <div className="relative h-44 bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=600" 
                  className="w-full h-full object-cover" 
                  alt="Shop Cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                
                {/* Profile Pic Floating */}
                <div className="absolute -bottom-4 left-4 flex items-end gap-3 z-10">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-md relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" 
                      className="w-full h-full object-cover" 
                      alt="Shop Profile" 
                    />
                  </div>
                  <div className="mb-4 text-white drop-shadow-md">
                    <h3 className="font-prompt text-base font-black leading-tight text-white">{storeName}</h3>
                    <p className="text-[9px] text-blue-100 font-medium font-prompt flex items-center gap-0.5 mt-0.5">
                      <MapPin size={10} className="text-blue-300" />
                      {storeArea || "ไม่ได้ระบุพื้นที่บริการ"}
                    </p>
                  </div>
                </div>

                {/* Status Badges Overlayed on Hero Top Right */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black shadow-md border ${
                    storeStatusOpen 
                      ? 'bg-emerald-500 text-white border-emerald-400' 
                      : 'bg-rose-500 text-white border-rose-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-white ${storeStatusOpen ? 'animate-ping' : ''}`}></span>
                    {storeStatusOpen ? 'เปิดรับออเดอร์' : 'ปิดร้านชั่วคราว'}
                  </span>
                  
                  <div className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-prompt font-black shadow-md flex items-center gap-0.5 border border-white/20">
                    ⭐ 4.8 <span className="text-[8px] text-slate-600 font-bold">(92 รีวิว)</span>
                  </div>
                </div>
              </div>

              {/* Extra spacing for floated avatar */}
              <div className="h-6"></div>

              {/* Badges of trust */}
              <div className="px-4 py-1 flex flex-wrap gap-1.5">
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[9px] font-bold flex items-center gap-0.5">
                  <ShieldCheck size={11} className="text-blue-600" />
                  ยืนยันตัวตนแล้ว
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-[9px] font-bold">
                  👑 Pro Agent
                </span>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[9px] font-bold flex items-center gap-0.5">
                  ⚡ ตอบไว
                </span>
              </div>

              {/* Details sections */}
              <div className="p-4 space-y-4">
                
                {/* Trust Certificate Banner */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-3.5 flex gap-3 items-start shadow-sm">
                  <ShieldCheck size={24} className="text-blue-600 fill-blue-50 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="font-prompt text-xs font-black text-blue-900">ตัวแทนจำหน่ายที่ได้รับอนุญาตอย่างเป็นทางการ</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-prompt">
                      ผ่านการลงทะเบียนรับรองสิทธิ์จำลองสลาก N3 มั่นใจในความปลอดภัยและบริการเป็นกันเอง
                    </p>
                  </div>
                </div>

                {/* C. ข้อมูลร้าน */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                  <h3 className="font-prompt text-xs font-black text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-1.5">
                    📢 ข้อมูลเกี่ยวกับร้านค้า
                  </h3>
                  
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-slate-400">คำอธิบายร้านค้า</span>
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                        {storeDesc || "ศูนย์รวมสลากกินแบ่งและเลข N3 แท้ 100% บริการดีเยี่ยมเป็นกันเอง"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1.5 border-t border-slate-100">
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-slate-400">เวลาทำการ</span>
                        <p className="text-xs text-slate-800 font-bold">
                          {storeHours || "เปิดทำการทุกวัน 07:00 - 21:00 น."}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="block text-[9px] font-bold text-slate-400">พื้นที่ให้บริการ</span>
                        <p className="text-xs text-slate-800 font-bold">
                          {storeArea || "ทุกพื้นที่ทั่วไทย"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1.5 border-t border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400">ช่องทางติดต่อหลัก / LINE ID</span>
                      <p className="text-xs text-slate-900 font-bold font-mono bg-slate-50 px-2.5 py-1.5 rounded-lg border flex justify-between items-center">
                        <span>{storePhone || "089-124-5124"}</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-prompt">ติดต่อร้าน</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* D. จุดเด่นร้าน */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-prompt text-xs font-black text-slate-800 border-b border-slate-150 pb-2">
                    ✨ จุดเด่นและคุณสมบัติของร้าน
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-700">เปิดบริการทุกวัน</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-700">ตอบกลับเร็วทันใจ</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-700">ยืนยันตัวตนระดับ Pro</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-700">ช่วยแนะนำเลือกเลข</span>
                    </div>
                  </div>
                </div>

                {/* E. เลขแนะนำ / เลขยอดนิยม */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                    <h3 className="font-prompt text-xs font-black text-slate-800 flex items-center gap-1">
                      🔥 เลขแนะนำ / เลขยอดนิยมประจำงวด
                    </h3>
                    <span className="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">HOT</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['123', '168', '789', '999', '555'].map((num) => (
                      <button 
                        key={num}
                        onClick={() => showToast(`🎯 คุณเลือกเลขแนะนำ: ${num} เรียบร้อยแล้ว (จำลอง)`)}
                        className="bg-gradient-to-b from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 border border-blue-200 rounded-xl px-3.5 py-2 font-mono font-black text-sm text-blue-800 transition-all active:scale-95 shadow-xs shrink-0 flex items-center gap-1"
                      >
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Statistics block */}
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-center space-y-1">
                  <span className="block text-[9px] font-prompt font-bold text-slate-400 uppercase">สถิติและความน่าเชื่อถือโดยสังเขป</span>
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <div>
                      <span className="block text-[8px] font-prompt font-bold text-slate-400">เวลาตอบกลับโดยประมาณ</span>
                      <span className="font-prompt text-xs font-black text-slate-800">~ 2 นาที</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-prompt font-bold text-slate-400">ลูกค้าที่ใช้บริการแล้ว</span>
                      <span className="font-prompt text-xs font-black text-slate-800">148 คน</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* F. ปุ่มหลักด้านล่าง */}
            <div className="absolute bottom-5 left-4 right-4 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xl flex gap-2 z-30 shrink-0">
              <button
                type="button"
                onClick={() => showToast(`📞 จำลองระบบโทรศัพท์ติดต่อสอบถาม: ${storePhone || "089-124-5124"}`)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-prompt font-black text-xs rounded-xl border border-slate-200 transition-all active:scale-95 text-center"
              >
                สอบถามร้านค้า
              </button>
              <button
                type="button"
                onClick={() => showToast("🛒 ระบบจำลอง: เริ่มต้นการเลือกซื้อเลข N3 กับร้านค้านี้ในมุมมองผู้ซื้อ")}
                className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:brightness-105 text-white font-prompt font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.97] text-center border border-blue-500"
              >
                เลือกเลข N3 กับร้านนี้
              </button>
            </div>

          </div>
        ) : !currentAgent ? (
          /* AGENT REGISTER / LOGIN FLOW */
          authScreen === 'login' ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative font-prompt">
              {/* Header */}
              <header className="bg-emerald-800 text-white px-4 py-4 flex items-center justify-between shadow-md shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center border border-white/20 shadow-inner shrink-0">N3</div>
                  <div>
                    <h1 className="text-sm font-black tracking-tight leading-none text-white">ระบบตัวแทนขาย</h1>
                    <p className="text-[9px] text-emerald-100 font-medium mt-1">N3 Agent Marketplace</p>
                  </div>
                </div>
                <button 
                  onClick={onBackToRoles}
                  className="text-[10px] font-black bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-lg transition-colors active:scale-95 shrink-0"
                >
                  เปลี่ยนบทบาท
                </button>
              </header>

              {/* Login Form Scroll Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 shadow-xs text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                    <Store size={28} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-base leading-snug">เข้าสู่ระบบตัวแทน</h2>
                    <p className="text-slate-400 text-[10px] font-semibold mt-1 leading-relaxed">
                      เข้าสู่ระบบเพื่อจัดการร้าน ออเดอร์ ลูกค้า และรายงานของคุณ
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {authError && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs font-black flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">เบอร์โทรศัพท์ / อีเมล</label>
                    <input 
                      type="text"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="กรอกเบอร์โทรศัพท์ เช่น 0891235124"
                      className="w-full px-4 py-3.5 border-2 border-slate-200 focus:border-emerald-500 bg-white rounded-2xl text-xs font-bold outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">รหัสผ่าน</label>
                    <input 
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="กรอกรหัสผ่าน (เช่น 123456)"
                      className="w-full px-4 py-3.5 border-2 border-slate-200 focus:border-emerald-500 bg-white rounded-2xl text-xs font-bold outline-none transition-colors"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => showToast("💡 รหัสผ่านทดสอบคือ 123456 ทุกบัญชี")}
                      className="text-[10px] font-black text-slate-400 hover:text-slate-600 underline"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck size={16} className="stroke-[2.5px]" />
                    <span>เข้าสู่ระบบตัวแทน</span>
                  </button>
                </form>

                {/* Switch to register */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl text-center space-y-3">
                  <div className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                    <strong>ยังไม่มีบัญชีตัวแทนจำหน่าย?</strong><br />
                    สมัครตัวแทนใหม่เพื่อเปิดรับยอดจองสลากดิจิทัลจำลองจากในพื้นที่ชุมชน
                  </div>
                  <button 
                    onClick={() => {
                      setAuthScreen('register');
                      setRegisterStep(1);
                      setAuthError(null);
                    }}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 cursor-pointer border border-amber-500"
                  >
                    สมัครตัวแทนใหม่
                  </button>
                </div>

                {/* Guide Mock accounts */}
                <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-left">
                  <span className="text-[9px] font-black text-slate-600 block">💡 บัญชีจำลองสำหรับร่วมทดสอบ:</span>
                  <div className="space-y-1.5 text-[9px] text-slate-500 font-bold leading-relaxed font-mono">
                    <div>
                      <span className="text-emerald-700 font-black">● อนุมัติแล้ว (Approved)</span><br />
                      เบอร์: <span className="text-slate-800 font-black">089-123-5124</span> | รหัส: <span className="text-slate-800">123456</span>
                    </div>
                    <div className="border-t border-slate-200/60 pt-1">
                      <span className="text-amber-700 font-black">● รอแอดมินตรวจ (Pending)</span><br />
                      เบอร์: <span className="text-slate-800 font-black">088-222-3333</span> | รหัส: <span className="text-slate-800">123456</span>
                    </div>
                    <div className="border-t border-slate-200/60 pt-1">
                      <span className="text-rose-700 font-black">● ต้องแก้ไข (Need Edit)</span><br />
                      เบอร์: <span className="text-slate-800 font-black">087-111-2222</span> | รหัส: <span className="text-slate-800">123456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* REGISTER FLOW SCREENS */
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative font-prompt">
              {/* Header */}
              <header className="bg-emerald-800 text-white px-4 py-4 flex items-center justify-between shadow-md shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center border border-white/20 shadow-inner shrink-0">N3</div>
                  <h1 className="text-sm font-black tracking-tight leading-none text-white">ลงทะเบียนสมัครตัวแทน</h1>
                </div>
                <button 
                  onClick={() => setAuthScreen('login')}
                  className="text-[10px] font-black bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-lg transition-colors active:scale-95 shrink-0"
                >
                  เข้าสู่ระบบ
                </button>
              </header>

              {/* Scrollable Registration Form Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 relative">
                {/* Step indicator header */}
                {registerStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-3 shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                          ขั้นตอนที่ 1 จาก 4
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">สมัครบัญชีตัวแทน</span>
                      </div>
                      <h2 className="font-black text-slate-900 text-base leading-tight">กรอกข้อมูลบัญชีผู้ใช้งาน</h2>
                      {/* Progress pill bar */}
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(s => (
                          <div 
                            key={s} 
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= 1 ? 'bg-emerald-600' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {authError && (
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs font-black flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">ชื่อ-นามสกุล</label>
                        <input 
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="เช่น นายรักดี ยิ่งชีพ"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">เบอร์โทรศัพท์ผู้ติดต่อ</label>
                        <input 
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="เช่น 089xxxxxxx"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">อีเมลบัญชี</label>
                        <input 
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="เช่น user@email.com"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">ตั้งรหัสผ่านบัญชี</label>
                        <input 
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="กำหนดรหัสผ่าน (6 ตัวขึ้นไป)"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">ยืนยันรหัสผ่านอีกครั้ง</label>
                        <input 
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="กรอกรหัสผ่านตรงกับช่องด้านบน"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button 
                        onClick={() => setAuthScreen('login')}
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black text-center"
                      >
                        ย้อนกลับ
                      </button>
                      <button 
                        onClick={handleNextStep1}
                        className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>ถัดไป</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-3 shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                          ขั้นตอนที่ 2 จาก 4
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">ข้อมูลร้านตัวแทน</span>
                      </div>
                      <h2 className="font-black text-slate-900 text-base leading-tight">กรอกรายละเอียดร้านค้า</h2>
                      {/* Progress pill bar */}
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(s => (
                          <div 
                            key={s} 
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {authError && (
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs font-black flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">ชื่อร้านตัวแทนจำหน่าย</label>
                        <input 
                          type="text"
                          value={regShopName}
                          onChange={(e) => setRegShopName(e.target.value)}
                          placeholder="เช่น ร้านเจ๊แมว N3"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">พื้นที่ให้บริการ / ทำเลที่ตั้ง</label>
                        <input 
                          type="text"
                          value={regArea}
                          onChange={(e) => setRegArea(e.target.value)}
                          placeholder="เช่น บางใหญ่, นนทบุรี"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">เวลาเปิด-ปิดร้าน</label>
                        <input 
                          type="text"
                          value={regHours}
                          onChange={(e) => setRegHours(e.target.value)}
                          placeholder="เช่น เปิดบริการทุกวัน 07:00 - 21:00 น."
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">เบอร์โทรร้าน หรือ LINE ID</label>
                        <input 
                          type="text"
                          value={regShopPhone}
                          onChange={(e) => setRegShopPhone(e.target.value)}
                          placeholder="เช่น 089-124-5124"
                          className="w-full px-3.5 py-3 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-slate-700 block">คำอธิบายร้านสั้นๆ</label>
                        <textarea 
                          value={regDesc}
                          onChange={(e) => setRegDesc(e.target.value)}
                          placeholder="เช่น ตัวแทนจำหน่ายสลากดิจิทัลแท้ มั่นใจในบริการ ช่วยเหลือคนชราทำรายการฟรี"
                          rows={3}
                          className="w-full px-3.5 py-2.5 border-2 border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-bold outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button 
                        onClick={() => setRegisterStep(1)}
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black text-center"
                      >
                        ย้อนกลับ
                      </button>
                      <button 
                        onClick={handleNextStep2}
                        className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>ถัดไป</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-3 shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                          ขั้นตอนที่ 3 จาก 4
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">เอกสารแนบ (KYC)</span>
                      </div>
                      <h2 className="font-black text-slate-900 text-base leading-tight">อัปโหลดเอกสารยืนยันตัวตน</h2>
                      {/* Progress pill bar */}
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(s => (
                          <div 
                            key={s} 
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-[10px] text-emerald-900 font-bold leading-relaxed">
                      💡 สัญญาสิทธิ์จำหน่ายสลากดิจิทัลจำลอง และเอกสารประจำตัวจะได้รับการคุ้มครองสิทธิ์และความปลอดภัย
                    </div>
                    {authError && (
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs font-black flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {[
                        { key: 'idCard', name: '1. รูปบัตรประชาชน (ID Card)', desc: 'เห็นชื่อ-นามสกุล และเลขประจำตัวชัดเจน' },
                        { key: 'idCardWithFace', name: '2. รูปถ่ายคู่กับบัตรประชาชน', desc: 'รูปเซลฟี่ถือบัตรประชาชนข้างใบหน้าของคุณเพื่อตรวจสอบตัวตน' },
                        { key: 'agentLicense', name: '3. ใบประกาศ/หลักฐานตัวแทน N3', desc: 'หลักฐานจดทะเบียนหรือใบสัญญาตัวแทนจำหน่ายจำลอง' },
                        { key: 'shopPhoto', name: '4. รูปถ่ายหน้าร้าน / จุดบริการ', desc: 'แผงค้า บอร์ดจุดวาง สัญลักษณ์จำหน่ายของร้าน' }
                      ].map((doc) => {
                        const isUploaded = (uploadedDocs as any)[doc.key];
                        return (
                          <div key={doc.key} className="bg-white border-2 border-slate-200 p-3.5 rounded-2xl space-y-3 hover:border-emerald-200 transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-black text-slate-800 leading-tight">{doc.name}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{doc.desc}</p>
                              </div>
                              <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${isUploaded ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-slate-100 border border-slate-150 text-slate-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isUploaded ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                {isUploaded ? 'อัปโหลดแล้ว' : 'ยังไม่แนบ'}
                              </span>
                            </div>

                            <div className="flex gap-2 border-t border-slate-100 pt-3">
                              <button
                                onClick={() => {
                                  setUploadedDocs(prev => ({ ...prev, [doc.key]: true }));
                                  showToast(`📸 แนบไฟล์ภาพ ${doc.name.split(' ')[1]} สำเร็จ!`);
                                }}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer ${isUploaded ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-150'}`}
                              >
                                {isUploaded ? '👉 อัปโหลดรูปใหม่' : '📸 อัปโหลดรูปภาพ'}
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewDoc(doc.key);
                                }}
                                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black border border-slate-200"
                              >
                                ดูตัวอย่าง
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button 
                        onClick={() => setRegisterStep(2)}
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black text-center"
                      >
                        ย้อนกลับ
                      </button>
                      <button 
                        onClick={handleNextStep3}
                        className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>ถัดไป</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-3 shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                          ขั้นตอนที่ 4 จาก 4
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">ยื่นใบสมัครตรวจสอบ</span>
                      </div>
                      <h2 className="font-black text-slate-900 text-base leading-tight">ตรวจสอบสรุปความถูกต้อง</h2>
                      {/* Progress pill bar */}
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(s => (
                          <div 
                            key={s} 
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= 4 ? 'bg-emerald-600' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {authError && (
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs font-black flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3 text-left">
                      <h3 className="font-black text-slate-900 text-xs border-b pb-1.5 flex items-center gap-1.5 text-emerald-800">
                        📋 สรุปความถูกต้องใบสมัคร
                      </h3>
                      <div className="space-y-2 text-[11px] leading-relaxed">
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">ชื่อตัวแทนจำหน่าย:</span>
                          <span className="text-slate-800 font-black">{regName}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">เบอร์โทรติดต่อ:</span>
                          <span className="text-slate-800 font-black font-mono">{regPhone}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">อีเมล:</span>
                          <span className="text-slate-800 font-black font-mono">{regEmail}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">ชื่อหน้าร้าน:</span>
                          <span className="text-emerald-800 font-black">{regShopName}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">ทำเลบริการ:</span>
                          <span className="text-slate-800 font-black">{regArea}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">เวลาทำการ:</span>
                          <span className="text-slate-800 font-black">{regHours}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed pb-1.5">
                          <span className="text-slate-400 font-bold">เอกสาร KYC:</span>
                          <span className="text-emerald-700 font-black">อัปโหลดครบแล้ว (ผ่านเกณฑ์)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">แพ็กเกจสมาชิก:</span>
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-black px-1.5 rounded text-[9px]">Basic Agent ⭐️</span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border-2 border-slate-200 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={confirmInfoCorrect}
                        onChange={(e) => setConfirmInfoCorrect(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 scale-110 shrink-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-600 font-bold leading-normal">
                        ข้าพเจ้ายินดีส่งเอกสารดังกล่าวข้างต้น และยืนยันว่าข้อมูลและเอกสารทั้งหมดที่ส่งมานี้เป็นข้อมูลจริง ถูกต้อง และสามารถตรวจสอบสิทธิ์ได้
                      </span>
                    </label>

                    <div className="flex gap-2.5 pt-2">
                      <button 
                        onClick={() => setRegisterStep(3)}
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black text-center"
                      >
                        ย้อนกลับ
                      </button>
                      <button 
                        onClick={handleSubmitRegister}
                        className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={16} className="stroke-[2.5px]" />
                        <span>ส่งใบสมัครและตรวจสอบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Document preview modal overlay inside mobile viewport */}
              {previewDoc && (
                <div className="absolute inset-0 bg-black/80 flex justify-center items-center p-4 z-50 font-prompt">
                  <div className="bg-white rounded-3xl w-full max-w-[320px] overflow-hidden border border-slate-100 shadow-2xl relative">
                    <button 
                      onClick={() => setPreviewDoc(null)}
                      className="absolute top-3 right-3 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <X size={16} className="stroke-[2.5px]" />
                    </button>
                    <div className="p-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
                      <h3 className="font-black text-xs leading-none">ตัวอย่างรูปเอกสารจำลอง</h3>
                      <p className="text-[9px] text-emerald-100 mt-1 leading-none">เอกสารอ้างอิงเพื่อสาธิตความพร้อมระบบ</p>
                    </div>
                    <div className="p-5 flex flex-col justify-center items-center text-center space-y-4">
                      <div className="w-full h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col justify-center items-center text-slate-400 text-center p-3 relative overflow-hidden">
                        {previewDoc === 'idCard' && (
                          <div className="space-y-1">
                            <FileText size={32} className="mx-auto text-emerald-600" />
                            <span className="text-[9px] font-mono block text-slate-600">CARD_ID_110020038XXXX_TEMP.PNG</span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-black border border-emerald-100">ตรวจสอบความถูกต้องเรียบร้อย</span>
                          </div>
                        )}
                        {previewDoc === 'idCardWithFace' && (
                          <div className="space-y-1">
                            <ImageIcon size={32} className="mx-auto text-emerald-600" />
                            <span className="text-[9px] font-mono block text-slate-600">SELFIE_WITH_CARD_VERIFY.JPG</span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-black border border-emerald-100">เซลฟี่ตรงกับเจ้าของชื่อ</span>
                          </div>
                        )}
                        {previewDoc === 'agentLicense' && (
                          <div className="space-y-1">
                            <FileText size={32} className="mx-auto text-emerald-600" />
                            <span className="text-[9px] font-mono block text-slate-600">N3_OFFICIAL_LICENSE_00124.PDF</span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-black border border-emerald-100">หลักฐานจดทะเบียนใบอนุมัติ</span>
                          </div>
                        )}
                        {previewDoc === 'shopPhoto' && (
                          <div className="space-y-1">
                            <ImageIcon size={32} className="mx-auto text-emerald-600" />
                            <span className="text-[9px] font-mono block text-slate-600">STOREFRONT_COMMUNITY_SETUP.JPG</span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-black border border-emerald-100">บอร์ดหน้าร้านและจุดแผงค้า</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        ระบบอัปโหลดและจับภาพอัตโนมัติจำลองเสร็จสมบูรณ์ คุณสามารถตรวจสอบข้อมูลการจองหลักฐานนี้ในแผงผู้ตรวจการสำหรับผู้ดูแลระบบ
                      </p>
                      <button 
                        onClick={() => setPreviewDoc(null)}
                        className="w-full py-2.5 bg-slate-900 text-white font-black text-xs rounded-xl cursor-pointer"
                      >
                        ปิดหน้าต่าง
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        ) : currentAgent.status !== 'Approved' ? (
          /* VERIFICATION STATUS SCREENS FOR LOGGED IN USERS WHO ARE PENDING REVIEW OR REJECTED */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative font-prompt">
            {/* Header */}
            <header className="bg-emerald-800 text-white px-4 py-4 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center border border-white/20 shadow-inner shrink-0">N3</div>
                <h1 className="text-sm font-black tracking-tight leading-none text-white">ตรวจสอบสถานะเปิดร้าน</h1>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform shrink-0"
              >
                ออกจากระบบ
              </button>
            </header>

            {/* Content body depending on Pending Review or Need More Info status */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {currentAgent.status === 'Pending Review' ? (
                /* PENDING REVIEW SCREEN */
                <div className="space-y-5 text-center">
                  <div className="bg-white border-2 border-amber-100 rounded-3xl p-5 shadow-xs space-y-4">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-100 relative">
                      <Clock size={32} className="animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">N3</span>
                    </div>
                    <div>
                      <h2 className="font-black text-slate-800 text-base leading-snug">ส่งข้อมูลใบสมัครเรียบร้อยแล้ว</h2>
                      <p className="text-slate-400 text-[10.5px] font-bold mt-1.5 leading-relaxed px-2">
                        ระบบได้รับข้อมูลใบสมัครตัวแทนจำหน่ายสลากดิจิทัลจำลอง N3 ของคุณแล้ว แอดมินกำลังเร่งตรวจสอบเอกสารและพิจารณาอนุมัติเปิดหน้าร้าน
                      </p>
                    </div>
                    <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-black px-4 py-1.5 rounded-full">
                      ⏳ สถานะใบสมัคร: รอแอดมินพิจารณาอนุมัติ
                    </div>
                  </div>

                  {/* Stepper Timeline */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left space-y-4">
                    <h3 className="font-black text-slate-800 text-xs border-b pb-2">🛣️ แผนภูมิขั้นตอนการดำเนินงาน</h3>
                    <div className="relative pl-6 space-y-5">
                      <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />
                      
                      {/* Step 1: Submit */}
                      <div className="relative">
                        <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-black">✓</div>
                        <div>
                          <h4 className="text-xs font-black text-emerald-800 leading-none">1. ส่งใบสมัครสำเร็จ</h4>
                          <p className="text-[9.5px] text-slate-400 mt-1">ส่งประวัติ, ข้อมูลร้านค้า, และอัปโหลด 4 เอกสารคัดกรอง</p>
                        </div>
                      </div>

                      {/* Step 2: KYC docs check */}
                      <div className="relative">
                        <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[8px] text-slate-950 font-black animate-pulse">●</div>
                        <div>
                          <h4 className="text-xs font-black text-amber-700 leading-none">2. ตรวจสอบเอกสาร (ในแผงแอดมิน)</h4>
                          <p className="text-[9.5px] text-slate-400 mt-1">คุณสามารถสลับไปสิทธิ์ "ผู้ดูแลระบบ" ด้านบนเพื่อกด อนุมัติ/แก้ไข</p>
                        </div>
                      </div>

                      {/* Step 3: Admin Approval */}
                      <div className="relative">
                        <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-slate-200 border-2 border-white" />
                        <div>
                          <h4 className="text-xs font-black text-slate-400 leading-none">3. แอดมินสิทธิ์อนุมัติเรียบร้อย</h4>
                          <p className="text-[9.5px] text-slate-400 mt-1">เมื่อแอดมินอนุมัติในแผงผู้ดูแล บัญชีนี้จะเข้าสู่หน้าเปิดแผงได้ทันที</p>
                        </div>
                      </div>

                      {/* Step 4: Approved */}
                      <div className="relative">
                        <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-slate-200 border-2 border-white" />
                        <div>
                          <h4 className="text-xs font-black text-slate-400 leading-none">4. เริ่มใช้งานแผงตัวแทนขาย</h4>
                          <p className="text-[9.5px] text-slate-400 mt-1">เริ่มรับยอดจองสลากดิจิทัล จัดเก็บเงิน ปริ้นคิวอาร์</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button actions */}
                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={() => {
                        showToast("🔄 อัปเดตข้อมูลสถานะใบสมัครเรียบร้อยแล้ว!");
                      }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🔄 ตรวจสอบสถานะอีกครั้ง</span>
                    </button>
                    <button 
                      onClick={onBackToRoles}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black cursor-pointer"
                    >
                      กลับหน้าเลือกบทบาท
                    </button>
                  </div>
                </div>
              ) : (
                /* NEED MORE INFO / NEED EDIT STATE */
                <div className="space-y-5">
                  <div className="bg-white border-2 border-rose-100 rounded-3xl p-5 shadow-xs text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                      <AlertCircle size={32} className="stroke-[2.5px]" />
                    </div>
                    <div>
                      <h2 className="font-black text-slate-800 text-base leading-snug">ต้องแก้ไขข้อมูลใบสมัครของคุณ</h2>
                      <p className="text-slate-400 text-[10px] font-bold mt-1 px-1">
                        เนื่องจากเอกสารที่ส่งมาระหว่างลงทะเบียนไม่ผ่านการตรวจสอบ กรุณาอัปโหลดเอกสารใหม่ให้ถูกต้อง
                      </p>
                    </div>
                  </div>

                  {/* Admin feedback banner */}
                  <div className="bg-rose-50 border-2 border-rose-200 p-4.5 rounded-3xl space-y-2">
                    <span className="text-[10px] font-black text-rose-800 block">💬 บันทึกข้อความชี้แจงจากทีมผู้ตรวจ (แอดมิน):</span>
                    <p className="text-slate-700 text-[11px] font-bold leading-relaxed bg-white/70 p-3 rounded-xl border border-rose-100">
                      "{currentAgent.notes || "เอกสารรูปถ่ายคู่บัตรประชาชนไม่ชัดเจน กรุณาถ่ายในบริเวณที่มีแสงสว่างพอและเห็นเลขบัตรถูกต้อง"}"
                    </p>
                  </div>

                  {/* Simple document uploader */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4.5 space-y-3.5">
                    <span className="text-xs font-black text-slate-800 block">📸 แก้ไขและส่งเอกสารแนบ:</span>
                    
                    <div className="border border-emerald-100 bg-emerald-50/40 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-black text-emerald-900 leading-snug">ถ่ายภาพเซลฟี่ถือบัตรประชาชนใหม่</h4>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-normal">อัปโหลดไฟล์ที่สว่าง ชัดเจน ไม่เบลอ หรือมืดสลัว</p>
                      </div>
                      <button 
                        onClick={() => {
                          showToast("📸 อัปโหลดรูปภาพทดแทนสำเร็จ!");
                        }}
                        className="py-2 px-3.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-black rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        📸 อัปโหลดใหม่
                      </button>
                    </div>
                  </div>

                  {/* Button actions */}
                  <div className="space-y-2 pt-1">
                    <button 
                      onClick={() => {
                        const updated = agentAccounts.map(acc => {
                          if (acc.phone === currentAgent.phone) {
                            return { ...acc, status: 'Pending Review', notes: '' };
                          }
                          return acc;
                        });
                        onUpdateAgentAccounts(updated);
                        showToast("🚀 อัปเดตและส่งใบสมัครตรวจสอบอีกครั้งสำเร็จ!");
                      }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle size={16} className="stroke-[2.5px]" />
                      <span>ส่งใบสมัครเพื่อตรวจสอบอีกครั้ง</span>
                    </button>
                    <button 
                      onClick={onBackToRoles}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black cursor-pointer"
                    >
                      กลับหน้าเลือกบทบาท
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !hasAcknowledgedApproval ? (
          /* GLORIOUS APPROVED ACKNOWLEDGMENT CONGRATULATIONS SCREEN */
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-emerald-800 via-emerald-900 to-slate-900 text-white relative font-prompt">
            {/* Success Animation Area */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl relative animate-bounce">
                <ShieldCheck size={48} className="stroke-[2.5px]" />
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full leading-none">N3 PASS</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] bg-emerald-800 border border-emerald-700 text-amber-300 font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  🎉 ตรวจสอบผ่านอนุมัติแล้ว
                </span>
                <h2 className="font-black text-2xl text-white tracking-tight leading-none pt-2">ยืนยันตัวตนสำเร็จ!</h2>
                <p className="text-emerald-100 text-[11px] leading-relaxed px-3 pt-1">
                  ร้านตัวแทนจำหน่าย <span className="font-black text-amber-400">"{currentAgent.shopName}"</span> ได้รับการอนุมัติสิทธิ์ลงทะเบียน N3 Agent เรียบร้อยแล้ว ยินดีต้อนรับเข้าสู่แพลตฟอร์มรับจอง
                </p>
              </div>

              {/* Summary Details */}
              <div className="w-full bg-white/10 rounded-2xl p-4 text-left border border-white/10 space-y-2 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="opacity-60">ชื่อร้านจำหน่าย:</span>
                  <span className="font-bold text-amber-300">{currentAgent.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">รหัสผู้สมัครสิทธิ์:</span>
                  <span className="font-bold font-mono">{currentAgent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">ประเภทแผง:</span>
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 rounded leading-normal">Basic Agent ⭐️</span>
                </div>
              </div>

              <button 
                onClick={handleEnterDashboard}
                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>เข้าสู่ระบบจัดการร้านค้า</span>
                <ChevronRight size={18} className="stroke-[3px]" />
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD AGENT VIEW SCREENS */
          <>
            {/* Top App Bar Header */}
            <header id="agent-header" className="sticky top-0 z-30 bg-emerald-800 text-white px-4 py-3 flex justify-between items-center shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-prompt font-black text-base flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  N3
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-prompt text-sm font-black tracking-tight leading-none text-white">
                      {activeTab === 'home' ? 'หน้าหลักตัวแทน' : 
                       activeTab === 'orders' ? 'จัดการออเดอร์' : 
                       activeTab === 'customers' ? 'รายชื่อลูกค้า' : 
                       activeTab === 'store' ? 'จัดการหน้าร้าน' : 
                       activeTab === 'reports' ? 'รายงานยอดขาย' : 'แพ็กเกจสมาชิก'}
                    </h1>
                    <span className="bg-emerald-600 text-white font-prompt font-black text-[8px] px-1.5 py-0.5 rounded-md leading-none">ตัวแทนขาย</span>
                  </div>
                  <p className="text-[9px] text-emerald-100 font-medium mt-1 font-prompt">N3 Agent Marketplace</p>
                </div>
              </div>
              
              <div className="flex gap-1 shrink-0">
                <button 
                  onClick={handleLogout}
                  className="text-[9px] font-prompt font-black bg-rose-600 hover:bg-rose-700 text-white px-2 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                >
                  ออกระบบ
                </button>
                <button 
                  id="btn-switch-role"
                  onClick={onBackToRoles}
                  className="text-[9px] font-prompt font-black bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 px-2 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                >
                  เปลี่ยนบทบาท
                </button>
              </div>
            </header>

        {/* Global Toast Overlay */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border-2 border-emerald-500"
            >
              <ShieldCheck className="text-emerald-400 shrink-0 w-6 h-6" />
              <span className="font-bold text-xs leading-snug font-prompt">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Scrollable View Area with padding for Bottom Navigation */}
        <main id="agent-main-content" className="flex-1 pb-28 overflow-y-auto">

          {/* =========================================================================
              SCREEN 1: AGENT DASHBOARD / หน้าหลักตัวแทน
              ========================================================================= */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              
              {/* (1) Store Profile Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl">
                  Pro Agent 👑
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img 
                      src="/src/assets/images/shop_je_maew_n3_1783428973348.jpg" 
                      className="w-full h-full object-cover" 
                      alt="Agent profile" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">ร้านเจ๊แมว N3</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-500 font-mono font-bold">รหัส: AG-001245</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-md font-bold">
                        ยืนยันตัวตนแล้ว
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${storeStatusOpen ? 'bg-emerald-50/75 border-emerald-200 text-emerald-950' : 'bg-rose-50/75 border-rose-200 text-rose-950'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${storeStatusOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span className="text-xs font-bold">
                      สถานะร้าน: {storeStatusOpen ? 'เปิดรับออเดอร์' : 'ปิดร้านชั่วคราว'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setStoreStatusOpen(!storeStatusOpen);
                      showToast(storeStatusOpen ? '🔴 ปิดรับออเดอร์ชั่วคราวสำเร็จ' : '🟢 เปิดรับออเดอร์ปกติเรียบร้อย');
                    }}
                    className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all rounded-lg shadow-sm"
                  >
                    เปิด/ปิดร้าน
                  </button>
                </div>
              </div>

              {/* (2) Store Status Box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                <h4 className="font-bold text-xs text-slate-800 tracking-tight">สถานะร้านของคุณ</h4>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                    ✓ เปิดรับออเดอร์
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                    ⚡ ตอบกลับเร็ว
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                    🛡️ ยืนยันตัวตนแล้ว
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setStoreStatusOpen(true);
                      showToast("🟢 เปิดหน้าร้านเรียบร้อยแล้ว");
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${storeStatusOpen ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    เปิดหน้าร้าน
                  </button>
                  <button
                    onClick={() => {
                      setStoreStatusOpen(false);
                      showToast("🔴 ปิดหน้าร้านชั่วคราวเรียบร้อยแล้ว");
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${!storeStatusOpen ? 'bg-rose-600 border-rose-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    ปิดหน้าร้าน
                  </button>
                </div>
              </div>

              {/* (3) 4 Major KPI Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-[88px]">
                  <span className="text-[10px] text-slate-500 font-bold block">โควตาคงเหลือ</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-700 font-mono">2,000</span>
                    <span className="text-[10px] text-slate-400 font-bold">ใบ</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-[88px]">
                  <span className="text-[10px] text-slate-500 font-bold block">ยอดขายวันนี้</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800 font-mono">฿4,250</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-[88px]">
                  <span className="text-[10px] text-slate-500 font-bold block">ลูกค้าทั้งหมด</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800 font-mono">148</span>
                    <span className="text-[10px] text-slate-400 font-bold">คน</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between h-[88px]">
                  <span className="text-[10px] text-slate-500 font-bold block">รายการใหม่</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-rose-600 font-mono">1</span>
                    <span className="text-[10px] text-slate-400 font-bold">รายการ</span>
                  </div>
                </div>
              </div>

              {/* (4) Main Menu Panel */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-slate-800 tracking-tight">เมนูใช้งานหลัก</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  
                  <button 
                    onClick={() => setActiveTab('store')}
                    className="bg-white border border-slate-200 hover:border-emerald-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Store size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">จัดการหน้าร้าน</span>
                      <span className="text-[9px] text-slate-400 truncate block">แก้ไขชื่อ รูปภาพ รายละเอียด</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="bg-white border border-slate-200 hover:border-emerald-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <ClipboardList size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">ออเดอร์</span>
                      <span className="text-[9px] text-slate-400 truncate block">รายการสั่งซื้อและการจอง</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="bg-white border border-slate-200 hover:border-emerald-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">ลูกค้าของฉัน</span>
                      <span className="text-[9px] text-slate-400 truncate block">รายชื่อและประวัติการโทร</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveTab('store');
                      showToast("👋 นำท่านไปยังหน้าร้านเพื่อตรวจสอบคิวหน้าร้าน");
                    }}
                    className="bg-white border border-slate-200 hover:border-emerald-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Clock size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">คิวหน้าร้าน</span>
                      <span className="text-[9px] text-slate-400 truncate block">จัดคิวรับหน้าร้านรวดเร็ว</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="bg-white border border-slate-200 hover:border-emerald-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">รายงาน</span>
                      <span className="text-[9px] text-slate-400 truncate block">สถิติยอดขาย 7 วันล่าสุด</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('packages')}
                    className="bg-emerald-50/50 border border-emerald-200 hover:bg-emerald-50 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Sparkles size={18} className="fill-emerald-800" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-emerald-950 block">แพ็กเกจ Pro</span>
                      <span className="text-[9px] text-emerald-600 truncate block font-bold">สิทธิประโยชน์ตัวแทนระดับโปร</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* (5) Recommendation Card */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400 animate-pulse fill-amber-400" />
                  <h4 className="font-bold text-sm text-white">อยากขายดีขึ้นไหม?</h4>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  เปิดบริการโปรโมตร้าน แจ้งเตือน หรือรายงานพิเศษ เพื่อช่วยให้ร้านดูน่าเชื่อถือขึ้น
                </p>
                <button
                  onClick={() => {
                    setActiveTab('packages');
                    showToast("✨ นำคุณเข้าสู่การดูบริการเสริมพิเศษ");
                  }}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  ดูบริการเสริม
                </button>
              </div>

              {/* (6) Critical Notifications Card List */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-slate-800 tracking-tight">แจ้งเตือนสำคัญ</h4>
                <div className="space-y-2">
                  
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <ClipboardList size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900">มีออเดอร์ใหม่ 1 รายการ</p>
                      <p className="text-[10px] text-slate-400 truncate">เลขอ้างอิง BK-2026-001245 โดยคุณ สมชาย ใจดี</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-[10px] font-bold text-emerald-600 shrink-0 hover:underline px-2"
                    >
                      ดูเลย
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertCircle size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900">โควตาใกล้หมด</p>
                      <p className="text-[10px] text-slate-400 truncate">โควตาของคุณเหลือ 2,000 ใบ กรุณาเติมสิทธิ์สำรอง</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('packages')}
                      className="text-[10px] font-bold text-emerald-600 shrink-0 hover:underline px-2"
                    >
                      เติมโควตา
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900">มีลูกค้าเพิ่มร้านของคุณเป็นร้านโปรด</p>
                      <p className="text-[10px] text-slate-400 truncate">คุณวิภาดา แสนดี บันทึกร้านเจ๊แมวเป็นร้านค้าประจำเป็นคนล่าสุด</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('customers')}
                      className="text-[10px] font-bold text-emerald-600 shrink-0 hover:underline px-2"
                    >
                      ดูประวัติ
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              SCREEN 2: ORDERS PAGE / ออเดอร์ของฉัน
              ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="w-8 h-8 rounded-full bg-slate-150 hover:bg-slate-200 flex items-center justify-center text-slate-800"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="font-bold text-base text-slate-900">ออเดอร์ของฉัน</h2>
              </div>

              {/* Order Status Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {[
                  { key: 'pending', label: 'ใหม่' },
                  { key: 'processing', label: 'กำลังดำเนินการ' },
                  { key: 'success', label: 'เสร็จแล้ว' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setOrderFilter(t.key as any)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg text-center transition-all ${
                      orderFilter === t.key
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Order List cards */}
              <div className="space-y-3 pb-12">
                {orderFilter === 'pending' && (
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-lg border">
                        BK-2026-001245
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md">
                        ใหม่
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-500 font-bold">ลูกค้า: <span className="text-slate-900">สมชาย ใจดี</span></p>
                      <p className="text-slate-500 font-bold">เวลา: <span className="text-slate-900">14:25 น.</span></p>
                      <div className="flex justify-between items-center bg-emerald-50/50 px-3 py-2 rounded-xl border border-emerald-100">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">เลขที่เลือก</span>
                          <span className="font-mono text-base font-black text-emerald-800">123</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">จำนวน</span>
                          <span className="font-mono text-base font-black text-slate-800">1 ใบ</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => showToast("🔎 เปิดดูรายละเอียดออเดอร์ของสมชาย ใจดี")}
                        className="py-2.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
                      >
                        ดูรายละเอียด
                      </button>
                      <button
                        onClick={() => {
                          setOrderFilter('processing');
                          showToast("🟢 รับออเดอร์เรียบร้อย อยู่ในขั้นตอนดำเนินการประสานงานสลากดิจิทัล");
                        }}
                        className="py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:bg-emerald-700 active:scale-95 flex items-center justify-center gap-1"
                      >
                        <Check size={14} />
                        <span>รับออเดอร์</span>
                      </button>
                    </div>
                  </div>
                )}

                {orderFilter === 'processing' && (
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-lg border">
                        BK-2026-001245
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold rounded-md">
                        กำลังดำเนินการ
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-500 font-bold">ลูกค้า: <span className="text-slate-900">สมชาย ใจดี</span></p>
                      <p className="text-slate-500 font-bold">เวลา: <span className="text-slate-900">14:25 น.</span></p>
                      <div className="flex justify-between items-center bg-emerald-50/50 px-3 py-2 rounded-xl border border-emerald-100">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">เลขที่เลือก</span>
                          <span className="font-mono text-base font-black text-emerald-800">123</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">จำนวน</span>
                          <span className="font-mono text-base font-black text-slate-800">1 ใบ</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => showToast("🔎 เปิดดูรายละเอียดออเดอร์ของสมชาย ใจดี")}
                        className="py-2.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
                      >
                        ดูรายละเอียด
                      </button>
                      <button
                        onClick={() => {
                          setOrderFilter('success');
                          showToast("✓ สลากนำโอนเข้าระบบเป๋าตังลูกค้าสำเร็จ ออเดอร์เสร็จสิ้นแล้ว!");
                        }}
                        className="py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                      >
                        <span>โอนสำเร็จ (เสร็จสิ้น)</span>
                      </button>
                    </div>
                  </div>
                )}

                {orderFilter === 'success' && (
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-lg border">
                        BK-2026-001245
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md">
                        เสร็จแล้ว
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-500 font-bold">ลูกค้า: <span className="text-slate-900">สมชาย ใจดี</span></p>
                      <p className="text-slate-500 font-bold">เวลา: <span className="text-slate-900">14:25 น.</span></p>
                      <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">เลขที่เลือก</span>
                          <span className="font-mono text-base font-black text-slate-600">123</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">จำนวน</span>
                          <span className="font-mono text-base font-black text-slate-600">1 ใบ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 3: CUSTOMERS PAGE / ลูกค้าของฉัน
              ========================================================================= */}
          {activeTab === 'customers' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="w-8 h-8 rounded-full bg-slate-150 hover:bg-slate-200 flex items-center justify-center text-slate-800"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="font-bold text-base text-slate-900">ลูกค้าของฉัน</h2>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="ค้นหาชื่อ หรือเบอร์โทรศัพท์ลูกค้า..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold focus:border-emerald-600 outline-none shadow-sm"
                />
              </div>

              {/* Customer Filter Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {[
                  { key: 'all', label: 'ลูกค้าทั้งหมด' },
                  { key: 'regular', label: 'ลูกค้าประจำ' },
                  { key: 'new', label: 'ลูกค้าใหม่' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setCustomerTabFilter(t.key as any)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                      customerTabFilter === t.key
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Customer List cards */}
              <div className="space-y-3 pb-12">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border bg-slate-50 shrink-0">
                        <img src={customer.image} className="w-full h-full object-cover" alt="Customer Avatar" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{customer.name}</h4>
                        <p className="text-xs text-slate-500 font-mono font-bold">{customer.phone}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                      <p className="text-slate-500 font-bold">จำนวนรายการที่ผ่านมา: <span className="font-mono text-slate-900 font-black">{customer.orderCount} ครั้ง</span></p>
                      <p className="text-slate-500 font-bold">รายการล่าสุด: <span className="font-mono text-slate-900 font-black">N3 [{customer.lastOrder}]</span></p>
                    </div>

                    <button
                      onClick={() => showToast(`📊 แสดงประวัติการทำรายการ N3 ของคุณ ${customer.name}`)}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all"
                    >
                      ดูประวัติ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 4: MY SHOP PAGE / จัดการหน้าร้าน
              ========================================================================= */}
          {activeTab === 'store' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="w-8 h-8 rounded-full bg-slate-150 hover:bg-slate-200 flex items-center justify-center text-slate-800"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="font-bold text-base text-slate-900">จัดการหน้าร้าน</h2>
              </div>

              {/* Store Profile Card and Details */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 relative group cursor-pointer" onClick={() => showToast('📸 การอัปโหลดรูปภาพร้านค้าเสมือน')}>
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover" alt="Shop Profile" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px] font-bold">แก้ไขรูป</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">คลิกที่รูปภาพเพื่อเปลี่ยนรูปภาพจำลอง</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">ป้ายกำกับร้านค้าของคุณ</label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[9px] font-bold">
                      ✓ ยืนยันตัวตนแล้ว
                    </span>
                    <span className="bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-[9px] font-bold">
                      👑 Pro Agent
                    </span>
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[9px] font-bold">
                      ⚡ ตอบไว
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">ชื่อร้านค้าตัวแทน</label>
                    <input 
                      type="text" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">คำอธิบายร้านค้า</label>
                    <textarea 
                      value={storeDesc}
                      onChange={(e) => setStoreDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">พื้นที่ให้บริการจัดส่งสลาก</label>
                    <input 
                      type="text" 
                      value={storeArea}
                      onChange={(e) => setStoreArea(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">เวลาทำการยืนยันออเดอร์</label>
                    <input 
                      type="text" 
                      value={storeHours}
                      onChange={(e) => setStoreHours(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">เบอร์โทรศัพท์ / LINE ID</label>
                    <input 
                      type="text" 
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-emerald-600 focus:bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">สถานะเปิด/ปิดร้าน</label>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStoreStatusOpen(true)}
                        className={`flex-1 py-2 text-xs font-bold border rounded-xl transition-all ${storeStatusOpen ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                      >
                        เปิดร้านปกติ
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreStatusOpen(false)}
                        className={`flex-1 py-2 text-xs font-bold border rounded-xl transition-all ${!storeStatusOpen ? 'bg-rose-50 text-rose-800 border-rose-400 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                      >
                        ปิดร้านชั่วคราว
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-150 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700 block">QR หน้าร้านสำหรับลูกค้า</span>
                      <span className="text-[10px] text-slate-400 font-bold block">ให้ลูกค้าแวะสแกนสิทธิพิเศษ</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setQrModalOpen(true)}
                      className="p-2 bg-slate-100 border hover:bg-slate-200 rounded-xl text-slate-700 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <QrCode size={14} />
                      <span className="text-xs font-bold">สแกนดู QR</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviewMode(true);
                      showToast("👁️ เปิดตัวอย่างหน้าร้าน (มุมมองลูกค้า) สำเร็จ");
                    }}
                    className="w-full py-3 bg-slate-900 text-white hover:bg-black font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                  >
                    ดูตัวอย่างหน้าร้านที่ลูกค้าเห็น
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('home');
                      showToast("💾 บันทึกข้อมูลหน้าร้านสำเร็จ ข้อมูลพร้อมเชื่อมต่อแบบเรียลไทม์");
                    }}
                    className="w-full py-3 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <Check size={14} className="stroke-[3px]" />
                    <span>บันทึกข้อมูลร้าน</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 5: REPORTS PAGE / รายงานร้าน
              ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="p-4 space-y-4.5 pb-28 font-prompt overflow-y-auto">
              {/* Header ของหน้า */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1">
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="w-8 h-8 rounded-full bg-slate-150 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-transform active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="min-w-0">
                    <h2 className="font-black text-lg text-slate-900 leading-tight">รายงานร้าน</h2>
                    <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">สรุปยอดขาย ลูกค้า และรายการของร้านคุณ</p>
                  </div>
                </div>

                {/* Filter chips ใต้หัวข้อ */}
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                  {[
                    { key: 'today', label: 'วันนี้' },
                    { key: 'period', label: 'งวดนี้' },
                    { key: 'month', label: 'เดือนนี้' },
                    { key: 'custom', label: 'กำหนดเอง' }
                  ].map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => {
                        setReportPeriod(chip.key as any);
                        showToast(`📅 แสดงรายงานเฉพาะ: ${chip.label}`);
                      }}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg text-center transition-all cursor-pointer ${
                        reportPeriod === chip.key
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Range Picker Form */}
              {reportPeriod === 'custom' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 shadow-xs animate-fade-in">
                  <span className="block text-[10px] font-black text-slate-500 uppercase font-prompt">เลือกช่วงเวลาตามกำหนดเอง</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-400">วันที่เริ่มต้น</label>
                      <input 
                        type="date" 
                        defaultValue="2026-07-01"
                        onChange={(e) => {
                          showToast(`📅 เริ่มต้นตั้งแต่วันที่: ${e.target.value}`);
                        }}
                        className="w-full text-[11px] font-bold font-mono bg-slate-50 border border-slate-250 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-400">วันที่สิ้นสุด</label>
                      <input 
                        type="date" 
                        defaultValue="2026-07-06"
                        onChange={(e) => {
                          showToast(`📅 สิ้นสุดถึงวันที่: ${e.target.value}`);
                        }}
                        className="w-full text-[11px] font-bold font-mono bg-slate-50 border border-slate-250 rounded-xl px-2.5 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Summary Highlight Card */}
              <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-850 text-white p-4.5 rounded-3xl shadow-lg shadow-emerald-900/10 border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
                {/* Decorative background circle */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none"></div>
                <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-white/5 pointer-events-none"></div>

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black bg-white/15 px-2 py-0.5 rounded uppercase tracking-wide">
                      {reportPeriod === 'today' ? 'ยอดขายวันนี้' : 
                       reportPeriod === 'period' ? 'ยอดรวมงวดนี้' : 
                       reportPeriod === 'month' ? 'ยอดรวมเดือนนี้' : 'ยอดรวมกำหนดเอง'}
                    </span>
                    <h3 className="text-2xl font-black font-mono pt-1">
                      {reportPeriod === 'today' ? '฿4,250' : 
                       reportPeriod === 'period' ? '฿28,500' : 
                       reportPeriod === 'month' ? '฿54,200' : '฿12,450'}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-amber-300 stroke-[2.5px]" />
                  </div>
                </div>

                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-[10px] mt-2">
                  <span className="text-emerald-100 font-medium">
                    {reportPeriod === 'today' ? 'เทียบกับเมื่อวาน' : 
                     reportPeriod === 'period' ? 'เทียบกับงวดก่อน' : 
                     reportPeriod === 'month' ? 'เทียบกับเดือนก่อน' : 'ช่วงสรุปข้อมูลล่าสุด'}
                  </span>
                  <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none shadow-xs">
                    {reportPeriod === 'today' ? '+5%' : 
                     reportPeriod === 'period' ? '+12%' : 
                     reportPeriod === 'month' ? '+18%' : 'คงที่'}
                  </span>
                </div>
              </div>

              {/* 3. KPI Cards (Prisitine balanced Bento Grid layout) */}
              <div className="grid grid-cols-2 gap-3">
                {/* ยอดขาย */}
                <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black font-prompt">ยอดขาย</span>
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <TrendingUp size={12} className="stroke-[2.5px]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm font-black text-slate-900 font-mono block leading-none">
                      {reportPeriod === 'today' ? '฿4,250' : 
                       reportPeriod === 'period' ? '฿28,500' : 
                       reportPeriod === 'month' ? '฿54,200' : '฿12,450'}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-bold font-prompt block mt-1">ยอดรวมสำเร็จแล้ว</span>
                  </div>
                </div>

                {/* ลูกค้าใหม่ */}
                <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-black font-prompt">ลูกค้าใหม่</span>
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                      <Users size={12} className="stroke-[2.5px]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm font-black text-slate-900 font-mono block leading-none">
                      {reportPeriod === 'today' ? '+2 คน' : 
                       reportPeriod === 'period' ? '+12 คน' : 
                       reportPeriod === 'month' ? '+24 คน' : '+5 คน'}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-bold font-prompt block mt-1">สมัครผ่านลิงก์ร้าน</span>
                  </div>
                </div>

                {/* รายการสำเร็จ */}
                <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-black font-prompt">รายการส่งมอบ</span>
                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                      <CheckCircle2 size={12} className="stroke-[2.5px]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm font-black text-slate-900 font-mono block leading-none truncate" title="รายการ">
                      {reportPeriod === 'today' ? '18 รายการ' : 
                       reportPeriod === 'period' ? '142 รายการ' : 
                       reportPeriod === 'month' ? '284 รายการ' : '58 รายการ'}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-bold font-prompt block mt-1">ส่งสลากเข้าเป๋าตังจริง</span>
                  </div>
                </div>

                {/* ออเดอร์ใหม่ */}
                <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded font-black font-prompt">ออเดอร์ใหม่</span>
                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 shrink-0">
                      <Zap size={12} className="stroke-[2.5px]" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm font-black text-slate-900 font-mono block leading-none">
                      {reportPeriod === 'today' ? '1 ออเดอร์' : 
                       reportPeriod === 'period' ? '1 ออเดอร์' : 
                       reportPeriod === 'month' ? '3 ออเดอร์' : '0 ออเดอร์'}
                    </span>
                    <span className="text-[8.5px] text-slate-400 font-bold font-prompt block mt-1">รอการยืนยันออเดอร์</span>
                  </div>
                </div>
              </div>

              {/* 4. Chart Section */}
              <div className="bg-white border border-slate-200 p-4.5 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-prompt font-black text-sm text-slate-800 tracking-tight">กราฟวิเคราะห์ยอดขาย</h4>
                    <p className="text-[10px] text-slate-400 font-bold font-prompt">เปรียบเทียบยอดจำหน่ายรายวันสัปดาห์นี้</p>
                  </div>
                  <span className="text-[8px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-black font-prompt">
                    7 วันล่าสุด
                  </span>
                </div>
                
                {/* Beautiful Mobile Chart Area */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <svg viewBox="0 0 320 180" className="w-full h-44 font-prompt">
                    {/* Horizontal Grid lines */}
                    <line x1="20" y1="20" x2="300" y2="20" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="20" y1="55" x2="300" y2="55" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="20" y1="90" x2="300" y2="90" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="20" y1="125" x2="300" y2="125" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="20" y1="145" x2="300" y2="145" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Y-Axis helper labels */}
                    <text x="14" y="23" textAnchor="end" className="text-[7.5px] font-mono font-black fill-slate-400">6k</text>
                    <text x="14" y="58" textAnchor="end" className="text-[7.5px] font-mono font-black fill-slate-400">4k</text>
                    <text x="14" y="93" textAnchor="end" className="text-[7.5px] font-mono font-black fill-slate-400">2k</text>
                    <text x="14" y="128" textAnchor="end" className="text-[7.5px] font-mono font-black fill-slate-400">0</text>

                    {/* Bars with Gradient-like effect & hover details */}
                    {[
                      { day: 'จ.', label: '3.5k', height: 61, y: 84, fill: '#10B981', isMax: false },
                      { day: 'อ.', label: '2.1k', height: 37, y: 108, fill: '#10B981', isMax: false },
                      { day: 'พ.', label: '4.8k', height: 84, y: 61, fill: '#10B981', isMax: false },
                      { day: 'พฤ.', label: '1.8k', height: 31, y: 114, fill: '#10B981', isMax: false },
                      { day: 'ศ.', label: '6.2k', height: 108, y: 37, fill: '#059669', isMax: true }, // Max Day
                      { day: 'ส.', label: '3.9k', height: 68, y: 77, fill: '#10B981', isMax: false },
                      { day: 'อา.', label: '4.2k', height: 73, y: 72, fill: '#10B981', isMax: false }
                    ].map((bar, idx) => {
                      const xBase = 32 + (idx * 37);
                      return (
                        <g key={idx} className="cursor-pointer group">
                          {/* Background Hover Guide bar */}
                          <rect x={xBase - 6} y="15" width="24" height="130" rx="6" className="fill-transparent group-hover:fill-slate-900/5 transition-colors duration-200" />
                          
                          {/* The actual value bar */}
                          <rect 
                            x={xBase - 3} 
                            y={bar.y} 
                            width="18" 
                            height={bar.height} 
                            rx="5" 
                            fill={bar.isMax ? '#059669' : '#10B981'} 
                            className="transition-all duration-300 shadow-sm" 
                          />
                          
                          {/* Top label */}
                          <text 
                            x={xBase + 6} 
                            y={bar.y - 6} 
                            textAnchor="middle" 
                            className={`text-[8px] font-mono font-black ${bar.isMax ? 'fill-emerald-800' : 'fill-slate-500'}`}
                          >
                            {bar.label}
                          </text>

                          {/* X-Axis day label */}
                          <text 
                            x={xBase + 6} 
                            y="160" 
                            textAnchor="middle" 
                            className={`text-[9.5px] font-black ${bar.isMax ? 'fill-emerald-800 font-extrabold' : 'fill-slate-400'}`}
                          >
                            {bar.day}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="bg-emerald-50/60 text-emerald-950 px-4 py-2.5 rounded-2xl border border-emerald-100/50 flex items-center justify-between text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-emerald-700 shrink-0" />
                    <span>วันที่ขายดีที่สุด: <strong className="text-emerald-900">วันศุกร์ (฿6,200)</strong></span>
                  </div>
                  <span className="text-[9px] text-emerald-700 font-black bg-emerald-100/50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +15.2% จากเฉลี่ย
                  </span>
                </div>
              </div>

              {/* 6. Insight Card */}
              <div className="bg-blue-50/75 border border-blue-100 rounded-3xl p-4 shadow-xs space-y-2">
                <h4 className="font-black text-xs text-blue-900 flex items-center gap-1.5">
                  💡 ข้อสรุปจากระบบ
                </h4>
                <ul className="text-[11px] text-slate-600 font-medium space-y-1.5 list-disc pl-4">
                  <li>ยอดขายวันนี้สูงกว่าค่าเฉลี่ย 12% ในตัวแทนระดับใกล้เคียง</li>
                  <li>ลูกค้าใหม่เพิ่มขึ้นจากงวดก่อนอย่างมีนัยสำคัญ</li>
                  <li className="text-rose-700 font-semibold">มีออเดอร์ใหม่ที่ควรตรวจสอบ 1 รายการ</li>
                </ul>
              </div>

              {/* 5. Report Action Section (Elegant and clean) */}
              <div className="bg-white border border-slate-200 p-4.5 rounded-3xl shadow-sm space-y-3.5">
                <div className="border-b border-slate-100 pb-2.5">
                  <h4 className="font-prompt font-black text-xs text-slate-800 tracking-tight">📁 ส่งออกและพิมพ์เอกสารสรุป</h4>
                  <p className="text-[9.5px] text-slate-400 font-medium font-prompt mt-0.5">บันทึกหรือแชร์สถิติร้านค้าเข้าสู่ระบบภายนอก</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => showToast("🖨️ กำลังส่งข้อมูลไปยังเครื่องพิมพ์รายงานความน่าเชื่อถือ")}
                    className="h-11 bg-slate-900 text-white hover:bg-black font-prompt font-black text-xs rounded-xl shadow-sm transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
                  >
                    <Printer size={14} className="text-slate-300" />
                    <span>พิมพ์เอกสาร</span>
                  </button>

                  <button
                    onClick={() => showToast("📄 กำลังดาวน์โหลดรายงานสรุปบัญชีร้านค้า (PDF)")}
                    className="h-11 bg-emerald-600 text-white hover:bg-emerald-700 font-prompt font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 border border-emerald-500 cursor-pointer"
                  >
                    <Download size={14} className="text-emerald-100" />
                    <span>ดาวน์โหลด PDF</span>
                  </button>
                </div>

                <button
                  onClick={() => showToast("💬 กำลังจำลองส่งรายงานสรุปยอดบัญชีร้านค้าไปยังไลน์ของคุณ")}
                  className="w-full h-11 bg-[#06C755] text-white hover:brightness-105 font-prompt font-black text-xs rounded-xl shadow-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 border border-emerald-600 cursor-pointer"
                >
                  <Send size={14} />
                  <span>ส่งรายงานเข้า LINE</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 6: PACKAGES / แพ็กเกจสมาชิกตัวแทน N3
              ========================================================================= */}
          {activeTab === 'packages' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="w-8 h-8 rounded-full bg-slate-150 hover:bg-slate-200 flex items-center justify-center text-slate-800"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="font-bold text-base text-slate-900 font-prompt">แพ็กเกจสมาชิกตัวแทน N3</h2>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-3xl border-2 border-amber-400 shadow-md">
                <p className="text-[10px] text-amber-400 font-black uppercase">แพ็กเกจใช้งานปัจจุบันของคุณ</p>
                <h3 className="font-black text-base mt-0.5 font-prompt text-white">
                  👑 Pro Agent (ตัวแทนระดับมือโปร)
                </h3>
                <p className="text-[10px] text-slate-300 mt-1">ยอดโควตาสำรองได้รับการรับรอง มั่นใจได้รับสิทธิ์โอนแน่นอน</p>
              </div>

              {/* Upgrade packages */}
              <div className="space-y-4">
                
                {/* Pro Card */}
                <div className={`bg-white rounded-3xl border-2 p-4 shadow-md space-y-3 relative overflow-hidden ${currentPackageId === 'pro' ? 'border-amber-400 ring-4 ring-amber-400/10' : 'border-slate-200'}`}>
                  {currentPackageId === 'pro' && (
                    <span className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[9px] font-black px-3.5 py-1 rounded-bl-xl border-l border-b border-white">
                      กำลังใช้งานอยู่ 🌟
                    </span>
                  )}
                  
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ยอดนิยมที่สุด 👍
                    </span>
                    <h3 className="font-black text-sm text-slate-950 pt-1">👑 Pro Agent Package</h3>
                    <p className="text-[11px] text-emerald-700 font-black">ค่าบริการเพียง 99 บาท / เดือน</p>
                  </div>

                  <ul className="text-xs text-slate-600 font-bold space-y-1.5 border-t border-slate-100 pt-2.5">
                    <li className="flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600 stroke-[2.5px]" />
                      <span>แจ้งเตือนออเดอร์ผ่านไลน์กลุ่ม</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600 stroke-[2.5px]" />
                      <span>ป้ายตราร้านค้าพรีเมียม</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => { setCurrentPackageId('pro'); showToast('🎉 อัปเกรดสมัครใช้งานแพ็กเกจตัวแทนระดับ PRO สำเร็จแล้ว!'); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${currentPackageId === 'pro' ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow shadow-md active:scale-95'}`}
                    disabled={currentPackageId === 'pro'}
                  >
                    {currentPackageId === 'pro' ? 'เปิดใช้งานแพ็กเกจนี้อยู่' : 'กดสมัครอัปเกรดแพ็กเกจ'}
                  </button>
                </div>

                {/* Premium Card */}
                <div className={`bg-white rounded-3xl border-2 p-4 shadow-md space-y-3 relative overflow-hidden ${currentPackageId === 'premium' ? 'border-blue-900 ring-4 ring-blue-900/10' : 'border-slate-200'}`}>
                  {currentPackageId === 'premium' && (
                    <span className="absolute top-0 right-0 bg-blue-900 text-white text-[9px] font-black px-3.5 py-1 rounded-bl-xl border-l border-b border-white">
                      กำลังใช้งานอยู่ 🌟
                    </span>
                  )}
                  
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      ความปลอดภัยสูงสุด 💎
                    </span>
                    <h3 className="font-black text-sm text-slate-950 pt-1">💎 Premium Gold Package</h3>
                    <p className="text-[11px] text-emerald-700 font-black">ค่าบริการ 149 บาท / เดือน</p>
                  </div>

                  <ul className="text-xs text-slate-600 font-bold space-y-1.5 border-t border-slate-100 pt-2.5">
                    <li className="flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600 stroke-[2.5px]" />
                      <span>ขึ้นเป็นร้านค้าแนะนำอันดับ 1</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-600 stroke-[2.5px]" />
                      <span>ระบบสำรองข้อมูลอัตโนมัติ</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => { setCurrentPackageId('premium'); showToast('🎉 อัปเกรดเป็นระดับพรีเมียมเรียบร้อยแล้ว!'); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${currentPackageId === 'premium' ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow shadow-md active:scale-95'}`}
                    disabled={currentPackageId === 'premium'}
                  >
                    {currentPackageId === 'premium' ? 'เปิดใช้งานแพ็กเกจนี้อยู่' : 'กดสมัครอัปเกรดแพ็กเกจ'}
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* Sharing Qr code Modal (LINE, seniors friendly) */}
        <AnimatePresence>
          {qrModalOpen && (
            <div id="modal-qr-container" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[32px] w-full max-w-[340px] p-5 shadow-2xl relative text-center space-y-4"
              >
                <button 
                  id="btn-close-qr-modal"
                  onClick={() => setQrModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90"
                >
                  <X size={16} className="text-slate-800" />
                </button>

                <div className="space-y-1 pt-3">
                  <span className="text-[10px] bg-amber-100 text-amber-950 font-black px-2.5 py-1 rounded-full border border-amber-300">
                    สแกนหน้าร้านผ่านมือถือ 📱
                  </span>
                  <h3 className="font-black text-base text-slate-900 pt-1">คิวอาร์โค้ดประจำร้านค้าของท่าน</h3>
                  <p className="text-[10px] text-slate-500 font-bold leading-normal">
                    บันทึกรูปนี้ส่งต่อเข้าแอป LINE หมู่บ้าน เพื่อแชร์ลิงก์สั่งซื้อให้ชาวบ้านใกล้เคียงสแกนจองสลาก N3 ได้เลยทันที!
                  </p>
                </div>

                {/* QR Code container */}
                <div className="bg-[#0B2545]/5 p-4 rounded-[24px] border-2 border-dashed border-[#D4AF37] w-fit mx-auto shadow-inner">
                  <div className="bg-white p-3 rounded-xl shadow-md w-36 h-36 flex items-center justify-center border border-slate-200">
                    <img 
                      className="w-full h-full object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSY80aaawpzTzomkLBd1DFYgcP_XdF-DOLkwe8dK3GNbb-aQLOh-aOCAU--mCR-mprigfEceOOgVb4MLHXQ8YYoMOvXniZ4lLsIhvEykRIM0hlhn45i2XSDfFvz4zVhd6N5sRFDqSthrVKRvAmTk8aFdriTU-FiUftQiXlxyaqhP9_k-1O9NVpWDIjHJsu5DrE0wxMsUoP8G6WCEcJYqrtVKA4NpsLnjsC9oJYswryFsbb8OMhobAC4Mk5q-GADjIQgEtr6nCphuxL" 
                      alt="Official N3 Shop QR Code" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black text-blue-900">{storeName}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">เวลาทำการ: {storeHours}</p>
                </div>

                {/* Share Actions */}
                <div className="flex gap-2.5 pt-1.5">
                  <button 
                    onClick={() => { setQrModalOpen(false); showToast('🔗 บันทึกภาพลงเครื่องเสร็จสิ้น!'); }}
                    className="flex-1 py-3 bg-slate-100 text-slate-800 font-black text-xs rounded-xl hover:bg-slate-200 transition-transform active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Download size={14} />
                    <span>บันทึกรูปภาพ</span>
                  </button>
                  <button 
                    onClick={() => { setQrModalOpen(false); showToast('🔗 คัดลอกลิงก์ร้านค้า และเปิด LINE แชร์เรียบร้อย!'); }}
                    className="flex-1 py-3 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1 hover:bg-emerald-700"
                  >
                    <Share2 size={14} />
                    <span>แชร์เข้าไลน์</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Agent Bottom Navigation Bar (Floating Pill, Unified Design System) */}
        <nav id="agent-bottom-nav" className="absolute bottom-5 left-4 right-4 bg-emerald-950 text-white rounded-2xl px-1.5 py-2.5 shadow-xl flex justify-around items-center z-30 border border-emerald-900">
          {[
            { id: 'home', label: 'หน้าหลัก', icon: LayoutDashboard },
            { id: 'orders', label: 'ออเดอร์', icon: ClipboardList, badge: 1 },
            { id: 'customers', label: 'ลูกค้า', icon: Users },
            { id: 'store', label: 'หน้าร้าน', icon: Store },
            { id: 'reports', label: 'รายงาน', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 flex-1 relative transition-all active:scale-95 ${isActive ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="relative">
                  <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-1.5'} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[7.5px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono border border-emerald-950">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[8px] font-prompt leading-none font-black">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </>
    )}

        {/* Visual Simulated Mobile Home Indicator Bar */}
        <div className="h-5 w-full bg-white flex justify-center items-center shrink-0 relative z-30 pb-1.5 border-t border-slate-50">
          <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
