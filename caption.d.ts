declare interface Text{
    start: number;
    end: number;
    text: string;
}

declare type captionJson = Array<Text>;

declare class Caption{
    static vttHeader: "WEBVTT\n";

    static fromJson(json: string, parse?: true, throwErrors?: false): Caption | false;
    static fromJson(json: string, parse?: true, throwErrors: true): Caption;
    static fromJson(json: any, parse: false, throwErrors?: false): Caption | false;
    static fromJson(json: any, parse: false, throwErrors: true): Caption;

    texts: Array<Text>;

    add(start: number, end: number, text: string): this;

    toVtt(includeHeader?: boolean, offset?: number): string;

    toJson(stringify?: true): string;
    toJson(stringify: false): captionJson;
}

export = Caption;