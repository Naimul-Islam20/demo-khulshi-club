import { useState, useEffect, useRef } from 'react'
import Footer from './Footer'
import SubTabs from './SubTabs'
import SideNavCard from './SideNav'

// ─── Sibling page definitions ─────────────────────────────────────────────────
export type PageId =
  | 'about-club'
  | 'mission-vision'
  | 'terms'
  | 'refund-policy'
  | 'benefits'
  | 'affiliated-clubs'

type SiblingGroup = { section: string; pages: { id: PageId; label: string }[] }

const SIBLING_GROUPS: SiblingGroup[] = [
  {
    section: 'About',
    pages: [
      { id: 'about-club', label: 'About Club' },
      { id: 'mission-vision', label: 'Mission & Vision' },
      { id: 'terms', label: 'Terms & Conditions' },
      { id: 'refund-policy', label: 'Refund & Return Policy' },
    ],
  },
  {
    section: 'Membership',
    pages: [
      { id: 'benefits', label: 'Benefits of Members' },
      { id: 'affiliated-clubs', label: 'Affiliated Clubs' },
    ],
  },
]

const ALL_PAGES = SIBLING_GROUPS.flatMap((g) => g.pages)

function groupOf(id: PageId) {
  return SIBLING_GROUPS.find((g) => g.pages.some((p) => p.id === id))!
}

function nextPage(id: PageId): { id: PageId; label: string } | null {
  const idx = ALL_PAGES.findIndex((p) => p.id === id)
  return ALL_PAGES[idx + 1] ?? null
}

// ─── Page header ──────────────────────────────────────────────────────────────
function PageHeader({
  breadcrumb,
  title,
  tabs,
}: {
  breadcrumb: string[]
  title: string
  tabs?: React.ReactNode
}) {
  return (
    <div
      // With mobile tabs the bar sits flush on the header's bottom edge, like the Media Centre
      className={tabs ? 'pb-0 lg:pb-10' : 'pb-10'}
      style={{
        minHeight: 'clamp(200px, 28vw, 320px)',
        background: '#EEF1F5',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: 108, // clears the floating navbar (20px offset + 72px bar) on phones
        // Align with the 1280px content column, like the Media & Resources headers
        paddingInline: 'max(clamp(24px,5vw,80px), calc((100% - 1280px) / 2 + clamp(24px,5vw,80px)))',
      }}
    >
      {/* Radial glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,51,61,0.10) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '30%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,139,67,0.08) 0%, transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4" style={{ position: 'relative', zIndex: 1 }}>
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="eyebrow"
              style={{ fontSize: 11, color: i < breadcrumb.length - 1 ? '#5C6673' : '#0E1116', cursor: i < breadcrumb.length - 1 ? 'pointer' : 'default' }}
            >
              {crumb}
            </span>
            {i < breadcrumb.length - 1 && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A8B0BB" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'CKCL',
          fontWeight: 600,
          fontSize: 'clamp(28px,3.5vw,56px)',
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          color: '#0E1116',
          margin: 0,
          position: 'relative',
          zIndex: 1,
          maxWidth: 720,
        }}
      >
        {title}
      </h1>

      {tabs && <div className="lg:hidden" style={{ position: 'relative', zIndex: 1, marginTop: 24 }}>{tabs}</div>}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  currentId,
  anchors,
  onNavigate,
}: {
  currentId: PageId
  anchors?: { id: string; label: string }[]
  onNavigate: (id: PageId) => void
}) {
  const group = groupOf(currentId)
  const [activeAnchor, setActiveAnchor] = useState(anchors?.[0]?.id ?? '')

  const scrollTo = (anchorId: string) => {
    const el = document.getElementById(anchorId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveAnchor(anchorId)
  }

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Sibling nav glass card */}
      <SideNavCard section={group.section} pages={group.pages} currentId={currentId} onNavigate={onNavigate} />

      {/* On this page (anchors) */}
      {anchors && anchors.length > 0 && (
        <div style={{ borderRadius: 16, padding: '16px 20px', background: '#F7F8FA', border: '1px solid #E2E6EC' }}>
          <div className="eyebrow mb-3" style={{ fontSize: 10, color: '#A8B0BB' }}>On this page</div>
          <nav className="flex flex-col gap-1">
            {anchors.map((a) => (
              <button
                key={a.id}
                onClick={() => scrollTo(a.id)}
                className="text-left transition-colors"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'CKCL',
                  fontSize: 13,
                  color: activeAnchor === a.id ? '#E10B17' : '#5C6673',
                  padding: '4px 0',
                  fontWeight: activeAnchor === a.id ? 600 : 400,
                  transition: 'color 160ms',
                }}
              >
                {a.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </aside>
  )
}

// ─── Mobile sibling chip row ──────────────────────────────────────────────────
function SiblingTabs({
  currentId,
  onNavigate,
}: {
  currentId: PageId
  onNavigate: (id: PageId) => void
}) {
  return <SubTabs tabs={groupOf(currentId).pages} active={currentId} onChange={onNavigate} />
}

// ─── Long-form content primitives ─────────────────────────────────────────────
function LFH2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      style={{
        fontFamily: 'CKCL',
        fontWeight: 600,
        fontSize: 'clamp(22px,2vw,30px)',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        color: '#0E1116',
        margin: '48px 0 16px',
        scrollMarginTop: 140,
      }}
    >
      {children}
    </h2>
  )
}

function LFH3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3
      id={id}
      style={{
        fontFamily: 'CKCL',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 1.3,
        color: '#0E1116',
        margin: '32px 0 12px',
        scrollMarginTop: 140,
      }}
    >
      {children}
    </h3>
  )
}

function LFP({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'CKCL',
        fontSize: 16,
        lineHeight: 1.75,
        color: '#2A3039',
        margin: '0 0 20px',
      }}
    >
      {children}
    </p>
  )
}

function LFUl({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E10B17', flexShrink: 0, marginTop: 8 }} />
          <span style={{ fontFamily: 'CKCL', fontSize: 16, lineHeight: 1.65, color: '#2A3039' }}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LFOl({ items }: { items: string[] }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 10, counterReset: 'lf-ol' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span
            style={{
              flexShrink: 0,
              fontFamily: 'CKCL',
              fontSize: 11,
              fontWeight: 500,
              color: '#E10B17',
              letterSpacing: '0.04em',
              minWidth: 24,
              marginTop: 3,
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: 'CKCL', fontSize: 16, lineHeight: 1.65, color: '#2A3039' }}>{item}</span>
        </li>
      ))}
    </ol>
  )
}

function LFBlockquote({ children, attribution }: { children: React.ReactNode; attribution?: string }) {
  return (
    <blockquote
      style={{
        margin: '32px 0',
        paddingLeft: 24,
        borderLeft: '3px solid #B98B43',
      }}
    >
      <p
        style={{
          fontFamily: 'CKCL',
          fontWeight: 500,
          fontStyle: 'italic',
          fontSize: 20,
          lineHeight: 1.55,
          color: '#0E1116',
          margin: 0,
        }}
      >
        {children}
      </p>
      {attribution && (
        <div
          className="eyebrow mt-3"
          style={{ fontSize: 10, color: '#B98B43' }}
        >
          {attribution}
        </div>
      )}
    </blockquote>
  )
}

function LFCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#FFF1F2',
        borderRadius: 12,
        padding: '20px 24px',
        borderLeft: '3px solid #E10B17',
        margin: '24px 0',
      }}
    >
      <div style={{ fontFamily: 'CKCL', fontSize: 15, lineHeight: 1.65, color: '#2A3039' }}>{children}</div>
    </div>
  )
}

function LFLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      style={{
        color: '#E10B17',
        textDecoration: 'underline',
        textDecorationColor: hovered ? '#E10B17' : 'rgba(225,11,23,0.40)',
        transition: 'text-decoration-color 160ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}

function LFImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#EEF1F5' }}>
        <img src={src} alt={alt} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 400 }} />
      </div>
      <figcaption
        style={{
          fontFamily: 'CKCL',
          fontSize: 13,
          color: '#5C6673',
          marginTop: 10,
          textAlign: 'center',
        }}
      >
        {caption}
      </figcaption>
    </figure>
  )
}

function ClauseSection({ num, title, children, id }: { num: number; title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} style={{ marginBottom: 40, scrollMarginTop: 140 }}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="eyebrow" style={{ fontSize: 11, color: '#E10B17', flexShrink: 0 }}>{String(num).padStart(2, '0')}</span>
        <h2 style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 22, lineHeight: 1.25, color: '#0E1116', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: 32 }}>{children}</div>
    </section>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #E2E6EC', margin: '40px 0' }} />
}

// ─── Next page card ───────────────────────────────────────────────────────────
function NextPageCard({ page, onNavigate }: { page: { id: PageId; label: string }; onNavigate: (id: PageId) => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={() => onNavigate(page.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left flex items-center justify-between p-6 mt-12 transition-all"
      style={{
        background: hovered ? '#FFF1F2' : '#F7F8FA',
        border: `1px solid ${hovered ? '#E10B17' : '#E2E6EC'}`,
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 200ms',
      }}
    >
      <div>
        <div className="eyebrow mb-1" style={{ fontSize: 10, color: '#A8B0BB' }}>Next</div>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 20, color: '#0E1116' }}>{page.label}</div>
      </div>
      <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E10B17" strokeWidth="2.5"
        style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 200ms', flexShrink: 0 }}
      >
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </button>
  )
}

// ─── PAGE CONTENT ─────────────────────────────────────────────────────────────

function AboutClubContent() {
  return (
    <>
      <LFP>
        Chittagong Khulshi Club Limited — commonly known as CKCL or Khulshi Club — is a private social and recreational club established in 2013 in the heart of Khulshi, one of Chattogram's most distinguished residential neighbourhoods. Registered under Trade License No. 89056, the club was founded by a group of leading business professionals and community leaders who shared a simple but ambitious vision: to create a space where Chattogram's finest could come together, recharge, and grow.
      </LFP>

      <LFImage
        src="https://images.unsplash.com/photo-1680609989998-6183fcea718b?w=720&h=420&fit=crop&auto=format"
        alt="The CKCL swimming pool — the centrepiece of the club's leisure facilities"
        caption="The CKCL swimming pool — the centrepiece of the club's leisure facilities, open daily for members and their families."
      />

      <LFH2>Our Values</LFH2>
      <LFP>
        From its earliest days, CKCL has been built on three core values that continue to define life at the club:
      </LFP>
      <LFUl items={[
        'Camaraderie — fostering genuine friendship and mutual respect among members across all walks of life.',
        'Excellence — maintaining world-class facilities, events and services that reflect the aspirations of our membership.',
        'Personal growth — creating an environment where members, and their families, are inspired to learn, lead and thrive.',
      ]} />

      <LFBlockquote attribution="— Founding President, CKCL">
        "We did not build a club. We built a home for the people who build this city."
      </LFBlockquote>

      <LFH2>Facilities & Amenities</LFH2>
      <LFP>
        The club spans a comprehensive range of amenities designed to serve every dimension of a member's life — from health and leisure to business and celebration. Today, CKCL offers seven distinct facilities under one roof:
      </LFP>
      <LFUl items={[
        'Swimming Pool — Olympic-standard pool with lifeguard cover, open to members and their registered guests daily.',
        'Guest House — Comfortable, well-appointed overnight accommodation within the club premises.',
        'Restaurant — Full-service dining featuring both Bangladeshi and international cuisine, available for private dining and corporate lunches.',
        'Coffee Shop — A quieter corner for casual meetings, reading, and premium refreshments throughout the day.',
        'Convention Hall — A versatile multi-purpose event venue accommodating up to 500 guests for weddings, conferences, seminars and gala dinners.',
        'Salon — A members-only wellness facility offering professional grooming, beauty and therapeutic services.',
        'Card Room — A refined, members-only lounge dedicated to card games, chess, and social recreation.',
      ]} />

      <LFCallout>
        <strong>Affiliated Club:</strong> CKCL members enjoy reciprocal access to <LFLink href="#">Dhaka Club</LFLink> facilities when visiting the capital — a privilege extended through our institutional partnership.
      </LFCallout>

      <LFH2>A History Built on Events</LFH2>
      <LFP>
        Since its inaugural committee meeting in 2013, CKCL has hosted more than a hundred signature events — from Valentine's Day celebrations and Pohela Boishakh gatherings to Annual General Meetings, picnics, and Mezbans that draw hundreds of members and their families. Each event deepens the sense of belonging that is the club's greatest asset.
      </LFP>
      <LFP>
        Over twelve years, our membership has grown to over 1,200 active members, making CKCL the most sought-after private club in Chattogram. We remain committed to the same founding spirit: warmth, excellence, and a genuine sense of community.
      </LFP>
    </>
  )
}

function MissionVisionContent() {
  return (
    <>
      <LFH2>Our Mission</LFH2>
      <LFP>
        To provide an exceptional private club experience that brings together Chattogram's leading professionals, business owners and their families — nurturing camaraderie, excellence and personal growth through world-class facilities, memorable events and a community that endures across generations.
      </LFP>

      <LFH2>Our Vision</LFH2>
      <LFBlockquote>
        To be the most respected and beloved private club in Bangladesh — a landmark institution that future generations of Chattogram's families are proud to belong to.
      </LFBlockquote>

      <LFH2>Our Core Values</LFH2>
      <LFH3>Camaraderie</LFH3>
      <LFP>We believe that the best clubs are defined not by their buildings but by the quality of their relationships. Every decision we make — from event programming to facility design — is guided by whether it deepens the bonds among our members.</LFP>
      <LFH3>Excellence</LFH3>
      <LFP>We hold ourselves to the highest standard in everything we do. Our facilities, our service, our events and our governance must reflect the ambitions of the members we serve.</LFP>
      <LFH3>Integrity</LFH3>
      <LFP>We operate transparently, govern responsibly and treat every member — founding member or new applicant — with equal respect and fairness.</LFP>
      <LFH3>Inclusivity</LFH3>
      <LFP>CKCL is a family club. Every programme, space and event is designed to welcome members across ages, backgrounds and interests. We are stronger for our diversity.</LFP>

      <LFCallout>
        CKCL is governed by an Executive Committee elected annually by the general membership. Decisions on strategy, admissions and major expenditure are made collectively and documented in Annual Reports available to all members.
      </LFCallout>
    </>
  )
}

const TERMS_ANCHORS = [
  { id: 'tc-01', label: 'Membership Eligibility' },
  { id: 'tc-02', label: 'Application Process' },
  { id: 'tc-03', label: 'Membership Fees & Dues' },
  { id: 'tc-04', label: 'Conduct & Discipline' },
  { id: 'tc-05', label: 'Use of Facilities' },
  { id: 'tc-06', label: 'Guest Policy' },
  { id: 'tc-07', label: 'Termination & Suspension' },
  { id: 'tc-08', label: 'Amendments' },
]

function TermsContent() {
  return (
    <>
      <LFP>
        These Terms and Conditions govern membership of Chittagong Khulshi Club Limited (CKCL), Trade License No. 89056. By accepting membership you agree to be bound by these terms, the Club Rules, and any resolutions passed by the Executive Committee from time to time.
      </LFP>
      <LFCallout>
        Last updated: January 2026. Members will be notified of material changes by email and notice board. Continued use of club facilities following notification constitutes acceptance.
      </LFCallout>

      <ClauseSection num={1} title="Membership Eligibility" id="tc-01">
        <LFP>Membership is open to adults aged 18 and over who reside or operate a business in Chattogram, and who are proposed and seconded by two existing CKCL members in good standing. The Executive Committee reserves the right to refuse any application without stating a reason.</LFP>
        <LFUl items={[
          'Applicants must hold a valid national identity document or passport.',
          'Corporate memberships may be held in the name of a company; the company must nominate a natural-person representative.',
          'Family members of a primary member may be enrolled as dependant members at a reduced annual fee as set out in the current Fee Schedule.',
        ]} />
      </ClauseSection>

      <ClauseSection num={2} title="Application Process" id="tc-02">
        <LFP>Applications are submitted in writing on the official CKCL Application Form and must be accompanied by two signed reference letters from existing members. The Executive Committee reviews applications at its monthly meeting; candidates may be invited for an introductory meeting before a decision is made.</LFP>
        <LFOl items={[
          'Download and complete the Membership Application Form.',
          'Obtain signatures from two CKCL members willing to act as referees.',
          'Submit the completed form, referee letters, and a copy of your NID to the Club Secretary.',
          'Await notification from the Executive Committee (usually within 30 days of the monthly meeting).',
          'On approval, pay the Admission Fee and first Annual Subscription within 14 days.',
          'Your Membership Card will be issued within 7 working days of payment confirmation.',
        ]} />
      </ClauseSection>

      <ClauseSection num={3} title="Membership Fees & Dues" id="tc-03">
        <LFP>An Admission Fee is payable once on acceptance of membership. Annual Subscriptions are due on 1 July each year and must be settled by 30 September to avoid a late-payment surcharge. The current Fee Schedule is published on the Member Portal and on the club notice board.</LFP>
        <LFCallout>
          Members whose dues remain outstanding for more than 90 days may have their facilities access suspended. Dues outstanding for more than 12 months may result in termination of membership at the discretion of the Executive Committee.
        </LFCallout>
      </ClauseSection>

      <ClauseSection num={4} title="Conduct & Discipline" id="tc-04">
        <LFP>All members and their guests are expected to behave with courtesy and respect at all times within the club premises. The Executive Committee may investigate any complaint of misconduct and may issue a warning, impose a suspension, or terminate membership depending on the severity of the matter.</LFP>
        <LFUl items={[
          'Members are responsible for the conduct of their guests at all times.',
          'Intoxication, abusive language, or harassment of staff or fellow members is grounds for immediate suspension pending investigation.',
          'Members found to have made materially false statements in their application may have their membership cancelled without refund.',
        ]} />
      </ClauseSection>

      <ClauseSection num={5} title="Use of Facilities" id="tc-05">
        <LFP>Facilities are available to members and registered guests during published operating hours. Some facilities — including the Convention Hall, Guest House and Salon — require advance booking and may be subject to separate usage fees. The club reserves the right to close facilities for maintenance, private events or other operational reasons with reasonable notice.</LFP>
      </ClauseSection>

      <ClauseSection num={6} title="Guest Policy" id="tc-06">
        <LFP>Members may bring a maximum of three guests per visit. Guests must be signed in at Reception by the hosting member, who assumes full responsibility for the guest's conduct and any charges incurred. Guests may not use the club facilities without their hosting member being present on the premises.</LFP>
      </ClauseSection>

      <ClauseSection num={7} title="Termination & Suspension" id="tc-07">
        <LFP>Membership may be voluntarily resigned at any time by written notice to the Club Secretary. Annual Subscriptions are non-refundable on voluntary resignation. The Executive Committee may suspend or terminate membership in cases of non-payment, misconduct, or conduct prejudicial to the interests of the club, following its disciplinary procedure.</LFP>
      </ClauseSection>

      <ClauseSection num={8} title="Amendments" id="tc-08">
        <LFP>These Terms and Conditions, the Club Rules, and the Fee Schedule may be amended by resolution of the Executive Committee or the Annual General Meeting. Members will receive at least 30 days' notice of any material change.</LFP>
        <LFP>For enquiries relating to these terms, please contact the Club Secretary at <LFLink href="mailto:info@ckclbd.com">info@ckclbd.com</LFLink> or call <LFLink href="tel:+8801988896906">+880 1988 896 906</LFLink>.</LFP>
      </ClauseSection>
    </>
  )
}

const REFUND_ANCHORS = [
  { id: 'rp-01', label: 'Scope' },
  { id: 'rp-02', label: 'Admission Fee' },
  { id: 'rp-03', label: 'Annual Subscriptions' },
  { id: 'rp-04', label: 'Event & Booking Fees' },
  { id: 'rp-05', label: 'Guest House' },
  { id: 'rp-06', label: 'Requesting a Refund' },
  { id: 'rp-07', label: 'Processing & Timelines' },
]

function RefundContent() {
  return (
    <>
      <LFP>
        Chittagong Khulshi Club Limited is committed to fair and transparent handling of all payments. This Refund and Return Policy applies to all fees paid to CKCL including membership admission fees, annual subscriptions, event fees, facility bookings and ancillary charges.
      </LFP>
      <LFCallout>
        Last updated: January 2026. This policy is subject to change at the discretion of the Executive Committee. The version in force at the time of payment governs that transaction.
      </LFCallout>

      <ClauseSection num={1} title="Scope" id="rp-01">
        <LFP>This policy applies to all financial transactions between a member (or applicant) and CKCL. It does not apply to transactions with third-party vendors operating within the club premises (e.g. contracted caterers), who maintain their own return policies.</LFP>
      </ClauseSection>

      <ClauseSection num={2} title="Admission Fee" id="rp-02">
        <LFP>The one-time Admission Fee is non-refundable once an application has been approved by the Executive Committee and payment has been received, regardless of whether the member subsequently resigns or is terminated.</LFP>
        <LFP>If an application is <strong>declined</strong> by the Executive Committee, the Admission Fee will be refunded in full within 14 business days of the decision.</LFP>
      </ClauseSection>

      <ClauseSection num={3} title="Annual Subscriptions" id="rp-03">
        <LFP>Annual Subscriptions are non-refundable on voluntary resignation, transfer or termination mid-year. In cases of genuine medical hardship resulting in the member's inability to use the facilities for six or more months, a pro-rated credit — not a cash refund — may be applied to the following year's subscription at the discretion of the Executive Committee upon written application.</LFP>
      </ClauseSection>

      <ClauseSection num={4} title="Event & Booking Fees" id="rp-04">
        <LFP>Event fees are refundable as follows:</LFP>
        <LFUl items={[
          'Cancellation more than 14 days before the event — full refund.',
          'Cancellation 7–14 days before the event — 50% refund.',
          'Cancellation less than 7 days before the event — no refund, but the fee may be transferred to another event of equivalent value within 6 months.',
          'Event cancelled by CKCL — full refund within 7 business days.',
        ]} />
      </ClauseSection>

      <ClauseSection num={5} title="Guest House" id="rp-05">
        <LFP>Guest House bookings cancelled more than 48 hours before check-in are fully refundable. Cancellations within 48 hours of check-in incur a one-night retention charge. No-shows forfeit the full booking amount. Modifications to dates are subject to availability and must be requested at least 24 hours before the original check-in time.</LFP>
      </ClauseSection>

      <ClauseSection num={6} title="Requesting a Refund" id="rp-06">
        <LFP>Refund requests must be submitted in writing to the Club Secretary at <LFLink href="mailto:info@ckclbd.com">info@ckclbd.com</LFLink>, stating the transaction date, amount, method of payment, and reason for the request. Supporting documentation may be requested.</LFP>
      </ClauseSection>

      <ClauseSection num={7} title="Processing & Timelines" id="rp-07">
        <LFP>Approved refunds will be processed to the original payment method within 7–14 business days of approval. CKCL is not responsible for additional delays caused by banking institutions. Mobile financial service refunds (bKash, Nagad) are typically processed within 3–5 business days.</LFP>
        <LFCallout>
          For urgent matters, please call the club office directly at <LFLink href="tel:+8801988896906">+880 1988 896 906</LFLink>. Our accounts team is available Saturday to Thursday, 10:00 AM to 5:00 PM.
        </LFCallout>
      </ClauseSection>
    </>
  )
}

function BenefitsContent() {
  return (
    <>
      <LFP>
        Membership of Chittagong Khulshi Club Limited opens the door to a range of exclusive benefits, privileges and services designed to enrich the lives of our members and their families every day of the year.
      </LFP>

      <LFH2>Facilities Access</LFH2>
      <LFUl items={[
        'Unrestricted daily access to the Swimming Pool, Coffee Shop and Card Room during operating hours.',
        'Priority booking for the Convention Hall, Guest House and Salon.',
        'Preferred rates on all facility bookings compared to guest pricing.',
        "Access to the club's Wi-Fi network and business lounge areas.",
      ]} />

      <LFH2>Events & Social Calendar</LFH2>
      <LFP>Members receive first access and priority seating at all CKCL signature events — including the Annual Gala, Eid Reunion Dinner, Pohela Boishakh celebration, Annual Picnic, and Club Night. A full calendar is published each quarter on the Member Portal.</LFP>

      <LFH2>Family Privileges</LFH2>
      <LFUl items={[
        'Spouse and dependent children (under 22) may use club facilities at no additional charge.',
        'Family membership extensions available for parents and siblings at a reduced annual rate.',
        "Dedicated family programming including children's events and youth sports activities.",
      ]} />

      <LFH2>Affiliated Club Access</LFH2>
      <LFP>CKCL members enjoy reciprocal access to <LFLink href="#">Dhaka Club</LFLink> on production of a valid CKCL Membership Card. This benefit is subject to Dhaka Club's visitor policy, which may vary. CKCL will notify members of any changes to this arrangement.</LFP>

      <LFBlockquote attribution="— Member, since 2014">
        "The pool alone is worth the membership. But it's the people — the friendships we've built here — that keep us coming back every week."
      </LFBlockquote>

      <LFH2>Governance Rights</LFH2>
      <LFUl items={[
        'Right to vote at the Annual General Meeting.',
        'Eligibility to stand for election to the Executive Committee (subject to tenure and good-standing requirements).',
        'Access to Annual Reports and audited financial statements.',
        'The right to raise matters of concern to the Executive Committee in writing.',
      ]} />

      <LFCallout>
        Members are encouraged to bring eligible guests to experience the club before applying. A current member must accompany all guests. Guest visits do not commit the member to a referral.
      </LFCallout>
    </>
  )
}

function AffiliatedClubsContent() {
  return (
    <>
      <LFP>
        CKCL maintains an institutional affiliation with Dhaka Club Limited, one of Bangladesh's oldest and most distinguished private members' clubs. This relationship grants qualifying CKCL members reciprocal access to Dhaka Club's facilities when visiting the capital.
      </LFP>

      <LFImage
        src="https://images.unsplash.com/photo-1756981168649-0e3c3c8a32f3?w=720&h=400&fit=crop&auto=format"
        alt="Dhaka Club member lounge"
        caption="The Dhaka Club member lounge — available to CKCL members on production of a valid membership card."
      />

      <LFH2>Dhaka Club Limited</LFH2>
      <LFP>
        Founded in 1911, Dhaka Club is one of Bangladesh's most storied institutions — a private social club in Shahbagh, Dhaka, with facilities including a swimming pool, restaurants, guest rooms, sports courts and event spaces. CKCL members may access these facilities as visitors subject to Dhaka Club's prevailing visitor policy.
      </LFP>
      <LFH3>How to Use Your Reciprocal Privilege</LFH3>
      <LFOl items={[
        'Carry your valid, current-year CKCL Membership Card at all times.',
        'Present your CKCL card at the Dhaka Club reception and request visitor access.',
        'Sign the visitor register and pay any applicable visitor-day fee directly to Dhaka Club.',
        "Abide by Dhaka Club's rules and dress code during your visit.",
      ]} />
      <LFCallout>
        Reciprocal access is a privilege, not a right, and is subject to Dhaka Club's discretion and capacity. CKCL will notify members of any changes to this arrangement at least 30 days in advance.
      </LFCallout>

      <LFH2>Future Affiliations</LFH2>
      <LFP>
        The Executive Committee is actively exploring reciprocal arrangements with other clubs in Bangladesh and internationally. Members wishing to recommend an affiliated club are encouraged to write to the Club Secretary.
      </LFP>
    </>
  )
}

// ─── Page config map ──────────────────────────────────────────────────────────
type PageConfig = {
  title: string
  breadcrumb: string[]
  anchors?: { id: string; label: string }[]
  content: React.FC
}

const PAGE_CONFIG: Record<PageId, PageConfig> = {
  'about-club': {
    title: 'About Club',
    breadcrumb: ['Home', 'About', 'About Club'],
    content: AboutClubContent,
  },
  'mission-vision': {
    title: 'Mission & Vision',
    breadcrumb: ['Home', 'About', 'Mission & Vision'],
    content: MissionVisionContent,
  },
  'terms': {
    title: 'Terms & Conditions',
    breadcrumb: ['Home', 'About', 'Terms & Conditions'],
    anchors: TERMS_ANCHORS,
    content: TermsContent,
  },
  'refund-policy': {
    title: 'Refund & Return Policy',
    breadcrumb: ['Home', 'About', 'Refund & Return Policy'],
    anchors: REFUND_ANCHORS,
    content: RefundContent,
  },
  'benefits': {
    title: 'Benefits of Members',
    breadcrumb: ['Home', 'Membership', 'Benefits of Members'],
    content: BenefitsContent,
  },
  'affiliated-clubs': {
    title: 'Affiliated Clubs',
    breadcrumb: ['Home', 'Membership', 'Affiliated Clubs'],
    content: AffiliatedClubsContent,
  },
}

// ─── Inner Page shell ─────────────────────────────────────────────────────────
export default function InnerPage({
  pageId,
  onNavigate,
}: {
  pageId: PageId
  onNavigate: (id: PageId | 'home') => void
}) {
  const config = PAGE_CONFIG[pageId]
  const ContentComponent = config.content
  const next = nextPage(pageId)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pageId])

  const handleNavigate = (id: PageId) => {
    onNavigate(id)
  }

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100vh' }}>
      {/* Page header */}
      <PageHeader
        breadcrumb={config.breadcrumb}
        title={config.title}
        tabs={<SiblingTabs currentId={pageId} onNavigate={handleNavigate} />}
      />

      {/* Two-column body */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(24px,5vw,80px)',
          display: 'flex',
          gap: 48,
          alignItems: 'stretch',
        }}
      >
        {/* Desktop sidebar — full-height white panel, menu sticks inside it */}
        <div
          className="hidden lg:block"
          style={{ background: '#FFFFFF', borderLeft: '1px solid #E2E6EC', borderRight: '1px solid #E2E6EC', padding: 'clamp(40px,6vw,80px) 20px' }}
        >
          <div style={{ position: 'sticky', top: 120 }}>
            <Sidebar currentId={pageId} anchors={config.anchors} onNavigate={handleNavigate} />
          </div>
        </div>

        {/* Content column */}
        <main style={{ flex: 1, maxWidth: 720, minWidth: 0, padding: 'clamp(40px,6vw,80px) 0' }}>
          <ContentComponent />
          {next && <NextPageCard page={next} onNavigate={handleNavigate} />}
        </main>
      </div>

      <Footer />
    </div>
  )
}
