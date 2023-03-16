import { Log4brains, SearchAdrsFilters, AdrDtoStatus } from "@madm4ttus3r/l4bcore";
import type { AppConsole } from "@madm4ttus3r/l4bcli-common";

type Deps = {
  l4bInstance: Log4brains;
  appConsole: AppConsole;
};

export type ListCommandOpts = {
  statuses: string;
  raw: boolean;
};

export class ListCommand {
  private readonly l4bInstance: Log4brains;

  private readonly console: AppConsole;

  constructor({ l4bInstance, appConsole }: Deps) {
    this.l4bInstance = l4bInstance;
    this.console = appConsole;
  }

  async execute(opts: ListCommandOpts): Promise<void> {
    const filters: SearchAdrsFilters = {};
    if (opts.statuses) {
      filters.statuses = opts.statuses.split(",") as AdrDtoStatus[];
    }
    const adrs = await this.l4bInstance.searchAdrs(filters);
    const table = this.console.createTable({
      head: ["Slug", "Status", "Package", "Title"]
    });
    adrs.forEach((adr) => {
      table.push([
        adr.slug,
        adr.status.toUpperCase(),
        adr.package || "",
        adr.title || "Untitled"
      ]);
    });
    this.console.printTable(table, opts.raw);
  }
}
