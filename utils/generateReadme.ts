import { RenderContext } from "./getRenderContext";
import { titleCase } from "./strings";

export function generateReadme(ctx: RenderContext): string {
  return `# ${titleCase(ctx.programName)}

TODO

\`\`\`sh
${ctx.getCommand("run", "programs:build")}
${ctx.getCommand("run", "programs:test")}
${ctx.getCommand("run", "programs:format")}
${ctx.getCommand("run", "programs:lint")}
\`\`\`

TODO`;
}
