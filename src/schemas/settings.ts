export const SETTINGS_SCHEMA = {
  id: 'Settings',
  properties: {
    prefillCommitMessage: {
      properties: {
        disableOptionalMessages: {
          type: 'boolean',
        },
        forceLowerCase: {
          type: 'boolean',
        },
        ignoreFileExtension: {
          type: 'boolean',
        },
        replacePatternWith: {
          items: {
            properties: {
              pattern: {
                minLength: 1,
                type: 'string',
              },
              with: {
                type: 'string',
              },
            },
            type: 'object',
          },
          type: 'array',
        },
        withFileWorkspacePath: {
          type: 'boolean',
        },
        withGuessedAction: {
          type: 'boolean',
        },
        withGuessedCustomActions: {
          items: {
            properties: {
              action: {
                type: 'string',
              },
              pattern: {
                minLength: 1,
                type: 'string',
              },
              state: {
                enum: ['ADDED', 'DELETED', 'MODIFIED', 'RENAMED'],
              },
            },
            type: 'object',
          },
          type: 'array',
        },
      },
      type: 'object',
    },
  },
  type: 'object',
}
