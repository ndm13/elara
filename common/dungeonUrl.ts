export interface ParsedDungeonUrl {
  type: 'scenario' | 'adventure' | 'profile';
  id: string;
  path: string;
  hostname: string;
  published?: boolean;
}

/**
 * Parses an AI Dungeon URL into type, ID, relative path segments, and hostname.
 * Supports any hostname (including proxies like *.axdungeon.com or self-hosted proxies).
 */
export function parseDungeonUrl(urlString: string): ParsedDungeonUrl | null {
  try {
    const url = new URL(urlString.trim());
    const matches = /\/(((?<type>scenario|adventure)\/(?<id>[\w-]+)\/.+)|((?<type>profile)\/(?<id>[\w-]+)))/.exec(url.pathname);
    if (!matches || !matches.groups) return null;
    
    let published: boolean | undefined = undefined;
    if (url.searchParams.get("published") === "true") {
      published = true;
    } else if (url.searchParams.get("unlisted") === "true") {
      published = false;
    }

    return {
      type: matches.groups.type as 'scenario' | 'adventure' | 'profile',
      id: matches.groups.id,
      path: url.pathname + url.search,
      hostname: url.hostname.toLowerCase(),
      published
    };
  } catch {
    return null;
  }
}

/**
 * Extracts the first valid AI Dungeon URL found in the text and returns it along with parsed details.
 */
export function extractDungeonUrlFromText(text: string): { url: string; parsed: ParsedDungeonUrl } | null {
  // Matches a link starting with http/https pointing to scenario, adventure, or profile
  const matches = /(https?:\/\/[\w.-]+\/(?:(?:scenario|adventure)\/[\w-]+\/[^?\s]+|profile\/[\w-]+)(?:\?[^\s)]*)?)/.exec(text);
  if (!matches) return null;
  
  const urlString = matches[1];
  const parsed = parseDungeonUrl(urlString);
  return parsed ? { url: urlString, parsed } : null;
}
