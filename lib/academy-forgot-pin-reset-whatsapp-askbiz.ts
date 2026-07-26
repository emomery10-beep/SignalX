import type { AcademyArticle } from "./academy-types";

// New article covering the self-service phone-PIN reset flow shipped in
// ce8bc6dd (2026-07-23, "feat(auth): self-service phone-PIN reset via
// WhatsApp"). Verified directly against app/(auth)/forgot-pin/page.tsx,
// app/api/auth/phone-pin/reset/route.ts, and the signin page's "Forgot
// PIN?" link before writing. This is the OWNER'S sign-in PIN for the main
// AskBiz app — a different system from POS staff till PINs, which are
// covered separately in lib/askbiz-pos-training-articles.ts and are
// unaffected by this feature.
export const academyForgotPinResetWhatsapp: AcademyArticle[] = [
  {
    slug: "forgot-pin-reset-whatsapp-askbiz",
    title: "Forgot Your AskBiz PIN? Reset It Yourself via WhatsApp",
    description:
      "How to recover your own AskBiz sign-in PIN without contacting support — verify your phone over WhatsApp and set a new 4-digit PIN in under a minute.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 3,
    keywords: [
      "forgot PIN",
      "reset PIN",
      "AskBiz",
      "WhatsApp verification",
      "sign in",
      "phone login",
      "account recovery",
      "tutorial",
    ],
    keyTakeaways: [
      "Forgot PIN? on the sign-in page starts a self-service reset — enter your phone number, confirm a 6-digit code sent over WhatsApp, then set a new 4-digit PIN.",
      "The code expires after 10 minutes, allows 5 attempts, and there's a 60-second cooldown before you can request another one.",
      "This resets your own owner sign-in PIN for the main AskBiz app — it has nothing to do with POS staff till PINs, which a manager still resets from POS > Staff > Edit > Reset PIN.",
      "Before this shipped, a locked-out owner had no self-service option at all — the only path was contacting support and waiting for an admin to generate and relay a temporary PIN by hand.",
    ],
    content: [
      {
        heading: "Two different PINs, and this is about one of them",
        body: "AskBiz actually has two PINs that are easy to confuse. Your sign-in PIN is what you use to log into the main AskBiz app on your own phone number — it's how you (the account owner) get into your dashboard, reports, and settings. A POS staff till PIN is a completely separate thing: a short code a manager assigns to each cashier so they can clock into the till without sharing the owner's login. This article is about the first one — your own sign-in PIN. If a cashier has forgotten their till PIN, that's fixed by a manager or owner going to POS > Staff, clicking Edit next to their name, and choosing Reset PIN — nothing about that process has changed. What's new is a way for you to recover your own sign-in PIN without anyone else's help."
      },
      {
        heading: "Where to find it",
        body: "On the AskBiz sign-in page, look just below the PIN field for a Forgot PIN? link. Clicking it takes you to a dedicated recovery page at askbiz.co/forgot-pin, separate from the main sign-in card, built as a narrow, single-purpose screen so it's obvious you're in a recovery flow rather than signing in normally."
      },
      {
        heading: "Step 1: Confirm your phone number",
        body: "Enter the phone number registered to your AskBiz account, including the correct country code — the same number you normally sign in with. Tap Send code via WhatsApp. Whatever number you enter, you'll see the same confirmation message next: AskBiz never reveals on this screen whether that number actually belongs to an account. That's deliberate — it stops the reset flow from being used as a way to check which phone numbers are registered to AskBiz. If the number does belong to an account, a 6-digit code arrives on WhatsApp within moments."
      },
      {
        heading: "Step 2: Enter the code and choose a new PIN",
        body: "On the next screen, enter the 6-digit code from WhatsApp along with a new 4-digit PIN, typed twice to confirm it matches. Submit, and — assuming the code is correct and still valid — your sign-in PIN is updated immediately. You're taken to a confirmation screen with a link straight back to sign in, where your new PIN works right away."
      },
      {
        heading: "The limits, and why they're there",
        body: "A few limits protect this flow from abuse. The code expires 10 minutes after it's sent, so an old, unused code sitting in a WhatsApp thread can't be used later. You get 5 attempts to enter it correctly before it's invalidated and you have to request a fresh one. And if you tap Resend code, there's a 60-second cooldown before another one will actually go out, which stops the same number from being flooded with codes. None of this should get in your way during a normal reset — enter the code once, correctly, within a few minutes of it arriving, and you're done. The limits only bite if something's gone wrong, which is exactly when you want them to."
      },
      {
        heading: "How AskBiz matches your phone number to your account",
        body: "Behind the scenes, AskBiz looks up your phone number in a dedicated table built specifically for this purpose, rather than relying on the phone number stored in your general profile settings. That distinction matters: your profile's phone field is just an editable settings value — you could update it at any time, and nothing stops two people from entering a similar-looking number by mistake. The reset flow needs an unambiguous, reliable link between a phone number and exactly one account before it will let anyone change a PIN, so it uses a separate identity record instead, set up when you first sign up and kept in sync from there."
      },
      {
        heading: "What recovery looked like before this existed",
        body: "Until late July 2026, there was no self-service option at all. If you forgot your AskBiz sign-in PIN, the only path was to contact support directly — by email or WhatsApp — explain who you were, and wait for an admin on the AskBiz side to manually generate a temporary PIN and relay it back to you out of band. That worked, but it meant every single lockout needed a human on the other end, and you were stuck waiting however long it took someone to pick it up. The WhatsApp-verified flow does the same job in under a minute, any time, without anyone else needing to be involved."
      },
    ],
    relatedSlugs: [],
    faq: [
      {
        q: "Is this the same as resetting a cashier's till PIN?",
        a: "No. This resets your own owner sign-in PIN for the main AskBiz app. A cashier's POS till PIN is a separate system entirely, and it's still reset the same way it always was — a manager or owner goes to POS > Staff, clicks Edit next to that staff member, and chooses Reset PIN."
      },
      {
        q: "I entered my phone number but never got a WhatsApp code. What's wrong?",
        a: "You'll see the same 'check WhatsApp' confirmation regardless of whether that number is actually registered — that's intentional, so the page can't be used to check which numbers have accounts. If nothing arrives, double check you entered the exact number your account is registered with, including the country code, and try again after the 60-second cooldown."
      },
      {
        q: "How long do I have to enter the code before it expires?",
        a: "10 minutes from when it's sent. After that it's no longer valid and you'll need to request a new one from the previous screen."
      },
      {
        q: "What happens if I keep entering the wrong code?",
        a: "You get 5 attempts. After that, the code is invalidated for security and you'll need to request a fresh one rather than keep guessing."
      },
      {
        q: "Can I request another code right away if I didn't get the first one?",
        a: "There's a 60-second cooldown between code requests for the same number. After that window, tap Resend code on the verification screen to get a new one."
      },
    ],
  },
];
