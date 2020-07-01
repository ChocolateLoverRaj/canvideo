declare interface Text{
    start: number;
    end: number;
    text: string;
}

declare class Caption{
    static vttHeader: "WEBVTT\n";

    texts: Array<Text>;

    add(start: number, end: number, text: string): this;

    toVtt(includeHeader?: boolean, offset?: number): string;
}

export = Caption;