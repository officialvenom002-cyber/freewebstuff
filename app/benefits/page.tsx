import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Supporter Benefits & Website Listing Privileges — FreeWebStuff',
  description:
    'Discover all exclusive supporter benefits: Guaranteed website listing, fast-track 24h editorial review, exposure to thousands of daily visitors, and Wall of Fame recognition.',
  alternates: {
    canonical: 'https://freewebstuff.site/benefits',
  },
};

const BENEFITS_LIST = [
  {
    icon: '🚀',
    title: 'Guaranteed Website Listing & Placement',
    highlight: 'Guaranteed Live',
    desc: 'Get your website, blog, or web utility permanently listed and verified in the FreeWebStuff directory under the most relevant high-traffic category.',
    actionText: 'Submit Your Website →',
    actionHref: '/submit',
  },
  {
    icon: '📈',
    title: 'Direct Exposure to Community Visitors',
    highlight: 'Organic Reach',
    desc: 'Tap directly into our growing, high-intent audience actively searching for free tools, open-source software, and web utilities.',
    actionText: 'Explore Categories →',
    actionHref: '/categories',
  },
  {
    icon: '⚡',
    title: 'Fast-Track 24-Hour Editorial Review',
    highlight: 'Skip the Queue',
    desc: 'Standard public submission queues take up to 7-14 days. Supporter websites bypass the queue and get tested, approved, and indexed within 24 hours.',
    actionText: 'Support to Fast-Track →',
    actionHref: '/support#donate-now',
  },
  {
    icon: '🔗',
    title: 'Dofollow Backlink & SEO Credibility',
    highlight: 'SEO Authority',
    desc: 'Benefit from high-authority indexation on a trusted, clean directory to boost your organic search presence and domain score.',
    actionText: 'Explore Directory →',
    actionHref: '/search',
  },
  {
    icon: '🌟',
    title: 'Permanent Wall of Fame & Contributor Honor',
    highlight: 'Public Credit',
    desc: 'Get permanently honored on our Community Wall of Fame with your brand or creator name prominently featured.',
    actionText: 'View Wall of Fame →',
    actionHref: '/support#wall-of-fame',
  },
];

export default function BenefitsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'FreeWebStuff Supporter Benefits',
    url: 'https://freewebstuff.site/benefits',
    description: 'Exclusive benefits and privileges for FreeWebStuff supporters.',
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      <JsonLd schema={jsonLd} />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <span>✨</span> Supporter Perks
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Supporter Privileges & Website Placement
          </h1>
          <p className="text-base sm:text-lg text-slate-300">
            When you voluntarily support FreeWebStuff, we give back with premium directory positioning, 24-hour review queues, and perpetual recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS_LIST.map((b, i) => (
            <div key={i} className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{b.icon}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {b.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
              <Link
                href={b.actionHref}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                {b.actionText}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/support#donate-now"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-xl shadow-purple-600/30"
          >
            Become a Supporter Today →
          </Link>
        </div>
      </main>

      </div>
  );
}
