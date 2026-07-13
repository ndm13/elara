/**
 * Types for the various custom ID implementations.
 */
export type CustomIdAdvanced = {
  type: 'scenario' | 'adventure';
  id: string;
  published?: boolean;
};

export type CustomIdAdventureState = {
  type: 'scgen' | 'instructions' | 'memory' | 'authors-note' | 'summary' | 'game-state' | 'message';
  id: string;
};

export type CustomIdRead = {
  type: 'md' | 'plain' | 'html';
  actions: number;
  id: string;
};

export type CustomIdScenarioState = {
  type: 'scgen' | 'instructions' | 'memory' | 'authors-note' | 'prompt';
  id: string;
  published?: boolean;
};

export type CustomIdStoryCards = {
  type: 'scenario' | 'adventure';
  id: string;
};

export type CustomIdOpenProfile = {
  id: string;
};

export type CustomIdOpenScenario = {
  id: string;
};

export type CustomIdScripts = {
  id: string;
};

/**
 * Type-safe custom ID builder and parser utility for Discord components.
 */
export const customIdRouter = {
  advanced: {
    build: (type: 'scenario' | 'adventure', id: string, published?: boolean): string => {
      const suffix = published === true ? '_pub' : published === false ? '_unl' : '';
      return `advanced_${type}_${id}${suffix}`;
    },
    parse: (customId: string): CustomIdAdvanced | null => {
      const match = /^advanced_(?<type>[^_]+)_(?<id>.+?)(?:_(?<pub>pub|unl))?$/.exec(customId);
      if (!match || !match.groups) return null;
      return {
        type: match.groups.type as 'scenario' | 'adventure',
        id: match.groups.id,
        published: match.groups.pub === 'pub' ? true : match.groups.pub === 'unl' ? false : undefined
      };
    }
  },
  adventureState: {
    build: (type: CustomIdAdventureState['type'], id: string): string => 
      `adventure_state_${type}_${id}`,
    parse: (customId: string): CustomIdAdventureState | null => {
      const match = /^adventure_state_(?<type>[^_]+)_(?<id>.*)$/.exec(customId);
      if (!match) return null;
      return {
        type: match.groups!.type as CustomIdAdventureState['type'],
        id: match.groups!.id,
      };
    }
  },
  read: {
    build: (type: CustomIdRead['type'], actions: number, id: string): string => `read_${type}_${actions}_${id}`,
    parse: (customId: string): CustomIdRead | null => {
      const match = /^read_(?<type>[^_]+)_(?<actions>[^_]+)_(?<id>.*)$/.exec(customId);
      if (!match) return null;
      return {
        type: match.groups!.type as CustomIdRead['type'],
        actions: Number.parseInt(match.groups!.actions, 10),
        id: match.groups!.id,
      };
    }
  },
  scenarioState: {
    build: (type: CustomIdScenarioState['type'], id: string, published?: boolean): string => {
      const suffix = published === true ? '_pub' : published === false ? '_unl' : '';
      return `scenario_state_${type}_${id}${suffix}`;
    },
    parse: (customId: string): CustomIdScenarioState | null => {
      const match = /^scenario_state_(?<type>[^_]+)_(?<id>.+?)(?:_(?<pub>pub|unl))?$/.exec(customId);
      if (!match || !match.groups) return null;
      return {
        type: match.groups.type as CustomIdScenarioState['type'],
        id: match.groups.id,
        published: match.groups.pub === 'pub' ? true : match.groups.pub === 'unl' ? false : undefined
      };
    }
  },
  storyCards: {
    build: (type: CustomIdStoryCards['type'], id: string): string => `story_cards_${type}_${id}`,
    parse: (customId: string): CustomIdStoryCards | null => {
      const match = /^story_cards_(?<type>[^_]+)_(?<id>.*)$/.exec(customId);
      if (!match) return null;
      return {
        type: match.groups!.type as CustomIdStoryCards['type'],
        id: match.groups!.id,
      };
    }
  },
  openProfile: {
    build: (id: string): string => `open_profile_${id}`,
    parse: (customId: string): CustomIdOpenProfile | null => customId.startsWith('open_profile_') ? { id: customId.slice(13) } : null
  },
  openScenario: {
    build: (id: string): string => `open_scenario_${id}`,
    parse: (customId: string): CustomIdOpenScenario | null => customId.startsWith('open_scenario_') ? { id: customId.slice(14) } : null
  },
  scripts: {
    build: (id: string): string => `scripts_${id}`,
    parse: (customId: string): CustomIdScripts | null => customId.startsWith('scripts_') ? { id: customId.slice(8) } : null
  }
};
