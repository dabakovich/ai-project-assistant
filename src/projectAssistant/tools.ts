import { ChatCompletionTool, FunctionDefinition } from 'openai/resources';
import { EChangeType, FunctionName } from './enums';

const readFolder: FunctionDefinition = {
  name: FunctionName.readFolder,
  description: 'Get a list of files/folders in the provided folder',
  parameters: {
    type: 'object',
    properties: {
      folderName: {
        type: 'string',
        description: 'Name of the folder to read, relative to the root directory',
      },
    },
  },
};

const createFolder: FunctionDefinition = {
  name: FunctionName.createFolder,
  description: 'Create a folder',
  parameters: {
    type: 'object',
    properties: {
      folderName: {
        type: 'string',
        description: 'Name of the folder to create',
      },
    },
  },
};

const readFile: FunctionDefinition = {
  name: FunctionName.readFile,
  description: 'Read file content. It returns file content as a string',
  parameters: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name of the file to read',
      },
      isWithRowNumbers: {
        type: 'boolean',
        description:
          'Should return file content with row numbers at the beginning. Use it when you need to update the file',
      },
    },
    required: ['fileName'],
  },
};

const createFile: FunctionDefinition = {
  name: FunctionName.createFile,
  description: 'Create a file',
  parameters: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name of the file to create',
      },
      content: {
        type: 'string',
        description: 'Content of the file to create',
      },
    },
  },
};

const editFile: FunctionDefinition = {
  name: FunctionName.editFile,
  description:
    'Edit file content. Note, you are replacing whole lines. ' +
    'Be as much precise as possible with startRow and endRow. ' +
    'If you want to `add` the `content`, it will be placed after `startRow` index. ' +
    'If you are making few changes in one file – keep original row numbers. ' +
    'Keep indentation and line breaks as they are in the original file.',
  parameters: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name of the file to edit',
      },
      changes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Type of the change',
              enum: [EChangeType.add, EChangeType.remove, EChangeType.replace],
            },
            startRow: {
              type: 'number',
              description: 'Start row of the change',
            },
            endRow: {
              type: 'number',
              description: 'End row of the change',
            },
            content: {
              type: 'string',
              description: 'New content of the change, is not required for `remove` type',
            },
          },
        },
      },
    },
  },
};

const rename: FunctionDefinition = {
  name: FunctionName.rename,
  description: 'Rename file or folder',
  parameters: {
    type: 'object',
    properties: {
      currentPath: {
        type: 'string',
        description: 'Current path of the file or folder',
      },
      newPath: {
        type: 'string',
        description: 'New path of the file or folder',
      },
    },
  },
};

const remove: FunctionDefinition = {
  name: FunctionName.remove,
  description: 'Remove file or folder. Be careful, it cannot be undone',
  parameters: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the file or folder',
      },
    },
  },
};

const exec: FunctionDefinition = {
  name: FunctionName.exec,
  description:
    'Allows to run a command in terminal (for running scripts, installing packages etc). ' +
    'Use project package manager if you are installing some libraries or running some scripts. ' +
    'If you are installing some packages or running scripts, use `--silent` flag to hide unnecessary output where it possible',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'Command to execute',
      },
    },
    required: ['command'],
  },
};

const getGitDiff: FunctionDefinition = {
  name: FunctionName.getGitDiff,
  description: 'Get git diff of the current folder',
};

const print: FunctionDefinition = {
  name: FunctionName.print,
  description:
    'Show some information to the user. Should be used when you need to call some another function but you want to show some information to the user in parallel. Should not be used for the final response.',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Message to show to the user',
      },
    },
  },
};

const GPT_FUNCTION_DEFINITIONS: FunctionDefinition[] = [
  readFolder,
  createFolder,

  readFile,
  createFile,
  editFile,

  rename,
  remove,

  exec,

  getGitDiff,

  print,
];

export const GPT_TOOLS: ChatCompletionTool[] = GPT_FUNCTION_DEFINITIONS.map(
  (functionDefinition) => ({
    type: 'function',
    function: functionDefinition,
  }),
);
