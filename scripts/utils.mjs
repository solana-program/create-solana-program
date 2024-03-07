export const CLIENTS = ['js', 'rust'];
export const PROJECTS = {
  'counter-shank': ['counter', '--shank'],
};

export async function executeStep(title, fn) {
  try {
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    if (process.env.CI) {
      echo(chalk.blue('⠋') + ` ${capitalizedTitle}...`);
      await fn();
    } else {
      await spinner(`${capitalizedTitle}...`, fn);
    }
    echo(chalk.green('✔︎') + ` ${capitalizedTitle}.`);
  } catch (e) {
    echo(chalk.red('✘') + ` Failed to ${title}.\n`);
    echo(e);
    process.exit(1);
  }
}
