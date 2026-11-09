import { useState, useEffect, useRef, useCallback } from 'react'
import Footer from './Footer'
import SubTabs from './SubTabs'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  ink900: '#0E1116', ink600: '#2A3039', ink400: '#5C6673', ink200: '#A8B0BB', ink100: '#E2E6EC',
  surface50: '#F7F8FA', surface100: '#EEF1F5',
  brand: '#E10B17', brass: '#B98B43',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
type NoticeCategory = 'Meeting' | 'Payment' | 'News clipping' | 'Obituary'
type NoticeEntry = { id: number; date: string; year: string; month: string; title: string; bangla: boolean; category: NoticeCategory; fileType: 'PDF' | 'JPG'; size: string }

const NOTICES: NoticeEntry[] = [
  { id: 1,  date: '03 Jul', year: '2026', month: 'July 2026',   title: '2ND CONVENER COMMITTEE Meeting (Agenda Notice)',      bangla: false, category: 'Meeting',       fileType: 'PDF', size: '180 KB' },
  { id: 2,  date: '08 Jul', year: '2026', month: 'July 2026',   title: 'বকেয়া পরিশোধ সংক্রান্ত বিশেষ নোটিশ',               bangla: true,  category: 'Payment',       fileType: 'PDF', size: '95 KB'  },
  { id: 3,  date: '09 Jun', year: '2026', month: 'June 2026',   title: 'খুলশী ক্লাব পরিবার শোকাহত',                         bangla: true,  category: 'Obituary',      fileType: 'PDF', size: '72 KB'  },
  { id: 4,  date: '09 Jun', year: '2026', month: 'June 2026',   title: 'শোক বার্তা',                                         bangla: true,  category: 'Obituary',      fileType: 'PDF', size: '64 KB'  },
  { id: 5,  date: '02 Jun', year: '2026', month: 'June 2026',   title: 'নোটিশ',                                              bangla: true,  category: 'Meeting',       fileType: 'PDF', size: '110 KB' },
  { id: 6,  date: '19 May', year: '2026', month: 'May 2026',    title: 'দৈনিক আজাদী নিউজ',                                  bangla: true,  category: 'News clipping', fileType: 'JPG', size: '1.2 MB' },
  { id: 7,  date: '11 May', year: '2026', month: 'May 2026',    title: 'Annual General Meeting 2026 — Notice of Meeting',     bangla: false, category: 'Meeting',       fileType: 'PDF', size: '220 KB' },
  { id: 8,  date: '04 Apr', year: '2026', month: 'April 2026',  title: 'Subscription Renewal Reminder — FY 2026',             bangla: false, category: 'Payment',       fileType: 'PDF', size: '145 KB' },
  { id: 9,  date: '15 Mar', year: '2026', month: 'March 2026',  title: 'Executive Committee Meeting — March 2026',            bangla: false, category: 'Meeting',       fileType: 'PDF', size: '188 KB' },
  { id: 10, date: '28 Feb', year: '2026', month: 'February 2026', title: 'ক্লাব নাইট ২০২৬ — আমন্ত্রণ',                     bangla: true,  category: 'Meeting',       fileType: 'PDF', size: '320 KB' },
  { id: 11, date: '10 Jan', year: '2026', month: 'January 2026', title: 'New Year Reception 2026 — Invitation',               bangla: false, category: 'Meeting',       fileType: 'PDF', size: '275 KB' },
  { id: 12, date: '20 Dec', year: '2025', month: 'December 2025', title: 'বার্ষিক চাঁদা পরিশোধের নোটিশ ২০২৫',              bangla: true,  category: 'Payment',       fileType: 'PDF', size: '98 KB'  },
  { id: 13, date: '05 Dec', year: '2025', month: 'December 2025', title: 'CKCL in Daily Azadi — Club Night Coverage',         bangla: false, category: 'News clipping', fileType: 'JPG', size: '2.1 MB' },
  { id: 14, date: '12 Nov', year: '2025', month: 'November 2025', title: 'Executive Committee Meeting — November 2025',       bangla: false, category: 'Meeting',       fileType: 'PDF', size: '165 KB' },
]

const CATEGORY_COLORS: Record<NoticeCategory, { bg: string; color: string }> = {
  'Meeting':       { bg: '#EFF6FF', color: '#1D4ED8' },
  'Payment':       { bg: '#FFF7E6', color: '#B98B43' },
  'News clipping': { bg: '#DCFCE7', color: '#16A34A' },
  'Obituary':      { bg: '#F3F4F6', color: '#4B5563' },
}

type AlbumEntry = { id: number; name: string; count: number; year: string; cover: string; photos: { src: string; caption: string }[] }
const ALBUMS: AlbumEntry[] = [
  { id: 1, name: '1st Executive Committee Meeting 2013', year: '2013', count: 24, cover: 'https://images.unsplash.com/photo-1700514077430-3659e38eb5e7?w=800&h=600&fit=crop&auto=format',
    photos: [
      { src: 'https://images.unsplash.com/photo-1700514077430-3659e38eb5e7?w=900&h=600&fit=crop&auto=format', caption: 'Opening session of the founding committee' },
      { src: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&h=1200&fit=crop&auto=format', caption: 'Committee members in formal session' },
      { src: 'https://images.unsplash.com/photo-1602081115720-72e5b0a254b8?w=900&h=600&fit=crop&auto=format', caption: 'Signing of founding charter' },
      { src: 'https://images.unsplash.com/photo-1676302144341-10563603f99a?w=900&h=600&fit=crop&auto=format', caption: 'Group photograph of founding members' },
      { src: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=900&h=600&fit=crop&auto=format', caption: 'Reception dinner' },
      { src: 'https://images.unsplash.com/photo-1720623784273-f9388b9aa535?w=900&h=600&fit=crop&auto=format', caption: 'Toast to the new club' },
    ]
  },
  { id: 2, name: "Valentine's Day 2014", year: '2014', count: 38, cover: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&h=600&fit=crop&auto=format',
    photos: [
      { src: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&h=1100&fit=crop&auto=format', caption: "Valentine's evening at the Convention Hall" },
      { src: 'https://images.unsplash.com/photo-1700514077430-3659e38eb5e7?w=900&h=600&fit=crop&auto=format', caption: 'Musical performance' },
      { src: 'https://images.unsplash.com/photo-1681855132086-2af9a58b56ad?w=900&h=600&fit=crop&auto=format', caption: 'Couples dinner' },
      { src: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=900&h=1200&fit=crop&auto=format', caption: 'Garden reception' },
    ]
  },
  { id: 3, name: 'Annual Picnic 2014', year: '2014', count: 52, cover: 'https://images.unsplash.com/photo-1680609989998-6183fcea718b?w=800&h=600&fit=crop&auto=format',
    photos: [
      { src: 'https://images.unsplash.com/photo-1680609989998-6183fcea718b?w=900&h=600&fit=crop&auto=format', caption: 'Pool activities at the annual picnic' },
      { src: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=900&h=600&fit=crop&auto=format', caption: 'Swimming competition' },
      { src: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=900&h=1100&fit=crop&auto=format', caption: 'BBQ lunch by the pool' },
    ]
  },
  { id: 4, name: 'Club Night 2015', year: '2015', count: 61, cover: 'https://images.unsplash.com/photo-1781955781178-6ea29c66e860?w=800&h=600&fit=crop&auto=format',
    photos: [
      { src: 'https://images.unsplash.com/photo-1781955781178-6ea29c66e860?w=900&h=600&fit=crop&auto=format', caption: 'Club Night 2015 — grand opening' },
      { src: 'https://images.unsplash.com/photo-1681855132086-2af9a58b56ad?w=900&h=600&fit=crop&auto=format', caption: 'Live band performance' },
      { src: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=900&h=1200&fit=crop&auto=format', caption: 'Dinner service' },
      { src: 'https://images.unsplash.com/photo-1720623784273-f9388b9aa535?w=900&h=600&fit=crop&auto=format', caption: 'Late evening at the bar' },
      { src: 'https://images.unsplash.com/photo-1700514077430-3659e38eb5e7?w=900&h=600&fit=crop&auto=format', caption: 'Awards ceremony' },
    ]
  },
  { id: 5, name: 'Pohela Boishakh 2015', year: '2015', count: 44, cover: 'https://images.unsplash.com/photo-1775467225376-1127edc8cc8a?w=800&h=600&fit=crop&auto=format',
    photos: [
      { src: 'https://images.unsplash.com/photo-1775467225376-1127edc8cc8a?w=900&h=600&fit=crop&auto=format', caption: 'Pohela Boishakh celebrations' },
      { src: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=900&h=800&fit=crop&auto=format', caption: 'Traditional food stalls' },
      { src: 'https://images.unsplash.com/photo-1676302144341-10563603f99a?w=900&h=600&fit=crop&auto=format', caption: 'Cultural performance' },
    ]
  },
  { id: 6, name: 'CKCL Mezban 2016', year: '2016', count: 29, cover: 'https://images.unsplash.com/photo-1581115685033-ccf1aa701722?w=800&h=600&fit=crop&auto=format',
    photos: [
      { src: 'https://images.unsplash.com/photo-1581115685033-ccf1aa701722?w=900&h=600&fit=crop&auto=format', caption: 'CKCL Mezban spread' },
      { src: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=900&h=600&fit=crop&auto=format', caption: 'Traditional Mezban serving' },
    ]
  },
]

type Article = { id: number; title: string; date: string; category: string; excerpt: string; body?: string; image: string; featured?: boolean }
const ARTICLES: Article[] = [
  {
    id: 1, featured: true,
    title: 'Club Night 2026 — A Night to Remember',
    date: 'Jun 2026', category: 'Event',
    excerpt: "This year's Club Night brought together over 400 members and guests for an unforgettable evening of live music, fine dining, and celebration at CKCL's Convention Hall.",
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&h=506&fit=crop&auto=format',
    body: `Club Night 2026 was the most attended in the club's history. The Convention Hall was transformed with bespoke floral arrangements and atmospheric lighting, setting the stage for a five-course dinner and performances by Chittagong's premier live orchestra.\n\nPresident Md. Rafiqul Islam welcomed guests with a toast to the club's founders and expressed gratitude to the outgoing Committee for their service over the past year. A highlight of the evening was the unveiling of the new pool wing, which will open to members in August 2026.\n\nAwards were presented to long-serving members and staff who have contributed to CKCL's growth and community spirit over the past decade.`,
  },
  {
    id: 2,
    title: 'Annual Picnic 2026 — Registration Now Open',
    date: 'May 2026', category: 'Announcement',
    excerpt: 'Registration is now open for the Annual Picnic 2026. Members may register up to four family members. Early registration closes 15 June.',
    image: 'https://images.unsplash.com/photo-1680609989998-6183fcea718b?w=700&h=420&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'Swimming Pool Expansion Complete',
    date: 'Apr 2026', category: 'Club News',
    excerpt: 'The Olympic-standard pool expansion project is now complete ahead of schedule. The new 25-metre lane pool and updated changing facilities open to members from 1 August 2026.',
    image: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=700&h=420&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'New Restaurant Menu — Summer 2026',
    date: 'Mar 2026', category: 'Club News',
    excerpt: 'Our Executive Chef has curated a new seasonal menu featuring fresh local produce and regional specialities. Available from 1 April at the CKCL Restaurant.',
    image: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?w=700&h=420&fit=crop&auto=format',
  },
]

const CATEGORY_CHIP_COLORS: Record<string, { bg: string; color: string }> = {
  'Event':        { bg: '#FFF1F2', color: '#E10B17' },
  'Announcement': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Club News':    { bg: '#DCFCE7', color: '#16A34A' },
}

type VideoEntry = { id: number; title: string; date: string; duration: string; thumb: string; description: string }
const VIDEOS: VideoEntry[] = [
  {
    id: 1, title: 'CKCL Land Video', date: 'Mar 2026', duration: '4:32',
    thumb: 'https://images.unsplash.com/photo-1720623784273-f9388b9aa535?w=700&h=394&fit=crop&auto=format',
    description: "An official documentary showcasing CKCL's premises, facilities, and the vibrant community of Chittagong Khulshi Club Limited.",
  },
  {
    id: 2, title: 'Club Night 2026 Highlights', date: 'Jun 2026', duration: '7:18',
    thumb: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=700&h=394&fit=crop&auto=format',
    description: 'Highlights from the most attended Club Night in CKCL history — live music, fine dining, and the unveiling of the new pool wing.',
  },
  {
    id: 3, title: 'Pool Complex Inauguration', date: 'Aug 2026', duration: '3:45',
    thumb: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=700&h=394&fit=crop&auto=format',
    description: 'Official inauguration ceremony of the expanded pool complex, attended by the Executive Committee and founding members.',
  },
]

// ─── Tab navigation ───────────────────────────────────────────────────────────
type MediaTab = 'notices' | 'news' | 'gallery' | 'video'
const TABS: { id: MediaTab; label: string }[] = [
  { id: 'notices', label: 'Notices' },
  { id: 'news',    label: 'News & Events' },
  { id: 'gallery', label: 'Photo Gallery' },
  { id: 'video',   label: 'Video Gallery' },
]

// ─── Page header ──────────────────────────────────────────────────────────────
function PageHeader({ activeTab, onTab }: { activeTab: MediaTab; onTab: (t: MediaTab) => void }) {
  return (
    <div
      style={{
        minHeight: 'clamp(200px, 28vw, 320px)',
        background: '#EEF1F5',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(225,11,23,0.09) 0%,transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div
        style={{
          maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box',
          padding: '108px clamp(24px,5vw,80px) 0', // top clears the floating navbar on phones
          position: 'relative', zIndex: 1,
        }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          {['Home', 'Media Centre'].map((c, i, arr) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="eyebrow" style={{ fontSize: 11, color: i < arr.length - 1 ? T.ink400 : T.ink900 }}>{c}</span>
              {i < arr.length - 1 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
            </span>
          ))}
        </div>
        <div className="eyebrow mb-2" style={{ fontSize: 11, color: T.brass }}>MEDIA</div>
        <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(32px,4vw,52px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: T.ink900, margin: '0 0 32px' }}>Media Centre.</h1>

        {/* Tab bar */}
        <SubTabs tabs={TABS} active={activeTab} onChange={onTab} />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTICES
// ═══════════════════════════════════════════════════════════════════════════════
function PDFViewer({ notice, onClose }: { notice: NoticeEntry; onClose: () => void }) {
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(14,17,22,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'CKCL',
              fontSize: 14, fontWeight: 600, color: '#FFFFFF',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {notice.title}
          </div>
          <div style={{ fontFamily: 'CKCL', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{notice.date} {notice.year} · {notice.size}</div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Zoom out */}
          <button onClick={() => setZoom((z) => Math.max(50, z - 25))} style={{ ...glassBtn, color: 'rgba(255,255,255,0.80)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.60)', minWidth: 40, textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(200, z + 25))} style={{ ...glassBtn, color: 'rgba(255,255,255,0.80)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>

          {/* Download */}
          <button style={{ ...glassBtn, color: 'rgba(255,255,255,0.80)', marginLeft: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>

          {/* Close */}
          <button onClick={onClose} style={{ ...glassBtn, color: 'rgba(255,255,255,0.80)', marginLeft: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Viewer area */}
      <div
        style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: `${zoom}%`, maxWidth: 800, minWidth: 320,
            background: '#FFFFFF',
            borderRadius: 8,
            boxShadow: '0 24px 80px rgba(0,0,0,0.40)',
            padding: 48,
            transition: 'width 200ms',
          }}
        >
          {/* Fake PDF page */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${T.brand}`, paddingBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900 }}>Chittagong Khulshi Club Limited</div>
                <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>Foy's Lake Road, Khulshi, Chattogram</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'CKCL', fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>CK</div>
            </div>
            <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: T.ink900, lineHeight: 1.3 }}>{notice.title}</div>
            <div style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink400 }}>{notice.date} {notice.year} · Ref: CKCL/{notice.year}/{String(notice.id).padStart(4, '0')}</div>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 12, background: T.surface100, borderRadius: 4, width: i % 3 === 2 ? '70%' : '100%' }} />
            ))}
            <div style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200, textAlign: 'center', marginTop: 32 }}>Page 1 of 1 · CKCL/{notice.year}/{String(notice.id).padStart(4, '0')}</div>
          </div>
        </div>
      </div>

      {/* ESC hint */}
      <div style={{ padding: '10px', textAlign: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.30)' }}>Press ESC to close</span>
      </div>
    </div>
  )
}

const NOTICE_CATEGORIES: NoticeCategory[] = ['Meeting', 'Payment', 'News clipping', 'Obituary']
const NOTICE_YEARS = [...new Set(NOTICES.map((n) => n.year))].sort((a, b) => Number(b) - Number(a))

function NoticesSection() {
  const [yearFilter, setYearFilter] = useState('')
  const [catFilter, setCatFilter] = useState<NoticeCategory | 'All'>('All')
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState<NoticeEntry | null>(null)

  const filtered = NOTICES.filter((n) => {
    if (yearFilter && n.year !== yearFilter) return false
    if (catFilter !== 'All' && n.category !== catFilter) return false
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const grouped: { month: string; items: NoticeEntry[] }[] = []
  filtered.forEach((n) => {
    const last = grouped[grouped.length - 1]
    if (!last || last.month !== n.month) grouped.push({ month: n.month, items: [n] })
    else last.items.push(n)
  })

  return (
    <>
      {viewing && <PDFViewer notice={viewing} onClose={() => setViewing(null)} />}

      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 28 }}>
        {/* Year select */}
        <div style={{ position: 'relative' }}>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{ appearance: 'none', WebkitAppearance: 'none', padding: '9px 32px 9px 14px', fontFamily: 'CKCL', fontSize: 13, color: T.ink600, background: '#FFFFFF', border: `1px solid ${T.ink100}`, borderRadius: 10, cursor: 'pointer', outline: 'none' }}
          >
            <option value="">All years</option>
            {NOTICE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        {/* Type chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', ...NOTICE_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              style={{
                padding: '7px 14px', fontFamily: 'CKCL', fontSize: 12, fontWeight: catFilter === cat ? 700 : 500,
                color: catFilter === cat ? '#FFFFFF' : T.ink400,
                background: catFilter === cat ? T.brand : '#FFFFFF',
                border: `1px solid ${catFilter === cat ? T.brand : T.ink100}`,
                borderRadius: 999, cursor: 'pointer', transition: 'all 160ms',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: `1px solid ${T.ink100}`, borderRadius: 10, padding: '9px 14px', flex: '1 1 180px', minWidth: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.ink200} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices…" style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'CKCL', fontSize: 13, color: T.ink900, flex: 1, minWidth: 0 }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: T.ink200 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
        </div>
      </div>

      {/* Grouped list */}
      {grouped.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}` }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 15, color: T.ink400 }}>No notices match that search.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {grouped.map((group) => (
            <div key={group.month}>
              <div className="eyebrow mb-3" style={{ fontSize: 10, color: T.brass }}>{group.month.toUpperCase()}</div>
              <div style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden' }}>
                {group.items.map((n, i) => {
                  const catColor = CATEGORY_COLORS[n.category]
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 20px',
                        borderBottom: i < group.items.length - 1 ? `1px solid ${T.ink100}` : 'none',
                        transition: 'background 140ms',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface50 }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      {/* Date block */}
                      <div style={{ width: 52, height: 52, background: '#FFF1F2', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 17, color: T.brand, lineHeight: 1 }}>{n.date.split(' ')[0]}</span>
                        <span className="eyebrow" style={{ fontSize: 8, color: T.ink400, marginTop: 2 }}>{n.date.split(' ')[1]}</span>
                      </div>

                      {/* Title */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'CKCL',
                            fontSize: n.bangla ? 15 : 14, fontWeight: 500,
                            color: T.ink900, lineHeight: 1.4,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}
                        >
                          {n.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.06em', color: catColor.color, background: catColor.bg, border: `1px solid ${catColor.color}30`, borderRadius: 999, padding: '3px 8px' }}>{n.category.toUpperCase()}</span>
                          <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, color: T.ink200, background: T.surface100, borderRadius: 999, padding: '3px 8px' }}>{n.fileType}</span>
                          <span style={{ fontFamily: 'CKCL', fontSize: 11, color: T.ink200 }}>{n.size}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => setViewing(n)}
                          style={{ padding: '8px 16px', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.brand, background: '#FFF1F2', border: `1px solid rgba(225,11,23,0.20)`, borderRadius: 8, cursor: 'pointer', transition: 'all 140ms' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.brand; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#FFF1F2'; (e.currentTarget as HTMLElement).style.color = T.brand }}
                        >
                          View
                        </button>
                        <button style={{ width: 34, height: 34, borderRadius: 8, background: T.surface100, border: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 140ms' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.ink100 }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.surface100 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS & EVENTS
// ═══════════════════════════════════════════════════════════════════════════════
function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
  const cc = CATEGORY_CHIP_COLORS[article.category] ?? { bg: T.surface100, color: T.ink400 }
  const bodyParagraphs = (article.body ?? '').split('\n\n').filter(Boolean)

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink400, marginBottom: 28, padding: 0 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = T.ink900 }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T.ink400 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back to News & Events
      </button>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Hero image */}
        <div style={{ borderRadius: 20, overflow: 'hidden', height: 480, marginBottom: 32 }}>
          <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Metadata row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <span className="eyebrow" style={{ fontSize: 10, color: T.ink200 }}>{article.date}</span>
          <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 9, letterSpacing: '0.06em', color: cc.color, background: cc.bg, borderRadius: 999, padding: '4px 10px' }}>{article.category.toUpperCase()}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['facebook', 'twitter', 'link'].map((s) => (
              <button key={s} style={{ width: 32, height: 32, borderRadius: '50%', background: T.surface100, border: `1px solid ${T.ink100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.ink400} strokeWidth="2">
                  {s === 'link' ? <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></> : <circle cx="12" cy="12" r="10"/>}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(26px,3.5vw,44px)', color: T.ink900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 28 }}>{article.title}</h1>

        {/* Body */}
        {bodyParagraphs.length > 0 ? (
          <>
            {bodyParagraphs.map((para, i) => (
              <p key={i} style={{ fontFamily: 'CKCL', fontSize: 17, lineHeight: 1.75, color: T.ink600, marginBottom: 20 }}>{para}</p>
            ))}
            {/* Inline image */}
            <figure style={{ margin: '32px 0' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 320 }}>
                <img src={article.image} alt="Event photo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <figcaption style={{ fontFamily: 'CKCL', fontSize: 12, color: T.ink200, marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>CKCL members gathered for the occasion — Convention Hall, Chattogram</figcaption>
            </figure>
            <p style={{ fontFamily: 'CKCL', fontSize: 17, lineHeight: 1.75, color: T.ink600, marginBottom: 20 }}>
              CKCL continues to be a cornerstone of the Khulshi community, bringing members together through events that celebrate the club's founding values of excellence, camaraderie, and civic pride. For details of upcoming events, consult the Notices section.
            </p>
          </>
        ) : (
          <p style={{ fontFamily: 'CKCL', fontSize: 17, lineHeight: 1.75, color: T.ink600 }}>{article.excerpt}</p>
        )}

        {/* Related news */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${T.ink100}` }}>
          <div className="eyebrow mb-5" style={{ fontSize: 10, color: T.brass }}>RELATED NEWS</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {ARTICLES.filter((a) => a.id !== article.id).slice(0, 3).map((a) => {
              const acc = CATEGORY_CHIP_COLORS[a.category] ?? { bg: T.surface100, color: T.ink400 }
              return (
                <div key={a.id} style={{ background: '#FFFFFF', borderRadius: 16, border: `1px solid ${T.ink100}`, overflow: 'hidden', cursor: 'pointer' }}>
                  <div className="h-[110px] sm:h-[140px]" style={{ overflow: 'hidden' }}>
                    <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 400ms' }} />
                  </div>
                  <div className="p-3 sm:px-4 sm:py-3.5">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      <span className="eyebrow" style={{ fontSize: 9, color: T.ink200 }}>{a.date}</span>
                      <span style={{ fontFamily: 'CKCL', fontSize: 9, color: acc.color, background: acc.bg, borderRadius: 999, padding: '2px 7px' }}>{a.category.toUpperCase()}</span>
                    </div>
                    <div className="text-[13px] sm:text-[14px]" style={{ fontFamily: 'CKCL', fontWeight: 600, color: T.ink900, lineHeight: 1.3 }}>{a.title}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsSection() {
  const [viewing, setViewing] = useState<Article | null>(null)
  if (viewing) return <ArticleDetail article={viewing} onBack={() => setViewing(null)} />

  const featured = ARTICLES.find((a) => a.featured)!
  const rest = ARTICLES.filter((a) => !a.featured)
  const fcc = CATEGORY_CHIP_COLORS[featured.category] ?? { bg: T.surface100, color: T.ink400 }

  return (
    <>
      {/* Featured */}
      <div
        style={{ background: '#FFFFFF', borderRadius: 24, border: `1px solid ${T.ink100}`, overflow: 'hidden', marginBottom: 28, cursor: 'pointer', display: 'grid' }}
        onClick={() => setViewing(featured)}
        // Phones: image stacked above the text; tablet up: side by side
        className="grid-cols-1 sm:grid-cols-2"
      >
        <div className="h-[200px] sm:h-auto sm:min-h-[280px]" style={{ overflow: 'hidden' }}>
          <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 400ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }} />
        </div>
        <div style={{ padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <span className="eyebrow" style={{ fontSize: 10, color: T.ink200 }}>{featured.date}</span>
            <span style={{ fontFamily: 'CKCL', fontSize: 9, letterSpacing: '0.06em', color: fcc.color, background: fcc.bg, borderRadius: 999, padding: '3px 8px' }}>{featured.category.toUpperCase()}</span>
            <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontFamily: 'CKCL', fontSize: 9, letterSpacing: '0.06em', borderRadius: 999, padding: '3px 8px' }}>FEATURED</span>
          </div>
          <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(20px,2.5vw,30px)', color: T.ink900, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 12 }}>{featured.title}</h2>
          <p style={{ fontFamily: 'CKCL', fontSize: 14, lineHeight: 1.65, color: T.ink400, marginBottom: 20 }}>{featured.excerpt}</p>
          <a href="#" onClick={(e) => { e.preventDefault(); setViewing(featured) }} style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 700, color: T.brand, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Read article <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
        {rest.map((a) => {
          const acc = CATEGORY_CHIP_COLORS[a.category] ?? { bg: T.surface100, color: T.ink400 }
          return (
            <div key={a.id} style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 200ms, transform 200ms' }}
              onClick={() => setViewing(a)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(14,17,22,0.10)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
            >
              <div className="h-[120px] sm:h-[200px]" style={{ overflow: 'hidden' }}>
                <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="p-3 sm:px-5 sm:py-[18px]">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span className="eyebrow" style={{ fontSize: 9, color: T.ink200 }}>{a.date}</span>
                  <span style={{ fontFamily: 'CKCL', fontSize: 9, color: acc.color, background: acc.bg, borderRadius: 999, padding: '3px 8px' }}>{a.category.toUpperCase()}</span>
                </div>
                <h3 className="text-[14px] sm:text-[17px]" style={{ fontFamily: 'CKCL', fontWeight: 600, color: T.ink900, lineHeight: 1.25, letterSpacing: '-0.01em', marginBottom: 6 }}>{a.title}</h3>
                <p className="text-[12px] sm:text-[13px]" style={{ fontFamily: 'CKCL', lineHeight: 1.55, color: T.ink400, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.excerpt}</p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHOTO GALLERY
// ═══════════════════════════════════════════════════════════════════════════════
type LightboxState = { album: AlbumEntry; index: number } | null

function Lightbox({ state, onChange, onClose }: { state: NonNullable<LightboxState>; onChange: (i: number) => void; onClose: () => void }) {
  const { album, index } = state
  const photo = album.photos[index]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onChange(Math.max(0, index - 1))
      if (e.key === 'ArrowRight') onChange(Math.min(album.photos.length - 1, index + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, album, onChange, onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(14,17,22,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      {/* Top-right controls */}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
        <button style={glassBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
        <button style={glassBtn} onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.caption} style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 24px 80px rgba(0,0,0,0.50)', display: 'block' }} />

        {/* Prev */}
        {index > 0 && (
          <button
            onClick={() => onChange(index - 1)}
            style={{ ...glassBtn, position: 'absolute', left: -52, width: 44, height: 44 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        )}

        {/* Next */}
        {index < album.photos.length - 1 && (
          <button
            onClick={() => onChange(index + 1)}
            style={{ ...glassBtn, position: 'absolute', right: -52, width: 44, height: 44 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>

      {/* Caption bar */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 16 }} onClick={(e) => e.stopPropagation()}>
        <span style={{ fontFamily: 'CKCL', fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>{photo.caption}</span>
        <span style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{index + 1} / {album.photos.length}</span>
      </div>

      {/* Keyboard hints */}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: 'CKCL', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>← → to navigate · ESC to close</span>
      </div>
    </div>
  )
}

function AlbumDetail({ album, onBack }: { album: AlbumEntry; onBack: () => void }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {lightbox !== null && (
        <Lightbox
          state={{ album, index: lightbox }}
          onChange={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Sticky album header */}
      <div
        ref={headerRef}
        style={{
          position: 'sticky', top: 80, zIndex: 30,
          background: 'rgba(247,248,250,0.90)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${T.ink100}`,
          padding: '14px 0',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: T.ink400, padding: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Albums
          </button>
          <span style={{ color: T.ink200 }}>·</span>
          <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: T.ink900 }}>{album.name}</div>
          <span className="eyebrow" style={{ fontSize: 10, color: T.ink200, marginLeft: 4 }}>{album.count} PHOTOS</span>
          <button style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: T.brand, background: '#FFF1F2', border: `1px solid rgba(225,11,23,0.20)`, borderRadius: 8, cursor: 'pointer' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download all
          </button>
        </div>
      </div>

      {/* Masonry-style grid with varied heights */}
      <div className="masonry-grid">
        {album.photos.map((photo, i) => (
          <div
            key={i}
            className="mb-3 sm:mb-4" style={{ breakInside: 'avoid', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
            onClick={() => setLightbox(i)}
          >
            <img src={photo.src} alt={photo.caption} style={{ width: '100%', display: 'block', transition: 'transform 300ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }} />
          </div>
        ))}
      </div>
    </>
  )
}

function GallerySection() {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumEntry | null>(null)

  if (selectedAlbum) return <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
      {ALBUMS.map((album) => {
        return (
          <div
            key={album.id}
            style={{ borderRadius: 20, overflow: 'hidden', cursor: 'pointer', background: T.surface100, position: 'relative', aspectRatio: '4/3' }}
            onClick={() => setSelectedAlbum(album)}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
              if (img) img.style.transform = 'scale(1.05)'
              const stacked = e.currentTarget.querySelectorAll('.stack-layer') as NodeListOf<HTMLElement>
              stacked.forEach((el, i) => { el.style.transform = `translateX(${(i + 1) * 6}px) rotate(${(i + 1) * 2}deg) scale(0.97)` })
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
              if (img) img.style.transform = 'scale(1)'
              const stacked = e.currentTarget.querySelectorAll('.stack-layer') as NodeListOf<HTMLElement>
              stacked.forEach((el) => { el.style.transform = '' })
            }}
          >
            {/* Stacked-photo depth effect */}
            <div className="stack-layer" style={{ position: 'absolute', inset: 4, borderRadius: 16, background: '#D4D8E0', transition: 'transform 260ms ease-out', zIndex: 0, right: 8 }} />
            <div className="stack-layer" style={{ position: 'absolute', inset: 2, borderRadius: 17, background: '#C8CDD6', transition: 'transform 260ms ease-out 40ms', zIndex: 1, right: 12 }} />

            {/* Main card */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', zIndex: 2 }}>
              <img src={album.cover} alt={album.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 400ms ease-out' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,22,0.70) 0%, transparent 55%)' }} />

              {/* Glass bottom panel */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }} className="px-3 py-2.5 sm:px-[18px] sm:py-3.5">
                <div style={{ minWidth: 0 }}>
                  <div className="text-[12px] sm:text-[14px] truncate" style={{ fontFamily: 'CKCL', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>{album.name}</div>
                  <div className="text-[9px] sm:text-[10px]" style={{ fontFamily: 'CKCL', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{album.count} PHOTOS · {album.year}</div>
                </div>
                <div className="hidden sm:flex" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO GALLERY
// ═══════════════════════════════════════════════════════════════════════════════
function VideoModal({ video, onClose }: { video: VideoEntry; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(14,17,22,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, width: '100%', maxWidth: 860, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.50)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fake video player */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
          <img src={video.thumb} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.55 }} />
          {/* Play button */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          {/* Scrubber overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 20px 16px', background: 'linear-gradient(to top,rgba(0,0,0,0.80),transparent)' }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 999, marginBottom: 12, position: 'relative' }}>
              <div style={{ width: '18%', height: '100%', background: T.brand, borderRadius: 999 }} />
              <div style={{ position: 'absolute', left: '18%', top: '50%', transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 0 0 3px rgba(225,11,23,0.40)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.60)' }}>0:48 / {video.duration}</div>
              <button onClick={onClose} style={{ ...glassBtn }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: '#FFFFFF', marginBottom: 6 }}>{video.title}</div>
          <div style={{ fontFamily: 'CKCL', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{video.description}</div>
        </div>
      </div>
    </div>
  )
}

function VideoSection() {
  const [playing, setPlaying] = useState<VideoEntry | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <>
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {VIDEOS.map((v) => (
          <div
            key={v.id}
            onClick={() => setPlaying(v)}
            onMouseEnter={() => setHovered(v.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ background: '#FFFFFF', borderRadius: 20, border: `1px solid ${T.ink100}`, overflow: 'hidden', cursor: 'pointer', transform: hovered === v.id ? 'translateY(-4px)' : '', boxShadow: hovered === v.id ? '0 12px 32px rgba(14,17,22,0.10)' : '', transition: 'all 220ms' }}
          >
            {/* 16:9 thumbnail */}
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111' }}>
              <img src={v.thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 400ms', transform: hovered === v.id ? 'scale(1.04)' : 'scale(1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,17,22,0.28)' }} />

              {/* Centred play button */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div
                  className="w-10 h-10 sm:w-16 sm:h-16"
                  style={{
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: hovered === v.id ? 'scale(1.10)' : 'scale(1)',
                    transition: 'transform 260ms ease-out',
                  }}
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#FFFFFF"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>

              {/* Duration chip */}
              <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(14,17,22,0.75)', borderRadius: 6, padding: '3px 8px', fontFamily: 'CKCL', fontSize: 11, color: '#FFFFFF', fontWeight: 500 }}>{v.duration}</div>
            </div>

            {/* Info */}
            <div className="p-3 sm:px-[18px] sm:py-4">
              <span className="eyebrow" style={{ fontSize: 9, color: T.ink200, display: 'block', marginBottom: 6 }}>{v.date}</span>
              <div className="text-[13px] sm:text-[16px]" style={{ fontFamily: 'CKCL', fontWeight: 600, color: T.ink900, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{v.title}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Shared glass button style ─────────────────────────────────────────────────
const glassBtn: React.CSSProperties = {
  width: 40, height: 40, borderRadius: '50%',
  background: 'rgba(255,255,255,0.10)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 160ms',
  color: 'rgba(255,255,255,0.80)',
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MediaCentrePage() {
  const [tab, setTab] = useState<MediaTab>('notices')
  const contentRef = useRef<HTMLDivElement>(null)

  const handleTab = useCallback((t: MediaTab) => {
    setTab(t)
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div style={{ background: T.surface50, minHeight: '100vh' }}>
      <PageHeader activeTab={tab} onTab={handleTab} />

      <div
        ref={contentRef}
        style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(24px,5vw,80px)' }}
      >
        {tab === 'notices' && <NoticesSection />}
        {tab === 'news'    && <NewsSection />}
        {tab === 'gallery' && <GallerySection />}
        {tab === 'video'   && <VideoSection />}
      </div>

      <Footer />
    </div>
  )
}
