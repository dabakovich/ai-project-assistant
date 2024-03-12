import { ProjectAssistant } from './projectAssistant';

const projectPath = './';
// const projectPath = '/Users/dtabaka/projects/forbytes/guesty/mobile-app-v3';

const projectAssistant = new ProjectAssistant(projectPath);

const query = [
  /** Simple information retrieval */
  // 'What type of project is it?',
  // 'Is my src folder structure ok for this kind of project?',
  // 'What can you tell about file constants.ts that present in projectAssistant folder?',
  // 'What OpenAI API functions (tools) are you using in that project? What functions can we use additionally?',
  /** Simple edit */
  // 'Add console.debug to the `rename` method of fileSystem controller class.',
  // 'Add console.debug to the `rename` method of fileSystem controller class. After that somehow figure out to check that your new console.debug appears in the console. You can create a temp file and run that method in terminal to check if the console.debug appears. If it does not work, fix it.',
  /** Complex edit */
  // 'Add tests for `rename` method of fileSystem controller class (read it). After that run the test, if you made a mistake, fix it',
  /** Commit message */
  'Create me a commit message for current changes using Conventional Commits pattern.',
].join('\n');

projectAssistant.ask(query).then(console.log);
