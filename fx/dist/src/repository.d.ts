import { PrismaClient } from '../generated/prisma';
declare const prisma: PrismaClient<{
    log: ({
        emit: "event";
        level: "error";
    } | {
        emit: "event";
        level: "warn";
    })[];
}, "warn" | "error", import("../generated/prisma/runtime/library").DefaultArgs>;
export { prisma };
//# sourceMappingURL=repository.d.ts.map