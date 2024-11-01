import figlet from 'figlet';
import { instagram } from 'gradient-string';
import figures from 'figures';
import chalk from 'chalk';
import createClickableLink from './clickableLink.js';

const figletConfig = {
  font: 'ANSI Shadow',
  horizontalLayout: 'fitted',
  verticalLayout: 'default',
  width: 200,
  whitespaceBreak: true,
};

// Function to create a border around the text
const createBorder = (text) => {
  const borderChar = figures.squareSmallFilled; // You can change this character to any other, like '-', '=', etc.
  const borderLine = borderChar.repeat(text[0].length + 4); // Adjust for padding
  return [
    borderLine,
    ...text.map((line) => `${borderChar} ${line} ${borderChar}`),
    borderLine,
  ];
};

export default async function welcome() {
  return new Promise((resolve) => {
    // Create ASCII text with figlet
    figlet.text('CNCA', figletConfig, (err, data) => {
      if (err) {
        return;
      }

      // Split the ASCII art into lines
      const lines = data.split('\n');
      lines.splice(lines.length - 1, 1);
      // Create the bordered version
      const borderedLines = createBorder(lines);
      // Print the bordered ASCII art
      borderedLines.forEach((line) => {
        console.log(instagram(line));
      });

      console.log(
        chalk.bold.hex('#34ace0')(
          `\n${figures.star} Welcome to Create Next Custom App by ${createClickableLink('https://www.mntcodes.com', 'mntcodes.com')}`
        )
      );
      console.log(
        chalk
          .hex('#ffb142')
          .bold(
            `Let's supercharge your Next.js project with custom configs and powerful tools!\n`
          )
      );
    });
    resolve();
  });
}
