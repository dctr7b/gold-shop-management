import { useEffect, useMemo, useState } from 'react';
import { Activity, Archive, Banknote, Boxes, Check, Download, Gem, LayoutDashboard, Plus, Search, ShieldCheck, ShoppingBag, Smartphone, TrendingUp, Upload, UserCheck, Wallet, Wifi, WifiOff } from 'lucide-react';

type GoldPrice = { karat: number; perGram: number };
type Product = {
  id: string;
  sku: string;
  name: string;
  karat: number;
  weight: number;
  workmanship: number;
  stoneCost: number;
  stock: number;
  createdAt: string;
};
type Customer = {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  createdAt: string;
};
type Sale = {
  id: string;
  invoiceNumber: string;
  productId: string;
  productName: string;
  customerName: string;
  customerId: string;
  quantity: number;
  karat: number;
  weight: number;
  goldPrice: number;
  workmanship: number;
  stoneCost: number;
  total: number;
  paid: number;
  createdAt: string;
};

type Store = {
  products: Product[];
  sales: Sale[];
  prices: GoldPrice[];
  customers: Customer[];
};

const STORAGE_KEY = 'gold-shop-state-v1';
const defaults: Store = {
  products: [
    { id: 'p-1', sku: 'G-001', name: 'خاتم ذهبي', karat: 21, weight: 8.5, workmanship: 250, stoneCost: 300, stock: 3, createdAt: new Date().toISOString() },
    { id: 'p-2', sku: 'G-002', name: 'سلسلة ذهبية', karat: 18, weight: 12, workmanship: 350, stoneCost: 0, stock: 2, createdAt: new Date().toISOString() },
  ],
  sales: [],
  prices: [
    { karat: 24, perGram: 3400 },
    { karat: 21, perGram: 2950 },
    { karat: 18, perGram: 2550 },
    { karat: 14, perGram: 2000 },
  ],
  customers: [
    { id: 'c-1', name: 'أحمد محمد', phone: '01012345678', nationalId: '29801010123456', createdAt: new Date().toISOString() },
  ],
};

const money = (n: number) => `${new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(n)} ج.م`;
const numeric = (n: number) => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(n);

const readStore = (): Store => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Store;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
};

const isValidEgyptianPhone = (value: string) => /^01[0-2,5]\d{8}$/.test(value.replace(/\s+/g, ''));

const isValidEgyptianNationalId = (value: string) => {
  const digits = value.replace(/\s+/g, '');
  if (!/^\d{14}$/.test(digits)) return false;
  const century = digits.slice(0, 1);
  const year = Number(digits.slice(1, 3));
  const month = Number(digits.slice(3, 5));
  const day = Number(digits.slice(5, 7));
  const governorate = Number(digits.slice(7, 9));
  if (!['2', '3'].includes(century)) return false;
  if (year < 0 || year > 99) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (governorate < 1 || governorate > 27) return false;
  const product = digits.split('').map(Number);
  const checksum = product[13];
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += product[i] * (i % 2 === 0 ? 1 : 2);
  }
  const remainder = sum % 11;
  const expected = (11 - remainder) % 10;
  return checksum === expected;
};

export default function App() {
  const [store, setStore] = useState<Store>(readStore);
  const [page, setPage] = useState<'الرئيسية' | 'المنتجات' | 'المبيعات' | 'الأسعار' | 'العملاء' | 'النسخ الاحتياطي'>('الرئيسية');
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [salePaid, setSalePaid] = useState('');
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  const productList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return store.products.filter((p) => {
      if (!q) return true;
      return `${p.name} ${p.sku} ${p.karat}`.toLowerCase().includes(q);
    });
  }, [search, store.products]);

  const totalInventory = store.products.reduce((sum, p) => sum + p.stock, 0);
  const todaySales = store.sales.filter((s) => new Date(s.createdAt).toDateString() === new Date().toDateString());
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);

  const selectedProduct = store.products.find((p) => p.id === selectedProductId) ?? null;
  const selectedGoldPrice = store.prices.find((p) => p.karat === selectedProduct?.karat)?.perGram ?? 0;
  const saleTotal = selectedProduct
    ? selectedProduct.weight * selectedGoldPrice * saleQty + selectedProduct.workmanship * saleQty + selectedProduct.stoneCost * saleQty
    : 0;

  const addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const sku = String(form.get('sku') || '').trim();
    const karat = Number(form.get('karat') || 21);
    const weight = Number(form.get('weight') || 0);
    const workmanship = Number(form.get('workmanship') || 0);
    const stoneCost = Number(form.get('stoneCost') || 0);
    const stock = Number(form.get('stock') || 0);
    if (!name || !weight || weight <= 0 || stock < 0) {
      setNotice('أدخل اسم القطعة ووزنًا صحيحًا وكمية مناسبة');
      return;
    }

    const product: Product = {
      id: crypto.randomUUID(),
      sku: sku || `G-${Date.now().toString().slice(-6)}`,
      name,
      karat,
      weight,
      workmanship,
      stoneCost,
      stock,
      createdAt: new Date().toISOString(),
    };

    setStore((prev) => ({ ...prev, products: [product, ...prev.products] }));
    setShowProductModal(false);
    event.currentTarget.reset();
    setNotice('تمت إضافة القطعة إلى المخزون');
  };

  const addCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const nationalId = String(form.get('nationalId') || '').trim();

    if (!name || !isValidEgyptianPhone(phone) || !isValidEgyptianNationalId(nationalId)) {
      setNotice('تحقق من اسم العميل، رقم الهاتف، ورقم قومي سليم');
      return;
    }

    const customer: Customer = {
      id: crypto.randomUUID(),
      name,
      phone,
      nationalId,
      createdAt: new Date().toISOString(),
    };

    setStore((prev) => ({ ...prev, customers: [customer, ...prev.customers] }));
    setCustomerId(customer.id);
    setShowCustomerModal(false);
    event.currentTarget.reset();
    setNotice('تمت إضافة العميل بنجاح');
  };

  const saveGoldPrice = (karat: number, value: string) => {
    const parsed = Number(value);
    setStore((prev) => ({
      ...prev,
      prices: prev.prices.map((p) => (p.karat === karat ? { ...p, perGram: Number.isFinite(parsed) ? parsed : 0 } : p)),
    }));
  };

  const sellSelectedProduct = () => {
    if (!selectedProduct) {
      setNotice('اختر قطعة أولاً من المخزون');
      return;
    }
    if (saleQty <= 0 || saleQty > selectedProduct.stock) {
      setNotice('الكمية غير متاحة في المخزون');
      return;
    }
    if (!customerId) {
      setNotice('اختر عميل أو أضف عميل جديدًا قبل البيع');
      return;
    }

    const customer = store.customers.find((c) => c.id === customerId);
    const paid = Number(salePaid || saleTotal);
    if (!Number.isFinite(paid) || paid < 0 || paid > saleTotal) {
      setNotice('راجع قيمة المبلغ المدفوع');
      return;
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const sale: Sale = {
      id: crypto.randomUUID(),
      invoiceNumber,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      customerName: customer?.name || 'عميل غير محدد',
      customerId: customerId,
      quantity: saleQty,
      karat: selectedProduct.karat,
      weight: selectedProduct.weight,
      goldPrice: selectedGoldPrice,
      workmanship: selectedProduct.workmanship,
      stoneCost: selectedProduct.stoneCost,
      total: saleTotal,
      paid,
      createdAt: new Date().toISOString(),
    };

    setStore((prev) => ({
      ...prev,
      sales: [sale, ...prev.sales],
      products: prev.products.map((p) => (p.id === selectedProduct.id ? { ...p, stock: p.stock - saleQty } : p)),
    }));

    setSelectedProductId('');
    setSaleQty(1);
    setSalePaid('');
    setCustomerId('');
    setNotice(`تمت الفاتورة ${invoiceNumber} بنجاح`);
  };

  const exportJson = () => {
    const anchor = document.createElement('a');
    const content = JSON.stringify(store, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    anchor.href = href;
    anchor.download = `gold-shop-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
    setNotice('تم تصدير نسخة البيانات بنجاح');
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed?.products || !parsed?.prices) throw new Error('bad format');
        setStore((prev) => ({ ...prev, ...parsed }));
        setNotice('تم دمج نسخة البيانات بنجاح');
      } catch {
        setNotice('الملف غير صالح، تأكد أنه ملف نسخة البيانات الصحيح');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark"><Gem size={20} /></div>
          <div>
            <strong>محل الذهب</strong>
            <small>إدارة كاملة</small>
          </div>
        </div>

        <nav className="nav">
          {['الرئيسية', 'المنتجات', 'المبيعات', 'الأسعار', 'العملاء', 'النسخ الاحتياطي'].map((item) => (
            <button
              key={item}
              className={`nav-item ${page === item ? 'active' : ''}`}
              onClick={() => setPage(item as typeof page)}
            >
              {item === 'الرئيسية' && <LayoutDashboard size={17} />}
              {item === 'المنتجات' && <Boxes size={17} />}
              {item === 'المبيعات' && <ShoppingBag size={17} />}
              {item === 'الأسعار' && <Gem size={17} />}
              {item === 'العملاء' && <UserCheck size={17} />}
              {item === 'النسخ الاحتياطي' && <Archive size={17} />}
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="status-box">
          <div className={`online-pill ${online ? '' : 'offline'}`}>
            {online ? <Wifi size={13} /> : <WifiOff size={13} />}
            {online ? 'متصل' : 'بدون إنترنت'}
          </div>
          <small>البيانات تحفظ محليًا على الجهاز</small>
        </div>
      </aside>

      <main className="main-area">
        <header className="header">
          <div>
            <small className="small-label">نظام إدارة محل الذهب</small>
            <h1>{page}</h1>
          </div>
          <div className="header-actions">
            <button className="ghost-btn" onClick={() => setNotice(online ? 'الإنترنت متصل' : 'التطبيق يعمل محليًا')}>حالة التشغيل</button>
            <div className="avatar">م</div>
          </div>
        </header>

        {page === 'الرئيسية' && (
          <>
            <section className="hero-card">
              <div>
                <small>لوحة التحكم</small>
                <h2>إدارة المحل بكل وضوح وسرعة</h2>
                <p>مخزون، أسعار، مبيعات، عملاء، وفواتير موثقة بدون تعارض.</p>
              </div>
              <div className="hero-icon"><TrendingUp size={32} /></div>
            </section>

            <section className="stats-grid">
              <MetricCard icon={<Banknote size={18} />} label="مبيعات اليوم" value={money(todayTotal)} note={`${todaySales.length} فاتورة`} />
              <MetricCard icon={<Boxes size={18} />} label="إجمالي المخزون" value={numeric(totalInventory)} note="قطع متاحة" />
              <MetricCard icon={<Activity size={18} />} label="أحدث بيع" value={store.sales[0] ? money(store.sales[0].total) : 'لا يوجد'} note={store.sales[0] ? store.sales[0].invoiceNumber : 'لا توجد'} />
              <MetricCard icon={<Wallet size={18} />} label="سعر عيار 21" value={money(store.prices.find((p) => p.karat === 21)?.perGram ?? 0)} note="للجرام" />
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>أسعار الذهب</h3>
                  <p>تحديث يدوي للأوزان والعيارات</p>
                </div>
                <button className="primary-btn" onClick={() => setPage('الأسعار')}>تحديث الأسعار</button>
              </div>
              <div className="price-grid">
                {store.prices.map((price) => (
                  <div key={price.karat} className="price-box">
                    <span>عيار {price.karat}</span>
                    <strong>{money(price.perGram)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {page === 'المنتجات' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>القطع المتاحة</h3>
                <p>التحقق من المخزون ومنع البيع الزائد</p>
              </div>
              <button className="primary-btn" onClick={() => setShowProductModal(true)}><Plus size={16} /> إضافة قطعة</button>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={16} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الكود أو العيار" />
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>الكود</th>
                    <th>الاسم</th>
                    <th>العيار</th>
                    <th>الوزن</th>
                    <th>المخزون</th>
                    <th>المصنعية</th>
                    <th>الإضافات</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((p) => (
                    <tr key={p.id}>
                      <td>{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.karat} قيراط</td>
                      <td>{p.weight} جم</td>
                      <td><span className={p.stock > 0 ? 'stock-ok' : 'stock-zero'}>{p.stock}</span></td>
                      <td>{money(p.workmanship)}</td>
                      <td>{money(p.stoneCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === 'المبيعات' && (
          <>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>إصدار فاتورة بيع</h3>
                  <p>يتم فحص المخزون قبل الحفظ</p>
                </div>
              </div>

              <div className="sale-grid">
                <label>
                  <span>اختر القطعة</span>
                  <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                    <option value="">اختر قطعة</option>
                    {store.products.filter((p) => p.stock > 0).map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.karat} قيراط — المخزون {p.stock}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>اختر العميل</span>
                  <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                    <option value="">اختر عميل</option>
                    {store.customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>الكمية</span>
                  <input type="number" min={1} max={selectedProduct?.stock ?? 1} value={saleQty} onChange={(e) => setSaleQty(Number(e.target.value) || 1)} />
                </label>

                <label>
                  <span>المبلغ المدفوع</span>
                  <input type="number" min={0} step="0.01" value={salePaid} onChange={(e) => setSalePaid(e.target.value)} />
                </label>
              </div>

              <div className="calc-box">
                {selectedProduct ? (
                  <>
                    <div><span>سعر الذهب</span><strong>{money(selectedGoldPrice * selectedProduct.weight * saleQty)}</strong></div>
                    <div><span>المصنعية</span><strong>{money(selectedProduct.workmanship * saleQty)}</strong></div>
                    <div><span>الإضافات</span><strong>{money(selectedProduct.stoneCost * saleQty)}</strong></div>
                    <div className="grand-total"><span>الإجمالي</span><strong>{money(saleTotal)}</strong></div>
                  </>
                ) : (
                  <p>اختر قطعة لعرض إجمالي الفاتورة.</p>
                )}
              </div>

              <div className="form-actions-row">
                <button className="primary-btn" onClick={sellSelectedProduct}>حفظ الفاتورة</button>
                <button className="secondary-btn" onClick={() => setShowCustomerModal(true)}>إضافة عميل</button>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>سجل المبيعات</h3>
                  <p>كل فاتورة تحفظ وقت البيع وتفاصيل العميل</p>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>رقم الفاتورة</th>
                      <th>العميل</th>
                      <th>القطعة</th>
                      <th>الإجمالي</th>
                      <th>المدفوع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.sales.map((sale) => (
                      <tr key={sale.id}>
                        <td>{sale.invoiceNumber}</td>
                        <td>{sale.customerName}</td>
                        <td>{sale.productName}</td>
                        <td>{money(sale.total)}</td>
                        <td>{money(sale.paid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {page === 'الأسعار' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>أسعار الذهب</h3>
                <p>تحديث كافة العيارات</p>
              </div>
            </div>
            <div className="price-editor-grid">
              {store.prices.map((price) => (
                <label key={price.karat} className="price-editor-box">
                  <span>عيار {price.karat}</span>
                  <div>
                    <input type="number" min={0} step="0.01" value={price.perGram} onChange={(e) => saveGoldPrice(price.karat, e.target.value)} />
                    <small>ج.م</small>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {page === 'العملاء' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>قائمة العملاء</h3>
                <p>التحقق من الرقم القومي ورقم الهاتف المصري</p>
              </div>
              <button className="primary-btn" onClick={() => setShowCustomerModal(true)}><UserCheck size={16} /> إضافة عميل</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الهاتف</th>
                    <th>الرقم القومي</th>
                  </tr>
                </thead>
                <tbody>
                  {store.customers.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.nationalId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === 'النسخ الاحتياطي' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>النسخ الاحتياطي والمزامنة</h3>
                <p>في حالة انقطاع الإنترنت يُحفظ البيانات على الجهاز ثم يتم التصدير والاستيراد</p>
              </div>
            </div>

            <div className="backup-boxes">
              <div className="backup-box">
                <Download size={18} />
                <div>
                  <strong>تصدير نسخة بيانات</strong>
                  <small>JSON يحفظ المنتجات والمشتريات والمبيعات والعملاء</small>
                </div>
                <button className="secondary-btn" onClick={exportJson}>تصدير</button>
              </div>

              <div className="backup-box">
                <Upload size={18} />
                <div>
                  <strong>استيراد نسخة بيانات</strong>
                  <small>دمج البيانات الجديدة مع النسخة الحالية</small>
                </div>
                <label className="secondary-btn file-label">
                  استيراد
                  <input type="file" accept="application/json" onChange={importJson} />
                </label>
              </div>
            </div>

            <div className="sync-note">
              <ShieldCheck size={16} />
              <span>مهم: أثناء انقطاع الإنترنت لا تبيع نفس القطعة من أكثر من جهاز قبل تبادل البيانات ومراجعة المخزون.</span>
            </div>
          </section>
        )}
      </main>

      {showProductModal && (
        <div className="modal-backdrop" onClick={() => setShowProductModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <h3>إضافة قطعة جديدة</h3>
                <p>كل قطعة تُسجل بوزنها وعيارها والمخزون</p>
              </div>
              <button className="icon-btn" onClick={() => setShowProductModal(false)}>×</button>
            </div>
            <form onSubmit={addProduct} className="form-grid">
              <label>
                <span>اسم القطعة</span>
                <input name="name" required placeholder="مثال: خاتم ذهبي" />
              </label>
              <label>
                <span>الكود</span>
                <input name="sku" placeholder="اختياري" />
              </label>
              <label>
                <span>العيار</span>
                <select name="karat" defaultValue={21}>
                  {[24, 21, 18, 14].map((karat) => (
                    <option key={karat} value={karat}>{karat} قيراط</option>
                  ))}
                </select>
              </label>
              <label>
                <span>الوزن (جرام)</span>
                <input name="weight" type="number" min="0" step="0.01" required />
              </label>
              <label>
                <span>المصنعية</span>
                <input name="workmanship" type="number" min="0" step="0.01" defaultValue={0} />
              </label>
              <label>
                <span>تكلفة الأحجار/الإضافات</span>
                <input name="stoneCost" type="number" min="0" step="0.01" defaultValue={0} />
              </label>
              <label>
                <span>المخزون</span>
                <input name="stock" type="number" min={0} step="1" defaultValue={0} />
              </label>
              <div className="full-row form-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowProductModal(false)}>إلغاء</button>
                <button type="submit" className="primary-btn">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCustomerModal && (
        <div className="modal-backdrop" onClick={() => setShowCustomerModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <h3>إضافة عميل جديد</h3>
                <p>تحقق من الرقم القومي ورقم الهاتف المصري</p>
              </div>
              <button className="icon-btn" onClick={() => setShowCustomerModal(false)}>×</button>
            </div>
            <form onSubmit={addCustomer} className="form-grid">
              <label>
                <span>اسم العميل</span>
                <input name="name" required placeholder="مثال: محمد علي" />
              </label>
              <label>
                <span>رقم الهاتف</span>
                <input name="phone" required placeholder="01012345678" />
              </label>
              <label className="full-row">
                <span>الرقم القومي</span>
                <input name="nationalId" required placeholder="14 رقم" />
              </label>
              <div className="full-row form-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowCustomerModal(false)}>إلغاء</button>
                <button type="submit" className="primary-btn">حفظ العميل</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}

function MetricCard({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span>{label}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
