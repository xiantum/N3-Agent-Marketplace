import React, { useState } from 'react';
import { 
  Home, 
  Store, 
  History as HistoryIcon, 
  Bell, 
  User, 
  Search, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Share2, 
  ChevronRight, 
  ArrowLeft, 
  Info,
  Check,
  Award,
  Plus,
  Minus,
  Trash2,
  Ticket,
  Sparkles
} from 'lucide-react';
import { mockShops, mockOrders, mockCustomerProfile, mockNotifications } from '../data';
import { CustomerTab, Shop, Order } from '../types';

interface CustomerViewProps {
  onBackToRoles: () => void;
}

export default function CustomerView({ onBackToRoles }: CustomerViewProps) {
  const [activeTab, setActiveTab] = useState<CustomerTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shopFilter, setShopFilter] = useState<'all' | 'nearby' | 'popular' | 'verified'>('all');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'success'>('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Custom states for interactive prototype
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // N3 Booking Flow State
  const [bookingStep, setBookingStep] = useState<'idle' | 'number-selection' | 'summary' | 'success'>('idle');
  const [selectedDigitTab, setSelectedDigitTab] = useState<'1' | '2' | '3'>('3');
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [customNumberInput, setCustomNumberInput] = useState<string>('');
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [latestBookingRef, setLatestBookingRef] = useState<string>('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Transition to N3 number picker
  const handlePlaceOrder = (shop: Shop) => {
    setSelectedShop(shop);
    setOrderModalOpen(false);
    setBookingStep('number-selection');
    setSelectedNumbers([]);
    setBookingQuantity(1);
    setCustomNumberInput('');
  };

  // Add a manually typed number
  const handleAddCustomNumber = () => {
    const trimmed = customNumberInput.trim();
    if (!trimmed) return;

    // Check formatting based on selectedDigitTab
    const targetLength = parseInt(selectedDigitTab);
    if (trimmed.length !== targetLength || !/^\d+$/.test(trimmed)) {
      showToast(`⚠️ กรุณากรอกตัวเลขให้ครบ ${targetLength} หลัก (0-9 เท่านั้น)`);
      return;
    }

    if (selectedNumbers.includes(trimmed)) {
      showToast(`⚠️ ตัวเลข ${trimmed} ถูกเลือกไว้แล้ว`);
      return;
    }

    setSelectedNumbers([...selectedNumbers, trimmed]);
    setCustomNumberInput('');
    showToast(`✅ เพิ่มเลข ${trimmed} เรียบร้อยแล้ว`);
  };

  // Toggle a number selection from grid
  const handleToggleGridNumber = (num: string) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  // Confirm and go to summary
  const handleConfirmN3Selection = () => {
    if (selectedNumbers.length === 0) {
      showToast('⚠️ กรุณาเลือกเลข N3 อย่างน้อย 1 หมายเลขเพื่อจองสิทธิ์');
      return;
    }
    setBookingStep('summary');
  };

  // Place final booking order
  const handleFinalBookingSubmit = () => {
    if (!selectedShop) return;

    const refId = `TXN-N3-${Math.floor(100000 + Math.random() * 900000)}`;
    const costPerSet = 80; // Standard price per N3 set in THB
    const totalAmount = selectedNumbers.length * bookingQuantity * costPerSet;

    const newOrder: Order = {
      id: refId,
      shopName: selectedShop.name,
      shopImage: selectedShop.logo,
      date: 'วันนี้ • เพิ่งทำรายการ',
      amount: totalAmount,
      itemsCount: selectedNumbers.length * bookingQuantity,
      status: 'pending',
      itemsSummary: `สลาก N3 เลขที่เลือก: ${selectedNumbers.join(', ')} (จำนวนเลขละ ${bookingQuantity} ชุด)`
    };

    setOrders([newOrder, ...orders]);
    setLatestBookingRef(refId);

    // Add notification
    setNotifications([
      {
        id: `n${notifications.length + 1}`,
        title: '🎉 ส่งคำจองสิทธิ์ N3 แล้ว',
        content: `ร้าน "${selectedShop.name}" ได้รับคำร้องจองเลข ${selectedNumbers.join(', ')} ของท่านแล้ว กรุณารอรับข้อความตอบกลับยืนยัน`,
        date: 'วันนี้ • เพิ่งทำรายการ',
        isRead: false
      },
      ...notifications
    ]);

    setBookingStep('success');
    showToast('🎉 บันทึกการจองสิทธิ์สลาก N3 สำเร็จแล้ว!');
  };

  // Filter shops
  const filteredShops = mockShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (shopFilter === 'nearby') return shop.badgeType === 'nearby';
    if (shopFilter === 'popular') return shop.badgeType === 'popular';
    if (shopFilter === 'verified') return shop.isVerified;
    return true;
  });

  // Filter history
  const filteredOrders = orders.filter(order => {
    if (historyFilter === 'pending') return order.status === 'pending';
    if (historyFilter === 'success') return order.status === 'success';
    return true;
  });

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    showToast('อ่านการแจ้งเตือนทั้งหมดแล้ว');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-slate-50 relative flex flex-col mx-auto shadow-2xl border-x border-slate-200">
      
      {/* TOAST SYSTEM (Friendly & Large for Seniors) */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[350px] bg-primary text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white animate-bounce">
          <CheckCircle2 className="text-white shrink-0 w-7 h-7" />
          <span className="font-bold text-sm leading-tight">{toastMessage}</span>
        </div>
      )}

      {bookingStep === 'number-selection' ? (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50 pb-20">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-primary text-white px-4 py-4 flex items-center gap-3 shadow-md h-16 shrink-0">
            <button 
              onClick={() => {
                setBookingStep('idle');
                setOrderModalOpen(true);
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <ArrowLeft size={24} className="stroke-[3px]" />
            </button>
            <div>
              <h1 className="font-prompt text-base font-black tracking-tight leading-none text-white">เลือกเลข N3</h1>
              <p className="text-[10px] opacity-90 font-medium mt-1 truncate max-w-[200px]">ร้านตัวแทน: {selectedShop?.name}</p>
            </div>
          </header>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-8">
            {/* Step indicator */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-primary font-prompt">ขั้นตอนที่ 1 จาก 3</span>
              <span className="text-[10px] font-black text-primary font-prompt">เลือกตัวเลขที่ชอบ</span>
            </div>

            {/* Digit Tab Selector */}
            <div className="bg-white border-2 border-slate-200 p-1 rounded-2xl grid grid-cols-3 gap-1 shadow-sm">
              <button 
                onClick={() => { setSelectedDigitTab('1'); setSelectedNumbers([]); }}
                className={`py-2 rounded-xl text-[11px] font-black font-prompt transition-all ${selectedDigitTab === '1' ? 'brand-gradient text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                เลข 1 ตัว
              </button>
              <button 
                onClick={() => { setSelectedDigitTab('2'); setSelectedNumbers([]); }}
                className={`py-2 rounded-xl text-[11px] font-black font-prompt transition-all ${selectedDigitTab === '2' ? 'brand-gradient text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                เลข 2 ตัว
              </button>
              <button 
                onClick={() => { setSelectedDigitTab('3'); setSelectedNumbers([]); }}
                className={`py-2 rounded-xl text-[11px] font-black font-prompt transition-all ${selectedDigitTab === '3' ? 'brand-gradient text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                เลข 3 ตัว
              </button>
            </div>

            {/* Input & Selected Display */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
              <div>
                <h4 className="font-prompt font-black text-xs text-slate-800">✍️ ระบุเลข {selectedDigitTab} หลัก ด้วยตนเอง:</h4>
                <div className="flex gap-2 mt-2">
                  <input 
                    type="text"
                    maxLength={parseInt(selectedDigitTab)}
                    value={customNumberInput}
                    onChange={(e) => setCustomNumberInput(e.target.value.replace(/\D/g, ''))}
                    placeholder={`กรอกเลข ${selectedDigitTab} หลัก`}
                    className="flex-1 h-11 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 text-center font-mono font-black text-lg text-slate-900 focus:border-primary outline-none"
                  />
                  <button 
                    onClick={handleAddCustomNumber}
                    className="h-11 bg-primary hover:bg-primary/95 text-white font-prompt font-black px-3.5 rounded-xl flex items-center justify-center gap-0.5 active:scale-95 transition-transform shrink-0"
                  >
                    <Plus size={16} className="stroke-[3px]" />
                    <span className="text-xs">เพิ่มเลข</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2.5">
                <h4 className="font-prompt font-black text-xs text-slate-800 mb-1.5">🎈 เลขที่เลือกไว้ ({selectedNumbers.length} หมายเลข):</h4>
                {selectedNumbers.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold py-1">กรุณาเลือกหมายเลขด้านล่าง หรือกรอกเองด้านบน</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
                    {selectedNumbers.map(num => (
                      <span 
                        key={num} 
                        className="inline-flex items-center gap-1 bg-amber-100 text-slate-900 font-mono font-black text-xs px-2.5 py-1 rounded-full border border-amber-300 shadow-sm"
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-[8px] shrink-0">N3</span>
                        {num}
                        <button 
                          onClick={() => setSelectedNumbers(selectedNumbers.filter(n => n !== num))}
                          className="text-slate-500 hover:text-red-500 hover:bg-slate-200 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selection Grid */}
            <div className="space-y-2">
              <h3 className="font-prompt text-xs font-black text-slate-900 pl-1 flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" />
                <span>ตัวเลขแนะนำ (แตะเลือกได้ทันที):</span>
              </h3>

              {selectedDigitTab === '1' && (
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const num = i.toString();
                    const isSelected = selectedNumbers.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => handleToggleGridNumber(num)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center font-mono font-black text-lg border-2 transition-all active:scale-90 ${isSelected ? 'bg-amber-400 border-amber-500 text-slate-950 scale-105 shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-primary/55'}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedDigitTab === '2' && (
                <div className="grid grid-cols-4 gap-1.5">
                  {['00', '07', '09', '11', '24', '38', '45', '56', '66', '72', '88', '99'].map(num => {
                    const isSelected = selectedNumbers.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => handleToggleGridNumber(num)}
                        className={`py-2 rounded-xl flex flex-col items-center justify-center font-mono font-black text-xs border-2 transition-all active:scale-95 ${isSelected ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md animate-pulse' : 'bg-white border-slate-200 text-slate-700 hover:border-primary/55'}`}
                      >
                        <span className="text-[7px] opacity-70 font-sans font-bold">N3</span>
                        {num}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedDigitTab === '3' && (
                <div className="grid grid-cols-3 gap-1.5">
                  {['123', '456', '789', '120', '555', '999', '111', '000', '365', '777', '888', '911'].map(num => {
                    const isSelected = selectedNumbers.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => handleToggleGridNumber(num)}
                        className={`py-2.5 rounded-xl flex flex-col items-center justify-center font-mono font-black text-sm border-2 transition-all active:scale-95 ${isSelected ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-primary/55'}`}
                      >
                        <span className="text-[8px] text-slate-400 font-sans font-bold leading-none mb-0.5">N3</span>
                        {num}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity Selector Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-2.5">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-prompt font-black text-xs text-slate-800">จำนวนจองสิทธิ์:</h4>
                  <p className="text-[8px] text-slate-400 font-bold">จำกัดสำหรับทดสอบในระบบ</p>
                </div>
                
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button 
                    onClick={() => setBookingQuantity(Math.max(1, bookingQuantity - 1))}
                    className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-800 font-bold border shadow-sm active:scale-90"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="font-mono font-black text-xs text-slate-900 w-5 text-center">{bookingQuantity}</span>
                  <button 
                    onClick={() => setBookingQuantity(bookingQuantity + 1)}
                    className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-800 font-bold border shadow-sm active:scale-90"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[9px] font-bold text-slate-500">
                <span>ราคาจำลองรวม (฿80 ต่อหมายเลขชุด)</span>
                <span className="text-amber-600 font-prompt font-black text-xs">
                  ฿{(selectedNumbers.length * bookingQuantity * 80).toLocaleString()} บาท
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button 
                onClick={() => setSelectedNumbers([])}
                className="h-11 bg-slate-100 text-slate-700 font-prompt font-black text-[10px] rounded-xl hover:bg-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-1 shadow-sm"
              >
                <Trash2 size={12} />
                <span>ล้างสลาก</span>
              </button>
              <button 
                onClick={handleConfirmN3Selection}
                className="col-span-2 h-11 brand-gradient text-white font-prompt font-black text-xs rounded-xl shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span>ยืนยันการจองสิทธิ์</span>
                <ArrowRight size={14} className="stroke-[3px]" />
              </button>
            </div>
          </div>
        </div>
      ) : bookingStep === 'summary' ? (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
          <header className="sticky top-0 z-30 bg-primary text-white px-4 py-4 flex items-center gap-3 shadow-md h-16 shrink-0">
            <button 
              onClick={() => setBookingStep('number-selection')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <ArrowLeft size={24} className="stroke-[3px]" />
            </button>
            <div>
              <h1 className="font-prompt text-base font-black tracking-tight leading-none text-white">สรุปการจองสิทธิ์</h1>
              <p className="text-[10px] opacity-90 font-medium mt-1">ร้าน: {selectedShop?.name}</p>
            </div>
          </header>

          <div className="p-4 space-y-3.5 flex-1 overflow-y-auto pb-8">
            {/* Step indicator */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-2 rounded-2xl">
              <span className="text-[10px] font-bold text-primary font-prompt">ขั้นตอนที่ 2 จาก 3</span>
              <span className="text-[10px] font-black text-primary font-prompt">สรุปรายการสลาก</span>
            </div>

            {/* Shop Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                  N3
                </div>
                <div>
                  <h3 className="font-prompt font-black text-xs text-slate-900">{selectedShop?.name}</h3>
                  <p className="text-[9px] text-slate-500 font-bold">รหัสตัวแทน: {selectedShop?.id || 'AGT-N3-001'}</p>
                </div>
              </div>
            </div>

            {/* N3 Numbers Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="font-prompt font-black text-[11px] text-slate-800 border-b border-slate-100 pb-1.5">🎯 สลาก N3 ที่ท่านเลือก:</h4>
              
              <div className="flex flex-wrap gap-1.5 py-1 max-h-[100px] overflow-y-auto">
                {selectedNumbers.map(num => (
                  <div 
                    key={num} 
                    className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-amber-400 border border-amber-500 text-slate-950 shadow font-mono font-black text-xs relative"
                  >
                    <span className="absolute -top-1.5 text-[5px] bg-slate-950 text-amber-400 font-sans font-black px-1 rounded-full scale-75">N3</span>
                    {num}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[10px]">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>จำนวนหมายเลขรวม:</span>
                  <span className="text-slate-900 font-mono font-black">{selectedNumbers.length} หมายเลข</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>ชุดต่อหมายเลข:</span>
                  <span className="text-slate-900 font-mono font-black">{bookingQuantity} ชุด</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>บริการเสริมหลัก:</span>
                  <span className="text-emerald-600 font-prompt">บันทึกจองและจัดเตรียมสลาก</span>
                </div>
                <div className="flex justify-between items-center font-bold border-t border-dashed border-slate-200 pt-2 text-xs">
                  <span className="text-slate-900">ยอดรวมสุทธิ (จำลอง):</span>
                  <span className="text-amber-600 font-prompt font-black text-sm">
                    ฿{(selectedNumbers.length * bookingQuantity * 80).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Contact Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
              <h4 className="font-prompt font-black text-[11px] text-slate-800 border-b border-slate-100 pb-1.5">👤 ข้อมูลผู้สั่งจองสิทธิ์:</h4>
              <div className="space-y-1 text-[10px] font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">ชื่อผู้จอง:</span>
                  <span className="text-slate-800 font-bold">{mockCustomerProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">เบอร์โทรติดต่อ:</span>
                  <span className="text-slate-800 font-mono font-bold">{mockCustomerProfile.phone}</span>
                </div>
              </div>
            </div>

            {/* Senior Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-amber-800">
              <Info className="shrink-0 w-4 h-4 text-amber-600" />
              <div className="text-[9px] font-bold leading-relaxed">
                <p>หมายเหตุสำคัญ: ข้อมูลใช้สำหรับเป็นพรีเซนเทชันตัวอย่างเท่านั้น ไม่มีธุรกรรมทางการเงินหรือบริการจองสิทธิ์จริงในระบบ</p>
              </div>
            </div>

            {/* Final CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-1.5">
              <button 
                onClick={() => setBookingStep('number-selection')}
                className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-prompt font-black text-[10px] rounded-xl active:scale-95 transition-transform shadow-sm"
              >
                ย้อนกลับไปแก้ไข
              </button>
              <button 
                onClick={handleFinalBookingSubmit}
                className="h-11 brand-gradient text-white font-prompt font-black text-[10px] rounded-xl shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-0.5"
              >
                <Check size={14} className="stroke-[3px]" />
                <span>ยืนยันส่งรายการ</span>
              </button>
            </div>
          </div>
        </div>
      ) : bookingStep === 'success' ? (
        <div className="flex-1 flex flex-col min-h-screen bg-white">
          <div className="p-5 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shadow-lg border-4 border-emerald-50 animate-bounce">
              <CheckCircle2 size={36} className="stroke-[2.5px]" />
            </div>

            <div className="space-y-1">
              <h2 className="font-prompt font-black text-lg text-slate-900">ส่งคำจองสำเร็จแล้ว!</h2>
              <p className="text-[10px] font-semibold text-slate-400">ร้านตัวแทนได้รับข้อความเรียบร้อย</p>
            </div>

            {/* Invoice card */}
            <div className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-left space-y-2 shadow-inner text-[10px]">
              <div className="flex justify-between items-center font-bold text-slate-400">
                <span>รหัสรายการจำลอง</span>
                <span className="font-mono text-slate-800 text-[10px] bg-white border px-2 py-0.5 rounded shadow-sm">{latestBookingRef}</span>
              </div>
              
              <div className="border-t border-slate-200 my-1"></div>
              
              <div className="space-y-1 font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">ร้านค้าตัวแทน:</span>
                  <span className="text-slate-950 font-bold">{selectedShop?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">สลากเลขที่เลือก:</span>
                  <span className="text-slate-950 font-mono font-black bg-amber-400 px-1 rounded text-[10px]">{selectedNumbers.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">จำนวน:</span>
                  <span className="text-slate-950 font-bold">{bookingQuantity} ชุด</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ยอดสุทธิ (จำลอง):</span>
                  <span className="text-emerald-600 font-prompt font-black text-xs">฿{(selectedNumbers.length * bookingQuantity * 80).toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">สถานะ:</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    รอตัวแทนจัดเตรียม
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[9px] font-bold text-blue-800 leading-relaxed text-center">
              💡 ตรวจสถานะรายการได้ตลอดเวลาที่แท็บ “ประวัติ”
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-2 pt-2">
              <button 
                onClick={() => {
                  setBookingStep('idle');
                  setActiveTab('history');
                  setSelectedShop(null);
                }}
                className="w-full h-11 brand-gradient text-white font-prompt font-black text-xs rounded-xl shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <Ticket size={14} className="stroke-[2.5px]" />
                <span>ดูประวัติการจองสิทธิ์</span>
              </button>
              
              <button 
                onClick={() => {
                  setBookingStep('idle');
                  setActiveTab('home');
                  setSelectedShop(null);
                }}
                className="w-full h-11 bg-slate-100 text-slate-700 hover:bg-slate-200 font-prompt font-black text-[10px] rounded-xl active:scale-95 transition-transform"
              >
                กลับหน้าแรก
              </button>
            </div>

          </div>
        </div>
      ) : (
        <>
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-border-soft px-5 py-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            N3
          </div>
          <div>
            <h1 className="font-prompt text-lg font-extrabold text-primary tracking-tight leading-none">N3 Marketplace</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">ฝั่งลูกค้า (Customer)</p>
          </div>
        </div>
        
        {/* Profile Avatar / Quick Action to switch role */}
        <button 
          onClick={() => setActiveTab('profile')} 
          className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden active:scale-95 transition-transform"
        >
          <img 
            className="w-full h-full object-cover" 
            src={mockCustomerProfile.image} 
            alt="Customer Avatar" 
          />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto">
        
        {/* TOAST SYSTEM (Friendly & Large for Seniors) */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] bg-primary text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white animate-bounce">
            <CheckCircle2 className="text-white shrink-0 w-8 h-8" />
            <span className="font-bold text-base leading-tight">{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="p-5 space-y-6">
            {/* Hero Card */}
            <div className="brand-gradient p-6 rounded-[28px] text-white relative overflow-hidden shadow-lg border-2 border-amber-300">
              <div className="relative z-10 space-y-4">
                <div className="inline-block bg-amber-400 text-slate-900 font-prompt text-sm font-black px-4 py-1.5 rounded-full shadow-md animate-pulse">
                  🌟 แพลตฟอร์มตัวแทน N3 ค้นหาง่าย ปลอดภัย
                </div>
                <h2 className="font-prompt text-2xl font-extrabold leading-tight">ยินดีต้อนรับสู่ N3</h2>
                <p className="text-sm opacity-95 leading-relaxed font-bold">ค้นหาและเข้าถึงร้านตัวแทนจำหน่าย N3 คุณภาพ บริการด้วยความซื่อสัตย์ ใกล้บ้านคุณ</p>
                <button 
                  onClick={() => setActiveTab('shops')} 
                  className="w-full h-14 bg-yellow-400 text-slate-950 hover:bg-yellow-300 rounded-full font-prompt font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg border-2 border-white squishy-active"
                >
                  <span>เลือกตัวแทน</span>
                  <ArrowRight size={22} className="stroke-[3px]" />
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-6 h-6 stroke-[2.5px]" />
              <input 
                type="text"
                placeholder="ค้นหาตัวแทน N3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setActiveTab('shops')}
                className="w-full h-14 bg-white border-3 border-primary/20 rounded-2xl pl-12 pr-4 focus:ring-4 focus:ring-primary/20 focus:border-primary font-bold text-lg shadow-sm outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {/* Main Menu Grid (Bento Style) */}
            <div className="space-y-3">
              <h3 className="font-prompt text-xl font-black text-deep-navy pl-1">เมนูหลักสำหรับคุณ</h3>
              <div className="grid grid-cols-2 gap-4">
                
                <div 
                  onClick={() => setActiveTab('shops')}
                  className="bg-white p-5 rounded-[24px] border-2 border-slate-100 flex flex-col gap-4 shadow-md hover:border-primary cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Store size={32} className="stroke-[2.5px]" />
                  </div>
                  <span className="font-prompt font-extrabold text-lg text-slate-900">เลือกร้านตัวแทน</span>
                </div>

                <div 
                  onClick={() => setActiveTab('history')}
                  className="bg-white p-5 rounded-[24px] border-2 border-slate-100 flex flex-col gap-4 shadow-md hover:border-primary cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                    <HistoryIcon size={32} className="stroke-[2.5px]" />
                  </div>
                  <span className="font-prompt font-extrabold text-lg text-slate-900">ดูประวัติรายการ</span>
                </div>

                <div 
                  onClick={() => setActiveTab('notifications')}
                  className="bg-white p-5 rounded-[24px] border-2 border-slate-100 flex flex-col gap-4 shadow-md hover:border-primary cursor-pointer active:bg-slate-50 transition-colors relative"
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                    <Bell size={32} className="stroke-[2.5px]" />
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-5 right-5 w-7 h-7 bg-red-600 text-white text-sm font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      {unreadNotificationsCount}
                    </span>
                  )}
                  <span className="font-prompt font-extrabold text-lg text-slate-900">รับแจ้งเตือนจากร้าน</span>
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('history');
                    showToast('🔍 ตรวจสอบประวัติรายการจองสิทธิ์ของคุณ');
                  }}
                  className="bg-white p-5 rounded-[24px] border-2 border-slate-100 flex flex-col gap-4 shadow-md hover:border-primary cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                    <Award size={32} className="stroke-[2.5px]" />
                  </div>
                  <span className="font-prompt font-extrabold text-lg text-slate-900">ดูประวัติ</span>
                </div>

              </div>
            </div>

            {/* Recommended Shops */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pl-1">
                <h3 className="font-prompt text-lg font-bold text-deep-navy">ร้านตัวแทนแนะนำใกล้ตัวคุณ</h3>
                <button 
                  onClick={() => { setActiveTab('shops'); setShopFilter('all'); }} 
                  className="text-primary font-prompt font-bold text-sm hover:underline"
                >
                  ดูทั้งหมด
                </button>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x">
                {mockShops.map(shop => (
                  <div 
                    key={shop.id}
                    onClick={() => { setSelectedShop(shop); setOrderModalOpen(true); }}
                    className="min-w-[280px] bg-white rounded-3xl border border-border-soft overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer snap-start"
                  >
                    <div className="h-40 relative">
                      <img 
                        className="w-full h-full object-cover" 
                        src={shop.coverImage} 
                        alt={shop.name} 
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                        <span className="text-xs font-bold text-on-surface">{shop.rating}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-prompt font-bold text-base text-on-surface leading-tight truncate">{shop.name}</h4>
                          {shop.isVerified && <CheckCircle2 className="text-primary shrink-0 w-4 h-4" />}
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-1 mt-1 font-medium">{shop.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg">
                          {shop.level}
                        </span>
                        <span className={`text-xs font-bold ${shop.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                          {shop.isOpen ? 'เปิดให้บริการ' : 'กำลังปิด'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight Banner */}
            <div className="bg-slate-100 border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary mx-auto shadow-sm">
                <Award size={24} />
              </div>
              <h4 className="font-prompt font-bold text-primary text-base">การันตีความปลอดภัย N3</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">ตัวแทนทั้งหมดของเราลงทะเบียนยืนยันตัวตน มีสถานประกอบการจริง และผ่านการตรวจสอบประวัติอย่างละเอียด</p>
            </div>
          </div>
        )}

        {/* TAB 2: SHOPS LIST */}
        {activeTab === 'shops' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="brand-gradient px-5 py-6 text-white space-y-4 shadow-md">
              <h2 className="font-prompt text-xl font-extrabold">ค้นหาตัวแทน N3</h2>
              <p className="text-xs opacity-90 leading-relaxed font-medium">เลือกตัวแทนใกล้ท่านเพื่อดูข้อมูลตัวแทน ติดต่อร้านตัวแทน และปรึกษาบริการเสริมได้ทันที</p>
              
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <input 
                  type="text"
                  placeholder="พิมพ์ชื่อตัวแทน แขวง เขต หรือบริการ N3..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white text-slate-900 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm font-medium shadow-inner"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="px-5 flex gap-2 overflow-x-auto scrollbar-none py-1">
              <button 
                onClick={() => setShopFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${shopFilter === 'all' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                ทั้งหมด
              </button>
              <button 
                onClick={() => setShopFilter('nearby')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${shopFilter === 'nearby' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                ตัวแทนใกล้บ้าน
              </button>
              <button 
                onClick={() => setShopFilter('popular')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${shopFilter === 'popular' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                ตัวแทนยอดนิยม
              </button>
              <button 
                onClick={() => setShopFilter('verified')}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${shopFilter === 'verified' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                ตัวแทน N3 ที่ยืนยันแล้ว
              </button>
            </div>

            {/* Shops List */}
            <div className="px-5 space-y-5">
              {filteredShops.length > 0 ? (
                filteredShops.map(shop => (
                  <div 
                    key={shop.id}
                    className="bg-white rounded-3xl border-2 border-slate-150 overflow-hidden shadow-md flex flex-col hover:border-primary transition-all duration-200"
                  >
                    <div className="h-36 w-full relative">
                      <img 
                        src={shop.coverImage} 
                        alt={shop.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-slate-100">
                        <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                        <span className="text-sm font-black text-slate-900">{shop.rating}</span>
                      </div>
                      
                      {/* Trust Badge overlay on cover */}
                      {shop.isVerified && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md border border-white">
                          <CheckCircle2 size={14} className="stroke-[3px] text-slate-950" />
                          <span>ตัวแทน N3 ที่ยืนยันแล้ว</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden p-1 shrink-0 shadow-md -mt-12 relative z-10">
                          <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-prompt font-black text-xl text-slate-950 leading-tight">{shop.name}</h4>
                          </div>
                          <p className="text-sm text-slate-600 font-bold mt-1.5 leading-relaxed">{shop.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
                          ระดับ: {shop.level}
                        </span>
                        <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 ${shop.isOpen ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'}`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {shop.isOpen ? 'เปิดบริการอยู่' : 'ปิดทำการ'}
                        </span>
                      </div>

                      <button 
                        onClick={() => { setSelectedShop(shop); setOrderModalOpen(true); }}
                        className="w-full h-14 bg-primary text-white hover:bg-primary-container rounded-full font-prompt font-black text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                      >
                        <span>ดูข้อมูลร้าน</span>
                        <ArrowRight size={20} className="stroke-[2.5px]" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-3">
                  <AlertCircle className="text-outline w-12 h-12 mx-auto" />
                  <p className="text-on-surface-variant font-bold text-lg">ไม่พบร้านค้าที่ท่านกำลังค้นหา</p>
                  <p className="text-sm text-slate-500">ลองพิมพ์คำค้นหาใหม่อีกครั้ง</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="p-5 space-y-6 animate-fadeIn">
            <div className="brand-gradient p-6 rounded-[24px] text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-1">
                <h2 className="font-prompt text-xl font-extrabold">ประวัติการทำรายการ</h2>
                <p className="text-xs opacity-90 leading-relaxed font-medium">ตรวจสอบรายการคำสั่งซื้อ ความคืบหน้า และประวัติย้อนหลังทั้งหมด</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
              <button 
                onClick={() => setHistoryFilter('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${historyFilter === 'all' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                ทั้งหมด
              </button>
              <button 
                onClick={() => setHistoryFilter('pending')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${historyFilter === 'pending' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                รอดำเนินการ
              </button>
              <button 
                onClick={() => setHistoryFilter('success')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all ${historyFilter === 'success' ? 'brand-gradient text-white shadow-md' : 'bg-white border border-border-soft text-on-surface-variant hover:border-primary'}`}
              >
                สำเร็จแล้ว
              </button>
            </div>

            {/* Orders Stack */}
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div 
                    key={order.id}
                    className="bg-white p-5 rounded-[24px] border border-border-soft shadow-sm flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 border border-border-soft rounded-xl overflow-hidden p-0.5">
                          <img src={order.shopImage} alt={order.shopName} className="w-full h-full object-contain rounded-lg" />
                        </div>
                        <div>
                          <h4 className="font-prompt font-bold text-base text-on-surface leading-snug">{order.shopName}</h4>
                          <p className="text-[11px] text-on-surface-variant font-semibold">{order.date}</p>
                        </div>
                      </div>

                      {/* Order Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        order.status === 'success' 
                          ? 'bg-green-100 text-green-700' 
                          : order.status === 'pending' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'success' ? <CheckCircle2 size={12} /> : <Info size={12} />}
                        {order.status === 'success' ? 'สำเร็จ' : 'รอดำเนินการ'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="text-xs text-on-surface font-medium leading-relaxed">{order.itemsSummary}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-xs text-on-surface-variant font-bold">รหัส: {order.id} ({order.itemsCount} รายการ)</span>
                      <span className="text-lg font-bold text-primary font-prompt">฿{order.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-3">
                  <AlertCircle className="text-outline w-12 h-12 mx-auto" />
                  <p className="text-on-surface-variant font-bold">ไม่พบประวัติการทำรายการตามเงื่อนไข</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="p-5 space-y-6">
            <div className="flex justify-between items-center pl-1">
              <h2 className="font-prompt text-xl font-extrabold text-deep-navy">การแจ้งเตือน</h2>
              {unreadNotificationsCount > 0 && (
                <button 
                  onClick={markAllNotificationsRead}
                  className="text-primary font-prompt font-bold text-xs bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20"
                >
                  ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setNotifications(notifications.map(n => n.id === item.id ? { ...n, isRead: true } : n));
                  }}
                  className={`p-5 rounded-[24px] border shadow-sm transition-all relative overflow-hidden cursor-pointer ${item.isRead ? 'bg-white border-border-soft' : 'bg-primary/5 border-primary/30'}`}
                >
                  {/* Unread indicator */}
                  {!item.isRead && (
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.isRead ? 'bg-slate-100 text-on-surface-variant' : 'bg-primary/10 text-primary'}`}>
                      <Bell size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-sm leading-snug font-bold ${item.isRead ? 'text-on-surface' : 'text-primary'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                        {item.content}
                      </p>
                      <p className="text-[10px] text-outline font-bold pt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-5 space-y-6">
            <div className="bg-white rounded-[28px] border border-border-soft p-6 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 brand-gradient"></div>
              
              <div className="relative mt-8 space-y-3">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mx-auto shadow-md">
                  <img src={mockCustomerProfile.image} alt={mockCustomerProfile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-prompt text-lg font-bold text-on-surface leading-tight">{mockCustomerProfile.name}</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block mt-2">
                    บัญชีผู้ซื้อระดับพรีเมียม
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info Details List */}
            <div className="bg-white rounded-[24px] border border-border-soft p-5 shadow-sm space-y-4">
              <h4 className="font-prompt text-base font-bold text-deep-navy border-b border-slate-100 pb-2">ข้อมูลการติดต่อ</h4>
              
              <div className="flex items-start gap-3">
                <Phone className="text-primary w-5 h-5 shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-on-surface-variant font-bold">เบอร์โทรศัพท์</p>
                  <p className="text-sm text-on-surface font-semibold">{mockCustomerProfile.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="text-primary w-5 h-5 shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-on-surface-variant font-bold">อีเมลผู้ใช้งาน</p>
                  <p className="text-sm text-on-surface font-semibold">{mockCustomerProfile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-primary w-5 h-5 shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-on-surface-variant font-bold">ที่อยู่จัดส่งสินค้าเริ่มต้น</p>
                  <p className="text-xs text-on-surface font-semibold leading-relaxed mt-0.5">{mockCustomerProfile.address}</p>
                </div>
              </div>
            </div>

            {/* Actions list */}
            <div className="space-y-3">
              <button 
                onClick={() => showToast('⚙️ ฟีเจอร์แก้ไขโปรไฟล์จะเปิดให้บริการในเวอร์ชันถัดไป')}
                className="w-full h-14 bg-white border border-border-soft rounded-2xl flex items-center justify-between px-5 text-on-surface font-bold text-sm shadow-sm hover:border-primary active:scale-[0.98] transition-transform"
              >
                <span>แก้ไขข้อมูลส่วนตัว</span>
                <ChevronRight size={18} className="text-outline-variant" />
              </button>

              <button 
                onClick={() => showToast('🔒 ฟีเจอร์เปลี่ยนรหัสผ่านจะเปิดให้บริการในเวอร์ชันถัดไป')}
                className="w-full h-14 bg-white border border-border-soft rounded-2xl flex items-center justify-between px-5 text-on-surface font-bold text-sm shadow-sm hover:border-primary active:scale-[0.98] transition-transform"
              >
                <span>ความปลอดภัยและรหัสผ่าน</span>
                <ChevronRight size={18} className="text-outline-variant" />
              </button>

              <button 
                onClick={onBackToRoles}
                className="w-full h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center gap-2 font-prompt font-bold text-base shadow-md squishy-active"
              >
                <span>ออกจากฝั่งลูกค้า เพื่อสลับบทบาท</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* SHOP SPECIFIC MODAL (High-Fidelity Shop Details) */}
      {orderModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-[420px] max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col animate-slideUp">
            
            {/* Cover and header */}
            <div className="h-40 relative shrink-0">
              <img src={selectedShop.coverImage} alt={selectedShop.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <button 
                onClick={() => { setOrderModalOpen(false); setSelectedShop(null); }}
                className="absolute top-4 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
              >
                <ArrowLeft size={18} className="text-on-surface" />
              </button>

              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-lg overflow-hidden shrink-0">
                  <img src={selectedShop.logo} alt={selectedShop.name} className="w-full h-full object-contain" />
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-1">
                    <h3 className="font-prompt font-bold text-lg leading-tight">{selectedShop.name}</h3>
                    {selectedShop.isVerified && <CheckCircle2 className="text-bright-blue shrink-0 w-4 h-4" />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs opacity-90">
                    <Star className="text-amber-400 fill-amber-400 w-3 h-3" />
                    <span className="font-bold">{selectedShop.rating}</span>
                    <span>({selectedShop.reviewsCount} รีวิว)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-5 space-y-6">
              
              {/* Quick info chips */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  {selectedShop.level}
                </span>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Check size={12} /> เปิดทำการ {selectedShop.openTime} - {selectedShop.closeTime}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">รายละเอียดเกี่ยวกับตัวแทน</h4>
                <p className="text-sm text-on-surface leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedShop.description}
                </p>
              </div>

              {/* Services Offered list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">บริการที่เปิดให้เลือกตัวแทน</h4>
                
                {/* Mock item 1 */}
                <div className="border border-border-soft p-4 rounded-2xl bg-white flex justify-between items-center shadow-sm">
                  <div>
                    <h5 className="text-sm font-bold text-on-surface">จองสิทธิ์ร่วมตัวแทนสลาก N3</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5">บันทึกรายการจองสิทธิ์และโควตากับตัวแทนล่วงหน้า</p>
                  </div>
                  <span className="text-primary font-bold font-prompt text-sm shrink-0">฿1,450.00</span>
                </div>
              </div>

              {/* Map location placeholder */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ที่อยู่และแผนที่จัดตั้งตัวแทน</h4>
                <div className="bg-slate-100 h-32 rounded-2xl overflow-hidden relative border border-border-soft">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiFFoaJeUtQ6lskjIv2_az_4gvVmbtNqhAabwVNYL4XIH8csyspP2-s4t9FGn_89KvbAXtwl0EAuZsvTOEAfKHB26Tioui3bJnhJAMcZz9nheNLZVAGjW8Pbz6Ho1j61DcKLAigpK2wUlh2hAt4DOV4pnJ-t98N6ff1SM9f94OCTCOTUqTdWpDX66rag2KbYMROxEgWJtMMcCK5PrTwVxDerV_NqUP1y-9kUwccy8C7BW7soU-zY9QVbT5Z0uZIeyIlmoOCvfUrJZU')` }}></div>
                  <div className="absolute inset-0 bg-primary/5"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <MapPin size={20} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  📍 {selectedShop.address}
                </p>
              </div>

              {/* Contact phone option */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-primary" />
                  <span className="text-xs text-on-surface font-semibold">ติดต่อร้านตัวแทน: {selectedShop.phone}</span>
                </div>
                <button 
                  onClick={() => showToast(`📞 กำลังจำลองโทรออกติดต่อร้านตัวแทน: ${selectedShop.phone}`)}
                  className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-primary/20"
                >
                  โทรออก
                </button>
              </div>

              {/* Order Buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => { setOrderModalOpen(false); setSelectedShop(null); }}
                  className="flex-1 h-12 bg-slate-100 text-on-surface font-bold text-sm rounded-full hover:bg-slate-200 active:scale-95 transition-transform"
                >
                  ปิดหน้านี้
                </button>
                <button 
                  onClick={() => handlePlaceOrder(selectedShop)}
                  className="flex-[2] h-12 brand-gradient text-white font-prompt font-extrabold text-sm rounded-full shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>เลือกเลข N3</span>
                  <ArrowRight size={18} className="stroke-[3px]" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Customer Bottom Tab Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-border-soft flex justify-around items-center px-4 shadow-lg rounded-t-3xl z-40">
        
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'}`}
        >
          <Home size={activeTab === 'home' ? 24 : 22} className={activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-1.5'} />
          <span className="text-[11px] font-prompt font-bold mt-1">หน้าหลัก</span>
        </button>

        <button 
          onClick={() => setActiveTab('shops')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${activeTab === 'shops' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'}`}
        >
          <Store size={activeTab === 'shops' ? 24 : 22} className={activeTab === 'shops' ? 'stroke-[2.5px]' : 'stroke-1.5'} />
          <span className="text-[11px] font-prompt font-bold mt-1">ร้านค้า</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'}`}
        >
          <HistoryIcon size={activeTab === 'history' ? 24 : 22} className={activeTab === 'history' ? 'stroke-[2.5px]' : 'stroke-1.5'} />
          <span className="text-[11px] font-prompt font-bold mt-1">ประวัติ</span>
        </button>

        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${activeTab === 'notifications' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'}`}
        >
          <Bell size={activeTab === 'notifications' ? 24 : 22} className={activeTab === 'notifications' ? 'stroke-[2.5px]' : 'stroke-1.5'} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-2.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
          )}
          <span className="text-[11px] font-prompt font-bold mt-1">แจ้งเตือน</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'}`}
        >
          <User size={activeTab === 'profile' ? 24 : 22} className={activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-1.5'} />
          <span className="text-[11px] font-prompt font-bold mt-1">โปรไฟล์</span>
        </button>

      </nav>
      </>
      )}
    </div>
  );
}
