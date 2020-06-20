export interface Animator<Properties extends object> {
    calculate(progress: number): Properties;
    lasts?: boolean;
    name?: string;
}

export type calculator<Properties extends object> = (progress: number) => Properties;

export type animator<Properties extends object> = Animator<Properties> | calculator<Properties>;

export default animator;