//
// langchainOrchestrator.js
//
// Acts as a LangChain-style "logic engine" for orchestrating multi-step simulation flows on the frontend.
//
// Usage: Import and use buildSimulationChain() and runChain() to connect prompt input, psychological profiling,
// and third-party APIs (GPT-4o, Stable Diffusion).
//

/**
 * PUBLIC_INTERFACE
 * Enumerable step types (extendable).
 */
const STEP_TYPES = {
  INPUT: "INPUT",
  PROFILE_ANALYSIS: "PROFILE_ANALYSIS",
  API_GPT: "API_GPT",
  API_SD: "API_SD",
  BRANCH: "BRANCH",
  SIDE_EFFECT: "SIDE_EFFECT",
  FINALIZE: "FINALIZE"
};

/**
 * PUBLIC_INTERFACE
 * Main interface for chain step definition.
 */
class ChainStep {
  constructor({ type, handler, next }) {
    this.type = type;
    this.handler = handler; // async (context) => { ... }
    this.next = next;       // string or function(context): string
  }
}

/**
 * PUBLIC_INTERFACE
 * Orchestrator state/context object.
 * Holds { prompt, profile, mbti, big5, metrics, apiResults, etc }.
 */
class ChainContext {
  constructor(initial) {
    Object.assign(this, initial);
    // { prompt, profile, mbti, big5, metrics, aiNarrative, visuals, ... }
  }
}

/**
 * PUBLIC_INTERFACE
 * Run the chain given steps and initial context; resolves when done.
 * - steps: { [stepName]: ChainStep }
 * - start: stepName
 * - initialContext: {}
 */
async function runChain(steps, start, initialContext) {
  const context = new ChainContext(initialContext);
  let step = start;
  let counter = 0;
  while (step && steps[step]) {
    if (counter++ > 20) throw new Error("Too many steps in chain (cycle?)");
    // Allow step.next to be a function of context
    const nextStep =
      typeof steps[step].next === "function"
        ? steps[step].next(context)
        : steps[step].next;
    await steps[step].handler(context);
    step = nextStep;
  }
  return context;
}

/**
 * PUBLIC_INTERFACE
 * Example chain builder for simulation flow.
 * Produces a chain for:
 *  - Gathering prompt + profile
 *  - Analyzing profile (MBTI/Big5)
 *  - Calling GPT-4o for narrative
 *  - Calling SD for visuals
 *  - Finalizing result
 *
 * Use your actual API calls in place of placeholders!
 */
function buildSimulationChain(api) {
  // api: { gptNarrative(prompt, profile), sdVisuals(prompt, profile) }
  return {
    // Step1: Collect/gather
    gather: new ChainStep({
      type: STEP_TYPES.INPUT,
      async handler(ctx) {
        // Prompt/profile are already present on ctx; could validate or mutate.
        ctx.log = (ctx.log || []).concat(
          "Gathered input and psychological profile."
        );
      },
      next: "analyze"
    }),
    // Step2: Analyze profile
    analyze: new ChainStep({
      type: STEP_TYPES.PROFILE_ANALYSIS,
      async handler(ctx) {
        // Optionally synthesize personality summary or branch.
        ctx.profileSummary = `MBTI: ${ctx.mbti}, Big5: ${Object.entries(ctx.big5)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ")}`;
        ctx.log = (ctx.log || []).concat(
          "Analyzed profile for simulation branching."
        );
      },
      next: "narrative"
    }),
    // Step3: Narration (GPT-4o)
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
    // Step4: Visual (Stable Diffusion)
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
    // Step5: Finish up
    finalize: new ChainStep({
      type: STEP_TYPES.FINALIZE,
      async handler: (ctx) => {
        ctx.log = (ctx.log || []).concat("Simulation finalized.");
      },
      next: null
    })
  };
}

export {
  ChainStep,
  ChainContext,
  runChain,
  STEP_TYPES,
  buildSimulationChain
};
