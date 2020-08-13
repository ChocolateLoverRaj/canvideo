import ExportTask from "./export-task";

export declare enum ExportStages {
    START = "START",
    CREATE_FILES = "CREATE_FILES",
    GENERATE_VIDEO = "GENERATE_VIDEO",
    DELETE_TEMPORARY = "DELETE_FRAMES",
    FINISH = "FINISH"
}

export declare namespace ExportTasks {
    const CHECK_TEMP_PATH: ExportTask;
    const DELETE_EXTRA_FRAMES: ExportTask;
    const RENDER_NEW_FRAMES: ExportTask;
    const GENERATE_SEPARATE_CAPTIONS: ExportTask;
    const GENERATE_EMBEDDED_CAPTIONS: ExportTask;
    const GENERATE_VIDEO: ExportTask;
    const DELETE_FRAMES: ExportTask;
    const DELETE_CAPTIONS: ExportTask;
}