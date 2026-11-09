import { useState, useEffect } from 'react'
import Footer from './Footer'
import SubTabs from './SubTabs'
import SideNavCard from './SideNav'

// ─── Member data ──────────────────────────────────────────────────────────────
type MemberTier = 'Office Bearer' | 'Member'

type CommitteeMember = {
  id: number
  name: string
  designation: string
  company: string
  tier: MemberTier
  photo: string | null
  bio: string
}

const P = (id: string, w = 440, h = 550) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`

const MEMBERS: CommitteeMember[] = [
  {
    id: 1,
    name: 'Md. Rafiqul Islam',
    designation: 'President',
    company: 'Islam Group of Industries',
    tier: 'Office Bearer',
    photo: P('1560250097-0b93528c311a'),
    bio: "Md. Rafiqul Islam is the founding President of CKCL and a pillar of Chattogram's business community. He chairs Islam Group of Industries, a diversified conglomerate spanning textiles, shipping and real estate. A passionate advocate for private-sector led community development, he championed the club's founding vision and has steered CKCL through its first twelve years of growth.",
  },
  {
    id: 2,
    name: 'Nasreen Akter',
    designation: 'Vice President',
    company: 'Akter Enterprises Ltd.',
    tier: 'Office Bearer',
    photo: P('1494790108377-be9c29b29330'),
    bio: 'Nasreen Akter brings three decades of entrepreneurial experience to her role as Vice President. As Managing Director of Akter Enterprises, she oversees operations across manufacturing and logistics. She has been instrumental in shaping the club\'s events calendar and member welfare programmes.',
  },
  {
    id: 3,
    name: 'Kamal Hossain',
    designation: 'General Secretary',
    company: 'KH Holdings',
    tier: 'Office Bearer',
    photo: P('1652471943570-f3590a4e52ed'),
    bio: 'Kamal Hossain serves as the backbone of the club\'s administration as General Secretary. Founder of KH Holdings, a property development and investment firm, he is known for his methodical approach and commitment to transparent governance.',
  },
  {
    id: 4,
    name: 'Dilruba Sultana',
    designation: 'Joint Secretary',
    company: 'Sultana Textiles',
    tier: 'Office Bearer',
    photo: P('1573496359142-b8d87734a5a2'),
    bio: 'Dilruba Sultana is Joint Secretary and the driving force behind the club\'s membership outreach. As the proprietor of Sultana Textiles, one of Chattogram\'s most respected export-oriented garment firms, she brings strategic thinking and warmth to everything she undertakes.',
  },
  {
    id: 5,
    name: 'Abdullah Al Mamun',
    designation: 'Treasurer',
    company: 'Mamun Shipping Ltd.',
    tier: 'Office Bearer',
    photo: P('1519085360753-af0119f7cbe7'),
    bio: 'Abdullah Al Mamun manages the club\'s finances as Treasurer, ensuring fiscal prudence and member accountability. He is Managing Director of Mamun Shipping Ltd., a leading freight forwarding and logistics company operating across the Port of Chattogram.',
  },
  {
    id: 6,
    name: 'Shirin Akhter',
    designation: 'Executive Member',
    company: 'Akhter Real Estate',
    tier: 'Member',
    photo: P('1614786269829-d24616faf56d'),
    bio: 'Shirin Akhter oversees facilities liaison and member services on the Executive Committee. She is the founder and CEO of Akhter Real Estate, a boutique property consultancy headquartered in Khulshi.',
  },
  {
    id: 7,
    name: 'Tarik Ahmed',
    designation: 'Executive Member',
    company: 'Ahmed Steel Mills',
    tier: 'Member',
    photo: P('1613181013804-1dcba09e6a9d'),
    bio: 'Tarik Ahmed brings industrial expertise to the committee as a representative of Chattogram\'s manufacturing sector. He is Managing Director of Ahmed Steel Mills, one of the region\'s largest producers of structural steel.',
  },
  {
    id: 8,
    name: 'Farhana Begum',
    designation: 'Executive Member',
    company: 'FBG Pharmaceuticals',
    tier: 'Member',
    photo: P('1573497019236-17f8177b81e8'),
    bio: 'Farhana Begum is a physician-turned-entrepreneur who founded FBG Pharmaceuticals, a regional drug distribution firm. On the committee she champions wellness programming and the club\'s health-focused member events.',
  },
  {
    id: 9,
    name: 'Rezaul Karim',
    designation: 'Executive Member',
    company: 'Karim & Associates',
    tier: 'Member',
    photo: P('1718209881007-c0ecdfc00f9d'),
    bio: 'Rezaul Karim is a senior advocate and founding partner of Karim & Associates, one of Chattogram\'s most respected commercial law practices. He advises the committee on governance, member discipline and constitutional matters.',
  },
  {
    id: 10,
    name: 'Sumaiya Chowdhury',
    designation: 'Executive Member',
    company: 'Chowdhury Media Group',
    tier: 'Member',
    photo: P('1585240975858-7264fd020798'),
    bio: "Sumaiya Chowdhury heads Chowdhury Media Group, which publishes two of Chattogram's leading Bengali-language dailies. She is the committee's communications lead and oversees the club's public presence.",
  },
  {
    id: 11,
    name: 'Jahangir Alam',
    designation: 'Executive Member',
    company: 'Alam Construction Co.',
    tier: 'Member',
    photo: null,
    bio: "Jahangir Alam is Managing Director of Alam Construction Co., responsible for several landmark commercial buildings in Chattogram's Khulshi and Nasirabad areas. He oversees the club's infrastructure and facilities development sub-committee.",
  },
  {
    id: 12,
    name: 'Roksana Islam',
    designation: 'Executive Member',
    company: 'RIL Garments Ltd.',
    tier: 'Member',
    photo: P('1573496359142-b8d87734a5a2', 440, 550),
    bio: 'Roksana Islam is a leading figure in Chattogram\'s ready-made garment sector. As Managing Director of RIL Garments Ltd., she oversees a workforce of over 3,000 employees. She leads the club\'s corporate membership drive.',
  },
  {
    id: 13,
    name: 'Nizam Uddin',
    designation: 'Executive Member',
    company: 'Uddin Trade Corporation',
    tier: 'Member',
    photo: null,
    bio: 'Nizam Uddin is a veteran importer and founder of Uddin Trade Corporation, specialising in electronics and consumer goods distribution across southern Bangladesh. He is known for his generosity and has sponsored several of the club\'s flagship events.',
  },
  {
    id: 14,
    name: 'Monira Khanam',
    designation: 'Executive Member',
    company: 'Khanam Finance & Leasing',
    tier: 'Member',
    photo: P('1614786269829-d24616faf56d', 440, 550),
    bio: 'Monira Khanam is the Managing Director of Khanam Finance & Leasing, a non-bank financial institution serving SMEs across Chattogram division. She chairs the member dues and finance sub-committee.',
  },
  {
    id: 15,
    name: 'Shahadat Hossain',
    designation: 'Executive Member',
    company: 'Hossain Brothers Ltd.',
    tier: 'Member',
    photo: P('1560250097-0b93528c311a', 440, 550),
    bio: 'Shahadat Hossain is a third-generation trader and Managing Director of Hossain Brothers Ltd., which operates bonded warehouses and a C&F agency at Chattogram Port. He oversees the affiliated club liaison function.',
  },
  {
    id: 16,
    name: 'Parvin Sultana',
    designation: 'Executive Member',
    company: 'PS Hospitality',
    tier: 'Member',
    photo: P('1573497019236-17f8177b81e8', 440, 550),
    bio: "Parvin Sultana brings deep hospitality expertise to the committee as founder of PS Hospitality, which manages two boutique hotels in Chattogram's GEC and Khulshi areas. She leads the club's food and beverage and guest house sub-committee.",
  },
  {
    id: 17,
    name: 'Belal Uddin Ahmed',
    designation: 'Executive Member',
    company: 'Ahmed Cables Ltd.',
    tier: 'Member',
    photo: P('1519085360753-af0119f7cbe7', 440, 550),
    bio: 'Belal Uddin Ahmed is Director of Ahmed Cables Ltd., a leading manufacturer of electrical cables and conductors. A founding member of CKCL, he played a pivotal role in the club\'s inaugural fundraising and infrastructure projects.',
  },
  {
    id: 18,
    name: 'Kamrun Nahar',
    designation: 'Executive Member',
    company: 'Nahar Agro Industries',
    tier: 'Member',
    photo: null,
    bio: 'Kamrun Nahar is a pioneering agro-industrialist and founder of Nahar Agro Industries, operating rice mills and food-processing plants across Chattogram and Cox\'s Bazar districts. She has championed women\'s business networking through CKCL events.',
  },
  {
    id: 19,
    name: 'Iqbal Hossain',
    designation: 'Executive Member',
    company: 'Hossain Auto Industries',
    tier: 'Member',
    photo: P('1652471943570-f3590a4e52ed', 440, 550),
    bio: "Iqbal Hossain is the Managing Director of Hossain Auto Industries, an authorised dealer and service centre for commercial vehicles across Chattogram division. He oversees the club's parking, transport and fleet management.",
  },
  {
    id: 20,
    name: 'Shumaiya Begum',
    designation: 'Executive Member',
    company: 'SB Designs Ltd.',
    tier: 'Member',
    photo: P('1585240975858-7264fd020798', 440, 550),
    bio: 'Shumaiya Begum is Founder and Creative Director of SB Designs Ltd., a Chattogram-based interior design and fit-out firm responsible for several landmark hospitality and retail projects. She leads the club\'s aesthetics and venue upgrade sub-committee.',
  },
  {
    id: 21,
    name: 'Mozammel Haque',
    designation: 'Executive Member',
    company: 'Haque Developers',
    tier: 'Member',
    photo: null,
    bio: 'Mozammel Haque is the Chairman of Haque Developers, one of Khulshi\'s most active real estate development firms, responsible for over a dozen residential apartment projects. He is a founding member and one of the original signatories of the CKCL trust deed.',
  },
  {
    id: 22,
    name: 'Rubina Akter',
    designation: 'Executive Member',
    company: 'RA Healthcare',
    tier: 'Member',
    photo: P('1573496359142-b8d87734a5a2', 441, 551),
    bio: 'Rubina Akter is the Managing Director of RA Healthcare, which operates diagnostic centres and specialty clinics across Chattogram. She advises the committee on occupational health and member wellness programming.',
  },
]

type FilterType = 'All' | 'Office Bearers' | 'Members'

// Shown on their own row above the rest of the committee
const LEADER_ROLES = ['President', 'Vice President']

// ─── No-photo fallback ────────────────────────────────────────────────────────
function NoPhotoCard() {
  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      style={{ background: '#EEF1F5', position: 'relative' }}
    >
      <div
        style={{
          fontFamily: 'CKCL',
          fontWeight: 600,
          fontSize: 72,
          color: 'rgba(14,17,22,0.08)',
          letterSpacing: '-0.02em',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        CKCL
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'CKCL',
          fontSize: 11,
          color: '#A8B0BB',
          whiteSpace: 'nowrap',
        }}
      >
        Photo not available
      </div>
    </div>
  )
}

// ─── Member card ──────────────────────────────────────────────────────────────
function MemberCard({
  member,
  featured,
  onClick,
}: {
  member: CommitteeMember
  featured?: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left w-full"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      aria-label={`View profile of ${member.name}`}
    >
      {/* Photo container — 4:5 ratio */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          borderRadius: 20,
          overflow: 'hidden',
          border: hovered ? `${featured ? 2 : 1}px solid #E10B17` : featured ? '2px solid #B98B43' : '1px solid rgba(185,139,67,0.45)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 16px 48px -8px rgba(14,17,22,0.14), 0 4px 12px rgba(14,17,22,0.08)'
            : '0 8px 24px rgba(14,17,22,0.06)',
          transition: 'all 240ms ease-out',
        }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
        ) : (
          <NoPhotoCard />
        )}

        {/* Bottom gradient scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(14,17,22,0.45) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Tier chip — bottom-left, glass */}
        <div
          className="absolute glass-strong eyebrow"
          style={{
            bottom: 12,
            left: 12,
            fontSize: 9,
            color: '#B98B43',
            borderRadius: 999,
            padding: '4px 10px',
            letterSpacing: '0.10em',
          }}
        >
          {member.tier === 'Office Bearer' ? 'Office Bearer' : 'Founding Member'}
        </div>
      </div>

      {/* Text below */}
      <div style={{ padding: '14px 4px 0' }}>
        <div
          style={{
            fontFamily: 'CKCL',
            fontWeight: 700,
            fontSize: featured ? 18 : 16,
            lineHeight: 1.3,
            color: '#0E1116',
            marginBottom: 3,
          }}
        >
          {member.name}
        </div>
        <div
          style={{
            fontFamily: 'CKCL',
            fontWeight: 600,
            fontSize: featured ? 14 : 13,
            color: hovered ? '#E10B17' : '#2A3039',
            marginBottom: 2,
            transition: 'color 160ms',
          }}
        >
          {member.designation}
        </div>
        <div
          style={{
            fontFamily: 'CKCL',
            fontSize: 12,
            color: '#5C6673',
            lineHeight: 1.4,
          }}
        >
          {member.company}
        </div>
      </div>
    </button>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function MemberModal({
  member,
  onClose,
}: {
  member: CommitteeMember
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(14,17,22,0.60)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="glass-strong relative w-full max-w-2xl"
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          animation: 'fadeUp 240ms ease-out both',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 glass-strong flex items-center justify-center transition-colors"
          style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer' }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E1116" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Portrait */}
          <div
            style={{
              width: '100%',
              flexShrink: 0,
              aspectRatio: '4 / 3',
              background: '#EEF1F5',
              position: 'relative',
            }}
            className="sm:w-56 sm:aspect-auto sm:min-h-full"
          >
            {member.photo ? (
              <img
                src={member.photo.replace('w=440&h=550', 'w=560&h=720')}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', minHeight: 280 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 280 }}>
                <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 56, color: 'rgba(14,17,22,0.08)' }}>CKCL</div>
              </div>
            )}
            {/* Tier chip */}
            <div
              className="absolute bottom-3 left-3 glass-strong eyebrow"
              style={{ fontSize: 9, color: '#B98B43', borderRadius: 999, padding: '4px 10px' }}
            >
              {member.tier === 'Office Bearer' ? 'Office Bearer' : 'Founding Member'}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '28px 32px', flex: 1, minWidth: 0 }}>
            <div className="eyebrow mb-2" style={{ fontSize: 10, color: '#B98B43' }}>Executive Committee</div>
            <h2
              style={{
                fontFamily: 'CKCL',
                fontWeight: 600,
                fontSize: 'clamp(20px,2vw,26px)',
                lineHeight: 1.2,
                color: '#0E1116',
                margin: '0 0 6px',
              }}
            >
              {member.name}
            </h2>
            <div
              style={{
                fontFamily: 'CKCL',
                fontWeight: 600,
                fontSize: 14,
                color: '#E10B17',
                marginBottom: 2,
              }}
            >
              {member.designation}
            </div>
            <div
              style={{
                fontFamily: 'CKCL',
                fontSize: 13,
                color: '#5C6673',
                marginBottom: 20,
              }}
            >
              {member.company}
            </div>

            <div
              style={{
                height: 1,
                background: '#E2E6EC',
                marginBottom: 20,
              }}
            />

            <p
              style={{
                fontFamily: 'CKCL',
                fontSize: 14,
                lineHeight: 1.75,
                color: '#2A3039',
                margin: 0,
              }}
            >
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page header (self-contained, no InnerPage dependency) ────────────────────
function PageHeader({ title, breadcrumb, tabs }: { title: string; breadcrumb: string[]; tabs?: React.ReactNode }) {
  return (
    <div
      // With mobile tabs the bar sits flush on the header's bottom edge, like the About pages
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
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,51,61,0.10) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '30%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,139,67,0.08) 0%, transparent 65%)', filter: 'blur(48px)', pointerEvents: 'none' }} />

      <div className="flex items-center gap-1.5 mb-4" style={{ position: 'relative', zIndex: 1 }}>
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="eyebrow" style={{ fontSize: 11, color: i < breadcrumb.length - 1 ? '#5C6673' : '#0E1116' }}>{crumb}</span>
            {i < breadcrumb.length - 1 && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A8B0BB" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            )}
          </span>
        ))}
      </div>

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
        }}
      >
        {title}
      </h1>

      {tabs && <div className="lg:hidden" style={{ position: 'relative', zIndex: 1, marginTop: 24 }}>{tabs}</div>}
    </div>
  )
}

// ─── Committees ───────────────────────────────────────────────────────────────
// Add a committee here (and to CommitteePageType) and it appears in the sidebar and mobile tabs.
export type CommitteePageType = 'founding' | 'executive'

export const COMMITTEES: { id: CommitteePageType; label: string }[] = [
  { id: 'founding', label: 'Founding Executive Committee' },
  { id: 'executive', label: 'Executive Committee' },
]

// ─── CommitteePage ────────────────────────────────────────────────────────────
export default function CommitteePage({
  type,
  onNavigate,
}: {
  type: CommitteePageType
  onNavigate: (type: CommitteePageType) => void
}) {
  const [filter, setFilter] = useState<FilterType>('All')
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null)

  // Reset the filter when switching committees
  useEffect(() => { setFilter('All') }, [type])

  const title = COMMITTEES.find((c) => c.id === type)!.label
  const breadcrumb = ['Home', 'About', title]

  const filtered = MEMBERS.filter((m) => {
    if (filter === 'Office Bearers') return m.tier === 'Office Bearer'
    if (filter === 'Members') return m.tier === 'Member'
    return true
  })

  // President first, then Vice President, then everyone else in list order
  const leaders = LEADER_ROLES.flatMap((role) => filtered.filter((m) => m.designation === role))
  const others = filtered.filter((m) => !LEADER_ROLES.includes(m.designation))

  const counts: Record<FilterType, number> = {
    All: MEMBERS.length,
    'Office Bearers': MEMBERS.filter((m) => m.tier === 'Office Bearer').length,
    Members: MEMBERS.filter((m) => m.tier === 'Member').length,
  }

  return (
    <div style={{ background: '#F7F8FA', minHeight: '100vh' }}>
      <PageHeader
        title={title}
        breadcrumb={breadcrumb}
        tabs={<SubTabs tabs={COMMITTEES} active={type} onChange={onNavigate} />}
      />

      {/* Two-column body, same as the About pages */}
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
          <div style={{ position: 'sticky', top: 120, width: 280 }}>
            <SideNavCard section="Committees" pages={COMMITTEES} currentId={type} onNavigate={onNavigate} />
          </div>
        </div>

        <main style={{ flex: 1, minWidth: 0, padding: 'clamp(40px,6vw,80px) 0' }}>
      {/* Filter chip row */}
      <div
        style={{
          position: 'sticky',
          top: 68,
          zIndex: 30,
          background: 'rgba(247,248,250,0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E6EC',
          padding: '12px 0',
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {(['All', 'Office Bearers', 'Members'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: 'CKCL',
                fontSize: 13,
                fontWeight: filter === f ? 600 : 500,
                color: filter === f ? '#FFFFFF' : '#5C6673',
                background: filter === f ? '#E10B17' : '#FFFFFF',
                border: filter === f ? '1px solid #E10B17' : '1px solid #E2E6EC',
                borderRadius: 999,
                padding: '7px 16px',
                cursor: 'pointer',
                transition: 'all 160ms',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {f}
              <span
                style={{
                  fontFamily: 'CKCL',
                  fontSize: 10,
                  fontWeight: 500,
                  opacity: 0.7,
                }}
              >
                {counts[f]}
              </span>
            </button>
          ))}

          <div style={{ marginLeft: 'auto', fontFamily: 'CKCL', fontSize: 13, color: '#A8B0BB' }}>
            {filtered.length} {filtered.length === 1 ? 'member' : 'members'}
          </div>
        </div>
      </div>

      {/* Card grid — President & Vice President side by side on their own row, with a gold frame and larger text */}
      <div>
        {leaders.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 mx-auto sm:max-w-[624px] mb-10">
            {leaders.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                featured
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
          {others.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 22, color: '#A8B0BB' }}>No members found</div>
            <button onClick={() => setFilter('All')} style={{ fontFamily: 'CKCL', fontSize: 14, color: '#E10B17', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filter</button>
          </div>
        )}
      </div>
        </main>
      </div>

      {/* Modal */}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      <Footer />
    </div>
  )
}
