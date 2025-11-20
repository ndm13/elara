import config from "../config.json" with {type: 'json'};
import scenario from "../queries/scenario.graphql" with {type: 'text'};
import adventure from "../queries/adventure.graphql" with {type: 'text'};
import profile from "../queries/profile.graphql" with {type: 'text'};
import storyCardsScenario from "../queries/storyCards/scenario.graphql" with {type: 'text'};
import storyCardsAdventure from "../queries/storyCards/adventure.graphql" with {type: 'text'};
import verifyAdventureState from "../queries/verify/adventureState.graphql" with {type: 'text'};
import verifyStoryCards from "../queries/verify/storyCards.graphql" with {type: 'text'};
import advancedScenario from "../queries/advanced/scenario.graphql" with {type: 'text'};
import log from "./logger.ts";

export class AIDungeonAPI {
    private _token: string;
    private _refresh: string;
    private _expires: number;
    public get isExpired() {
        return this._expires < Date.now();
    }
    private readonly _guest: boolean;

    constructor(
        credentials: IdentityKitCredentials,
        generated: number,
        guest = false,
    ) {
        this._token = credentials.idToken;
        this._refresh = credentials.refreshToken;
        this._expires = generated +
            (Number.parseInt(credentials.expiresIn) * 1000);
        this._guest = guest;
    }

    async query<T extends Record<string, unknown>>(gql: GraphQLQuery): Promise<GraphQLResponse<string, T>> {
        try {
            await this.keepTokenAlive();
        } catch (error) {
            throw AIDungeonAPIError.onRequest("Error refreshing token", gql, error);
        }
        try {
            return await (await fetch(config.client.gqlEndpoint, {
                "credentials": "include",
                "headers": {
                    "User-Agent": config.client.userAgent,
                    "Accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "x-gql-operation-name": gql.operationName,
                    "authorization": `firebase ${this._token}`,
                    "Priority": "u=4",
                },
                "referrer": config.client.origin,
                "body": JSON.stringify({
                    "operationName": gql.operationName,
                    "variables": gql.variables,
                    "query": gql.query,
                }),
                "method": "POST",
            })).json();
        } catch (error) {
            throw AIDungeonAPIError.onRequest("Error running GraphQL query", gql, error);
        }
    }

    async getVerifyAdventureState(shortId: string): Promise<VerifyAdventureStateData> {
        const query = {
            operationName: "AdventureState",
            variables: {"shortId": shortId},
            query: verifyAdventureState
        };
        return AIDungeonAPI.validateResponse(query, await this.query<VerifyAdventureStateData>(query), shortId, 'adventureState')
    }

    async getVerifyStoryCards(shortId: string): Promise<VerifyStoryCardsData> {
        const query = {
            operationName: "AdventureState",
            variables: {
                "shortId": shortId
            },
            query: verifyStoryCards
        };
        return AIDungeonAPI.validateResponse(query, await this.query<VerifyStoryCardsData>(query), shortId, 'adventureState')
    }

    async getStoryCardsScenario(shortId: string): Promise<StoryCardsData> {
        const query = {
            operationName: "Scenario",
            variables: {
                "shortId": shortId
            },
            query: storyCardsScenario
        };
        return AIDungeonAPI.validateResponse(query, await this.query<StoryCardsData>(query), shortId, 'scenario')
    }

    async getStoryCardsAdventure(shortId: string): Promise<StoryCardsData> {
        const query = {
            operationName: "Adventure",
            variables: {
                "shortId": shortId
            },
            query: storyCardsAdventure
        };
        return AIDungeonAPI.validateResponse(query, await this.query<StoryCardsData>(query), shortId, 'adventure')
    }

    async getAdvancedScenario(shortId: string): Promise<AdvancedScenarioData> {
        const query = {
            operationName: "Scenario",
            variables: {
                "shortId": shortId
            },
            query: advancedScenario
        };
        return AIDungeonAPI.validateResponse(query, await this.query<AdvancedScenarioData>(query), shortId, 'scenario')
    }

    async getScenario(shortId: string): ScenarioData {
        const query = {
            operationName: "GetScenario",
            variables: {"shortId": shortId},
            query: scenario,
        };
        return AIDungeonAPI.validateResponse(query, await this.query<ScenarioData>(query), shortId, 'scenario');
    }

    async getAdventure(shortId: string): AdventureData {
        const query = {
            operationName: "GetAdventure",
            variables: {"shortId": shortId},
            query: adventure
        };
        return AIDungeonAPI.validateResponse(query, await this.query<AdventureData>(query), shortId, 'adventure');
    }

    async getUser(username: string): UserData {
        const query = {
            operationName: "ProfileScreenGetUser",
            variables: {"username": username},
            query: profile
        };
        return AIDungeonAPI.validateResponse(query, await this.query<UserData>(query), username, 'user');
    }

    private async keepTokenAlive() {
        if (this.isExpired) {
            // Already expired: generate a new token if guest, otherwise error out
            if (this._guest) {
                const replace = await AIDungeonAPI.getNewGuestToken();
                this._token = replace.idToken;
                this._refresh = replace.refreshToken;
                this._expires = Date.now() + (Number.parseInt(replace.expiresIn) * 1000);
                log.debug(`Created new user token (valid until ${new Date(this._expires)})`);
            } else {
                this._token = "";
                throw new Error("Non-guest API token expired, unable to refresh token");
            }
        } else if (this._expires - Date.now() < 300000) {
            // Less than five minutes left, refresh
            const refresh = await this.refreshToken();
            const now = Date.now();
            this._token = refresh.id_token;
            this._refresh = refresh.refresh_token;
            this._expires = now + (Number.parseInt(refresh.expires_in) * 1000);
            log.debug(`Refreshed user token (valid until ${new Date(this._expires)})`);
        }
    }

    private async refreshToken() {
        return await (await fetch(
            "https://securetoken.googleapis.com/v1/token?key=" +
            config.firebase.identityToolkitKey,
            {
                "headers": {
                    "User-Agent": config.client.userAgent,
                    "Origin": config.client.origin,
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "X-Client-Version": config.firebase.clientVersion,
                    "X-Firebase-Client": config.firebase.clientToken,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                "body": `grant_type=refresh_token&refresh_token=${this._refresh}`,
                "method": "POST",
            },
        )).json() as Promise<RefreshTokenResponse>;
    }

    static async guest() {
        return new AIDungeonAPI(await AIDungeonAPI.getNewGuestToken(), Date.now(), true);
    }

    private static async getNewGuestToken() {
        return await (await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            config.firebase.identityToolkitKey,
            {
                "credentials": "omit",
                "headers": {
                    "User-Agent": config.client.userAgent,
                    "Origin": config.client.origin,
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "X-Client-Version": config.firebase.clientVersion,
                    "X-Firebase-Client": config.firebase.clientToken,
                    "Content-Type": "application/json",
                },
                "body": '{"returnSecureToken":true}',
                "method": "POST",
            },
        )).json() as Promise<IdentityKitCredentials>;
    }

    private static validateResponse<K extends string, T>(
        query: GraphQLQuery, response: { data?: Record<K, T> }, id: string, key: K
    ): T {
        const output = response?.data?.[key];
        if (!output)
            throw AIDungeonAPIError.onUnpack(`Couldn't find ${key} with id ${id}`, query, response);

        return output;
    }
}

export class AIDungeonAPIError extends Error {
    readonly query: GraphQLQuery;
    readonly response?: GraphQLResponse<string, any>;

    private constructor(message: string, query: GraphQLQuery, response?: GraphQLResponse<string, any>) {
        super(message);
        this.name = "AIDungeonAPIError";
        this.query = query;
        this.response = response;
    }

    static onUnpack(message: string, query: GraphQLQuery, response: GraphQLResponse<string, any>) {
        return new AIDungeonAPIError(message, query, response);
    }

    static onRequest(message: string, query: GraphQLQuery, cause: any) {
        const error = new AIDungeonAPIError(message, query, undefined);
        error.cause = cause;
        return error;
    }
}

export type IdentityKitCredentials = {
    kind: string;
    idToken: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
};

export type RefreshTokenResponse = {
    expires_in: string;
    token_type: string;
    refresh_token: string;
    id_token: string;
    user_id: string;
    project_id: string;
};

export type GraphQLQuery = {
    operationName: string;
    variables: Record<string, any>;
    query: string;
};

export type GraphQLResponse<K extends string, T> = {
    data?: Record<K, T>,
    errors?: {
        message: string,
        extensions: Record<string, any>
    }[]
};

export type ContentRating = "Everyone" | "Teen" | "Mature" | "Unrated";

export type ScenarioData = {
    createdAt: string,
    editedAt: string | null,
    title: string,
    description: string | null,
    prompt: string | null,
    published: boolean,
    unlisted: boolean,
    publishedAt: string | null,
    commentCount: number,
    voteCount: number,
    saveCount: number,
    storyCardCount: number,
    tags: string[],
    adventuresPlayed: number,
    thirdPerson: boolean,
    nsfw: boolean | null,
    contentRating: ContentRating,
    contentRatingLockedAt: string | null,
    deletedAt: string | null,
    blockedAt: string | null,
    image: string,
    contentResponses: {
        isSaved: boolean,
        isDisliked: boolean
    },
    user: {
        isMember: boolean,
        profile: {
            title: string,
            thumbImageUrl: string
        }
    }
};

export type AdventureData = {
    createdAt: string,
    editedAt: string | null,
    title: string,
    description: string | null,
    actionCount: number,
    published: boolean,
    unlisted: boolean,
    commentCount: number,
    voteCount: number,
    saveCount: number,
    storyCardCount: number,
    thirdPerson: boolean,
    nsfw: boolean | null,
    contentRating: ContentRating,
    contentRatingLockedAt: string | null,
    tags: string[],
    publishedAt: string | null,
    deletedAt: string | null,
    blockedAt: string | null,
    userId: string,
    image: string,
    playerCount: number,
    scenario: {
        title: string,
        published: true,
        deletedAt: string | null
    },
    user: {
        isMember: boolean,
        profile: {
            title: string,
            thumbImageUrl: string
        }
    }
};

export type UserData = {
    isMember: boolean,
    profile: {
        thumbImageUrl: string,
        title: string,
        description: string
    },
    followingCount: number,
    friendCount: number,
    followersCount: number
};

export type VerifyAdventureStateData = {
    storyCardCount: number,
    scenarioId: string,
    playerCount: number
};

export type VerifyStoryCardsData = {
    storyCards: {
        value: string
    }[],
    user: {
        profile: {
            title: string,
            thumbImageUrl: string
        }
    }
};

export type StoryCardsData = {
    storyCards: {
        keys: string,
        title: string,
        type: string,
        value: string,
        description: string,
        useForCharacterCreation: boolean
    }[]
}

export type AdvancedScenarioData = {
    gameCodeOnInput: string,
    gameCodeOnModelContext: string,
    gameCodeOnOutput: string,
    gameCodeSharedLibrary: string,
    options: {
        shortId: string,
        title: string,
        parentScenario: {
            shortId: string
        }
    },
    state: {
        instructions: object,
        storyCardInstructions: string,
        storyCardStoryInformation: string,
        storySummary: string
    },
    memory: string,
    prompt: string,
    title: string
    storyCardCount: number
}