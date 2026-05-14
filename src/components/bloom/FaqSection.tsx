import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQS = [
  {
    q: "What is Bloom Routine?",
    a: "Bloom Routine is a cozy daily planner app and daily routine app that turns your tasks and habits into cute characters that bloom across a peaceful spring meadow.",
  },
  {
    q: "How do daily tasks work?",
    a: "Add a task and it becomes a little friend in your garden. Tap to complete it — you earn XP and coins, and the character blooms into a flower so your day feels visibly finished.",
  },
  {
    q: "Can I track habits and a daily routine?",
    a: "Yes. Recurring tasks act like habits — replant them each day to build a calm daily routine. The garden fills up the more consistent you are, with no streak guilt.",
  },
  {
    q: "What is the daily summary?",
    a: "Each evening you can open Today to reflect on what bloomed, log a quick mood and journal entry, and close the day. It's a gentle wrap-up instead of an endless to-do list.",
  },
  {
    q: "Is Bloom Routine free?",
    a: "Yes — the core daily planner, habit tracking, and daily summary are free to use in your browser. Sign in to sync your garden across devices.",
  },
];

export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-20 pt-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl px-5 py-6 sm:px-7 sm:py-8"
      >
        <p className="font-display text-xs uppercase tracking-[0.2em] text-foreground/50">
          Daily planner app · Daily routine app
        </p>
        <h2
          id="faq-heading"
          className="mt-2 font-display text-2xl sm:text-3xl text-foreground"
        >
          Cozy questions, gentle answers
        </h2>
        <p className="mt-1 text-sm text-foreground/70">
          Everything you might wonder about tasks, habits, and your daily summary.
        </p>

        <Accordion type="single" collapsible className="mt-5">
          {FAQS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-foreground/10">
              <AccordionTrigger className="text-left font-display text-base hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
