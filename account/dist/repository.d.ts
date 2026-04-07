import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: ({
        emit: "event";
        level: "error";
    } | {
        emit: "event";
        level: "warn";
    })[];
}, "warn" | "error", import("@prisma/client/runtime/library").DefaultArgs>;
export { prisma };
//# sourceMappingURL=repository.d.ts.map