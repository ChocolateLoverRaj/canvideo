import { Operations } from 'canvideo/lib/operations';
import { StateObj } from './getState';
interface Options {
    fps: number;
    width: number;
    height: number;
}
declare class Generator {
    videos: Map<number, StateObj<number>>;
    latestId: number;
    generatedDir: string;
    outputDir: string;
    tempDir: string;
    ready: Promise<unknown>;
    constructor(generatedDir: string);
    getVideoPath(id: string | number): string;
    generate(operations: Operations[][], options: Options): number;
}
export default Generator;
