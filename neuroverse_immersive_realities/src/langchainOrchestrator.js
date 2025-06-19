//
// langchainOrchestrator.js
//
// Acts as a LangChain-style "logic engine" for orchestrating multi-step simulation flows on the frontend.
//

// PUBLIC_INTERFACE
const STEP_TYPES = {
  INPUT: "INPUT",
  PROFILE_ANALYSIS: "PROFILE_ANALYSIS",
  API_GPT: "API_GPT",
  API_SD: "API_SD",
  BRANCH: "BRANCH",
  SIDE_EFFECT: "SIDE_EFFECT",
  FINALIZE: "FINALIZE"
};

// PUBLIC_INTERFACE
class ChainStep {
  constructor({ type, handler, next }) {
    this.type = type;
    this.handler = handler;
    this.next = next;
  }
}

// PUBLIC_INTERFACE
class ChainContext {
  constructor(initial) {
    Object.assign(this, initial);
  }
}

// PUBLIC_INTERFACE
async function runChain(steps, start, initialContext) {
  const context = new ChainContext(initialContext);
  let step = start;
  let counter = 0;
  while (step && steps[step]) {
    if (counter++ > 20) throw new Error("Too many steps in chain (cycle?)");
    const nextStep =
      typeof steps[step].next === "function"
        ? steps[step].next(context)
        : steps[step].next;
    await steps[step].handler(context);
    step = nextStep;
  }
  return context;
}

// PUBLIC_INTERFACE
function buildSimulationChain(api) {
  return {
    gather: new ChainStep({
      type: STEP_TYPES.INPUT,
      async handler(ctx) {
        ctx.log = (ctx.log || []).concat(
          "Gathered input and psychological profile."
        );
      },
      next: "analyze"
    }),
    analyze: new ChainStep({
      type: STEP_TYPES.PROFILE_ANALYSIS,
      async handler(ctx) {
        ctx.profileSummary = `MBTI: ${ctx.mbti}, Big5: ${Object.entries(ctx.big5)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ")}`;
        ctx.log = (ctx.log || []).concat(
          "Analyzed profile for simulation branching."
        );
      },
      next: "narrative"
    }),
    narrative: new ChainStep({
      type: STEP_TYPES.API_GPT,
      async handler: async (ctx) => {
        ctx.aiNarrative = await api.gptNarrative(
          ctx.prompt,
          ctx.profileSummary,
          ctx.metrics
        );
        ctx.log = (ctx.log || []).concat("Generated narrative using GPT-4o.");
      },
      next: "visual"
    }),
    visual: new ChainStep({
      type: STEP_TYPES.API_SD,
      async handler: async (ctx) => {
        ctx.visuals = await api.sdVisuals(
          ctx.prompt,
          ctx.profileSummary,
          ctx.metrics
        );
        ctx.log = (ctx.log || []).concat("Generated images using SD API.");
      },
      next: "finalize"
    }),
    finalize: new ChainStep({
      type: STEP_TYPES.FINALIZE,
      async handler(ctx) {
        ctx.log = (ctx.log || []).concat("Simulation finalized.");
      },
      next: null
    })
  };
}

export { ChainStep, ChainContext, runChain, STEP_TYPES, buildSimulationChain }
