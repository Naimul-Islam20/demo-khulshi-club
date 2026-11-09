import { useState, useRef } from 'react'
import Footer from './Footer'

// ─── Shared image map ─────────────────────────────────────────────────────────
const IMG = {
  pool:       'https://images.unsplash.com/photo-1572331165267-854da2b10ccc',
  poolIndoor: 'https://images.unsplash.com/photo-1680609989998-6183fcea718b',
  pool3:      'https://images.unsplash.com/photo-1727579674528-600120447183',
  pool4:      'https://images.unsplash.com/photo-1676302144341-10563603f99a',
  restaurant: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f',
  restaurant2:'https://images.unsplash.com/photo-1509710398975-6454dcdf049f',
  guestHouse: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f',
  coffee:     'https://images.unsplash.com/photo-1581115685033-ccf1aa701722',
  convention: 'https://images.unsplash.com/photo-1775467225376-1127edc8cc8a',
  convention2:'https://images.unsplash.com/photo-1700514077430-3659e38eb5e7',
  salon:      'https://images.unsplash.com/photo-1651376589881-0e5a7eb15ae4',
  bar:        'https://images.unsplash.com/photo-1781955781178-6ea29c66e860',
  bar2:       'https://images.unsplash.com/photo-1784025173567-9ed10b66fdc1',
  cardRoom:   'https://images.unsplash.com/photo-1756981168649-0e3c3c8a32f3',
}

const src = (id: string, w = 900, h = 600) =>
  `${id}?w=${w}&h=${h}&fit=crop&auto=format`

// ─── Facility data ─────────────────────────────────────────────────────────────
export type FacilityId =
  | 'swimming-pool'
  | 'restaurant'
  | 'guest-house'
  | 'coffee-shop'
  | 'convention-hall'
  | 'salon'
  | 'bar'
  | 'card-room'

type Facility = {
  id: FacilityId
  name: string
  caption: string
  avail: string
  img: string
  gridArea: string
}

export const FACILITIES: Facility[] = [
  { id: 'swimming-pool',  name: 'Swimming Pool',   caption: 'Olympic-standard, lifeguard on duty',    img: IMG.pool,       avail: 'Open daily',       gridArea: 'pool'   },
  { id: 'restaurant',     name: 'Restaurant',       caption: 'Fine dining, open to members & guests',  img: IMG.restaurant, avail: 'Open daily',       gridArea: 'rest'   },
  { id: 'guest-house',    name: 'Guest House',      caption: 'Comfortable stays within the club',       img: IMG.guestHouse, avail: 'Booking required', gridArea: 'guest'  },
  { id: 'coffee-shop',    name: 'Coffee Shop',      caption: 'Light bites and premium brews',           img: IMG.coffee,     avail: 'Open daily',       gridArea: 'coffee' },
  { id: 'convention-hall',name: 'Convention Hall',  caption: 'Up to 500 guests for any occasion',       img: IMG.convention, avail: 'Booking required', gridArea: 'conv'   },
  { id: 'salon',          name: 'Salon',            caption: 'Full grooming & wellness services',        img: IMG.salon,      avail: 'By appointment',   gridArea: 'salon'  },
  { id: 'bar',            name: 'Bar',              caption: 'Members-only social lounge',               img: IMG.bar,        avail: 'Members only',     gridArea: 'bar'    },
  { id: 'card-room',      name: 'Card Room',        caption: 'Refined games and relaxation',             img: IMG.cardRoom,   avail: 'Open daily',       gridArea: 'card'   },
]

// ─── Shared page header ────────────────────────────────────────────────────────
function PageHeader({ title, breadcrumb }: { title: string; breadcrumb: string[] }) {
  return (
    <div
      style={{
        minHeight: 'clamp(200px, 28vw, 320px)',
        background: '#EEF1F5',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBlock: 'clamp(24px,5vw,80px)',
        paddingTop: 108, // clears the floating navbar (20px offset + 72px bar) on phones
        // Align with the 1280px content column, like the Media & Resources headers
        paddingInline: 'max(clamp(24px,5vw,80px), calc((100% - 1280px) / 2 + clamp(24px,5vw,80px)))',
        paddingBottom: 40,
      }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle,rgba(242,51,61,0.10) 0%,transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '30%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(185,139,67,0.08) 0%,transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />
      <div className="flex items-center gap-1.5 mb-4" style={{ position: 'relative', zIndex: 1 }}>
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="eyebrow" style={{ fontSize: 11, color: i < breadcrumb.length - 1 ? '#5C6673' : '#0E1116' }}>{crumb}</span>
            {i < breadcrumb.length - 1 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A8B0BB" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
          </span>
        ))}
      </div>
      <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(28px,3.5vw,56px)', lineHeight: 1.1, letterSpacing: '-0.015em', color: '#0E1116', margin: 0, position: 'relative', zIndex: 1 }}>{title}</h1>
    </div>
  )
}

// ─── FACILITIES OVERVIEW ──────────────────────────────────────────────────────
function BentoTile({ facility, onClick }: { facility: Facility; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        gridArea: facility.gridArea,
        borderRadius: 20,
        background: '#EEF1F5',
        border: hovered ? '1px solid #E10B17' : '1px solid transparent',
        transition: 'border-color 200ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img
        src={src(facility.img)}
        alt={facility.name}
        className="w-full h-full object-cover"
        style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 400ms ease-out', display: 'block' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,17,22,0.80) 0%, rgba(14,17,22,0.15) 50%, transparent 100%)' }} />
      <div className="absolute top-3 right-3 glass-subtle eyebrow" style={{ fontSize: 9, color: '#FFF', borderRadius: 999, padding: '5px 10px' }}>{facility.avail}</div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div style={{ fontFamily: 'CKCL', fontWeight: 700, fontSize: 16, color: '#FFF', marginBottom: 3 }}>{facility.name}</div>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: 'rgba(255,255,255,0.80)' }}>{facility.caption}</div>
        <a
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#FFF',
            textDecoration: 'none', marginTop: 10,
            opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 200ms, transform 200ms',
          }}
        >
          View details →
        </a>
      </div>
    </div>
  )
}

export function FacilitiesOverview({ onSelectFacility }: { onSelectFacility: (id: FacilityId) => void }) {
  return (
    <div style={{ background: '#F7F8FA', minHeight: '100vh' }}>
      <PageHeader title="Member Facilities" breadcrumb={['Home', 'Facilities']} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)' }}>
        {/* Intro */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          <p style={{ fontFamily: 'CKCL', fontSize: 17, lineHeight: 1.75, color: '#2A3039', margin: 0 }}>
            Seven exceptional amenities — from an Olympic-standard swimming pool to a world-class convention hall — all within the club's Foy's Lake Road premises in Khulshi. Every facility is maintained to the highest standard and is available exclusively to CKCL members and their registered guests.
          </p>
          <p style={{ fontFamily: 'CKCL', fontSize: 15, lineHeight: 1.70, color: '#5C6673', margin: 0 }}>
            Facilities are open Saturday to Thursday, 10:00 AM to 6:00 PM. The Guest House and Convention Hall require advance booking. Click any facility below for full details and to make a reservation request.
          </p>
        </div>

        {/* Desktop bento */}
        <div
          className="hidden lg:grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(4,1fr)',
            gridTemplateRows: 'repeat(3,240px)',
            gridTemplateAreas: `
              "pool pool rest  guest"
              "pool pool conv  conv "
              "coffee salon bar  card "
            `,
          }}
        >
          {FACILITIES.map((f) => <BentoTile key={f.id} facility={f} onClick={() => onSelectFacility(f.id)} />)}
        </div>

        {/* Mobile/tablet grid */}
        <div className="lg:hidden grid grid-cols-2 gap-3 sm:gap-4">
          {FACILITIES.map((f) => (
            <div
              key={f.id}
              // Phones: equal 4:5 tiles, two per row. Tablet: fixed heights, pool taller
              className={`relative overflow-hidden cursor-pointer aspect-[4/5] sm:aspect-auto ${f.id === 'swimming-pool' ? 'sm:h-[320px]' : 'sm:h-[220px]'}`}
              style={{ borderRadius: 16, background: '#EEF1F5' }}
              onClick={() => onSelectFacility(f.id)}
            >
              <img src={src(f.img)} alt={f.name} className="w-full h-full object-cover" style={{ display: 'block' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,17,22,0.80) 0%, rgba(14,17,22,0.10) 55%, transparent 100%)' }} />
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 glass-subtle eyebrow" style={{ fontSize: 8, color: '#fff', borderRadius: 999, padding: '4px 8px' }}>{f.avail}</div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <div className="text-[14px] sm:text-[15px]" style={{ fontFamily: 'CKCL', fontWeight: 700, color: '#FFF', lineHeight: 1.25 }}>{f.name}</div>
                <div className="text-[11px] sm:text-[12px] line-clamp-2" style={{ fontFamily: 'CKCL', color: 'rgba(255,255,255,0.75)', marginTop: 2, lineHeight: 1.4 }}>{f.caption}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Affiliated Clubs glass panel */}
        <div
          className="glass-strong mt-10 p-8"
          style={{ borderRadius: 24 }}
        >
          <div className="eyebrow mb-5" style={{ color: '#B98B43', fontSize: 10 }}>Affiliated Clubs</div>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div
              style={{
                width: 120, height: 80, borderRadius: 12, overflow: 'hidden',
                flexShrink: 0, background: '#EEF1F5',
              }}
            >
              <img src={src(IMG.convention, 240, 160)} alt="Dhaka Club" className="w-full h-full object-cover" />
            </div>
            <div>
              <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: '#0E1116', marginBottom: 6 }}>Dhaka Club Limited</div>
              <p style={{ fontFamily: 'CKCL', fontSize: 14, lineHeight: 1.65, color: '#5C6673', maxWidth: 560, margin: '0 0 12px' }}>
                CKCL members enjoy reciprocal access to Dhaka Club Limited — one of Bangladesh's oldest and most prestigious private members' clubs — on production of a valid CKCL Membership Card. Subject to Dhaka Club's prevailing visitor policy.
              </p>
              <a href="#" style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: '#E10B17', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                Learn about reciprocal access
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// ─── FACILITY DETAIL — Swimming Pool ──────────────────────────────────────────
const POOL_PHOTOS = [
  { img: IMG.pool,       alt: 'CKCL outdoor pool' },
  { img: IMG.poolIndoor, alt: 'CKCL indoor pool facility' },
  { img: IMG.pool3,      alt: 'Pool surrounded by greenery' },
  { img: IMG.pool4,      alt: 'Pool interior view' },
]

const TIME_SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:00 PM']

// Lightbox
function Lightbox({ photos, startIndex, onClose }: { photos: { img: string; alt: string }[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex)
  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setIdx((i) => (i + 1) % photos.length)

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(14,17,22,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={`${photos[idx].img}?w=1200&h=800&fit=crop&auto=format`}
          alt={photos[idx].alt}
          style={{ width: '100%', borderRadius: 16, display: 'block', maxHeight: '80vh', objectFit: 'contain' }}
        />
        {/* Counter */}
        <div className="eyebrow absolute top-4 left-4 glass-strong" style={{ fontSize: 10, color: '#FFFFFF', borderRadius: 999, padding: '5px 12px' }}>
          {idx + 1} / {photos.length}
        </div>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 glass-strong flex items-center justify-center"
          style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        {/* Arrows */}
        {photos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 glass-strong flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 glass-strong flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Booking bottom sheet (mobile)
function BookingSheet({ onClose }: { onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [guests, setGuests] = useState(1)

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: 'rgba(14,17,22,0.50)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="glass-strong w-full p-6"
        style={{ borderRadius: '24px 24px 0 0', animation: 'fadeUp 240ms ease-out both' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, color: '#0E1116', margin: 0 }}>Reserve a Slot</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C6673" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Date */}
        <label style={{ display: 'block', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116', marginBottom: 6 }}>Date</label>
        <input
          type="date"
          className="w-full mb-4"
          style={{ fontFamily: 'CKCL', fontSize: 14, color: '#0E1116', background: '#F7F8FA', border: '1px solid #E2E6EC', borderRadius: 10, padding: '11px 14px', outline: 'none' }}
        />

        {/* Time slots */}
        <div style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116', marginBottom: 8 }}>Time Slot</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              style={{
                fontFamily: 'CKCL', fontSize: 13, fontWeight: 500,
                color: selectedSlot === slot ? '#FFF' : '#2A3039',
                background: selectedSlot === slot ? '#E10B17' : '#F7F8FA',
                border: `1px solid ${selectedSlot === slot ? '#E10B17' : '#E2E6EC'}`,
                borderRadius: 999, padding: '7px 14px', cursor: 'pointer', transition: 'all 160ms',
              }}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Guests */}
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: '#0E1116' }}>Guests</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setGuests((g) => Math.max(1, g - 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E6EC', background: '#FFF', cursor: 'pointer', fontSize: 18, color: '#0E1116', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 15, color: '#0E1116', minWidth: 20, textAlign: 'center' }}>{guests}</span>
            <button onClick={() => setGuests((g) => Math.min(6, g + 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E6EC', background: '#FFF', cursor: 'pointer', fontSize: 18, color: '#0E1116', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>

        <button
          style={{ width: '100%', padding: '14px', fontFamily: 'CKCL', fontSize: 15, fontWeight: 600, color: '#FFF', background: '#E10B17', border: 'none', borderRadius: 999, cursor: 'pointer' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B70813' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E10B17' }}
        >
          Request Booking
        </button>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: '#A8B0BB', textAlign: 'center', marginTop: 10 }}>
          Members only. Confirmation by phone.
        </div>
      </div>
    </div>
  )
}

// Booking card (desktop)
function BookingCard() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [guests, setGuests] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div
      className="glass-strong sticky"
      style={{ borderRadius: 24, padding: '28px', top: 120 }}
    >
      <h3 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, color: '#0E1116', margin: '0 0 20px' }}>Reserve</h3>

      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 18, color: '#0E1116', textAlign: 'center' }}>Request received!</div>
          <div style={{ fontFamily: 'CKCL', fontSize: 13, color: '#5C6673', textAlign: 'center' }}>The club will confirm your slot by phone within one business day.</div>
          <button onClick={() => setSubmitted(false)} style={{ fontFamily: 'CKCL', fontSize: 13, color: '#E10B17', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>Make another booking</button>
        </div>
      ) : (
        <>
          {/* Date */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116', marginBottom: 6 }}>Date</label>
            <input
              type="date"
              className="w-full"
              style={{ fontFamily: 'CKCL', fontSize: 14, color: '#0E1116', background: '#F7F8FA', border: '1px solid #E2E6EC', borderRadius: 10, padding: '10px 13px', outline: 'none', width: '100%' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#E10B17'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(225,11,23,0.10)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E2E6EC'; e.currentTarget.style.boxShadow = '' }}
            />
          </div>

          {/* Time slots */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116', marginBottom: 8 }}>Time Slot</div>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
                  style={{
                    fontFamily: 'CKCL', fontSize: 12, fontWeight: 500,
                    color: selectedSlot === slot ? '#FFF' : '#2A3039',
                    background: selectedSlot === slot ? '#E10B17' : '#F7F8FA',
                    border: `1px solid ${selectedSlot === slot ? '#E10B17' : '#E2E6EC'}`,
                    borderRadius: 999, padding: '6px 12px', cursor: 'pointer', transition: 'all 160ms',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Guest stepper */}
          <div className="flex items-center justify-between mb-5" style={{ padding: '12px 16px', background: '#F7F8FA', borderRadius: 12 }}>
            <span style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: '#0E1116' }}>Guests</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #E2E6EC', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#0E1116' }}
              >
                −
              </button>
              <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 14, color: '#0E1116', minWidth: 18, textAlign: 'center' }}>{guests}</span>
              <button
                onClick={() => setGuests((g) => Math.min(6, g + 1))}
                style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #E2E6EC', background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#0E1116' }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            style={{ width: '100%', padding: '13px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: '#FFF', background: '#E10B17', border: 'none', borderRadius: 999, cursor: 'pointer', transition: 'background 160ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B70813' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E10B17' }}
          >
            Request Booking
          </button>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: '#A8B0BB', textAlign: 'center', marginTop: 10 }}>
            Members only. Confirmation by phone.
          </div>
        </>
      )}
    </div>
  )
}

// Other facilities rail
function OtherFacilitiesRail({
  currentId,
  onSelect,
}: {
  currentId: FacilityId
  onSelect: (id: FacilityId) => void
}) {
  const others = FACILITIES.filter((f) => f.id !== currentId)
  const railRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px,5vw,72px) clamp(24px,5vw,80px)' }}>
      <div className="flex items-center justify-between mb-8">
        <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 26, color: '#0E1116', margin: 0, letterSpacing: '-0.01em' }}>Other Facilities</h2>
        <div className="hidden sm:flex gap-2">
          {(['left', 'right'] as const).map((dir) => (
            <button key={dir} onClick={() => railRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' })}
              className="glass-strong flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E1116" strokeWidth="2.5">
                {dir === 'left' ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div ref={railRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {others.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className="shrink-0 relative overflow-hidden text-left"
            style={{ width: 240, height: 180, borderRadius: 16, background: '#EEF1F5', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src={src(f.img, 480, 360)} alt={f.name} className="w-full h-full object-cover" style={{ display: 'block' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,17,22,0.75) 0%, transparent 55%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div style={{ fontFamily: 'CKCL', fontWeight: 700, fontSize: 14, color: '#FFF' }}>{f.name}</div>
              <div style={{ fontFamily: 'CKCL', fontSize: 11, color: 'rgba(255,255,255,0.70)', marginTop: 2 }}>{f.avail}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── FACILITY DETAIL — generic shell, populated for Swimming Pool ─────────────
type DetailData = {
  id: FacilityId
  name: string
  img: string
  quickFacts: { label: string; value: string }[]
  description: string[]
  amenities: string[]
  rules: string[]
  photos: { img: string; alt: string }[]
}

const POOL_DETAIL: DetailData = {
  id: 'swimming-pool',
  name: 'Swimming Pool',
  img: IMG.pool,
  quickFacts: [
    { label: 'Hours', value: '10:00 AM – 6:00 PM' },
    { label: 'Access', value: 'Members & Guests' },
    { label: 'Capacity', value: '50 swimmers' },
    { label: 'Booking', value: 'Walk-in / Reserved' },
  ],
  description: [
    "CKCL's swimming pool is the centrepiece of the club's leisure offering — a full-size, Olympic-standard lap pool maintained to the highest hygiene standards and open to members and their registered guests every day the club is open.",
    "The pool deck features comfortable loungers, shade canopies, and a dedicated shallow zone for younger swimmers. A qualified lifeguard is on duty during all operating hours. Changing rooms, lockers and shower facilities are available poolside.",
  ],
  amenities: [
    'Full-length 25-metre lap pool',
    'Shallow play zone for children',
    'Poolside loungers and shade canopies',
    'Fully-equipped changing rooms and lockers',
    'Hot and cold shower facilities',
    'Qualified lifeguard on duty at all times',
    'Towel service available (nominal charge)',
    'Poolside refreshments from the Coffee Shop',
  ],
  rules: [
    'Swimwear must be worn at all times — no cut-offs or street clothing in the pool.',
    'Children under 12 must be accompanied by an adult member.',
    'No food or glass containers permitted on the pool deck.',
    'No running, diving from the sides, or pushing in the water.',
    'Members are responsible for the conduct of their guests.',
    'The pool may be closed for private bookings or maintenance at short notice.',
  ],
  photos: POOL_PHOTOS,
}

// Generic fallback detail for other facilities
function makeFallbackDetail(f: Facility): DetailData {
  return {
    id: f.id,
    name: f.name,
    img: f.img,
    quickFacts: [
      { label: 'Hours', value: '10:00 AM – 6:00 PM' },
      { label: 'Access', value: 'Members & Guests' },
      { label: 'Capacity', value: 'See below' },
      { label: 'Booking', value: f.avail === 'Open daily' ? 'Walk-in' : 'Required' },
    ],
    description: [`${f.name} is one of CKCL's seven world-class member facilities, maintained to the highest standard and available to all members and their registered guests during club operating hours.`],
    amenities: [`Full access for members and guests`, `Professional staff on duty`, `Advance booking available`],
    rules: ['Members are responsible for the conduct of their guests.', 'Appropriate attire required at all times.'],
    photos: [{ img: f.img, alt: f.name }],
  }
}

function FacilityDetailPage({
  facilityId,
  onBack,
  onSelectFacility,
}: {
  facilityId: FacilityId
  onBack: () => void
  onSelectFacility: (id: FacilityId) => void
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const data = facilityId === 'swimming-pool'
    ? POOL_DETAIL
    : makeFallbackDetail(FACILITIES.find((f) => f.id === facilityId)!)

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100vh' }}>
      {/* 60vh hero image */}
      <div style={{ height: '60vh', minHeight: 380, position: 'relative', overflow: 'hidden', background: '#1a1a1a' }}>
        <img
          src={`${data.img}?w=1920&h=1080&fit=crop&auto=format`}
          alt={data.name}
          className="w-full h-full object-cover"
          style={{ display: 'block', opacity: 0.92 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,17,22,0.55) 0%, transparent 50%)' }} />

        {/* Glass breadcrumb chip — floating top-left */}
        <div
          className="absolute glass-strong flex items-center gap-1.5"
          style={{ top: 24, left: 24, borderRadius: 999, padding: '8px 16px', zIndex: 10 }}
        >
          <button
            onClick={onBack}
            style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 500, color: '#5C6673', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Facilities
          </button>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A8B0BB" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116' }}>{data.name}</span>
        </div>

        {/* Quick facts strip — overlapping the bottom edge */}
        <div
          className="absolute left-0 right-0 glass-strong"
          style={{
            bottom: -64,
            marginInline: 'clamp(24px,5vw,80px)',
            borderRadius: 20,
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: '16px 32px',
            zIndex: 10,
          }}
          // On large screens, 4-up row
        >
          <div
            className="hidden lg:grid"
            style={{
              position: 'absolute',
              inset: 0,
              padding: '24px 32px',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 32,
              borderRadius: 20,
            }}
          >
            {data.quickFacts.map((fact) => (
              <div key={fact.label}>
                <div className="eyebrow mb-1.5" style={{ fontSize: 10, color: '#5C6673' }}>{fact.label}</div>
                <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: '#0E1116', lineHeight: 1.2 }}>{fact.value}</div>
              </div>
            ))}
          </div>
          {/* Mobile: 2-column fallback (always visible, hidden on lg by the absolute overlay) */}
          <div className="lg:invisible contents">
            {data.quickFacts.map((fact) => (
              <div key={fact.label + '-m'}>
                <div className="eyebrow mb-1" style={{ fontSize: 10, color: '#5C6673' }}>{fact.label}</div>
                <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 17, color: '#0E1116', lineHeight: 1.2 }}>{fact.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px,5vw,80px)', paddingTop: 'clamp(80px,10vw,120px)' }}>
        <div className="flex gap-12 items-start">
          {/* Left — content */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
            <div className="eyebrow mb-3" style={{ color: '#B98B43', fontSize: 10 }}>CKCL Facilities</div>
            <h1 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 'clamp(28px,3vw,44px)', color: '#0E1116', lineHeight: 1.1, letterSpacing: '-0.015em', marginBottom: 28 }}>{data.name}</h1>

            {/* Description */}
            {data.description.map((para, i) => (
              <p key={i} style={{ fontFamily: 'CKCL', fontSize: 16, lineHeight: 1.75, color: '#2A3039', marginBottom: 16 }}>{para}</p>
            ))}

            {/* Amenities */}
            <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, color: '#0E1116', margin: '36px 0 16px', letterSpacing: '-0.01em' }}>Amenities</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.amenities.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E10B17" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontFamily: 'CKCL', fontSize: 15, lineHeight: 1.6, color: '#2A3039' }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* Rules */}
            <div style={{ background: '#FFF1F2', borderRadius: 16, padding: '20px 24px', borderLeft: '3px solid #E10B17', marginBottom: 48 }}>
              <div style={{ fontFamily: 'CKCL', fontWeight: 700, fontSize: 14, color: '#0E1116', marginBottom: 12 }}>Rules & Guidelines</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {data.rules.map((rule, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontFamily: 'CKCL', fontSize: 10, fontWeight: 500, color: '#E10B17', flexShrink: 0, marginTop: 3 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: 'CKCL', fontSize: 14, lineHeight: 1.6, color: '#2A3039' }}>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4-up photo strip */}
            {data.photos.length > 1 && (
              <>
                <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, color: '#0E1116', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                  {data.photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', background: '#EEF1F5', border: 'none', cursor: 'zoom-in', padding: 0, position: 'relative' }}
                    >
                      <img src={`${photo.img}?w=400&h=400&fit=crop&auto=format`} alt={photo.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'rgba(14,17,22,0.35)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop booking card */}
          <div className="hidden lg:block" style={{ width: 320, flexShrink: 0 }}>
            <BookingCard />
          </div>
        </div>
      </div>

      {/* Other facilities */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #E2E6EC' }}>
        <OtherFacilitiesRail currentId={facilityId} onSelect={onSelectFacility} />
      </div>

      {/* Mobile sticky booking bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ padding: '12px 16px 24px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderTop: '1px solid #E2E6EC' }}
      >
        <button
          onClick={() => setSheetOpen(true)}
          style={{ width: '100%', padding: '14px', fontFamily: 'CKCL', fontSize: 15, fontWeight: 600, color: '#FFF', background: '#E10B17', border: 'none', borderRadius: 999, cursor: 'pointer' }}
        >
          Request Booking
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && <BookingSheet onClose={() => setSheetOpen(false)} />}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox photos={data.photos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}

      <Footer />
    </div>
  )
}

// ─── Facilities router shell ──────────────────────────────────────────────────
export default function FacilitiesPage({
  initialFacility,
  onBack,
}: {
  initialFacility?: FacilityId
  onBack: () => void
}) {
  const [selected, setSelected] = useState<FacilityId | null>(initialFacility ?? null)

  if (selected) {
    return (
      <FacilityDetailPage
        facilityId={selected}
        onBack={() => setSelected(null)}
        onSelectFacility={(id) => { setSelected(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      />
    )
  }

  return <FacilitiesOverview onSelectFacility={(id) => { setSelected(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
}
