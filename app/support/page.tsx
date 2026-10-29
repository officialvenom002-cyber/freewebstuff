import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import DonationCards from '@/components/DonationCards';
import TopDonorsSection from '@/components/TopDonorsSection';
import SupportEmailButton from './SupportEmailButton';
import { getDonations } from '@/lib/donations';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  Gift,
  Receipt,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Trophy,
  CheckCircle2,
  HelpCircle,
  Send,
  Mail,
  Award
} from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Support FreeWebStuff — Keep Free Knowledge & Tools Alive',
  description:
    'FreeWebStuff is a 100% free community platform. Your voluntary support keeps our servers running, maintains fast reliable mirrors, and keeps the directory independent without paywalls.',
  alternates: {
    canonical: 'https://freewebstuff.site/support',
  },
  openGraph: {
    title: 'Support FreeWebStuff — Hey! We’re Glad You’re Here',
    description:
      'Support FreeWebStuff with a coffee tip, UPI, card, or crypto. Help keep web tools and free software directory free for everyone.',
    url: 'https://freewebstuff.site/support',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support FreeWebStuff — Hey! We’re Glad You’re Here',
    description: 'Help keep FreeWebStuff independent, fast, and free for everyone.',
  },
};

const STATS = [
  { label: 'Indexed Free Tools', value: '20,000+', icon: Sparkles, color: 'text-amber-400' },
  { label: 'Free Forever', value: '100%', icon: ShieldCheck, color: 'text-emerald-400' },
  { label: 'Mirror Uptime', value: '99.9%', icon: Zap, color: 'text-blue-400' },
  { label: 'Mandatory Paywalls', value: '0', icon: Heart, color: 'text-rose-400' },
];

const PERKS = [
  {
    icon: Trophy,
    title: 'Hall of Fame Badge',
    desc: 'Permanent verified recognition on the Community Wall of Fame with your custom message or backlink.',
    badge: 'Permanent',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  {
    icon: Zap,
    title: '24-Hour Review Fast-Track',
    desc: 'Submit your open-source projects or tool suggestions for priority editorial verification within 24 hours.',
    badge: 'Priority',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  {
    icon: Users,
    title: 'VIP Community Access',
    desc: 'Exclusive Supporter role in our Discord & direct dev communication channel for feature requests.',
    badge: 'Community',
    badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  },
];

const FAQS = [
  {
    icon: Lock,
    q: 'Is my payment secure?',
    a: 'Yes, absolutely. All payments (UPI, Card, Stripe, PayPal, Crypto) are processed through bank-grade 256-bit SSL encrypted gateways. FreeWebStuff never stores or handles your payment credentials.',
  },
  {
    icon: Gift,
    q: 'How will my donation be used?',
    a: '100% of contributions directly fund cloud server hosting, global DNS CDN delivery, automated uptime probe monitors, and expanding our verified zero-paywall directory.',
  },
  {
    icon: Receipt,
    q: 'Can I get a payment receipt?',
    a: 'Yes! Every payment method (UPI, Buy Me a Coffee, Ko-fi, Stripe) immediately issues an official digital transaction receipt delivered to your screen and email.',
  },
  {
    icon: Award,
    q: 'How do I claim my Wall of Fame spot?',
    a: 'Once your contribution is complete, submit the simple 30-second verification form below on this page. Our team verifies submissions promptly and activates your listing.',
  },
  {
    icon: Sparkles,
    q: 'Can I donate a custom amount or recurring tip?',
    a: 'Yes! Select the "Custom Amount" tile on the support card and enter any amount you wish to contribute via UPI, card, Ko-fi, or crypto.',
  },
  {
    icon: MessageCircle,
    q: 'Have questions or need manual assistance?',
    a: 'Our community desk is online 24/7. Join our Discord server, ping our Telegram channel, or send an email to officialvenom002@gmail.com.',
  },
];

export default async function SupportPage() {
  const donations = await getDonations();
  const approvedDonations = donations.filter((d) => d.status === 'approved' || d.status === 'verified');

  const supportChannels = [
    {
      title: 'Discord Community',
      badge: 'Live Chat',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      desc: 'Connect with fellow developers, get 1-on-1 assistance, and propose tool additions in real-time.',
      actionLabel: 'Join Discord Server',
      actionHref: 'https://discord.gg/mHpBcYJHM',
      isExternal: true,
    },
    {
      title: 'Telegram Dispatch',
      badge: 'Broadcasts',
      badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#229ED9]" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      desc: 'Instant broadcasts for newly verified vaults, open-source tool discoveries, and emergency mirrors.',
      actionLabel: 'Subscribe Channel',
      actionHref: 'https://t.me/+N7tYaUKT2q44NGU1',
      isExternal: true,
    },
    {
      title: 'Email Dispatch Desk',
      badge: '< 24h SLA',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      icon: (
        <Mail className="w-5 h-5 text-emerald-400" />
      ),
      desc: 'Dedicated inbox for webmaster submissions, sponsorship inquiries, and editorial corrections.',
      actionLabel: 'officialvenom002@gmail.com',
      actionHref: 'mailto:officialvenom002@gmail.com?subject=FreeWebStuff%20Support%20Inquiry',
      isExternal: false,
      email: 'officialvenom002@gmail.com',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'FreeWebStuff Community Treasury & Support',
    url: 'https://freewebstuff.site/support',
    description: 'Support FreeWebStuff — Fueling independent open-source web tools directory.',
    mainEntity: {
      '@type': 'Organization',
      name: 'FreeWebStuff',
      url: 'https://freewebstuff.site',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'officialvenom002@gmail.com',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0B0C0E] text-[#EDEDEE] flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-hidden">
      <JsonLd schema={jsonLd} />

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden opacity-40">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-500/20 via-blue-600/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.08),transparent_60%)]" />
      </div>

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
        
        {/* ── HERO SECTION ── */}
        <section className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#16181F] text-purple-300 border border-[#272B35] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span>Community Treasury • 100% Ad-Free Support Zone</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Fueling Open Knowledge for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400">
              Millions of Creators
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto font-normal">
            FreeWebStuff indexes 20,000+ free web tools, open-source utilities, and educational vaults without paywalls or subscriptions. Your voluntary contribution directly powers our hosting, crawlers, and independent mirrors.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#donate-now"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all duration-150"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Contribute via UPI, Card or Crypto</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>

            <Link
              href="/benefits"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16181F] hover:bg-[#1C1F28] text-slate-200 border border-[#272B35] font-semibold text-sm transition-all duration-150 hover:border-slate-600"
            >
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Explore Supporter Perks</span>
            </Link>
          </div>
        </section>

        {/* ── KEY METRICS BAR ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className="group relative p-5 rounded-2xl bg-[#111317]/90 border border-[#22252C] hover:border-[#353A47] transition-all duration-200 text-center flex flex-col items-center justify-center space-y-1.5 shadow-sm"
              >
                <div className="p-2 rounded-xl bg-[#181B22] border border-[#272B35] mb-1">
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-400 tracking-wide">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── SUPPORTER PRIVILEGES HIGHLIGHT ── */}
        <section className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141720] to-[#0E1015] border border-[#272B37] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#22252C]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recognition & Impact</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Exclusive Supporter Privileges
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Every voluntary tip directly sustains the project and unlocks special community honors.
              </p>
            </div>

            <Link
              href="/benefits"
              className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shrink-0"
            >
              <span>View All 5 Tiers & Perks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PERKS.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#111317] border border-[#22252C] hover:border-purple-500/30 transition-all duration-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#181B24] border border-[#272B37] flex items-center justify-center text-purple-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${perk.badgeColor}`}>
                        {perk.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm tracking-tight">{perk.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── DONATION TIERS & PAYMENT CHANNELS ── */}
        <section id="donate-now" className="space-y-6 pt-2">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Select Your Contribution Method
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              UPI instant QR, Buy Me a Coffee, Ko-fi, Stripe, PayPal, or Crypto. Fast, encrypted, and transparent.
            </p>
          </div>

          <div className="rounded-3xl bg-[#101217] border border-[#22252C] p-4 sm:p-6 shadow-2xl">
            <DonationCards />
          </div>
        </section>

        {/* ── WALL OF FAME / TOP DONORS ── */}
        <section id="wall-of-fame" className="space-y-6">
          <TopDonorsSection dbDonations={approvedDonations} />
        </section>

        {/* ── DIRECT HELP & COMMUNITY DESKS ── */}
        <section className="space-y-8 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Direct Help &amp; Dispatch Desks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Need assistance with payment verification, tool listings, or general inquiries? Connect directly with our core team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {supportChannels.map((c, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-[#111317] border border-[#22252C] hover:border-[#353A47] hover:bg-[#14161C] transition-all duration-200 flex flex-col justify-between space-y-5 shadow-sm"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#272B35] flex items-center justify-center">
                      {c.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base tracking-tight">{c.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>

                {c.email ? (
                  <SupportEmailButton email={c.email} />
                ) : (
                  <a
                    href={c.actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#181B22] hover:bg-white hover:text-black text-slate-200 border border-[#272B35] transition-all duration-150 flex items-center justify-center gap-1.5"
                  >
                    <span>{c.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ── */}
        <section className="space-y-8 pt-8 border-t border-[#22252C]">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Transparency First</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear answers regarding payments, security, tax receipts, and directory privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {FAQS.map((faq, i) => {
              const Icon = faq.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#111317] border border-[#22252C] hover:border-[#353A47] transition-all space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#181B24] border border-[#272B37] flex items-center justify-center text-purple-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-white text-sm tracking-tight">{faq.q}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-9.5">{faq.a}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── BOTTOM COMMUNITY PLEDGE ── */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/20 via-[#111317] to-indigo-950/20 border border-[#22252C] text-center space-y-3 max-w-3xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <Heart className="w-5 h-5 fill-purple-400 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Our Independent Community Promise
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            FreeWebStuff will always remain completely accessible to students, researchers, developers, and creators worldwide without paywalled locks. Thank you for making open web knowledge possible!
          </p>
        </section>

      </main>
    </div>
  );
}
