import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield,
  Database,
  Eye,
  Lock,
  Users,
  Cookie,
  Mail,
  MessageCircle,
  Globe,
  RefreshCw,
  UserCheck,
  Trash2,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SKIERS ENTREPRENEURS KENYA",
  description:
    "How SKIERS ENTREPRENEURS KENYA collects, uses, and protects your personal data, in line with Kenya's Data Protection Act 2019.",
};

const sections = [
  {
    icon: FileText,
    title: "1. About this policy",
    body: [
      "This Privacy Policy explains how SKIERS ENTREPRENEURS KENYA (referred to as SKIERS, we, us, or our) collects, uses, stores, and protects your personal information when you use our platform.",
      "We follow the Kenya Data Protection Act 2019, which gives you specific rights over your data. This policy explains those rights in plain language and tells you how to exercise them.",
      "If you do not agree with how we handle your data as described here, please do not use the Platform. If you have any questions, contact us using the details at the bottom of this page.",
    ],
  },
  {
    icon: Database,
    title: "2. Information we collect",
    body: [
      "Account information: When you sign up, we collect your full name, email address, phone number, and password. You may also add a profile photo, headline, bio, location, skills, and portfolio items.",
      "Verification information: If you choose to verify your identity, we collect a photo of your national ID, a selfie, and any documents needed to confirm your business or professional credentials. This information is stored securely and never shown to other users.",
      "Transaction information: When you hire someone or complete a job, we record the details of the job, the amount paid, the escrow status, and the reviews exchanged.",
      "Payment information: M-Pesa transactions are processed through Safaricom. We receive the phone number used, the amount, and the M-Pesa confirmation code. We do not store your M-Pesa PIN or any details that would allow someone to charge your account.",
      "Communication: We store messages sent through the Platform so we can resolve disputes and improve the service. We also log emails and WhatsApp messages you send to our support team.",
      "Technical information: We collect your IP address, browser type, device type, and pages you visit on the Platform. This helps us keep the site secure and improve it.",
      "Location information: If you allow it, we collect your approximate location to show you nearby services and businesses. You can turn this off in your browser or device settings at any time.",
    ],
  },
  {
    icon: Eye,
    title: "3. How we use your information",
    body: [
      "To create and manage your account and let you sign in.",
      "To connect buyers and sellers, and to enable messaging, proposals, and hiring.",
      "To process payments through M-Pesa and hold money safely in escrow.",
      "To verify your identity, if you choose to be verified.",
      "To show you relevant services, businesses, or jobs based on your location and search history.",
      "To resolve disputes between users, by reviewing the relevant messages, files, and transaction data.",
      "To send you service updates, security alerts, and (if you agree) marketing messages.",
      "To detect and prevent fraud, abuse, and violations of our Terms of Service.",
      "To comply with legal obligations under Kenyan law.",
    ],
  },
  {
    icon: Lock,
    title: "4. How we protect your information",
    body: [
      "We use industry standard security measures to protect your data. This includes encryption in transit, secure authentication, and access controls inside our systems.",
      "Our database is protected so that users can only see information they are supposed to see. For example, only you can see your own wallet balance. Only the two people in a conversation can read the messages in it.",
      "Only a small number of our team members can access personal data, and only when they need to for support, verification, or dispute resolution. All such access is logged.",
      "No system is perfectly secure. If we ever become aware of a data breach that affects your information, we will notify you and the Office of the Data Protection Commissioner as required by law.",
    ],
  },
  {
    icon: Users,
    title: "5. When we share your information",
    body: [
      "With other users: Some information is public by design. Your name, profile photo, headline, ratings, reviews, and (if you choose) location are visible to other users. Your email, phone number, ID documents, and payment details are never shared publicly.",
      "With service providers: We work with trusted third parties like Supabase (for database hosting), Vercel (for website hosting), and Safaricom (for M-Pesa payments). These companies process data only as necessary to provide their service to us.",
      "With authorities: We may share information if required by Kenyan law, a court order, or a lawful request from a government agency.",
      "For safety: If we believe there is a serious risk to someone's safety, we may share information with the appropriate authorities.",
      "We never sell your personal data to anyone.",
    ],
  },
  {
    icon: UserCheck,
    title: "6. Your rights under the Data Protection Act",
    body: [
      "Right to be informed: You have the right to know what data we collect and how we use it. That is what this policy is for.",
      "Right of access: You can ask us for a copy of all the personal data we hold about you.",
      "Right to correction: If any of your information is wrong or out of date, you can correct it from your account settings or ask us to correct it.",
      "Right to deletion: You can ask us to delete your personal data. In most cases, we will delete it within 30 days. Some data may be kept longer if required by law, or if there is an unresolved dispute or unpaid balance.",
      "Right to object: You can object to how we are using your data. For example, you can opt out of marketing emails at any time.",
      "Right to data portability: You can ask us to send you your data in a machine readable format.",
      "Right to complain: If you believe we have mishandled your data, you can complain to us first, and if you are not satisfied, you can complain to the Office of the Data Protection Commissioner of Kenya.",
      "To exercise any of these rights, contact us at skierscreatives@gmail.com. We respond to data requests within 30 days.",
    ],
  },
  {
    icon: Cookie,
    title: "7. Cookies and tracking",
    body: [
      "We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how the Platform is used.",
      "Essential cookies are required for the Platform to work. We cannot turn these off.",
      "Analytics cookies help us understand which pages are popular and where users get stuck. You can turn these off.",
      "We do not use cookies to track you across other websites, and we do not sell cookie data to anyone.",
      "You can control cookies through your browser settings. If you disable essential cookies, some parts of the Platform may not work properly.",
      "For more details, please see our Cookie Policy.",
    ],
  },
  {
    icon: Globe,
    title: "8. Where your data is stored",
    body: [
      "Our database is hosted by Supabase, on servers located in the European Union. Our website is hosted by Vercel on servers located in the United States and Europe.",
      "This means your data may be transferred outside Kenya. We only work with providers that meet international data protection standards, and we have agreements in place to protect your information.",
      "If you would prefer your data to stay within Kenya, we plan to offer local hosting options in the future. For now, the security and reliability of the international providers we use is the best choice for our users.",
    ],
  },
  {
    icon: RefreshCw,
    title: "9. How long we keep your data",
    body: [
      "While your account is active: We keep your account information, transaction history, and messages for as long as you have an account.",
      "When you close your account: We delete your personal data, portfolio, and messages within 30 days.",
      "Financial records: We keep records of transactions and payments for 7 years, as required by Kenyan tax and financial regulations. This is standard practice for any business handling money.",
      "Disputes: If you are involved in an active dispute, we keep the relevant data until the dispute is fully resolved, even if you have closed your account.",
    ],
  },
  {
    icon: Trash2,
    title: "10. Deleting your account",
    body: [
      "You can delete your account at any time from your account settings. When you do, we permanently remove your profile, photos, portfolio, messages, and personal details.",
      "Before deleting your account, please make sure you have no active jobs, unresolved disputes, or unsettled balances. If you do, you must resolve them first.",
      "Once deleted, your account cannot be recovered. If you want to use SKIERS again later, you will need to create a new account.",
      "If you would like us to delete your account on your behalf, email skierscreatives@gmail.com from the email address registered to your account.",
    ],
  },
  {
    icon: Shield,
    title: "11. Children's privacy",
    body: [
      "SKIERS is not intended for use by anyone under 18 years of age. We do not knowingly collect personal information from children.",
      "If we become aware that we have collected data from someone under 18 without proper consent, we will delete it as quickly as possible.",
      "If you believe a child has used SKIERS to create an account, please contact us immediately at skierscreatives@gmail.com.",
    ],
  },
  {
    icon: RefreshCw,
    title: "12. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will update the date at the bottom of this page.",
      "If the changes are significant, we will send a notification to every account holder by email and inside the Platform.",
      "By continuing to use SKIERS after we update this policy, you agree to the new version. If you do not agree, you may close your account at any time.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                Your data, protected
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
              Privacy Policy
            </h1>

            <p
              className="text-lg text-gray-300 leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              How we collect, use, and protect your personal data. Written in
              plain language, and compliant with Kenya&apos;s Data Protection
              Act 2019.
            </p>

            <p className="text-sm text-gray-400 mt-6">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* ============ INTRO ============ */}
      <section className="py-12 bg-background-secondary border-b border-border">
        <div className="container-site max-w-3xl">
          <p className="text-text-secondary leading-relaxed">
            Your privacy matters to us. This policy is written in plain language
            so you can actually understand it. If anything here is unclear, or
            if you want to exercise any of your rights, email us at{" "}
            <a
              href="mailto:skierscreatives@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              skierscreatives@gmail.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* ============ SECTIONS ============ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl">
          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-white border border-border rounded-2xl p-6 lg:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg lg:text-xl font-display font-semibold text-text-primary mb-4">
                      {section.title}
                    </h2>
                    <div className="space-y-3">
                      {section.body.map((para, i) => (
                        <p
                          key={i}
                          className="text-sm lg:text-base text-text-secondary leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-dark text-white rounded-2xl p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center">
              <Shield className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">
                Questions about your data?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                We respond to every data request within 30 days. If you want a
                copy of your data, need us to correct something, or want your
                account deleted, just reach out.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/254768860572"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-kenya-green text-white hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
                <a
                  href="mailto:skierscreatives@gmail.com?subject=Privacy%20Request"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-dark transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
                See also our{" "}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="text-accent hover:underline">
                  Cookie Policy
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
