"use client";

import { Social } from "./Social";

export function SocialsSection() {
  return (
    <section className="w-full pt-12 pb-24">
      <div className="relative flex flex-col sm:space-y-10">
        <Social link="https://twitter.com" social="Twitter" />
        <Social link="https://linkedin.com" social="Linkedin" />
        <Social link="https://instagram.com" social="Instagram" />
        <Social link="https://tiktok.com" social="Tiktok" theme="dark" />
        <Social link="https://facebook.com" social="Facebook" />
      </div>
    </section>
  );
}
