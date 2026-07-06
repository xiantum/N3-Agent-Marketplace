import { 
  User, 
  Customer, 
  Agent, 
  Shop, 
  Subscription, 
  AddOnService, 
  Order, 
  SubscriptionPackage, 
  ApprovalRequest, 
  CustomerProfile, 
  AgentProfile, 
  NotificationItem 
} from './types';

// =========================================================================
// 1. SPECIFIED NEW ENTITIES MOCK DATA
// =========================================================================

export const mockUsers: User[] = [
  { id: 'u1', name: 'คุณนลินี รักดี', role: 'customer' },
  { id: 'u2', name: 'คุณเจ๊นุช บางใหญ่', role: 'agent' },
  { id: 'u3', name: 'แอดมิน สมชาย', role: 'admin' }
];

export const mockCustomersEntityList: Customer[] = [
  {
    customerId: 'c1',
    name: 'คุณนลินี รักดี',
    phone: '089-765-4321',
    historyCount: 12,
    favoriteShops: ['shop1', 'shop3']
  },
  {
    customerId: 'c2',
    name: 'คุณวิภาดา แสนดี',
    phone: '081-333-4444',
    historyCount: 8,
    favoriteShops: ['shop2']
  },
  {
    customerId: 'c3',
    name: 'คุณสมเกียรติ ยอดเยี่ยม',
    phone: '086-555-6666',
    historyCount: 25,
    favoriteShops: ['shop1', 'shop5']
  },
  {
    customerId: 'c4',
    name: 'คุณป้าอรวรรณ ใฝ่ดี',
    phone: '082-444-5555',
    historyCount: 42,
    favoriteShops: ['shop3', 'shop6']
  }
];

export const mockAgentsEntityList: Agent[] = [
  {
    agentId: 'AG-001245',
    shopName: 'ร้านเจ๊นุช N3',
    ownerName: 'คุณเจ๊นุช บางใหญ่',
    package: 'Pro',
    quotaTotal: 5000,
    quotaRemaining: 3820,
    todaySales: 42500,
    totalCustomers: 542,
    status: 'Active'
  },
  {
    agentId: 'AG-001568',
    shopName: 'ตัวแทนสมชาย N3',
    ownerName: 'คุณสมชาย ยอดเยี่ยม',
    package: 'Pro',
    quotaTotal: 3000,
    quotaRemaining: 1240,
    todaySales: 28000,
    totalCustomers: 310,
    status: 'Active'
  },
  {
    agentId: 'AG-002104',
    shopName: 'บ้านสลาก N3',
    ownerName: 'คุณป้าอรวรรณ ใฝ่ดี',
    package: 'Basic',
    quotaTotal: 1000,
    quotaRemaining: 320,
    todaySales: 12000,
    totalCustomers: 189,
    status: 'Active'
  },
  {
    agentId: 'AG-002230',
    shopName: 'ร้านโชคดี N3',
    ownerName: 'คุณโชคดี ทวีทรัพย์',
    package: 'Premium',
    quotaTotal: 10000,
    quotaRemaining: 8940,
    todaySales: 89000,
    totalCustomers: 1204,
    status: 'Active'
  },
  {
    agentId: 'AG-003310',
    shopName: 'ตัวแทนนนทบุรี N3',
    ownerName: 'คุณมานะ รักสงบ',
    package: 'Premium',
    quotaTotal: 10000,
    quotaRemaining: 9500,
    todaySales: 15400,
    totalCustomers: 75,
    status: 'Active'
  },
  {
    agentId: 'AG-001099',
    shopName: 'ร้านป้าศรี N3',
    ownerName: 'คุณป้าศรี มั่งมี',
    package: 'Pro',
    quotaTotal: 3000,
    quotaRemaining: 2150,
    todaySales: 18500,
    totalCustomers: 142,
    status: 'Active'
  },
  {
    agentId: 'AG-004501',
    shopName: 'N3 Point บางใหญ่',
    ownerName: 'คุณสมศักดิ์ รักดี',
    package: 'Basic',
    quotaTotal: 1000,
    quotaRemaining: 150,
    todaySales: 4500,
    totalCustomers: 68,
    status: 'Active'
  },
  {
    agentId: 'AG-001255',
    shopName: 'ตัวแทนตลาดกลาง N3',
    ownerName: 'คุณสมพร มีชัย',
    package: 'Pro',
    quotaTotal: 3000,
    quotaRemaining: 2450,
    todaySales: 21000,
    totalCustomers: 220,
    status: 'Active'
  }
];

export const mockSubscriptionsList: Subscription[] = [
  {
    packageName: 'Basic',
    pricePerRound: 49,
    pricePerMonth: 98,
    expireDate: '2026-12-31',
    status: 'Active'
  },
  {
    packageName: 'Pro',
    pricePerRound: 99,
    pricePerMonth: 198,
    expireDate: '2026-12-31',
    status: 'Active'
  },
  {
    packageName: 'Premium',
    pricePerRound: 149,
    pricePerMonth: 298,
    expireDate: '2026-12-31',
    status: 'Active'
  }
];

export const mockAddOnServicesList: AddOnService[] = [
  {
    serviceName: 'ดันหน้าร้านแนะนำพิเศษ',
    price: 99,
    status: 'Active',
    id: 'addon1',
    name: 'ดันหน้าร้านแนะนำพิเศษ',
    description: 'ดันหน้าบูธตัวแทน N3 และแสดงผลในลำดับแนะนำด้านบน เพิ่มจำนวนการแวะชมของลูกค้า 3 เท่า',
    iconName: 'campaign'
  },
  {
    serviceName: 'แจ้งเตือน SMS ถึงลูกค้าด่วน',
    price: 50,
    status: 'Active',
    id: 'addon2',
    name: 'SMS แจ้งเตือนด่วน',
    description: 'ระบบส่งข้อความแจ้งสถานะและเลขรับสิทธิ์ทางมือถือของลูกค้าโดยอัตโนมัติทันที',
    iconName: 'notifications_active'
  },
  {
    serviceName: 'รายงานยอดขาย PDF / Excel',
    price: 199,
    status: 'Active',
    id: 'addon3',
    name: 'รายงานยอดขาย PDF/Excel',
    description: 'สรุปรายงานยอดตัวแทนจำหน่าย รายได้ส่วนต่าง และโควตาคงเหลือเข้าอีเมลทุกสิ้นงวด',
    iconName: 'description'
  },
  {
    serviceName: 'ระบบบันทึกฐานข้อมูลประวัติลูกค้า',
    price: 149,
    status: 'Active',
    id: 'addon4',
    name: 'ระบบฐานข้อมูลลูกค้าประวัติ',
    description: 'บริการสำรองข้อมูลเบอร์ติดต่อลูกค้าและสถิติยอดการซื้อย้อนหลังอย่างปลอดภัย',
    iconName: 'cloud_done'
  }
];

// Compatibility exports
export const mockAddons: AddOnService[] = mockAddOnServicesList;

// =========================================================================
// 2. N3 AGENT SHOPS MOCK DATA
// =========================================================================

export const mockShops: Shop[] = [
  {
    shopId: 'shop1',
    shopName: 'ร้านเจ๊นุช N3',
    rating: 4.9,
    verified: true,
    packageBadge: 'Pro',
    location: 'บางใหญ่ นนทบุรี (ใกล้เซ็นทรัลเวสต์เกต)',
    description: 'ตัวแทนจำหน่าย N3 ที่ผ่านการยืนยันแล้ว จุดจำหน่ายที่ตรวจสอบได้ มีหน้าร้านและช่องทางติดต่อชัดเจน มีประวัติการให้บริการดีเยี่ยม',
    
    // Legacy fields
    id: 'shop1',
    name: 'ร้านเจ๊นุช N3',
    address: 'บางใหญ่ นนทบุรี (ใกล้เซ็นทรัลเวสต์เกต)',
    phone: '089-124-5124',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 148,
    isVerified: true,
    isOpen: true,
    openTime: '08:00',
    closeTime: '20:00',
    level: 'Gold Agent',
    badgeType: 'popular'
  },
  {
    shopId: 'shop2',
    shopName: 'ตัวแทนสมชาย N3',
    rating: 4.8,
    verified: true,
    packageBadge: 'Pro',
    location: 'เมืองนนทบุรี (ตรงข้ามตลาดนนท์)',
    description: 'ตัวแทนจำหน่าย N3 ที่ผ่านการยืนยัน จุดจำหน่ายที่ตรวจสอบได้ ให้บริการแนะนำอย่างเป็นกันเองสำหรับผู้สูงอายุ',
    
    // Legacy fields
    id: 'shop2',
    name: 'ตัวแทนสมชาย N3',
    address: 'เมืองนนทบุรี (ตรงข้ามตลาดนนท์)',
    phone: '081-568-1568',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 92,
    isVerified: true,
    isOpen: true,
    openTime: '08:00',
    closeTime: '19:00',
    level: 'Pro Agent',
    badgeType: 'nearby'
  },
  {
    shopId: 'shop3',
    shopName: 'บ้านสลาก N3',
    rating: 4.7,
    verified: true,
    packageBadge: 'Basic',
    location: 'ปากเกร็ด นนทบุรี (ห้าแยกปากเกร็ด)',
    description: 'ร้านตัวแทนแนะนำ มั่นใจปลอดภัย ตรวจสอบประวัติการจำหน่ายได้เต็มรูปแบบ ลูกค้าสามารถเลือกตัวแทนที่ไว้ใจได้',
    
    // Legacy fields
    id: 'shop3',
    name: 'บ้านสลาก N3',
    address: 'ปากเกร็ด นนทบุรี (ห้าแยกปากเกร็ด)',
    phone: '082-104-2104',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 65,
    isVerified: true,
    isOpen: true,
    openTime: '07:30',
    closeTime: '18:30',
    level: 'Basic Agent',
    badgeType: 'none'
  },
  {
    shopId: 'shop4',
    shopName: 'ร้านโชคดี N3',
    rating: 4.9,
    verified: true,
    packageBadge: 'Premium',
    location: 'ปากเกร็ด นนทบุรี (ซอยวัดกู้)',
    description: 'ตัวแทนจำหน่าย N3 ที่ผ่านการยืนยันแล้ว บริการรวดเร็วทันใจ มีหน้าร้านและเคาน์เตอร์บริการเปิดเผย ตรวจสอบได้ 100%',
    
    // Legacy fields
    id: 'shop4',
    name: 'ร้านโชคดี N3',
    address: 'ปากเกร็ด นนทบุรี (ซอยวัดกู้)',
    phone: '085-223-2230',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 210,
    isVerified: true,
    isOpen: true,
    openTime: '07:00',
    closeTime: '21:00',
    level: 'Premium Agent',
    badgeType: 'popular'
  },
  {
    shopId: 'shop5',
    shopName: 'ตัวแทนนนทบุรี N3',
    rating: 5.0,
    verified: true,
    packageBadge: 'Premium',
    location: 'เมืองนนทบุรี (ใกล้หอนาฬิกา)',
    description: 'ศูนย์ตัวแทนขนาดใหญ่ มอบบริการแบบมืออาชีพ ตรวจสอบความถูกต้องแม่นยำ พร้อมบันทึกประวัติอย่างเป็นระบบ',
    
    // Legacy fields
    id: 'shop5',
    name: 'ตัวแทนนนทบุรี N3',
    address: 'เมืองนนทบุรี (ใกล้หอนาฬิกา)',
    phone: '081-999-3310',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 304,
    isVerified: true,
    isOpen: true,
    openTime: '08:00',
    closeTime: '20:00',
    level: 'Premium Agent',
    badgeType: 'popular'
  },
  {
    shopId: 'shop6',
    shopName: 'ร้านป้าศรี N3',
    rating: 4.8,
    verified: true,
    packageBadge: 'Pro',
    location: 'บางบัวทอง นนทบุรี (ตลาดบางบัวทอง)',
    description: 'จุดบริการซุ้มตัวแทนจำหน่าย N3 ตรวจสอบสถานะจริงได้ เปิดให้บริการทุกวัน มีประวัติทำรายการผ่านแอปพลิเคชันอย่างโปร่งใส',
    
    // Legacy fields
    id: 'shop6',
    name: 'ร้านป้าศรี N3',
    address: 'บางบัวทอง นนทบุรี (ตลาดบางบัวทอง)',
    phone: '086-109-1099',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 88,
    isVerified: true,
    isOpen: true,
    openTime: '08:30',
    closeTime: '19:30',
    level: 'Pro Agent',
    badgeType: 'nearby'
  },
  {
    shopId: 'shop7',
    shopName: 'N3 Point บางใหญ่',
    rating: 4.6,
    verified: true,
    packageBadge: 'Basic',
    location: 'บางใหญ่ นนทบุรี (ซอยแก้วอินทร์)',
    description: 'บูธตัวแทนรายย่อย ดูแลด้วยใจ มีหน้าร้านจริงและเบอร์โทรที่ติดต่อได้รวดเร็ว เพื่อความอุ่นใจของคนในพื้นที่',
    
    // Legacy fields
    id: 'shop7',
    name: 'N3 Point บางใหญ่',
    address: 'บางใหญ่ นนทบุรี (ซอยแก้วอินทร์)',
    phone: '083-450-4501',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 42,
    isVerified: true,
    isOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    level: 'Basic Agent',
    badgeType: 'none'
  },
  {
    shopId: 'shop8',
    shopName: 'ตัวแทนตลาดกลาง N3',
    rating: 4.9,
    verified: true,
    packageBadge: 'Pro',
    location: 'บางใหญ่ นนทบุรี (ในตลาดกลางบางใหญ่)',
    description: 'ตัวแทนจำหน่าย N3 ที่ผ่านการตรวจสอบ จุดจำหน่ายที่มีความโปร่งใส ปลอดภัย มีประวัติการจัดเตรียมสิทธิ์อย่างซื่อสัตย์',
    
    // Legacy fields
    id: 'shop8',
    name: 'ตัวแทนตลาดกลาง N3',
    address: 'บางใหญ่ นนทบุรี (ในตลาดกลางบางใหญ่)',
    phone: '081-255-2450',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=120',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600',
    reviewsCount: 115,
    isVerified: true,
    isOpen: true,
    openTime: '08:00',
    closeTime: '20:30',
    level: 'Pro Agent',
    badgeType: 'nearby'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'TXN-N3-1004',
    shopName: 'ร้านเจ๊นุช N3',
    shopImage: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=120',
    date: 'วันนี้ • 14:20',
    amount: 160,
    itemsCount: 1,
    status: 'success',
    itemsSummary: 'รายการจองสิทธิ์ตัวแทนสลาก N3 งวดประจำวันที่ 16 กรกฎาคม'
  },
  {
    id: 'TXN-N3-1003',
    shopName: 'ตัวแทนสมชาย N3',
    shopImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=120',
    date: 'วันนี้ • 09:45',
    amount: 320,
    itemsCount: 2,
    status: 'pending',
    itemsSummary: 'รายการจองสิทธิ์ตัวแทนสลาก N3 งวดปัจจุบัน (รออัปเดตสิทธิ์ระบบ)'
  },
  {
    id: 'TXN-N3-1002',
    shopName: 'บ้านสลาก N3',
    shopImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=120',
    date: '1 ก.ค. 2026 • 11:00',
    amount: 80,
    itemsCount: 1,
    status: 'success',
    itemsSummary: 'รายการจองสิทธิ์ตัวแทนสลาก N3 (งวดประจำวันที่ 1 กรกฎาคม)'
  },
  {
    id: 'TXN-N3-1001',
    shopName: 'ร้านโชคดี N3',
    shopImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=120',
    date: '16 มิ.ย. 2026 • 18:30',
    amount: 400,
    itemsCount: 5,
    status: 'success',
    itemsSummary: 'รายการจองสิทธิ์ตัวแทนสลาก N3 งวดกลางเดือนมิถุนายน สำเร็จเสร็จสิ้น'
  }
];

export const mockPackages: SubscriptionPackage[] = [
  {
    id: 'basic',
    name: 'Basic Agent',
    pricePerPeriod: 49,
    pricePerMonth: 98,
    periodText: '/ งวด',
    features: [
      { text: 'จัดการระบบหน้าร้านตัวแทนส่วนตัว (Storefront)', included: true },
      { text: 'ระบบ QR Code จำลองการรับยอดชำระเงิน', included: true },
      { text: 'รายงานยอดขายพื้นฐานประจำร้าน', included: true },
      { text: 'โควตาการลงสินค้าจำลองมาตรฐาน (1,000 สิทธิ์)', included: true },
      { text: 'ระบบส่ง SMS แจ้งลูกค้าอัจฉริยะ', included: false },
      { text: 'รายงานสรุปบัญชีและภาษีอย่างละเอียด', included: false }
    ],
    badge: 'ตัวแทนเริ่มต้น'
  },
  {
    id: 'pro',
    name: 'Pro Agent',
    pricePerPeriod: 99,
    pricePerMonth: 198,
    periodText: '/ งวด',
    features: [
      { text: 'ฟีเจอร์ทั้งหมดจาก Basic Agent', included: true, isHeader: true },
      { text: 'ระบบแจ้งเตือนลูกค้าผ่าน SMS อัตโนมัติ', included: true },
      { text: 'โควตาการจองยอดจำลองขยาย (5,000 สิทธิ์)', included: true },
      { text: 'สิทธิ์การดาวน์โหลดรายงานสรุปแบบ Excel/PDF', included: true },
      { text: 'ป้ายรับรองร้านค้าแนะนำยอดนิยมด้านบน', included: false }
    ],
    badge: 'ตัวแทนมืออาชีพ',
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium Agent',
    pricePerPeriod: 149,
    pricePerMonth: 298,
    periodText: '/ งวด',
    features: [
      { text: 'ฟีเจอร์ทั้งหมดจาก Pro Agent', included: true, isHeader: true },
      { text: 'โควตาการจำลองสูงสุด (10,000 สิทธิ์)', included: true },
      { text: 'เครื่องหมายผู้ค้าแนะนำพิเศษ (Featured Agent)', included: true },
      { text: 'ป้ายสัญลักษณ์ตกแต่งบูธพิเศษเฉพาะแบรนด์', included: true },
      { text: 'เจ้าหน้าที่ผู้เชี่ยวชาญบริการตอบคำถามส่วนตัวตลอด 24 ชม.', included: true }
    ],
    badge: 'ตัวแทนระดับสูง'
  }
];

export const mockApprovals: ApprovalRequest[] = [
  {
    id: 'app1',
    name: 'คุณเจ๊นุช บางใหญ่',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=120',
    type: 'register',
    typeText: 'สมัครลงทะเบียนเป็นตัวแทนจำหน่าย N3',
    level: 'Gold Agent'
  },
  {
    id: 'app2',
    name: 'คุณสมเกียรติ ยอดเยี่ยม',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=120',
    type: 'upgrade',
    typeText: 'ขออัปเกรดระดับการจัดการตัวแทน',
    level: 'Premium Agent'
  }
];

export const mockCustomerProfile: CustomerProfile = {
  name: 'คุณนลินี รักดี',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  phone: '089-765-4321',
  email: 'nalinee.r@gmail.com',
  address: '123/45 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
  favoriteShops: ['shop1', 'shop3']
};

export const mockAgentProfile: AgentProfile = {
  name: 'คุณเจ๊นุช บางใหญ่',
  shopName: 'ร้านเจ๊นุช N3',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  phone: '089-124-5124',
  email: 'januch.n3@n3agent.com',
  quotaRemaining: 3820,
  salesToday: 42500,
  totalCustomers: 542,
  pendingOrders: 5,
  isPremium: true
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'คำสั่งซื้อสิทธิ์ของท่านได้รับการบันทึกแล้ว',
    content: 'รายการจองสิทธิ์จำลองผ่าน "ร้านเจ๊นุช N3" ได้รับการบันทึกเข้าระบบแล้ว รอการยืนยันโควตา',
    date: 'วันนี้ • 10:30',
    isRead: false
  },
  {
    id: 'n2',
    title: 'ตัวแทนจำหน่าย N3 อัปเดตแพ็กเกจการบริการ',
    content: 'ระบบยินดีต้อนรับ "ตัวแทนสมชาย N3" ขยายโควตาการให้บริการแก่ประชาชนในพื้นที่เมืองนนทบุรีแล้ว',
    date: 'เมื่อวานนี้ • 14:15',
    isRead: false
  },
  {
    id: 'n3',
    title: 'ระบบสำรองข้อมูลสำหรับร้านตัวแทนเสร็จสิ้น',
    content: 'ฐานข้อมูลประวัติการจองสิทธิ์จำลองในสัปดาห์ที่ผ่านมา ได้รับการสำรองข้อมูลขึ้นระบบ Cloud เรียบร้อย ปลอดภัย 100%',
    date: '3 วันที่แล้ว',
    isRead: true
  }
];
