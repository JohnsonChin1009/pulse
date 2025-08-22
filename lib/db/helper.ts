// helper.ts
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { AnyPgTable, AnyPgColumn } from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { eq } from "drizzle-orm";

type ListOpts = {
  where?: SQL;
  orderBy?: SQL | SQL[];
  limit?: number;
  offset?: number;
};

export function makeCrud<TTable extends AnyPgTable, TIdCol extends AnyPgColumn>(
  db: NodePgDatabase, // keep db un-parameterized for widest compatibility
  table: TTable,
  idColumn: TIdCol,
) {
  type Insert = InferInsertModel<TTable>;
  type Row = InferSelectModel<TTable>;

  return {
    async create(values: Insert): Promise<Row> {
      const [row] = await db
        .insert(table)
        .values(values as any)
        .returning();
      return row as Row;
    },

    async getById(id: string | number): Promise<Row | null> {
      const [row] = await db
        .select()
        .from(table as unknown as AnyPgTable)
        .where(eq(idColumn as unknown as AnyPgColumn, id as any)) // keep operands compatible (uuid/number)
        .limit(1);

      return (row ?? null) as Row | null;
    },

    async update(
      id: string | number,
      values: Partial<Insert>,
    ): Promise<Row | null> {
      const [row] = await db
        .update(table)
        .set(values as any)
        .where(eq(idColumn as unknown as AnyPgColumn, id as any))
        .returning();
      return (row ?? null) as Row | null;
    },

    async remove(id: string | number): Promise<Row | null> {
      const [row] = await db
        .delete(table)
        .where(eq(idColumn as unknown as AnyPgColumn, id as any))
        .returning();
      return (row ?? null) as Row | null;
    },
  };
}
