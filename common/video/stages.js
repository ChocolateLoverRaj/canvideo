//Export enums
//The export process is split into stages.
//Each stage has some tasks that it depends on.
//After those tasks are done, it starts the tasks that depend on the stage to be done.

//Visualization

// START                 CREATE_FILES                     GENERATE_VIDEO       DELETE_TEMPORARY      FINISH
// | --> CHECK_TEMP_PATH |                                |                    |                     |
//                       | --> DELETE_EXTRA_FRAMES        |                    |                     |
//                       | --> RENDER_NEW_FRAMES          |                    |                     |
//                       | --> GENERATE_EMBEDDED_CAPTIONS |                    |                     |
//                                                        | --> GENERATE_VIDEO |                     |
//                                                                             | --> DELETE_FRAMES   |
//                                                                             | --> DELETE_CAPTIONS |
//                       | --> GENERATE_SEPARATE_CAPTIONS                                            |

//Export stages enum
export const ExportStages = {
    START: "START",
    CREATE_FILES: "CREATE_FILES",
    GENERATE_VIDEO: "GENERATE_VIDEO",
    DELETE_TEMPORARY: "DELETE_FRAMES",
    FINISH: "FINISH"
};

//Export tasks enum
export const ExportTasks = {
    CHECK_TEMP_PATH: {
        name: "CHECK_TEMP_PATH",
        start: ExportStages.START,
        end: ExportStages.CREATE_FILES
    },
    DELETE_EXTRA_FRAMES: {
        name: "DELETE_EXTRA_FRAMES",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    RENDER_NEW_FRAMES: {
        name: "RENDER_NEW_FRAMES",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    GENERATE_SEPARATE_CAPTIONS: {
        name: "GENERATE_SEPARATE_CAPTIONS",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.FINISH
    },
    GENERATE_EMBEDDED_CAPTIONS: {
        name: "GENERATE_EMBEDDED_CAPTIONS",
        start: ExportStages.CREATE_FILES,
        end: ExportStages.GENERATE_VIDEO
    },
    GENERATE_VIDEO: {
        name: "GENERATE_VIDEO",
        start: ExportStages.GENERATE_VIDEO,
        end: ExportStages.DELETE_TEMPORARY
    },
    DELETE_FRAMES: {
        name: "DELETE_FRAMES",
        start: ExportStages.DELETE_TEMPORARY,
        end: ExportStages.FINISH
    },
    DELETE_CAPTIONS: {
        name: "DELETE_CAPTIONS",
        start: ExportStages.DELETE_TEMPORARY,
        end: ExportStages.FINISH
    }
}