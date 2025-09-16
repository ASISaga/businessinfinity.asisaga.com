/**
 * Animation data extracted from animation.md
 * Contains narration, visual direction, and on-screen text for each event
 */

export const AnimationData = {
  events: [
    {
      // Event 1 — Opening Reality Check
      title: "Opening Reality Check",
      narration: "You've built something rare — a business born from your vision, your grit, your relationships. But right now… it runs on you.",
      onScreenText: [
        { text: "Your Vision. Your Grit. Your Relationships.", type: "emphasis" },
        { text: "But right now… it runs on YOU.", type: "highlight" }
      ],
      visualDirection: "Dim, desaturated palette. Founder at cluttered desk, phone buzzing, multiple disconnected dashboards floating like islands. Papers swirl in slow motion. Clock hands spin faster, casting long shadows.",
      motionCues: ["slow dolly-in on founder", "subtle parallax on floating screens"],
      colors: {
        primary: "#2c3e50",
        secondary: "#34495e",
        accent: "#e74c3c"
      }
    },
    {
      // Event 2 — The Pain Points
      title: "The Pain Points",
      narration: "Every major deal, partnership, and decision depends on you being in the room. Your instincts, your network, your way of doing business — they're the engine. And that means growth is capped by your personal bandwidth.",
      onScreenText: [
        { text: "Every deal. Every decision. Every approval.", type: "highlight" },
        { text: "Bottlenecked by you.", type: "emphasis" }
      ],
      visualDirection: "Glowing relationship threads all tied to founder, pulling taut. Puzzle pieces (representing tools) rotate but never fit together.",
      motionCues: ["quick snap zooms between vignettes", "threads vibrate under strain"],
      colors: {
        primary: "#c0392b",
        secondary: "#e74c3c",
        accent: "#f39c12"
      }
    },
    {
      // Event 3 — The Default Future
      title: "The Default Future",
      narration: "You already know the default future if nothing changes. The cracks you're patching today become tomorrow's bottlenecks. Opportunities pass to faster movers. Your best people burn out. And when you step back — the next generation inherits a name… not a living, evolving business.",
      onScreenText: [
        { text: "Today's cracks → Tomorrow's bottlenecks", type: "emphasis" },
        { text: "Opportunities lost. People burned out. Legacy at risk.", type: "highlight" }
      ],
      visualDirection: "Calendar pages flip into dust. Cracks widen in the ground. Competitor ships sail ahead while your boat is chained in place. Team silhouettes fade away.",
      motionCues: ["pull-back shot revealing widening cracks", "dissolve effect for fading team"],
      colors: {
        primary: "#7f8c8d",
        secondary: "#95a5a6",
        accent: "#e67e22"
      }
    },
    {
      // Event 4 — The Doorway Moment
      title: "The Doorway Moment",
      narration: "But there's another path. Business Infinity is your invitation into a new future — one that starts the moment you step in.",
      onScreenText: [
        { text: "There's another path.", type: "highlight" },
        { text: "An invitation into a new future.", type: "emphasis" }
      ],
      visualDirection: "Scene darkens, single glowing doorway appears. Warm light spills out, carrying faint outlines of gears, data streams, and Agent silhouettes. Founder turns toward it.",
      motionCues: ["slow push-in on doorway", "light burst wipe to next scene"],
      colors: {
        primary: "#2980b9",
        secondary: "#3498db",
        accent: "#f1c40f"
      }
    },
    {
      // Event 5 — The Boardroom Reveal
      title: "The Boardroom Reveal",
      narration: "A 24/7, real‑time, self‑evolving Boardroom of Agents — each with the mastery of legends in their domain — steered by your vision, plugged into your tools, acting in perfect alignment with your priorities.",
      onScreenText: [
        { text: "24/7. Real‑time. Self‑evolving.", type: "highlight" },
        { text: "Mastery of legends. Steered by your vision.", type: "emphasis" }
      ],
      visualDirection: "Founder steps through door — scene bursts into vibrant colour. 360° orbit around round table of luminous Agents. Data streams flow into a glowing core.",
      motionCues: ["orbit camera move", "agent icons pulse in sync with narration"],
      colors: {
        primary: "#8e44ad",
        secondary: "#9b59b6",
        accent: "#1abc9c"
      }
    },
    {
      // Event 6 — Day One in Action
      title: "Day One in Action",
      narration: "Your network, your instincts, your leadership DNA — captured, codified, and made operational. So the business can move at the speed of opportunity, scale without breaking, and carry your vision forward — not just for the next quarter, but for the next generation.",
      onScreenText: [
        { text: "Your network. Your instincts. Your DNA.", type: "highlight" },
        { text: "Captured. Codified. Operational.", type: "emphasis" }
      ],
      visualDirection: "Split‑screen: Marketing Agent launches campaign — ripples spread across map. Finance Agent adjusts forecasts — numbers shift instantly. Product Agent moves roadmap tiles into place. Partnership Agent weaves glowing threads between markets.",
      motionCues: ["smooth tracking shots following data flows from action to result", "ripple transitions"],
      colors: {
        primary: "#27ae60",
        secondary: "#2ecc71",
        accent: "#f39c12"
      }
    },
    {
      // Event 7 — Six Months Later
      title: "Six Months Later",
      narration: "Your team moves at the speed of opportunity, not the speed of approval. Your network is now an operational asset. Scaling feels like turning a dial, not rebuilding the machine.",
      onScreenText: [
        { text: "Speed of opportunity.", type: "highlight" },
        { text: "Scaling without breaking.", type: "emphasis" }
      ],
      visualDirection: "Map expands with new markets lighting up. Charts rise smoothly. Team members collaborate confidently.",
      motionCues: ["map zoom‑out", "organic growth animation for charts"],
      colors: {
        primary: "#16a085",
        secondary: "#1abc9c",
        accent: "#f1c40f"
      }
    },
    {
      // Event 8 — Two Years Later
      title: "Two Years Later",
      narration: "Your leadership DNA is embedded in a living, self‑evolving enterprise brain. The next generation inherits not just a brand — but a system that carries your vision forward and keeps evolving it.",
      onScreenText: [
        { text: "Your vision, embedded.", type: "highlight" },
        { text: "A system that evolves with you.", type: "emphasis" }
      ],
      visualDirection: "Founder stands beside next‑generation leaders at the Boardroom table. Table glows and subtly shifts shape to show evolution. Horizon opens to vast, bright future.",
      motionCues: ["slow pan across leaders", "lens‑flare horizon expansion"],
      colors: {
        primary: "#2980b9",
        secondary: "#3498db",
        accent: "#ecf0f1"
      }
    },
    {
      // Event 9 — Closing Invitation
      title: "Closing Invitation",
      narration: "The door is open. On one side is the default future. On the other is the future you imagined when you started. Business Infinity is the step between them.",
      onScreenText: [
        { text: "The door is open.", type: "highlight" },
        { text: "Business Infinity is the step between them.", type: "emphasis" }
      ],
      visualDirection: "Doorway wide open, light spilling into the world. Founder and Agents silhouetted against infinite horizon. Light expands to fill frame — fade to logo.",
      motionCues: ["light pulse synced to final line", "fade to brand lock‑up"],
      colors: {
        primary: "#f39c12",
        secondary: "#f1c40f",
        accent: "#ecf0f1"
      }
    }
  ]
};