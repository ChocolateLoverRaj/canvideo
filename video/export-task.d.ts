export default interface ExportTask {
    name: string;
    start: ExportStages;
    end: ExportStages;
}