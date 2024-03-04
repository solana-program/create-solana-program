import { RenderContext } from "./getRenderContext";
import { titleCase } from "./strings";

export function generateReadme(ctx: RenderContext): string {
  return `# ${titleCase(ctx.programName)}

TODO

\`\`\`sh
${ctx.getCommand("programs:build")}
${ctx.getCommand("programs:test")}
${ctx.getCommand("programs:format")}
${ctx.getCommand("programs:lint")}
\`\`\`

TODO`;
}
