import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  HelpCircle, 
  X, 
  Check, 
  RotateCcw, 
  Store, 
  Share2, 
  Heart,
  ChevronRight,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle,
  Home,
  Search,
  Star,
  MapPin,
  Calendar,
  Smartphone,
  Bell,
  User
} from 'lucide-react';

// Import mock data and types
import { mockShops, mockOrders, mockNotifications, mockCustomerProfile } from './data';
import { Shop, Order } from './types';
import AgentView from './components/AgentView';
import AdminView from './components/AdminView';
import RoleSelection from './components/RoleSelection';

// Predefined suggestions for N3 suggestions
const SUGGESTIONS = {
  popular: ['123', '789', '999', '888', '168', '555', '111', '000'],
  recommended: ['168', '245', '456', '555', '888', '289', '365', '599'],
  trending: ['999', '007', '911', '777', '123', '112', '889', '234']
};

const initialAgentAccounts = [
  {
    id: 'AG-001245',
    name: 'คุณเจ๊แมว บางใหญ่',
    email: 'jamaew.n3@n3agent.com',
    phone: '089-123-5124',
    password: '123456',
    shopName: 'ร้านเจ๊แมว N3',
    area: 'บางใหญ่, นนทบุรี',
    hours: 'เปิดบริการทุกวัน 07:00 - 21:00 น.',
    shopPhone: '089-124-5124',
    desc: 'ศูนย์รวมสลากกินแบ่งและเลข N3 แท้ 100% จัดส่งรวดเร็ว ปลอดภัย ได้โควตาตรงจากรัฐบาล มั่นใจบริการเป็นกันเอง',
    status: 'Approved',
    level: 'Pro',
    submittedAt: '2026-07-01 10:00',
    notes: '',
    documents: {
      idCard: 'uploaded',
      idCardWithFace: 'uploaded',
      agentLicense: 'uploaded',
      shopPhoto: 'uploaded',
    }
  },
  {
    id: 'AG-001246',
    name: 'ตัวแทนสมชาย นนทบุรี',
    email: 'somchai.n3@n3agent.com',
    phone: '088-222-3333',
    password: '123456',
    shopName: 'ตัวแทนสมชาย N3',
    area: 'เมืองนนทบุรี (ตรงข้ามตลาดนนท์)',
    hours: 'เปิดบริการทุกวัน 08:00 - 20:00 น.',
    shopPhone: '081-568-1568',
    desc: 'ตัวแทนจำหน่ายหวย N3 ประจำพื้นที่เมืองนนทบุรี บริการประทับใจ ซื่อสัตย์ รวดเร็ว',
    status: 'Pending Review',
    level: 'Basic',
    submittedAt: '2026-07-07 09:30',
    notes: '',
    documents: {
      idCard: 'uploaded',
      idCardWithFace: 'uploaded',
      agentLicense: 'uploaded',
      shopPhoto: 'uploaded',
    }
  },
  {
    id: 'AG-001247',
    name: 'บ้านสลาก ปากเกร็ด',
    email: 'baansalak.n3@n3agent.com',
    phone: '087-111-2222',
    password: '123456',
    shopName: 'บ้านสลาก N3',
    area: 'ปากเกร็ด นนทบุรี (ห้าแยกปากเกร็ด)',
    hours: 'เปิดบริการทุกวัน 06:00 - 22:00 น.',
    shopPhone: '082-104-2104',
    desc: 'บ้านสลาก N3 จุดรับจองและจำหน่ายสลากดิจิทัล มีบอร์ดเลขเด็ดให้เลือกชม',
    status: 'Need More Info',
    level: 'Basic',
    submittedAt: '2026-07-06 15:45',
    notes: 'รูปเอกสารไม่ชัดเจน กรุณาอัปโหลดใหม่อีกครั้ง',
    documents: {
      idCard: 'uploaded',
      idCardWithFace: 'need_edit',
      agentLicense: 'uploaded',
      shopPhoto: 'uploaded',
    }
  }
];

export default function App() {
  // User Role state: null | 'customer' | 'agent' | 'admin'
  const [currentRole, setCurrentRole] = useState<'customer' | 'agent' | 'admin' | null>(null);

  // Agent accounts state
  const [agentAccounts, setAgentAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('n3_agent_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return initialAgentAccounts;
  });

  useEffect(() => {
    localStorage.setItem('n3_agent_accounts', JSON.stringify(agentAccounts));
  }, [agentAccounts]);

  // Logged in agent state
  const [loggedInAgentPhone, setLoggedInAgentPhone] = useState<string | null>(() => {
    return localStorage.getItem('n3_logged_in_agent_phone');
  });

  useEffect(() => {
    if (loggedInAgentPhone) {
      localStorage.setItem('n3_logged_in_agent_phone', loggedInAgentPhone);
    } else {
      localStorage.removeItem('n3_logged_in_agent_phone');
    }
  }, [loggedInAgentPhone]);

  const handleUpdateAgentStatus = (phone: string, newStatus: string, notes?: string) => {
    setAgentAccounts(prev => prev.map(acc => {
      if (acc.phone === phone) {
        return {
          ...acc,
          status: newStatus,
          notes: notes !== undefined ? notes : (acc.notes || '')
        };
      }
      return acc;
    }));
  };

  // Navigation Screens state
  const [currentScreen, setCurrentScreen] = useState<
    'role-selection' | 'customer-home' | 'agent-dashboard' | 'admin-overview' | 'home' | 'shop-detail' | 'number-selection' | 'summary' | 'success' | 'history'
  >('role-selection');
  
  // Navigation stack for custom back actions
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Function to return to role selection screen
  const goToRoleSelection = () => {
    setCurrentRole(null);
    setCurrentScreen('role-selection');
  };

  // Selected entities state
  const [selectedShop, setSelectedShop] = useState<Shop>(mockShops[0]); // Default to first shop (ร้านเจ๊แมว N3)
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  // Selected digit state (null or string '0'-'9')
  const [hundreds, setHundreds] = useState<string | null>(null);
  const [tens, setTens] = useState<string | null>(null);
  const [units, setUnits] = useState<string | null>(null);

  // Booking detail state
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  
  // Customer info in Summary Screen
  const [customerName, setCustomerName] = useState<string>('คุณนลินี รักดี');
  const [customerPhone, setCustomerPhone] = useState<string>('089-765-4321');

  // Suggestion tabs state
  const [activeTab, setActiveTab] = useState<'popular' | 'recommended' | 'trending'>('popular');

  // Customer Bottom Tab navigation state
  const [customerTab, setCustomerTab] = useState<'home' | 'shops' | 'my-bookings' | 'notifications' | 'account'>('home');

  // Shops tab specific filters
  const [shopsFilter, setShopsFilter] = useState<'all' | 'nearby' | 'popular' | 'verified'>('all');

  // Bookings/History tab specific filters
  const [bookingsFilter, setBookingsFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  // Customer state
  const [notificationsList, setNotificationsList] = useState(mockNotifications);
  const [followedShops, setFollowedShops] = useState<string[]>(mockCustomerProfile.favoriteShops || ['shop1', 'shop3']);
  const [appNotificationsEnabled, setAppNotificationsEnabled] = useState<boolean>(true);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState<boolean>(true);

  // Search and filter for Home screen
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [homeFilter, setHomeFilter] = useState<'all' | 'popular' | 'nearby'>('all');

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<Order | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [latestBookingRef, setLatestBookingRef] = useState<string>('');

  // Auto-clear toast helper
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Helper to safely navigate to screen and track stack
  const navigateTo = (
    screen:
      | 'role-selection'
      | 'customer-home'
      | 'agent-dashboard'
      | 'admin-overview'
      | 'home'
      | 'shop-detail'
      | 'number-selection'
      | 'summary'
      | 'success'
      | 'history'
  ) => {
    setNavigationHistory(prev => [...prev, currentScreen]);
    if (screen === 'history') {
      setCustomerTab('my-bookings');
      setCurrentScreen('customer-home');
    } else if (screen === 'home') {
      setCustomerTab('home');
      setCurrentScreen('customer-home');
    } else {
      setCurrentScreen(screen);
    }
  };

  // Custom back button handler
  const handleBack = () => {
    if (currentScreen === 'shop-detail') {
      setCurrentScreen('customer-home');
    } else if (currentScreen === 'number-selection') {
      setCurrentScreen('shop-detail');
    } else if (currentScreen === 'summary') {
      setCurrentScreen('number-selection');
    } else if (currentScreen === 'success') {
      setCurrentScreen('customer-home');
    } else if (currentScreen === 'history') {
      setCurrentScreen('customer-home');
    } else {
      setCurrentScreen('customer-home');
    }
  };

  // Select a 3-digit number from suggestions
  const handleSelectSuggestion = (numStr: string) => {
    if (numStr.length === 3) {
      setHundreds(numStr[0]);
      setTens(numStr[1]);
      setUnits(numStr[2]);
      showToast(`🎯 เลือกเลขแนะนำ "${numStr}" เรียบร้อยแล้ว!`, 'success');
    }
  };

  // Randomize all 3 digits with a fun visual delay
  const handleRandomize = () => {
    setIsSpinning(true);
    showToast("🎲 กำลังสุ่มเลขนำโชคให้คุณ...", "info");

    let count = 0;
    const interval = setInterval(() => {
      setHundreds(Math.floor(Math.random() * 10).toString());
      setTens(Math.floor(Math.random() * 10).toString());
      setUnits(Math.floor(Math.random() * 10).toString());
      count++;
      if (count > 8) {
        clearInterval(interval);
        const h = Math.floor(Math.random() * 10).toString();
        const t = Math.floor(Math.random() * 10).toString();
        const u = Math.floor(Math.random() * 10).toString();
        setHundreds(h);
        setTens(t);
        setUnits(u);
        setIsSpinning(false);
        showToast(`🎉 ได้เลขสุ่มนำโชค: ${h}${t}${u} !`, 'success');
      }
    }, 80);
  };

  // Clear selections
  const handleClear = () => {
    setHundreds(null);
    setTens(null);
    setUnits(null);
    setQuantity(1);
    setNote('');
    showToast("🧹 ล้างข้อมูลที่เลือกแล้ว", "info");
  };

  // Fill random popular number
  const handlePopularFill = () => {
    const populars = ['123', '168', '999'];
    const randomPopular = populars[Math.floor(Math.random() * populars.length)];
    setHundreds(randomPopular[0]);
    setTens(randomPopular[1]);
    setUnits(randomPopular[2]);
    showToast(`✨ เติมเลขยอดนิยม: ${randomPopular} เรียบร้อยแล้ว!`, 'success');
  };

  // Check if selection is completed
  const isComplete = hundreds !== null && tens !== null && units !== null;
  const currentNumberStr = `${hundreds ?? '_'}${tens ?? '_'}${units ?? '_'}`;

  // Price calculations
  const pricePerSet = 80;
  const totalPrice = isComplete ? quantity * pricePerSet : 0;

  // Final submit handler (adds booking to state history)
  const handleFinalSubmit = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast("⚠️ กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วน", "warning");
      return;
    }

    const refCode = `TXN-N3-${Math.floor(100000 + Math.random() * 900000)}`;
    setLatestBookingRef(refCode);

    const newOrder: Order = {
      id: refCode,
      shopName: selectedShop.shopName || selectedShop.name,
      shopImage: selectedShop.logo || 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=120',
      date: 'วันนี้ • ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      amount: totalPrice,
      itemsCount: quantity,
      status: 'pending',
      itemsSummary: `สลากดิจิทัล N3 หมายเลข: ${currentNumberStr} จำนวน ${quantity} ชุด (${customerName} • ${customerPhone})`
    };

    setOrders([newOrder, ...orders]);
    navigateTo('success');
    showToast("🎉 ส่งคำจองสิทธิ์สำเร็จแล้ว!", "success");
  };

  // Filter shops for Home Screen
  const filteredShops = mockShops.filter(shop => {
    const sName = shop.shopName || shop.name || '';
    const sLoc = shop.location || shop.address || '';
    const matchSearch = sName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        sLoc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchSearch) return false;
    if (homeFilter === 'popular') return shop.badgeType === 'popular' || shop.rating >= 4.8;
    if (homeFilter === 'nearby') return shop.badgeType === 'nearby' || shop.location.includes('บางใหญ่');
    return true;
  });

  if (currentScreen === 'role-selection') {
    return (
      <RoleSelection 
        onSelectCustomer={() => {
          setCurrentRole('customer');
          setCurrentScreen('customer-home');
        }}
        onSelectAgent={() => {
          setCurrentRole('agent');
          setCurrentScreen('agent-dashboard');
        }}
        onSelectAdmin={() => {
          setCurrentRole('admin');
          setCurrentScreen('admin-overview');
        }}
      />
    );
  }

  if (currentRole === 'agent') {
    return (
      <AgentView 
        onBackToRoles={goToRoleSelection} 
        agentAccounts={agentAccounts}
        onUpdateAgentAccounts={setAgentAccounts}
        loggedInAgentPhone={loggedInAgentPhone}
        onSetLoggedInAgentPhone={setLoggedInAgentPhone}
      />
    );
  }

  if (currentRole === 'admin') {
    return (
      <AdminView 
        onBackToRoles={goToRoleSelection} 
        agentAccounts={agentAccounts}
        onUpdateAgentStatus={handleUpdateAgentStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center p-0 md:p-6 font-sans antialiased text-slate-800">
      
      {/* CENTER: Mobile Frame Mockup (390px iPhone-first container) */}
      <div className="w-full max-w-[390px] min-h-screen md:min-h-[820px] md:h-[820px] bg-slate-50 md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800 overflow-hidden flex flex-col justify-between relative transition-all">
        
        {/* Toast Warning Alert Banner */}
        {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700/50 animate-fade-in-down">
            {toastType === 'success' && <CheckCircle2 className="text-emerald-400 shrink-0 w-5 h-5" />}
            {toastType === 'info' && <Sparkles className="text-blue-400 shrink-0 w-5 h-5" />}
            {toastType === 'warning' && <Info className="text-amber-400 shrink-0 w-5 h-5" />}
            <span className="font-prompt font-bold text-xs leading-snug">{toastMessage}</span>
          </div>
        )}

        {/* Top App Status Bar (Simulating Native Mobile App Top Status) */}
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

        {(currentScreen === 'home' || currentScreen === 'customer-home' || currentScreen === 'history') && (
          <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
            
            {/* Unified Customer Header */}
            <header className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center shadow-md z-20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-prompt font-black text-base flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  N3
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-prompt text-sm font-black tracking-tight leading-none text-white">
                      N3 ลูกค้า
                      {customerTab === 'home' ? '' : 
                       customerTab === 'shops' ? ': ร้านค้า' : 
                       customerTab === 'my-bookings' ? ': รายการจอง' : 
                       customerTab === 'notifications' ? ': แจ้งเตือน' : ': บัญชี'}
                    </h1>
                    <span className="bg-blue-900 text-amber-300 font-prompt font-black text-[8px] px-1.5 py-0.5 rounded-md leading-none">Customer</span>
                  </div>
                  <p className="text-[9px] text-blue-100 font-medium mt-1 font-prompt">N3 Marketplace</p>
                </div>
              </div>
              
              <button 
                id="btn-switch-role"
                onClick={goToRoleSelection}
                className="text-[10px] font-prompt font-black bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-full active:scale-95 transition-transform cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
              >
                เปลี่ยนบทบาท
              </button>
            </header>

            {/* 1. HOME TAB */}
            {customerTab === 'home' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
                  {/* Senior Welcome Banner */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-white/5 rounded-full pointer-events-none"></div>
                    <div className="relative z-10 space-y-1.5">
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-prompt">
                        ค้นหาตัวแทนใกล้ตัว
                      </span>
                      <h2 className="font-prompt text-lg font-black leading-tight">สลาก 3 หลัก (N3) สั่งง่าย มั่นใจได้จริง</h2>
                      <p className="text-[10px] text-blue-100 leading-relaxed font-medium font-prompt">
                        เลือกตัวแทนจำหน่ายที่ท่านถูกใจ เพื่อเข้าไปกดเลือกเลข 3 หลัก โต๊ด หรือ เต็ง ได้อย่างอิสระและโทรประสานงานได้ทันที
                      </p>
                    </div>
                  </div>

                  {/* 3 Unified Customer KPI Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm flex flex-col justify-between h-[76px]">
                      <span className="text-[9px] text-slate-400 font-prompt font-black block">สิทธิ์จองสะสม</span>
                      <div className="mt-1 flex items-baseline gap-0.5">
                        <span className="text-lg font-black text-blue-700 font-mono">12</span>
                        <span className="text-[8px] text-slate-400 font-prompt font-bold">ใบ</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm flex flex-col justify-between h-[76px]">
                      <span className="text-[9px] text-slate-400 font-prompt font-black block">คะแนนสะสม</span>
                      <div className="mt-1 flex items-baseline gap-0.5">
                        <span className="text-lg font-black text-amber-500 font-mono">240</span>
                        <span className="text-[8px] text-slate-400 font-prompt font-bold">แต้ม</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm flex flex-col justify-between h-[76px]">
                      <span className="text-[9px] text-slate-400 font-prompt font-black block">แจ้งเตือนใหม่</span>
                      <div className="mt-1 flex items-baseline gap-0.5">
                        <span className="text-lg font-black text-rose-500 font-mono">2</span>
                        <span className="text-[8px] text-slate-400 font-prompt font-bold">เรื่อง</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-prompt font-black text-xs text-slate-800 tracking-tight">เมนูใช้งานหลัก</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button 
                        onClick={() => setCustomerTab('shops')}
                        className="bg-white border border-slate-200 hover:border-blue-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                          <Store size={18} />
                        </div>
                        <div>
                          <span className="font-prompt font-black text-xs text-slate-900 block">ค้นหาหน้าร้าน</span>
                          <span className="text-[9px] text-slate-400 truncate block font-prompt">ดูตัวแทนจำหน่ายใกล้บ้านคุณ</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setCustomerTab('my-bookings')}
                        className="bg-white border border-slate-200 hover:border-blue-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <span className="font-prompt font-black text-xs text-slate-900 block">ประวัติการจอง</span>
                          <span className="text-[9px] text-slate-400 truncate block font-prompt">ตรวจเช็กและโทรติดตามรายการ</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => showToast("🏆 ผลรางวัลสลาก N3 งวดล่าสุด: เลข 3 ตัวตรงคือ 123", "success")}
                        className="bg-white border border-slate-200 hover:border-blue-600 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <span className="font-prompt font-black text-xs text-slate-900 block">ตรวจสลาก N3</span>
                          <span className="text-[9px] text-slate-400 truncate block font-prompt">ระบบตรวจสลากจำลองงวดล่าสุด</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setShowHelpModal(true)}
                        className="bg-blue-50/50 border border-blue-200 hover:bg-blue-50 p-3 rounded-2xl text-left shadow-sm active:scale-95 transition-all flex flex-col justify-between h-24 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                          <HelpCircle size={18} className="stroke-[2.5px]" />
                        </div>
                        <div>
                          <span className="font-prompt font-black text-xs text-blue-950 block">วิธีซื้อ N3</span>
                          <span className="text-[9px] text-blue-600 truncate block font-prompt font-bold">คู่มือสำหรับผู้สูงอายุ</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Search input - Large for Seniors */}
                  <div className="relative">
                    <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="พิมพ์ชื่อตัวแทน หรือ อำเภอ / นนทบุรี..."
                      className="w-full h-12 bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl pl-11 pr-4 text-xs font-prompt font-medium outline-none transition-all shadow-sm placeholder:text-slate-400"
                    />
                  </div>

                  {/* Category Filters */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-prompt font-black text-slate-700 flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-500 animate-pulse" /> ตัวกรองความน่าเชื่อถือ
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setHomeFilter('all')}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-prompt font-black border transition-all ${homeFilter === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        ทั้งหมด ({mockShops.length})
                      </button>
                      <button 
                        onClick={() => setHomeFilter('popular')}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-prompt font-black border transition-all ${homeFilter === 'popular' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        ⭐ ยอดนิยม
                      </button>
                      <button 
                        onClick={() => setHomeFilter('nearby')}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-prompt font-black border transition-all ${homeFilter === 'nearby' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        📍 บางใหญ่
                      </button>
                    </div>
                  </div>

                  {/* Shop List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-prompt font-black text-slate-800">รายชื่อตัวแทน N3 ({filteredShops.length} ร้าน)</span>
                      <span className="text-[10px] font-prompt font-bold text-slate-400">คลิกที่ร้านเพื่อดูหน้าร้าน</span>
                    </div>

                    {filteredShops.map((shop) => (
                      <div 
                        key={shop.id}
                        onClick={() => {
                          setSelectedShop(shop);
                          navigateTo('shop-detail');
                        }}
                        className="bg-white border border-slate-150 rounded-2xl p-3.5 hover:border-blue-400 active:scale-[0.98] transition-all cursor-pointer shadow-sm flex gap-3.5 relative overflow-hidden"
                      >
                        {shop.badgeType === 'popular' && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 font-prompt font-black text-[8px] px-2 py-0.5 rounded-bl-xl shadow-sm">
                            ยอดนิยม
                          </div>
                        )}

                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center relative">
                          <img 
                            src={shop.logo} 
                            alt={shop.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          {shop.isVerified && (
                            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-0.5 rounded-tl-lg border-t border-l border-white">
                              <ShieldCheck size={11} className="fill-white text-blue-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-prompt text-sm font-black text-slate-950 truncate">{shop.name}</h4>
                              <span className="bg-blue-50 text-blue-700 text-[8px] font-prompt font-black px-1.5 py-0.5 rounded-md border border-blue-100">
                                {shop.level}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium font-prompt truncate mt-0.5 flex items-center gap-1">
                              <MapPin size={10} className="text-slate-400 shrink-0" />
                              {shop.address}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-100/60 mt-1">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 font-prompt">
                              <Star size={11} fill="currentColor" />
                              <span>{shop.rating} ({shop.reviewsCount} รีวิว)</span>
                            </div>
                            <span className="text-[10px] font-prompt font-black text-blue-600 flex items-center gap-0.5">
                              ดูหน้าร้าน <ChevronRight size={11} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredShops.length === 0 && (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl p-4">
                        <p className="text-xs font-prompt font-bold text-slate-400">ไม่พบข้อมูลตัวแทนจำหน่ายที่ค้นหา</p>
                        <button 
                          onClick={() => { setSearchQuery(''); setHomeFilter('all'); }}
                          className="mt-3 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-prompt font-black"
                        >
                          ล้างคำค้นหาทั้งหมด
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. SHOPS TAB */}
            {customerTab === 'shops' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
                  {/* Search input */}
                  <div className="relative">
                    <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="พิมพ์ชื่อร้านตัวแทน หรือ ทำเลที่ตั้ง..."
                      className="w-full h-12 bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl pl-11 pr-4 text-xs font-prompt font-medium outline-none transition-all shadow-sm placeholder:text-slate-400"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-prompt font-bold text-slate-500 block px-0.5">ตัวกรองร้านตัวแทน</span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { id: 'all', label: 'ทั้งหมด' },
                        { id: 'nearby', label: '📍 ใกล้ฉัน' },
                        { id: 'popular', label: '⭐ ยอดนิยม' },
                        { id: 'verified', label: '✓ ยืนยันแล้ว' }
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => setShopsFilter(pill.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-prompt font-black border whitespace-nowrap transition-all ${shopsFilter === pill.id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shop Cards */}
                  <div className="space-y-3.5">
                    {mockShops
                      .filter(shop => {
                        const sName = shop.name || shop.shopName || '';
                        const sLoc = shop.address || shop.location || '';
                        const matchesSearch = sName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                              sLoc.toLowerCase().includes(searchQuery.toLowerCase());
                        if (!matchesSearch) return false;

                        if (shopsFilter === 'nearby') return shop.badgeType === 'nearby' || sLoc.includes('บางใหญ่');
                        if (shopsFilter === 'popular') return shop.badgeType === 'popular' || shop.rating >= 4.8;
                        if (shopsFilter === 'verified') return shop.isVerified;
                        return true;
                      })
                      .map((shop) => (
                        <div 
                          key={shop.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col"
                        >
                          <div className="flex gap-3.5">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-150 shrink-0 flex items-center justify-center relative">
                              <img src={shop.logo} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              {shop.isVerified && (
                                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-0.5 rounded-tl-lg">
                                  <ShieldCheck size={10} className="fill-white text-blue-600" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 justify-between">
                                <h4 className="font-prompt text-xs font-black text-slate-950 truncate">{shop.name}</h4>
                                <span className="bg-amber-100 text-amber-800 text-[8px] font-prompt font-black px-1.5 py-0.5 rounded border border-amber-200">
                                  {shop.level}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-prompt font-semibold truncate mt-1 flex items-center gap-1">
                                <MapPin size={9} className="text-slate-400" />
                                {shop.address}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 font-prompt mt-1.5">
                                <Star size={10} fill="currentColor" />
                                <span>{shop.rating} ({shop.reviewsCount} รีวิว)</span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              setSelectedShop(shop);
                              navigateTo('shop-detail');
                            }}
                            className="mt-3 w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-prompt font-black flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                          >
                            <span>ดูร้านค้า</span>
                            <ChevronRight size={13} className="stroke-[2.5px]" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. BOOKINGS TAB (รายการของฉัน) */}
            {customerTab === 'my-bookings' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
                  {/* Restore history and Sub-Header bar */}
                  <div className="flex justify-between items-center pb-1 pt-0.5 border-b border-slate-100">
                    <span className="text-xs font-prompt font-black text-slate-800">รายการสั่งจองจำลองสะสม</span>
                    <button 
                      onClick={() => {
                        showToast("🧹 คืนค่าข้อมูลประวัติเรียบร้อยแล้ว", "info");
                        setOrders(mockOrders);
                      }}
                      className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl font-prompt font-black transition-all active:scale-95 shrink-0 flex items-center gap-1"
                      title="รีเซ็ตประวัติ"
                    >
                      <RotateCcw size={12} />
                      <span>คืนค่าข้อมูล</span>
                    </button>
                  </div>

                  {/* Status Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: 'all', label: 'ทั้งหมด' },
                      { id: 'pending', label: '🕒 รอดำเนินการ' },
                      { id: 'accepted', label: '✓ รับรายการแล้ว' },
                      { id: 'completed', label: '🎉 เสร็จสิ้น' }
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setBookingsFilter(pill.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-prompt font-black whitespace-nowrap border transition-all ${bookingsFilter === pill.id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {/* List of Orders */}
                  <div className="space-y-3.5">
                    {orders
                      .filter(order => {
                        if (bookingsFilter === 'pending') return order.status === 'pending';
                        if (bookingsFilter === 'accepted') return order.status === 'success' && order.id !== 'TXN-N3-1001';
                        if (bookingsFilter === 'completed') return order.status === 'success' && order.id === 'TXN-N3-1001';
                        return true;
                      })
                      .map((order) => {
                        const isPending = order.status === 'pending';
                        return (
                          <div 
                            key={order.id}
                            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col space-y-2 relative"
                          >
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-[10px] font-prompt font-bold">
                              <span className="text-slate-400 font-mono">{order.id}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                isPending 
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                  : 'bg-emerald-50 text-emerald-600 border border-emerald-150'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                {isPending ? '🕒 รอดำเนินการ' : '✓ ได้รับสิทธิ์จริง'}
                              </span>
                            </div>

                            <div className="flex gap-3 pt-1">
                              <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                <img src={order.shopImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-prompt text-xs font-black text-slate-900 truncate">{order.shopName}</h4>
                                <p className="text-[10px] text-slate-400 font-prompt font-bold truncate mt-0.5">{order.date}</p>
                                <p className="text-[10px] text-slate-500 font-prompt font-semibold mt-1 leading-snug truncate-2-lines">
                                  {order.itemsSummary}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-1 text-xs">
                              <span className="text-slate-400 font-prompt font-bold">ราคารวมทั้งสิ้น:</span>
                              <span className="font-prompt font-black text-amber-500">
                                ฿{order.amount.toLocaleString()} บาท
                              </span>
                            </div>

                            <button 
                              onClick={() => setSelectedHistoryOrder(order)}
                              className="mt-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-prompt font-black flex items-center justify-center gap-1 border border-slate-200 transition-all cursor-pointer"
                            >
                              <span>ดูรายละเอียด</span>
                            </button>
                          </div>
                        );
                      })}

                    {orders.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                        <p className="text-xs font-prompt font-bold text-slate-400">ยังไม่มีรายการจองใดๆ ในฐานข้อมูล</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS TAB */}
            {customerTab === 'notifications' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-blue-700 text-white px-4 py-3.5 flex justify-between items-center shadow-md z-20 shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell size={20} className="text-amber-400 animate-bounce" />
                    <div>
                      <h1 className="font-prompt text-base font-black tracking-tight leading-none">การแจ้งเตือน</h1>
                      <p className="text-[9px] text-blue-100 font-medium mt-1 font-prompt">ข่าวสารจากระบบและร้านค้าตัวแทน</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
                      showToast("✓ อ่านแจ้งเตือนทั้งหมดเรียบร้อย", "success");
                    }}
                    className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl font-prompt font-black transition-all active:scale-95 shrink-0"
                  >
                    อ่านทั้งหมด
                  </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
                  {notificationsList.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        setNotificationsList(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex gap-3 ${notif.isRead ? 'bg-white border-slate-150 shadow-sm' : 'bg-blue-50/40 border-blue-100 shadow-md'}`}
                    >
                      {!notif.isRead && (
                        <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bell size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-prompt text-xs font-black text-slate-900 pr-4 leading-snug">{notif.title}</h4>
                        <p className="text-[10px] text-slate-500 font-prompt font-medium leading-relaxed">{notif.content}</p>
                        <span className="inline-block text-[9px] text-slate-400 font-semibold font-mono pt-1">{notif.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ACCOUNT TAB */}
            {customerTab === 'account' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-blue-700 text-white px-4 py-3.5 flex justify-between items-center shadow-md z-20 shrink-0">
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-amber-400" />
                    <div>
                      <h1 className="font-prompt text-base font-black tracking-tight leading-none">บัญชีผู้ใช้</h1>
                      <p className="text-[9px] text-blue-100 font-medium mt-1 font-prompt">ข้อมูลโปรไฟล์และการตั้งค่าของคุณ</p>
                    </div>
                  </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
                  {/* Profile Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 bg-slate-50 shrink-0">
                      <img 
                        src={mockCustomerProfile.image} 
                        alt={mockCustomerProfile.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-prompt text-sm font-black text-slate-900">{customerName}</h3>
                      <p className="text-xs font-prompt font-semibold text-slate-500 mt-0.5">{customerPhone}</p>
                      <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-prompt font-black px-2 py-0.5 rounded-full mt-1.5">
                        ✓ ลูกค้าผ่านการรับรอง
                      </span>
                    </div>
                  </div>

                  {/* Followed Shops */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-prompt font-black text-slate-700 px-0.5">❤️ ร้านตัวแทนที่คุณบันทึกไว้</h3>
                    <div className="space-y-2">
                      {followedShops.map((shopId) => {
                        const shop = mockShops.find(s => s.id === shopId);
                        if (!shop) return null;
                        return (
                          <div 
                            key={shopId}
                            onClick={() => {
                              setSelectedShop(shop);
                              navigateTo('shop-detail');
                            }}
                            className="bg-white border border-slate-150 rounded-xl p-3 hover:border-blue-300 transition-all cursor-pointer flex justify-between items-center shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <img src={shop.logo} className="w-8 h-8 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                              <div>
                                <h4 className="font-prompt text-xs font-black text-slate-900">{shop.name}</h4>
                                <p className="text-[9px] text-slate-400 font-prompt font-bold">{shop.level}</p>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-400" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* App Config */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
                    <h3 className="text-xs font-prompt font-black text-slate-800">⚙️ การตั้งค่าการแจ้งเตือน</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-prompt font-black text-slate-700">แจ้งเตือนในแอปพลิเคชัน</span>
                        <p className="text-[9px] text-slate-400 font-prompt font-semibold">รับข้อความสถานะส่งคำสั่งสลากแบบพุช</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={appNotificationsEnabled} 
                          onChange={() => setAppNotificationsEnabled(!appNotificationsEnabled)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-prompt font-black text-slate-700">แจ้งเตือนผ่าน SMS ด่วน</span>
                        <p className="text-[9px] text-slate-400 font-prompt font-semibold">ส่งสิทธิ์ยืนยันไปยังเบอร์โทรศัพท์ของคุณ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={smsNotificationsEnabled} 
                          onChange={() => setSmsNotificationsEnabled(!smsNotificationsEnabled)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={goToRoleSelection}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-prompt font-black text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Smartphone size={16} />
                      สลับ/เปลี่ยนบทบาท (สลับไปฝั่งตัวแทน หรือแอดมิน)
                    </button>
                    <button 
                      onClick={() => {
                        showToast("👋 ออกจากระบบจำลองแล้ว", "info");
                        goToRoleSelection();
                      }}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-150 rounded-2xl font-prompt font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom 5-Tab Navigation Bar */}
            <div className="absolute bottom-5 left-4 right-4 bg-slate-900 text-white rounded-2xl px-2 py-2.5 shadow-xl flex justify-around items-center z-30 border border-slate-850">
              {[
                { id: 'home', label: 'หน้าหลัก', icon: Home },
                { id: 'shops', label: 'ร้านค้า', icon: Store },
                { id: 'my-bookings', label: 'รายการของฉัน', icon: Calendar },
                { id: 'notifications', label: 'แจ้งเตือน', icon: Bell, badge: notificationsList.filter(n => !n.isRead).length },
                { id: 'account', label: 'บัญชี', icon: User }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = customerTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setCustomerTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1 flex-1 relative transition-colors ${isActive ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    <div className="relative">
                      <Icon size={18} />
                      {tab.badge && tab.badge > 0 ? (
                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono">
                          {tab.badge}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[8px] font-prompt font-black leading-none">{tab.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        )}


        {/* ==========================================
            SCREEN 2: SHOP DETAIL SCREEN
            ========================================== */}
        {currentScreen === 'shop-detail' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-blue-700 text-white px-4 py-3.5 flex items-center gap-3.5 shadow-md z-20 shrink-0">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-white"
                title="ย้อนกลับ"
              >
                <ArrowLeft size={20} className="stroke-[2.5px]" />
              </button>
              <div>
                <h1 className="font-prompt text-base font-black tracking-tight leading-none text-white">รายละเอียดร้านค้า</h1>
                <p className="text-[9px] text-blue-100 font-medium mt-1">ตรวจประวัติสิทธิ์และจองสลาก N3</p>
              </div>
            </header>

            {/* Scrollable Shop details content */}
            <div className="flex-1 overflow-y-auto pb-24">
              
              {/* Cover Banner Image with overlays */}
              <div className="relative h-44 bg-slate-200">
                <img 
                  src={selectedShop.coverImage} 
                  alt={selectedShop.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Float badges over image */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      เปิดบริการ
                    </span>
                    <h2 className="font-prompt text-lg font-black leading-none mt-1">{selectedShop.name}</h2>
                  </div>
                  <div className="bg-amber-400 text-slate-950 px-2 py-1 rounded-xl text-[10px] font-prompt font-black shadow-md flex items-center gap-0.5">
                    ⭐ {selectedShop.rating}
                  </div>
                </div>
              </div>

              {/* Shop Main Information Details */}
              <div className="p-4 space-y-4">
                
                {/* Government Certificate Badge (Senior Trust Booster) */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-3.5 flex gap-3 items-start shadow-sm">
                  <ShieldCheck size={26} className="text-blue-600 fill-blue-50 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="font-prompt text-xs font-black text-blue-900">ตัวแทนจำหน่ายที่ได้รับอนุญาตอย่างเป็นทางการ</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-prompt">
                      ผ่านการลงทะเบียนรับรองสิทธิ์จำลองสลาก N3 จากสำนักงานสลากกินแบ่งรัฐบาล มั่นใจในความโปร่งใส ปลอดภัย ตรวจสอบได้
                    </p>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-prompt text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5">📢 คำอธิบายและความน่าเชื่อถือร้าน</h3>
                  <p className="text-[11px] text-slate-600 font-prompt leading-relaxed">
                    {selectedShop.description || "ยินดีต้อนรับเข้าสู่ร้านค้าตัวแทนจำหน่ายอย่างเป็นทางการ เราพร้อมอำนวยความสะดวกในการจัดสรรสิทธิ์จองสลาก N3 ในระบบจำลองให้คนในชุมชนอย่างทั่วถึง"}
                  </p>
                  
                  {/* Quota details and metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-center">
                      <span className="block text-[8px] font-prompt font-bold text-slate-400">โควตาคงเหลือจำลอง</span>
                      <span className="font-prompt text-sm font-black text-blue-600">2,000 ใบ</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-center">
                      <span className="block text-[8px] font-prompt font-bold text-slate-400">ประวัติการสั่งจอง</span>
                      <span className="font-prompt text-sm font-black text-emerald-600">ดีเยี่ยม (✓ 100%)</span>
                    </div>
                  </div>
                </div>

                {/* Contact and address Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
                  <h3 className="font-prompt text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5">📍 ข้อมูลจุดจำหน่ายและติดต่อ</h3>
                  
                  <div className="space-y-2.5 font-prompt font-semibold text-slate-700">
                    <div className="flex gap-2 items-start">
                      <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-400 text-[9px]">ที่ตั้งหน้าร้านจริง</span>
                        <p className="text-[11px] text-slate-700">{selectedShop.address}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <Phone size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-400 text-[9px]">เบอร์โทรศัพท์สำหรับโทรยืนยัน</span>
                        <p className="text-[11px] text-slate-700 font-mono">{selectedShop.phone || '089-124-5124'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <Clock size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-slate-400 text-[9px]">เวลาทำการทุกวัน</span>
                        <p className="text-[11px] text-slate-700">{selectedShop.openTime} - {selectedShop.closeTime} น.</p>
                      </div>
                    </div>
                  </div>

                  {/* Simulate call action button */}
                  <button 
                    onClick={() => showToast(`📞 กำลังโทรจำลองไปยังเบอร์: ${selectedShop.phone || '089-124-5124'} (ติดต่อเสร็จสิ้น)`, 'success')}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-prompt font-black rounded-xl text-center block"
                  >
                    📞 โทรสอบถามที่ร้านโดยตรง
                  </button>
                </div>

              </div>
            </div>

            {/* Bottom sticky action bar with selection button */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-30 shrink-0">
              <button
                onClick={() => navigateTo('number-selection')}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-prompt font-black text-xs rounded-xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-500"
              >
                <Sparkles size={16} className="text-amber-300 animate-pulse" />
                <span>ดำเนินการเลือกเลข N3 ของร้านนี้</span>
              </button>
            </div>
          </div>
        )}


        {/* ==========================================
            SCREEN 3: N3 NUMBER SELECTION SCREEN
            ========================================== */}
        {currentScreen === 'number-selection' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with back navigation returning to Shop Detail */}
            <header className="bg-blue-700 text-white px-4 py-3.5 flex justify-between items-center shadow-md z-20 shrink-0">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setCurrentScreen('shop-detail')}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-white"
                  title="กลับหน้าข้อมูลร้าน"
                >
                  <ArrowLeft size={20} className="text-white stroke-[2.5px]" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-prompt text-base font-black tracking-tight leading-none text-white">เลือกเลข N3</h1>
                    <span className="bg-amber-400 text-slate-950 font-prompt font-black text-[8px] px-1.5 py-0.5 rounded-full">HOT</span>
                  </div>
                  <p className="text-[9px] text-blue-100 font-medium truncate max-w-[190px] mt-1">ร้านค้า: {selectedShop.shopName || selectedShop.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    showToast(isFavorite ? "💔 เลิกเป็นร้านโปรดแล้ว" : "❤️ บันทึกเป็นร้านโปรดแล้ว", "info");
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-rose-500/10 text-rose-500' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className="stroke-[2.5px]" />
                </button>
                <button 
                  onClick={() => setShowHelpModal(true)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
                >
                  <HelpCircle size={18} className="stroke-[2.5px]" />
                </button>
              </div>
            </header>

            {/* Main Selection Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-48">
              
              {/* Promotion / Quota Box & Thai Header Subtitle */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex flex-col gap-2 shadow-sm">
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">i</span>
                  <div className="text-[10px] text-blue-900 leading-relaxed font-bold font-prompt">
                    <p className="font-extrabold text-blue-900">แนะนำการสั่งจองจำลอง N3</p>
                    <p className="font-medium text-slate-500 mt-0.5">ราคาใบละ 80 บาท หลังจากเลือกเลขสลากครบและส่งสรุปรายการแล้ว เจ๊แมวจะติดต่อกลับเพื่อโอนสิทธิ์จริงในแอปเป๋าตัง</p>
                  </div>
                </div>
                <div className="border-t border-blue-100/60 pt-2 text-center">
                  <p className="text-[10.5px] font-prompt font-black text-blue-800 bg-white/80 py-1.5 px-2 rounded-lg border border-blue-100">
                    📢 พิมพ์เลข 3 หลักได้ทันที หรือเลือกทีละหลักด้านล่าง
                  </p>
                </div>
              </div>

              {/* 1. Direct 3-digit typing input container */}
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-prompt text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500 animate-pulse" />
                    พิมพ์เลข 3 หลักได้ทันที
                  </h3>
                  <span className="text-[9px] font-prompt font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    สะดวกรวดเร็ว
                  </span>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    value={`${hundreds ?? ''}${tens ?? ''}${units ?? ''}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setHundreds(val.length > 0 ? val[0] : null);
                      setTens(val.length > 1 ? val[1] : null);
                      setUnits(val.length > 2 ? val[2] : null);
                    }}
                    placeholder="กรอกเลข 3 หลัก เช่น 123"
                    className="w-full text-center font-mono text-2xl font-black h-14 bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-slate-400 placeholder:font-prompt placeholder:text-sm placeholder:font-bold tracking-widest text-slate-900 shadow-inner"
                  />
                  
                  {/* Status Helper under the input */}
                  {isComplete ? (
                    <span className="text-[10px] font-prompt font-bold text-emerald-600 flex items-center gap-0.5 pt-0.5">
                      ✓ แสดงในกล่อง "เลขที่คุณเลือก" เรียบร้อยแล้ว
                    </span>
                  ) : (
                    <span className="text-[10px] font-prompt font-bold text-amber-600 animate-pulse pt-0.5">
                      ⚠️ กรุณากรอกให้ครบ 3 หลัก
                    </span>
                  )}
                </div>

                {/* Auxiliary Helpers in same box */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={handleClear}
                    className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-prompt font-black text-[10.5px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    title="ล้างเลขทั้งหมด"
                  >
                    <Trash2 size={12} className="text-slate-500" />
                    <span>ล้างเลข</span>
                  </button>
                  <button
                    onClick={handleRandomize}
                    disabled={isSpinning}
                    className="py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-prompt font-black text-[10.5px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    title="สุ่มเลขนำโชค"
                  >
                    🎲 สุ่มเลข
                  </button>
                  <button
                    onClick={handlePopularFill}
                    className="py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-prompt font-black text-[10.5px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    title="เลือกเลขนำโชคแนะนำ"
                  >
                    ⭐ เลขยอดนิยม
                  </button>
                </div>
              </div>

              {/* 3. Selected Number Display Box (Large & Prominent) */}
              <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-400 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 font-prompt font-black text-[9px] px-2.5 py-1 rounded-bl-xl shadow-sm">
                  กล่องสถานะ
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <span className="text-[11px] font-prompt font-black text-slate-600 uppercase tracking-wider">
                    🎯 เลขที่คุณเลือก
                  </span>

                  {/* Gigantic visual digits */}
                  <div className="flex items-center gap-3">
                    {/* Hundreds Box */}
                    <div className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-inner transition-all duration-200 ${
                      hundreds !== null 
                        ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-500 text-blue-700 scale-105' 
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}>
                      <span className="text-[8px] font-prompt font-bold text-slate-400">หลักร้อย</span>
                      <span className={`text-3xl font-mono font-black ${isSpinning ? 'animate-pulse text-amber-500' : ''}`}>
                        {hundreds ?? '_'}
                      </span>
                      <span className="w-4 h-1 bg-current rounded opacity-20"></span>
                    </div>

                    {/* Tens Box */}
                    <div className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-inner transition-all duration-200 ${
                      tens !== null 
                        ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-500 text-blue-700 scale-105' 
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}>
                      <span className="text-[8px] font-prompt font-bold text-slate-400">หลักสิบ</span>
                      <span className={`text-3xl font-mono font-black ${isSpinning ? 'animate-pulse text-amber-500' : ''}`}>
                        {tens ?? '_'}
                      </span>
                      <span className="w-4 h-1 bg-current rounded opacity-20"></span>
                    </div>

                    {/* Units Box */}
                    <div className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-between p-2 shadow-inner transition-all duration-200 ${
                      units !== null 
                        ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-500 text-blue-700 scale-105' 
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}>
                      <span className="text-[8px] font-prompt font-bold text-slate-400">หลักหน่วย</span>
                      <span className={`text-3xl font-mono font-black ${isSpinning ? 'animate-pulse text-amber-500' : ''}`}>
                        {units ?? '_'}
                      </span>
                      <span className="w-4 h-1 bg-current rounded opacity-20"></span>
                    </div>
                  </div>

                  {/* Selected string summary and validation message */}
                  <div className="w-full text-center space-y-1.5 pt-1">
                    {isComplete ? (
                      <div className="flex flex-col items-center gap-1">
                        <p className="font-prompt text-xs font-bold text-slate-700">
                          หมายเลข N3 ของคุณคือ <span className="font-mono text-base font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">{currentNumberStr}</span>
                        </p>
                        <p className="text-[10px] text-emerald-600 font-semibold font-prompt flex items-center gap-1">
                          <CheckCircle2 size={12} className="stroke-[2.5px]" /> แตะปุ่มยืนยันด้านล่างเพื่อสรุปใบจองสิทธิ์
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 font-prompt">
                        <p className="text-xs font-black text-amber-600 animate-pulse">
                          ⚠️ ยังเลือกไม่ครบ 3 หลัก
                        </p>
                        <p className="text-lg font-mono font-black text-slate-600 bg-slate-100 px-4 py-1 rounded-xl border border-slate-200 tracking-widest shadow-inner">
                          {hundreds ?? '_'} {tens ?? '_'} {units ?? '_'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Suggestions Chips Tabs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-prompt font-black text-slate-800 flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-500" />
                    เลขชุดนำโชคยอดนิยม
                  </span>
                  <button 
                    onClick={handleRandomize}
                    disabled={isSpinning}
                    className="text-[10px] font-prompt font-black text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
                  >
                    🎲 สุ่มสลากนำโชค
                  </button>
                </div>

                {/* Tab select category */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('popular')}
                    className={`py-1.5 text-[10px] font-prompt font-bold rounded-lg transition-all ${activeTab === 'popular' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    🔥 ยอดนิยม
                  </button>
                  <button
                    onClick={() => setActiveTab('recommended')}
                    className={`py-1.5 text-[10px] font-prompt font-bold rounded-lg transition-all ${activeTab === 'recommended' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    ✨ แนะนำพิเศษ
                  </button>
                  <button
                    onClick={() => setActiveTab('trending')}
                    className={`py-1.5 text-[10px] font-prompt font-bold rounded-lg transition-all ${activeTab === 'trending' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    ⚡️ เลขเด็ดมาแรง
                  </button>
                </div>

                {/* Recommendation numbers rendering */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {SUGGESTIONS[activeTab].map((num) => {
                    const isSelected = isComplete && currentNumberStr === num;
                    return (
                      <button
                        key={num}
                        onClick={() => handleSelectSuggestion(num)}
                        className={`py-2 rounded-xl text-xs font-mono font-black border transition-all active:scale-90 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-500 text-slate-950 shadow-md scale-105 font-black' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Giant Digit Keyboard Area */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span className="text-xs font-prompt font-black text-slate-800">
                    หรือเลือกทีละหลักด้านล่าง
                  </span>
                  <span className="text-[9.5px] font-prompt font-bold text-slate-400">
                    แตะที่ปุ่มเพื่อระบุเลข
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Hundreds keyboard */}
                  <div className="space-y-2 text-center">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl py-1">
                      <span className="text-[10px] font-prompt font-black text-blue-800">หลักร้อย</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                        <button
                          key={`h-${digit}`}
                          onClick={() => {
                            setHundreds(digit);
                            showToast(`✅ หลักร้อยระบุเป็นเลข "${digit}"`, "info");
                          }}
                          className={`aspect-square rounded-full font-mono font-black text-sm flex items-center justify-center border-2 transition-all active:scale-75 ${
                            hundreds === digit 
                              ? 'bg-blue-600 border-amber-400 text-white shadow-md scale-105' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tens keyboard */}
                  <div className="space-y-2 text-center">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl py-1">
                      <span className="text-[10px] font-prompt font-black text-blue-800">หลักสิบ</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                        <button
                          key={`t-${digit}`}
                          onClick={() => {
                            setTens(digit);
                            showToast(`✅ หลักสิบระบุเป็นเลข "${digit}"`, "info");
                          }}
                          className={`aspect-square rounded-full font-mono font-black text-sm flex items-center justify-center border-2 transition-all active:scale-75 ${
                            tens === digit 
                              ? 'bg-blue-600 border-amber-400 text-white shadow-md scale-105' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Units keyboard */}
                  <div className="space-y-2 text-center">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl py-1">
                      <span className="text-[10px] font-prompt font-black text-blue-800">หลักหน่วย</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                        <button
                          key={`u-${digit}`}
                          onClick={() => {
                            setUnits(digit);
                            showToast(`✅ หลักหน่วยระบุเป็นเลข "${digit}"`, "info");
                          }}
                          className={`aspect-square rounded-full font-mono font-black text-sm flex items-center justify-center border-2 transition-all active:scale-75 ${
                            units === digit 
                              ? 'bg-blue-600 border-amber-400 text-white shadow-md scale-105' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Quantity / Sets Block */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-prompt font-black text-xs text-slate-800 flex items-center gap-1">
                      🎟️ จำนวนใบ / จำนวนชุดที่จะจอง
                    </h4>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      (ราคา 80 บาท/ชุด • จำกัดสูงสุด 10 ชุด)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                          showToast(`ลดลงเหลือ ${quantity - 1} ชุด`, 'info');
                        }
                      }}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-white text-slate-800 font-extrabold flex items-center justify-center border shadow-sm active:scale-90 transition-transform disabled:opacity-40"
                    >
                      <Minus size={14} className="stroke-[3px]" />
                    </button>
                    <span className="font-mono font-black text-base text-slate-900 w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (quantity < 10) {
                          setQuantity(quantity + 1);
                          showToast(`เพิ่มขึ้นเป็น ${quantity + 1} ชุด`, 'info');
                        } else {
                          showToast(`⚠️ ขออภัย จำกัดจองไม่เกิน 10 ชุดต่อรายการ`, 'warning');
                        }
                      }}
                      disabled={quantity >= 10}
                      className="w-8 h-8 rounded-lg bg-white text-slate-800 font-extrabold flex items-center justify-center border shadow-sm active:scale-90 transition-transform disabled:opacity-40"
                    >
                      <Plus size={14} className="stroke-[3px]" />
                    </button>
                  </div>
                </div>

                {/* Optional Note to Shop */}
                <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                  <label className="block text-[11px] font-prompt font-black text-slate-700">
                    ✍️ หมายเหตุหรือข้อความถึงร้านค้าตัวแทน
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={80}
                    placeholder="เช่น ต้องการให้โทรติดต่อก่อน 17.00 น. หรือต้องการใบรับสลากจริงทางแชท"
                    className="w-full text-xs font-prompt font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 h-14 outline-none focus:border-blue-500 focus:bg-white resize-none transition-all placeholder:text-slate-400"
                  />
                  <div className="text-right text-[8px] text-slate-400 font-semibold">
                    {note.length}/80 ตัวอักษร
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom sticky panel displaying pricing, reset and confirmation buttons */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-30 shrink-0">
              <div className="flex flex-col space-y-2.5 font-prompt">
                
                {/* Visual calculation details */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold">สลากเลขที่เลือก:</span>
                      {isComplete ? (
                        <span className="font-mono text-sm font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          {currentNumberStr}
                        </span>
                      ) : (
                        <span className="text-orange-500 font-black text-[11px] animate-pulse">
                          กรุณาเลือกให้ครบ 3 หลัก
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold">
                      จำนวน: <span className="font-mono text-slate-800 font-black">{quantity}</span> ใบ
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-slate-400 font-bold">ราคารวม:</span>
                    <span className="text-base font-black text-amber-500 ml-1">
                      ฿{totalPrice.toLocaleString()}.-
                    </span>
                  </div>
                </div>

                {/* Helper validation text if not complete */}
                {!isComplete && (
                  <p className="text-[10px] text-orange-500 font-bold text-center bg-orange-50/50 py-1 rounded-lg border border-orange-100 animate-pulse">
                    กรุณาเลือกหรือกรอกเลขให้ครบ 3 หลัก
                  </p>
                )}

                {/* Primary Button layout */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleClear}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-black text-[11px] transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                    title="ล้างทั้งหมด"
                  >
                    <Trash2 size={14} />
                    <span>ล้างเลข</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isComplete) {
                        showToast("⚠️ กรุณาเลือกหรือกรอกเลขให้ครบ 3 หลัก", "warning");
                        return;
                      }
                      navigateTo('summary');
                    }}
                    disabled={!isComplete}
                    className={`col-span-2 py-3 rounded-xl font-black text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-lg relative overflow-hidden ${
                      isComplete 
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 hover:brightness-105 active:scale-95 cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <Check size={16} className="stroke-[3.5px]" />
                    <span>ยืนยันการจอง</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* ==========================================
            SCREEN 4: BOOKING SUMMARY SCREEN
            ========================================== */}
        {currentScreen === 'summary' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-blue-700 text-white px-4 py-3.5 flex items-center gap-3.5 shadow-md z-20 shrink-0">
              <button 
                onClick={() => setCurrentScreen('number-selection')}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-white"
                title="ย้อนกลับ"
              >
                <ArrowLeft size={20} className="stroke-[2.5px]" />
              </button>
              <div>
                <h1 className="font-prompt text-base font-black tracking-tight leading-none text-white">ตรวจสอบและสรุปรายการ</h1>
                <p className="text-[9px] text-blue-100 font-medium mt-1">กรุณาตรวจสอบรายละเอียดก่อนส่งคำขอ</p>
              </div>
            </header>

            {/* Scrollable Receipt Form content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
              
              {/* Grand Visual Booking Ticket Representing N3 Ticket */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3.5 relative shadow-md overflow-hidden">
                
                {/* Ticket punch circles decoration */}
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 border-r-2 border-slate-200 rounded-full"></div>
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 border-l-2 border-slate-200 rounded-full"></div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-600 text-white text-[8px] font-prompt font-black px-1.5 py-0.5 rounded">N3</span>
                    <span className="text-[10px] font-prompt font-black text-slate-400">ใบจองสลาก N3 ดิจิทัล (ระบบทดสอบ)</span>
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 font-bold">ROUND #01</span>
                </div>

                <div className="space-y-2 text-xs font-prompt font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ร้านค้าตัวแทน:</span>
                    <span className="text-slate-900 font-black text-right">{selectedShop.shopName || selectedShop.name}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">หมายเลขที่เลือก:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xl font-black text-white bg-blue-600 px-3.5 py-0.5 rounded-lg border border-blue-500 shadow-sm">
                        {currentNumberStr}
                      </span>
                      <button 
                        onClick={() => navigateTo('number-selection')}
                        className="text-blue-600 hover:text-blue-800 underline text-[10px] font-bold"
                      >
                        แก้ไขเลข
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">จำนวน:</span>
                    <span className="text-slate-900 font-black">{quantity} ชุด / ใบ</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">ราคาสลาก (จำลอง):</span>
                    <span className="text-slate-900 font-bold">฿80 บาท ต่อใบ</span>
                  </div>

                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm">
                    <span className="text-slate-900 font-black">ยอดรวมสุทธิ:</span>
                    <span className="text-amber-500 font-black text-base">฿{totalPrice.toLocaleString()}.-</span>
                  </div>

                  {note.trim() && (
                    <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl mt-2">
                      <span className="block text-slate-400 text-[8px] font-prompt font-bold">หมายเหตุถึงร้าน:</span>
                      <p className="text-[10px] text-slate-600 leading-normal mt-0.5 font-medium">{note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer contact fields - highly visible for elderly */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="font-prompt text-xs font-black text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  👤 ข้อมูลผู้สั่งจองสิทธิ์ (สำหรับการติดต่อกลับ)
                </h3>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-prompt font-black text-slate-500">
                      ชื่อ-นามสกุลจริงผู้สั่งจอง (ภาษาไทย):
                    </label>
                    <input 
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="เช่น คุณสมเจตน์ รักไทย"
                      className="w-full h-11 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 text-xs font-prompt font-bold text-slate-800 outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-prompt font-black text-slate-500">
                      เบอร์โทรศัพท์ที่ติดต่อได้สะดวก:
                    </label>
                    <input 
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="เช่น 089-765-4321"
                      className="w-full h-11 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 text-xs font-mono font-bold text-slate-800 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl text-[10px] text-amber-900 leading-normal font-semibold font-prompt">
                  ⚠️ เจ๊แมวจำหน่ายสลากดิจิทัลจริงและโทรช่วยเหลือคนเฒ่าคนแก่ในการโอนสิทธิ์ผ่านเป๋าตัง กรุณากรอกเบอร์โทรตามจริงเพื่อให้ประสานงานได้ถูกต้อง
                </div>
              </div>

            </div>

            {/* Bottom confirmation submit CTA bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-30 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentScreen('number-selection')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-prompt font-black text-[11px] transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer border border-slate-200 w-28"
                  title="แก้ไขรายการ"
                >
                  ย้อนกลับ
                </button>

                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-prompt font-black text-xs text-center rounded-xl shadow-lg hover:brightness-105 active:scale-95 flex items-center justify-center gap-1.5 border border-emerald-400"
                >
                  <Check size={16} className="stroke-[3.5px]" />
                  <span>ยืนยันส่งรายการ</span>
                </button>
              </div>
            </div>

          </div>
        )}


        {/* ==========================================
            SCREEN 5: BOOKING SUCCESS SCREEN
            ========================================== */}
        {currentScreen === 'success' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header top banner (no back button here, flow completes) */}
            <header className="bg-emerald-600 text-white px-4 py-4 text-center shadow-md z-20 shrink-0">
              <h1 className="font-prompt text-base font-black tracking-tight leading-none text-white">ส่งสิทธิ์การจองสำเร็จ</h1>
              <p className="text-[9px] text-emerald-100 font-medium mt-1">โปรดจำบันทึกหน้าจอหรือตรวจสอบประวัติรายการ</p>
            </header>

            {/* Content Receipt block */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              
              {/* Circle check and success notice */}
              <div className="text-center py-2 space-y-1.5">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={32} className="stroke-[3px]" />
                </div>
                <h2 className="font-prompt text-base font-black text-emerald-600">จองสิทธิ์ N3 สำเร็จเรียบร้อย!</h2>
                <p className="text-[10px] text-slate-500 leading-normal max-w-[240px] mx-auto font-prompt font-bold">
                  ระบบจำลองได้ส่งความต้องการจองเลขของคุณ ไปยังร้านตัวแทนจำหน่ายที่เลือกเรียบร้อยแล้ว
                </p>
              </div>

              {/* Grand receipt ticket inside */}
              <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 space-y-3 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 font-mono text-[8px] font-bold px-2.5 py-1 rounded-bl-xl border-l border-b border-emerald-100">
                  RECEIPT
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 text-[10px] font-prompt font-bold">
                  <span className="text-slate-400">รหัสจองสิทธิ์สลาก:</span>
                  <span className="font-mono text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {latestBookingRef || 'TXN-N3-120484'}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-prompt font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ผู้ค้าตัวแทน N3:</span>
                    <span className="text-slate-900 font-black">{selectedShop.shopName || selectedShop.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">เลขสลากที่เลือก:</span>
                    <span className="font-mono text-base font-black text-white bg-blue-600 px-3 py-0.5 rounded-md">
                      {currentNumberStr}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">จำนวนการจอง:</span>
                    <span className="text-slate-900 font-black">{quantity} ชุด / ใบ</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">ยอดชำระจริงที่ร้าน:</span>
                    <span className="text-amber-500 font-black">฿{totalPrice.toLocaleString()}.-</span>
                  </div>

                  <div className="flex justify-between border-t border-slate-100 pt-2 text-[10px]">
                    <span className="text-slate-400">ชื่อผู้จอง:</span>
                    <span className="text-slate-800 font-bold">{customerName}</span>
                  </div>

                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">เบอร์โทรศัพท์ติดต่อ:</span>
                    <span className="text-slate-800 font-mono font-bold">{customerPhone}</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-2.5 border-t border-dashed border-slate-200 flex flex-col items-center space-y-1">
                  <div className="w-full h-8 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#0f172a_2px,#0f172a_4px)] opacity-90"></div>
                  <span className="font-mono text-[8px] text-slate-400">N3-MOCKUP-{latestBookingRef || '120484'}-2026</span>
                </div>
              </div>

              {/* Call-to-action details */}
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-[10px] text-slate-600 leading-normal font-semibold font-prompt">
                <span className="font-bold text-emerald-800 block mb-0.5">📌 ขั้นตอนถัดไปสำหรับท่าน:</span>
                เจ๊แมวจะทำการตรวจสอบสลากใบจริงในระบบหลังบ้าน หากได้รับการจับคู่สิทธิ์ จะมีเสียงโทรศัพท์โทรเข้าเครื่องท่านเพื่อยืนยันสลากโดยทันที
              </div>

              {/* Control actions buttons */}
              <div className="space-y-2 pt-1.5">
                <button
                  onClick={() => navigateTo('history')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-prompt font-black text-xs text-center rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>ดูประวัติรายการ</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      // Reset numbers and back to home
                      setHundreds(null);
                      setTens(null);
                      setUnits(null);
                      setQuantity(1);
                      setNote('');
                      navigateTo('home');
                    }}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-prompt font-black text-[11px] rounded-xl text-center active:scale-95 transition-transform cursor-pointer"
                  >
                    กลับหน้าหลัก
                  </button>

                  <button
                    onClick={() => {
                      showToast("📤 คัดลอกลิงก์ข้อมูลการจองไปยังคลิปบอร์ดแล้ว (จำลอง)", "success");
                    }}
                    className="py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-prompt font-black text-[11px] rounded-xl text-center active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Share2 size={12} />
                    <span>แชร์ข้อมูลใบจอง</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}





        {/* Visual Simulated Mobile Home Indicator Bar */}
        <div className="h-5 w-full bg-white flex justify-center items-center shrink-0 relative z-30 pb-1.5 border-t border-slate-50">
          <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
        </div>

      </div>


      {/* ==========================================
          MODAL A: HELP & EXPLANATIONS MODAL
          ========================================== */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-blue-100 animate-zoom-in text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-blue-700 flex items-center gap-1.5">
                <HelpCircle size={16} /> วิธีการสั่งจองและสลาก N3 คืออะไร
              </span>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-prompt font-medium text-slate-600 leading-relaxed">
              <div className="space-y-1 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                <p className="font-extrabold text-blue-900 text-[11px]">📌 สลาก N3 คืออะไร?</p>
                <p className="text-[10px] text-slate-500">คือสลากตัวเลข 3 หลักแบบดิจิทัล มีรางวัลออกรางวัลร่วมกับสลากกินแบ่งรัฐบาล ออกรางวัลทุกวันที่ 1 และ 16 ของเดือน ประกอบด้วยรางวัล 3 ตัวตรง, 3 ตัวสลับ (โต๊ด), 2 ตัวตรง และรางวัลพิเศษสะสม</p>
              </div>

              <div className="space-y-2">
                <p className="font-extrabold text-slate-800 text-[11px]">🛠️ ขั้นตอนจำลองการจอง:</p>
                <div className="space-y-1.5 text-[10px]">
                  <p><strong>1. เลือกตัวแทน:</strong> เลือกหน้าร้านค้าตัวแทนจำหน่ายที่ท่านเชื่อใจ</p>
                  <p><strong>2. เลือกหมายเลข:</strong> ระบุหลักร้อย หลักสิบ หลักหน่วย หรือกดสุ่มเลขเด็ด</p>
                  <p><strong>3. กรอกข้อมูล:</strong> ระบุชื่อและเบอร์โทรในหน้าสรุป เพื่อส่งความต้องการ</p>
                  <p><strong>4. รับผลสลาก:</strong> ตัวแทนจะประสานงานจัดซื้อสิทธิ์จริงส่งเข้าเป๋าตังท่าน</p>
                </div>
              </div>

              <div className="bg-amber-50 text-amber-950 p-2.5 rounded-xl border border-amber-200 text-[10px] font-bold">
                💡 หมายเหตุ: ระบบนี้จัดทำขึ้นเป็นแบบจำลองนำเสนอความก้าวหน้าด้านโปรแกรมจำหน่ายสิทธิ์ ไม่มีสิทธิ์สลากจริงและการจ่ายเงินจริงเกิดขึ้นในระบบนี้
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-prompt font-black text-xs rounded-xl shadow-md cursor-pointer text-center block"
            >
              เข้าใจเรียบร้อยแล้ว
            </button>
          </div>
        </div>
      )}


      {/* ==========================================
          MODAL B: HISTORICAL ORDER DETAILS DIALOG MODAL
          ========================================== */}
      {selectedHistoryOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[340px] w-full p-5 space-y-4 shadow-2xl border border-slate-100 animate-zoom-in text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-prompt font-black text-sm text-blue-700 flex items-center gap-1.5">
                <ShieldCheck size={16} /> รายละเอียดสิทธิ์สลาก N3 ของท่าน
              </span>
              <button 
                onClick={() => setSelectedHistoryOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Receipt visualization */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2.5 relative shadow-inner">
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-slate-150 rounded-full"></div>
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-slate-150 rounded-full"></div>

              <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 text-[9px] font-prompt font-bold">
                <span className="text-slate-400">ใบจองสิทธิ์ประวัติ</span>
                <span className="font-mono text-slate-800 bg-white border px-1.5 py-0.5 rounded shadow-sm">
                  {selectedHistoryOrder.id}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-prompt font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">ร้านค้าตัวแทน:</span>
                  <span className="text-slate-900 font-black">{selectedHistoryOrder.shopName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">วันเวลาทำรายการ:</span>
                  <span className="text-slate-800 font-bold">{selectedHistoryOrder.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">จำนวนใบจอง:</span>
                  <span className="text-slate-900 font-black">{selectedHistoryOrder.itemsCount} ใบ / ชุด</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">ยอดเงินรวม:</span>
                  <span className="text-amber-500 font-black">฿{selectedHistoryOrder.amount.toLocaleString()} บาท</span>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="block text-slate-400 text-[8px] font-prompt font-bold">รายละเอียดรายการสลาก:</span>
                  <p className="text-[10px] text-slate-600 mt-1 font-medium bg-white p-2 rounded-xl border border-slate-150">
                    {selectedHistoryOrder.itemsSummary}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-200 flex flex-col items-center">
                <div className="w-full h-6 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#1e293b_2px,#1e293b_4px)] opacity-80"></div>
                <span className="font-mono text-[8px] text-slate-400">N3-{selectedHistoryOrder.id}-2026</span>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-950 p-2.5 rounded-xl border border-blue-150 text-[10px] leading-relaxed font-semibold">
              ℹ️ <strong>สถานะการตรวจสอบ:</strong> ตัวแทนของท่านได้รับการประสานงานแล้ว หากท่านจองสิทธิ์สำเร็จในแอปเป๋าตังจริง ร้านค้าจะโทรรับทราบทันที
            </div>

            <button
              onClick={() => setSelectedHistoryOrder(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-prompt font-black text-xs rounded-xl shadow-md cursor-pointer text-center block"
            >
              ปิดหน้านี้
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
