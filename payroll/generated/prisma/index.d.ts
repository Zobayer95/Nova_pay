
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model PayrollJob
 * 
 */
export type PayrollJob = $Result.DefaultSelection<Prisma.$PayrollJobPayload>
/**
 * Model PayrollItem
 * 
 */
export type PayrollItem = $Result.DefaultSelection<Prisma.$PayrollItemPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PayrollJobStatus: {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PAUSED: 'PAUSED'
};

export type PayrollJobStatus = (typeof PayrollJobStatus)[keyof typeof PayrollJobStatus]


export const PayrollItemStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type PayrollItemStatus = (typeof PayrollItemStatus)[keyof typeof PayrollItemStatus]

}

export type PayrollJobStatus = $Enums.PayrollJobStatus

export const PayrollJobStatus: typeof $Enums.PayrollJobStatus

export type PayrollItemStatus = $Enums.PayrollItemStatus

export const PayrollItemStatus: typeof $Enums.PayrollItemStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PayrollJobs
 * const payrollJobs = await prisma.payrollJob.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more PayrollJobs
   * const payrollJobs = await prisma.payrollJob.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.payrollJob`: Exposes CRUD operations for the **PayrollJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayrollJobs
    * const payrollJobs = await prisma.payrollJob.findMany()
    * ```
    */
  get payrollJob(): Prisma.PayrollJobDelegate<ExtArgs>;

  /**
   * `prisma.payrollItem`: Exposes CRUD operations for the **PayrollItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayrollItems
    * const payrollItems = await prisma.payrollItem.findMany()
    * ```
    */
  get payrollItem(): Prisma.PayrollItemDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    PayrollJob: 'PayrollJob',
    PayrollItem: 'PayrollItem'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "payrollJob" | "payrollItem"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PayrollJob: {
        payload: Prisma.$PayrollJobPayload<ExtArgs>
        fields: Prisma.PayrollJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayrollJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayrollJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>
          }
          findFirst: {
            args: Prisma.PayrollJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayrollJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>
          }
          findMany: {
            args: Prisma.PayrollJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>[]
          }
          create: {
            args: Prisma.PayrollJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>
          }
          createMany: {
            args: Prisma.PayrollJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PayrollJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>[]
          }
          delete: {
            args: Prisma.PayrollJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>
          }
          update: {
            args: Prisma.PayrollJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>
          }
          deleteMany: {
            args: Prisma.PayrollJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayrollJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayrollJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollJobPayload>
          }
          aggregate: {
            args: Prisma.PayrollJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayrollJob>
          }
          groupBy: {
            args: Prisma.PayrollJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayrollJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.PayrollJobCountArgs<ExtArgs>
            result: $Utils.Optional<PayrollJobCountAggregateOutputType> | number
          }
        }
      }
      PayrollItem: {
        payload: Prisma.$PayrollItemPayload<ExtArgs>
        fields: Prisma.PayrollItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayrollItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayrollItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>
          }
          findFirst: {
            args: Prisma.PayrollItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayrollItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>
          }
          findMany: {
            args: Prisma.PayrollItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>[]
          }
          create: {
            args: Prisma.PayrollItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>
          }
          createMany: {
            args: Prisma.PayrollItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PayrollItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>[]
          }
          delete: {
            args: Prisma.PayrollItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>
          }
          update: {
            args: Prisma.PayrollItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>
          }
          deleteMany: {
            args: Prisma.PayrollItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayrollItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayrollItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollItemPayload>
          }
          aggregate: {
            args: Prisma.PayrollItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayrollItem>
          }
          groupBy: {
            args: Prisma.PayrollItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayrollItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PayrollItemCountArgs<ExtArgs>
            result: $Utils.Optional<PayrollItemCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PayrollJobCountOutputType
   */

  export type PayrollJobCountOutputType = {
    items: number
  }

  export type PayrollJobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PayrollJobCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * PayrollJobCountOutputType without action
   */
  export type PayrollJobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJobCountOutputType
     */
    select?: PayrollJobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PayrollJobCountOutputType without action
   */
  export type PayrollJobCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayrollItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PayrollJob
   */

  export type AggregatePayrollJob = {
    _count: PayrollJobCountAggregateOutputType | null
    _avg: PayrollJobAvgAggregateOutputType | null
    _sum: PayrollJobSumAggregateOutputType | null
    _min: PayrollJobMinAggregateOutputType | null
    _max: PayrollJobMaxAggregateOutputType | null
  }

  export type PayrollJobAvgAggregateOutputType = {
    totalItems: number | null
    processedItems: number | null
    failedItems: number | null
    checkpoint: number | null
  }

  export type PayrollJobSumAggregateOutputType = {
    totalItems: number | null
    processedItems: number | null
    failedItems: number | null
    checkpoint: number | null
  }

  export type PayrollJobMinAggregateOutputType = {
    id: string | null
    employerAccountId: string | null
    status: $Enums.PayrollJobStatus | null
    totalItems: number | null
    processedItems: number | null
    failedItems: number | null
    checkpoint: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayrollJobMaxAggregateOutputType = {
    id: string | null
    employerAccountId: string | null
    status: $Enums.PayrollJobStatus | null
    totalItems: number | null
    processedItems: number | null
    failedItems: number | null
    checkpoint: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayrollJobCountAggregateOutputType = {
    id: number
    employerAccountId: number
    status: number
    totalItems: number
    processedItems: number
    failedItems: number
    checkpoint: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayrollJobAvgAggregateInputType = {
    totalItems?: true
    processedItems?: true
    failedItems?: true
    checkpoint?: true
  }

  export type PayrollJobSumAggregateInputType = {
    totalItems?: true
    processedItems?: true
    failedItems?: true
    checkpoint?: true
  }

  export type PayrollJobMinAggregateInputType = {
    id?: true
    employerAccountId?: true
    status?: true
    totalItems?: true
    processedItems?: true
    failedItems?: true
    checkpoint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayrollJobMaxAggregateInputType = {
    id?: true
    employerAccountId?: true
    status?: true
    totalItems?: true
    processedItems?: true
    failedItems?: true
    checkpoint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayrollJobCountAggregateInputType = {
    id?: true
    employerAccountId?: true
    status?: true
    totalItems?: true
    processedItems?: true
    failedItems?: true
    checkpoint?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayrollJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayrollJob to aggregate.
     */
    where?: PayrollJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollJobs to fetch.
     */
    orderBy?: PayrollJobOrderByWithRelationInput | PayrollJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayrollJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayrollJobs
    **/
    _count?: true | PayrollJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayrollJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayrollJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayrollJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayrollJobMaxAggregateInputType
  }

  export type GetPayrollJobAggregateType<T extends PayrollJobAggregateArgs> = {
        [P in keyof T & keyof AggregatePayrollJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayrollJob[P]>
      : GetScalarType<T[P], AggregatePayrollJob[P]>
  }




  export type PayrollJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayrollJobWhereInput
    orderBy?: PayrollJobOrderByWithAggregationInput | PayrollJobOrderByWithAggregationInput[]
    by: PayrollJobScalarFieldEnum[] | PayrollJobScalarFieldEnum
    having?: PayrollJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayrollJobCountAggregateInputType | true
    _avg?: PayrollJobAvgAggregateInputType
    _sum?: PayrollJobSumAggregateInputType
    _min?: PayrollJobMinAggregateInputType
    _max?: PayrollJobMaxAggregateInputType
  }

  export type PayrollJobGroupByOutputType = {
    id: string
    employerAccountId: string
    status: $Enums.PayrollJobStatus
    totalItems: number
    processedItems: number
    failedItems: number
    checkpoint: number
    createdAt: Date
    updatedAt: Date
    _count: PayrollJobCountAggregateOutputType | null
    _avg: PayrollJobAvgAggregateOutputType | null
    _sum: PayrollJobSumAggregateOutputType | null
    _min: PayrollJobMinAggregateOutputType | null
    _max: PayrollJobMaxAggregateOutputType | null
  }

  type GetPayrollJobGroupByPayload<T extends PayrollJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayrollJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayrollJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayrollJobGroupByOutputType[P]>
            : GetScalarType<T[P], PayrollJobGroupByOutputType[P]>
        }
      >
    >


  export type PayrollJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employerAccountId?: boolean
    status?: boolean
    totalItems?: boolean
    processedItems?: boolean
    failedItems?: boolean
    checkpoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    items?: boolean | PayrollJob$itemsArgs<ExtArgs>
    _count?: boolean | PayrollJobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payrollJob"]>

  export type PayrollJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employerAccountId?: boolean
    status?: boolean
    totalItems?: boolean
    processedItems?: boolean
    failedItems?: boolean
    checkpoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payrollJob"]>

  export type PayrollJobSelectScalar = {
    id?: boolean
    employerAccountId?: boolean
    status?: boolean
    totalItems?: boolean
    processedItems?: boolean
    failedItems?: boolean
    checkpoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayrollJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PayrollJob$itemsArgs<ExtArgs>
    _count?: boolean | PayrollJobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PayrollJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PayrollJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayrollJob"
    objects: {
      items: Prisma.$PayrollItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employerAccountId: string
      status: $Enums.PayrollJobStatus
      totalItems: number
      processedItems: number
      failedItems: number
      checkpoint: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payrollJob"]>
    composites: {}
  }

  type PayrollJobGetPayload<S extends boolean | null | undefined | PayrollJobDefaultArgs> = $Result.GetResult<Prisma.$PayrollJobPayload, S>

  type PayrollJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PayrollJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PayrollJobCountAggregateInputType | true
    }

  export interface PayrollJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayrollJob'], meta: { name: 'PayrollJob' } }
    /**
     * Find zero or one PayrollJob that matches the filter.
     * @param {PayrollJobFindUniqueArgs} args - Arguments to find a PayrollJob
     * @example
     * // Get one PayrollJob
     * const payrollJob = await prisma.payrollJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayrollJobFindUniqueArgs>(args: SelectSubset<T, PayrollJobFindUniqueArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PayrollJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PayrollJobFindUniqueOrThrowArgs} args - Arguments to find a PayrollJob
     * @example
     * // Get one PayrollJob
     * const payrollJob = await prisma.payrollJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayrollJobFindUniqueOrThrowArgs>(args: SelectSubset<T, PayrollJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PayrollJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobFindFirstArgs} args - Arguments to find a PayrollJob
     * @example
     * // Get one PayrollJob
     * const payrollJob = await prisma.payrollJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayrollJobFindFirstArgs>(args?: SelectSubset<T, PayrollJobFindFirstArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PayrollJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobFindFirstOrThrowArgs} args - Arguments to find a PayrollJob
     * @example
     * // Get one PayrollJob
     * const payrollJob = await prisma.payrollJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayrollJobFindFirstOrThrowArgs>(args?: SelectSubset<T, PayrollJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PayrollJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayrollJobs
     * const payrollJobs = await prisma.payrollJob.findMany()
     * 
     * // Get first 10 PayrollJobs
     * const payrollJobs = await prisma.payrollJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payrollJobWithIdOnly = await prisma.payrollJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayrollJobFindManyArgs>(args?: SelectSubset<T, PayrollJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PayrollJob.
     * @param {PayrollJobCreateArgs} args - Arguments to create a PayrollJob.
     * @example
     * // Create one PayrollJob
     * const PayrollJob = await prisma.payrollJob.create({
     *   data: {
     *     // ... data to create a PayrollJob
     *   }
     * })
     * 
     */
    create<T extends PayrollJobCreateArgs>(args: SelectSubset<T, PayrollJobCreateArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PayrollJobs.
     * @param {PayrollJobCreateManyArgs} args - Arguments to create many PayrollJobs.
     * @example
     * // Create many PayrollJobs
     * const payrollJob = await prisma.payrollJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayrollJobCreateManyArgs>(args?: SelectSubset<T, PayrollJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PayrollJobs and returns the data saved in the database.
     * @param {PayrollJobCreateManyAndReturnArgs} args - Arguments to create many PayrollJobs.
     * @example
     * // Create many PayrollJobs
     * const payrollJob = await prisma.payrollJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PayrollJobs and only return the `id`
     * const payrollJobWithIdOnly = await prisma.payrollJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PayrollJobCreateManyAndReturnArgs>(args?: SelectSubset<T, PayrollJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PayrollJob.
     * @param {PayrollJobDeleteArgs} args - Arguments to delete one PayrollJob.
     * @example
     * // Delete one PayrollJob
     * const PayrollJob = await prisma.payrollJob.delete({
     *   where: {
     *     // ... filter to delete one PayrollJob
     *   }
     * })
     * 
     */
    delete<T extends PayrollJobDeleteArgs>(args: SelectSubset<T, PayrollJobDeleteArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PayrollJob.
     * @param {PayrollJobUpdateArgs} args - Arguments to update one PayrollJob.
     * @example
     * // Update one PayrollJob
     * const payrollJob = await prisma.payrollJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayrollJobUpdateArgs>(args: SelectSubset<T, PayrollJobUpdateArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PayrollJobs.
     * @param {PayrollJobDeleteManyArgs} args - Arguments to filter PayrollJobs to delete.
     * @example
     * // Delete a few PayrollJobs
     * const { count } = await prisma.payrollJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayrollJobDeleteManyArgs>(args?: SelectSubset<T, PayrollJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayrollJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayrollJobs
     * const payrollJob = await prisma.payrollJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayrollJobUpdateManyArgs>(args: SelectSubset<T, PayrollJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayrollJob.
     * @param {PayrollJobUpsertArgs} args - Arguments to update or create a PayrollJob.
     * @example
     * // Update or create a PayrollJob
     * const payrollJob = await prisma.payrollJob.upsert({
     *   create: {
     *     // ... data to create a PayrollJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayrollJob we want to update
     *   }
     * })
     */
    upsert<T extends PayrollJobUpsertArgs>(args: SelectSubset<T, PayrollJobUpsertArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PayrollJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobCountArgs} args - Arguments to filter PayrollJobs to count.
     * @example
     * // Count the number of PayrollJobs
     * const count = await prisma.payrollJob.count({
     *   where: {
     *     // ... the filter for the PayrollJobs we want to count
     *   }
     * })
    **/
    count<T extends PayrollJobCountArgs>(
      args?: Subset<T, PayrollJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayrollJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayrollJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayrollJobAggregateArgs>(args: Subset<T, PayrollJobAggregateArgs>): Prisma.PrismaPromise<GetPayrollJobAggregateType<T>>

    /**
     * Group by PayrollJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayrollJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayrollJobGroupByArgs['orderBy'] }
        : { orderBy?: PayrollJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayrollJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayrollJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayrollJob model
   */
  readonly fields: PayrollJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayrollJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayrollJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends PayrollJob$itemsArgs<ExtArgs> = {}>(args?: Subset<T, PayrollJob$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayrollJob model
   */ 
  interface PayrollJobFieldRefs {
    readonly id: FieldRef<"PayrollJob", 'String'>
    readonly employerAccountId: FieldRef<"PayrollJob", 'String'>
    readonly status: FieldRef<"PayrollJob", 'PayrollJobStatus'>
    readonly totalItems: FieldRef<"PayrollJob", 'Int'>
    readonly processedItems: FieldRef<"PayrollJob", 'Int'>
    readonly failedItems: FieldRef<"PayrollJob", 'Int'>
    readonly checkpoint: FieldRef<"PayrollJob", 'Int'>
    readonly createdAt: FieldRef<"PayrollJob", 'DateTime'>
    readonly updatedAt: FieldRef<"PayrollJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayrollJob findUnique
   */
  export type PayrollJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * Filter, which PayrollJob to fetch.
     */
    where: PayrollJobWhereUniqueInput
  }

  /**
   * PayrollJob findUniqueOrThrow
   */
  export type PayrollJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * Filter, which PayrollJob to fetch.
     */
    where: PayrollJobWhereUniqueInput
  }

  /**
   * PayrollJob findFirst
   */
  export type PayrollJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * Filter, which PayrollJob to fetch.
     */
    where?: PayrollJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollJobs to fetch.
     */
    orderBy?: PayrollJobOrderByWithRelationInput | PayrollJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayrollJobs.
     */
    cursor?: PayrollJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayrollJobs.
     */
    distinct?: PayrollJobScalarFieldEnum | PayrollJobScalarFieldEnum[]
  }

  /**
   * PayrollJob findFirstOrThrow
   */
  export type PayrollJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * Filter, which PayrollJob to fetch.
     */
    where?: PayrollJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollJobs to fetch.
     */
    orderBy?: PayrollJobOrderByWithRelationInput | PayrollJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayrollJobs.
     */
    cursor?: PayrollJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayrollJobs.
     */
    distinct?: PayrollJobScalarFieldEnum | PayrollJobScalarFieldEnum[]
  }

  /**
   * PayrollJob findMany
   */
  export type PayrollJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * Filter, which PayrollJobs to fetch.
     */
    where?: PayrollJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollJobs to fetch.
     */
    orderBy?: PayrollJobOrderByWithRelationInput | PayrollJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayrollJobs.
     */
    cursor?: PayrollJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollJobs.
     */
    skip?: number
    distinct?: PayrollJobScalarFieldEnum | PayrollJobScalarFieldEnum[]
  }

  /**
   * PayrollJob create
   */
  export type PayrollJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * The data needed to create a PayrollJob.
     */
    data: XOR<PayrollJobCreateInput, PayrollJobUncheckedCreateInput>
  }

  /**
   * PayrollJob createMany
   */
  export type PayrollJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayrollJobs.
     */
    data: PayrollJobCreateManyInput | PayrollJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayrollJob createManyAndReturn
   */
  export type PayrollJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PayrollJobs.
     */
    data: PayrollJobCreateManyInput | PayrollJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayrollJob update
   */
  export type PayrollJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * The data needed to update a PayrollJob.
     */
    data: XOR<PayrollJobUpdateInput, PayrollJobUncheckedUpdateInput>
    /**
     * Choose, which PayrollJob to update.
     */
    where: PayrollJobWhereUniqueInput
  }

  /**
   * PayrollJob updateMany
   */
  export type PayrollJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayrollJobs.
     */
    data: XOR<PayrollJobUpdateManyMutationInput, PayrollJobUncheckedUpdateManyInput>
    /**
     * Filter which PayrollJobs to update
     */
    where?: PayrollJobWhereInput
  }

  /**
   * PayrollJob upsert
   */
  export type PayrollJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * The filter to search for the PayrollJob to update in case it exists.
     */
    where: PayrollJobWhereUniqueInput
    /**
     * In case the PayrollJob found by the `where` argument doesn't exist, create a new PayrollJob with this data.
     */
    create: XOR<PayrollJobCreateInput, PayrollJobUncheckedCreateInput>
    /**
     * In case the PayrollJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayrollJobUpdateInput, PayrollJobUncheckedUpdateInput>
  }

  /**
   * PayrollJob delete
   */
  export type PayrollJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
    /**
     * Filter which PayrollJob to delete.
     */
    where: PayrollJobWhereUniqueInput
  }

  /**
   * PayrollJob deleteMany
   */
  export type PayrollJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayrollJobs to delete
     */
    where?: PayrollJobWhereInput
  }

  /**
   * PayrollJob.items
   */
  export type PayrollJob$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    where?: PayrollItemWhereInput
    orderBy?: PayrollItemOrderByWithRelationInput | PayrollItemOrderByWithRelationInput[]
    cursor?: PayrollItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PayrollItemScalarFieldEnum | PayrollItemScalarFieldEnum[]
  }

  /**
   * PayrollJob without action
   */
  export type PayrollJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollJob
     */
    select?: PayrollJobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollJobInclude<ExtArgs> | null
  }


  /**
   * Model PayrollItem
   */

  export type AggregatePayrollItem = {
    _count: PayrollItemCountAggregateOutputType | null
    _avg: PayrollItemAvgAggregateOutputType | null
    _sum: PayrollItemSumAggregateOutputType | null
    _min: PayrollItemMinAggregateOutputType | null
    _max: PayrollItemMaxAggregateOutputType | null
  }

  export type PayrollItemAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PayrollItemSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PayrollItemMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    employeeAccountId: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.PayrollItemStatus | null
    transactionId: string | null
    error: string | null
    createdAt: Date | null
  }

  export type PayrollItemMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    employeeAccountId: string | null
    amount: Decimal | null
    currency: string | null
    status: $Enums.PayrollItemStatus | null
    transactionId: string | null
    error: string | null
    createdAt: Date | null
  }

  export type PayrollItemCountAggregateOutputType = {
    id: number
    jobId: number
    employeeAccountId: number
    amount: number
    currency: number
    status: number
    transactionId: number
    error: number
    createdAt: number
    _all: number
  }


  export type PayrollItemAvgAggregateInputType = {
    amount?: true
  }

  export type PayrollItemSumAggregateInputType = {
    amount?: true
  }

  export type PayrollItemMinAggregateInputType = {
    id?: true
    jobId?: true
    employeeAccountId?: true
    amount?: true
    currency?: true
    status?: true
    transactionId?: true
    error?: true
    createdAt?: true
  }

  export type PayrollItemMaxAggregateInputType = {
    id?: true
    jobId?: true
    employeeAccountId?: true
    amount?: true
    currency?: true
    status?: true
    transactionId?: true
    error?: true
    createdAt?: true
  }

  export type PayrollItemCountAggregateInputType = {
    id?: true
    jobId?: true
    employeeAccountId?: true
    amount?: true
    currency?: true
    status?: true
    transactionId?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type PayrollItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayrollItem to aggregate.
     */
    where?: PayrollItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollItems to fetch.
     */
    orderBy?: PayrollItemOrderByWithRelationInput | PayrollItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayrollItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayrollItems
    **/
    _count?: true | PayrollItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayrollItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayrollItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayrollItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayrollItemMaxAggregateInputType
  }

  export type GetPayrollItemAggregateType<T extends PayrollItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePayrollItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayrollItem[P]>
      : GetScalarType<T[P], AggregatePayrollItem[P]>
  }




  export type PayrollItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayrollItemWhereInput
    orderBy?: PayrollItemOrderByWithAggregationInput | PayrollItemOrderByWithAggregationInput[]
    by: PayrollItemScalarFieldEnum[] | PayrollItemScalarFieldEnum
    having?: PayrollItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayrollItemCountAggregateInputType | true
    _avg?: PayrollItemAvgAggregateInputType
    _sum?: PayrollItemSumAggregateInputType
    _min?: PayrollItemMinAggregateInputType
    _max?: PayrollItemMaxAggregateInputType
  }

  export type PayrollItemGroupByOutputType = {
    id: string
    jobId: string
    employeeAccountId: string
    amount: Decimal
    currency: string
    status: $Enums.PayrollItemStatus
    transactionId: string | null
    error: string | null
    createdAt: Date
    _count: PayrollItemCountAggregateOutputType | null
    _avg: PayrollItemAvgAggregateOutputType | null
    _sum: PayrollItemSumAggregateOutputType | null
    _min: PayrollItemMinAggregateOutputType | null
    _max: PayrollItemMaxAggregateOutputType | null
  }

  type GetPayrollItemGroupByPayload<T extends PayrollItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayrollItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayrollItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayrollItemGroupByOutputType[P]>
            : GetScalarType<T[P], PayrollItemGroupByOutputType[P]>
        }
      >
    >


  export type PayrollItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    employeeAccountId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    transactionId?: boolean
    error?: boolean
    createdAt?: boolean
    job?: boolean | PayrollJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payrollItem"]>

  export type PayrollItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    employeeAccountId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    transactionId?: boolean
    error?: boolean
    createdAt?: boolean
    job?: boolean | PayrollJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payrollItem"]>

  export type PayrollItemSelectScalar = {
    id?: boolean
    jobId?: boolean
    employeeAccountId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    transactionId?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type PayrollItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | PayrollJobDefaultArgs<ExtArgs>
  }
  export type PayrollItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | PayrollJobDefaultArgs<ExtArgs>
  }

  export type $PayrollItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayrollItem"
    objects: {
      job: Prisma.$PayrollJobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      employeeAccountId: string
      amount: Prisma.Decimal
      currency: string
      status: $Enums.PayrollItemStatus
      transactionId: string | null
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["payrollItem"]>
    composites: {}
  }

  type PayrollItemGetPayload<S extends boolean | null | undefined | PayrollItemDefaultArgs> = $Result.GetResult<Prisma.$PayrollItemPayload, S>

  type PayrollItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PayrollItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PayrollItemCountAggregateInputType | true
    }

  export interface PayrollItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayrollItem'], meta: { name: 'PayrollItem' } }
    /**
     * Find zero or one PayrollItem that matches the filter.
     * @param {PayrollItemFindUniqueArgs} args - Arguments to find a PayrollItem
     * @example
     * // Get one PayrollItem
     * const payrollItem = await prisma.payrollItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayrollItemFindUniqueArgs>(args: SelectSubset<T, PayrollItemFindUniqueArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PayrollItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PayrollItemFindUniqueOrThrowArgs} args - Arguments to find a PayrollItem
     * @example
     * // Get one PayrollItem
     * const payrollItem = await prisma.payrollItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayrollItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PayrollItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PayrollItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemFindFirstArgs} args - Arguments to find a PayrollItem
     * @example
     * // Get one PayrollItem
     * const payrollItem = await prisma.payrollItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayrollItemFindFirstArgs>(args?: SelectSubset<T, PayrollItemFindFirstArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PayrollItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemFindFirstOrThrowArgs} args - Arguments to find a PayrollItem
     * @example
     * // Get one PayrollItem
     * const payrollItem = await prisma.payrollItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayrollItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PayrollItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PayrollItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayrollItems
     * const payrollItems = await prisma.payrollItem.findMany()
     * 
     * // Get first 10 PayrollItems
     * const payrollItems = await prisma.payrollItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payrollItemWithIdOnly = await prisma.payrollItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayrollItemFindManyArgs>(args?: SelectSubset<T, PayrollItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PayrollItem.
     * @param {PayrollItemCreateArgs} args - Arguments to create a PayrollItem.
     * @example
     * // Create one PayrollItem
     * const PayrollItem = await prisma.payrollItem.create({
     *   data: {
     *     // ... data to create a PayrollItem
     *   }
     * })
     * 
     */
    create<T extends PayrollItemCreateArgs>(args: SelectSubset<T, PayrollItemCreateArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PayrollItems.
     * @param {PayrollItemCreateManyArgs} args - Arguments to create many PayrollItems.
     * @example
     * // Create many PayrollItems
     * const payrollItem = await prisma.payrollItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayrollItemCreateManyArgs>(args?: SelectSubset<T, PayrollItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PayrollItems and returns the data saved in the database.
     * @param {PayrollItemCreateManyAndReturnArgs} args - Arguments to create many PayrollItems.
     * @example
     * // Create many PayrollItems
     * const payrollItem = await prisma.payrollItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PayrollItems and only return the `id`
     * const payrollItemWithIdOnly = await prisma.payrollItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PayrollItemCreateManyAndReturnArgs>(args?: SelectSubset<T, PayrollItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PayrollItem.
     * @param {PayrollItemDeleteArgs} args - Arguments to delete one PayrollItem.
     * @example
     * // Delete one PayrollItem
     * const PayrollItem = await prisma.payrollItem.delete({
     *   where: {
     *     // ... filter to delete one PayrollItem
     *   }
     * })
     * 
     */
    delete<T extends PayrollItemDeleteArgs>(args: SelectSubset<T, PayrollItemDeleteArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PayrollItem.
     * @param {PayrollItemUpdateArgs} args - Arguments to update one PayrollItem.
     * @example
     * // Update one PayrollItem
     * const payrollItem = await prisma.payrollItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayrollItemUpdateArgs>(args: SelectSubset<T, PayrollItemUpdateArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PayrollItems.
     * @param {PayrollItemDeleteManyArgs} args - Arguments to filter PayrollItems to delete.
     * @example
     * // Delete a few PayrollItems
     * const { count } = await prisma.payrollItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayrollItemDeleteManyArgs>(args?: SelectSubset<T, PayrollItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayrollItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayrollItems
     * const payrollItem = await prisma.payrollItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayrollItemUpdateManyArgs>(args: SelectSubset<T, PayrollItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayrollItem.
     * @param {PayrollItemUpsertArgs} args - Arguments to update or create a PayrollItem.
     * @example
     * // Update or create a PayrollItem
     * const payrollItem = await prisma.payrollItem.upsert({
     *   create: {
     *     // ... data to create a PayrollItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayrollItem we want to update
     *   }
     * })
     */
    upsert<T extends PayrollItemUpsertArgs>(args: SelectSubset<T, PayrollItemUpsertArgs<ExtArgs>>): Prisma__PayrollItemClient<$Result.GetResult<Prisma.$PayrollItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PayrollItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemCountArgs} args - Arguments to filter PayrollItems to count.
     * @example
     * // Count the number of PayrollItems
     * const count = await prisma.payrollItem.count({
     *   where: {
     *     // ... the filter for the PayrollItems we want to count
     *   }
     * })
    **/
    count<T extends PayrollItemCountArgs>(
      args?: Subset<T, PayrollItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayrollItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayrollItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayrollItemAggregateArgs>(args: Subset<T, PayrollItemAggregateArgs>): Prisma.PrismaPromise<GetPayrollItemAggregateType<T>>

    /**
     * Group by PayrollItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayrollItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayrollItemGroupByArgs['orderBy'] }
        : { orderBy?: PayrollItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayrollItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayrollItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayrollItem model
   */
  readonly fields: PayrollItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayrollItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayrollItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends PayrollJobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PayrollJobDefaultArgs<ExtArgs>>): Prisma__PayrollJobClient<$Result.GetResult<Prisma.$PayrollJobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayrollItem model
   */ 
  interface PayrollItemFieldRefs {
    readonly id: FieldRef<"PayrollItem", 'String'>
    readonly jobId: FieldRef<"PayrollItem", 'String'>
    readonly employeeAccountId: FieldRef<"PayrollItem", 'String'>
    readonly amount: FieldRef<"PayrollItem", 'Decimal'>
    readonly currency: FieldRef<"PayrollItem", 'String'>
    readonly status: FieldRef<"PayrollItem", 'PayrollItemStatus'>
    readonly transactionId: FieldRef<"PayrollItem", 'String'>
    readonly error: FieldRef<"PayrollItem", 'String'>
    readonly createdAt: FieldRef<"PayrollItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayrollItem findUnique
   */
  export type PayrollItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * Filter, which PayrollItem to fetch.
     */
    where: PayrollItemWhereUniqueInput
  }

  /**
   * PayrollItem findUniqueOrThrow
   */
  export type PayrollItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * Filter, which PayrollItem to fetch.
     */
    where: PayrollItemWhereUniqueInput
  }

  /**
   * PayrollItem findFirst
   */
  export type PayrollItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * Filter, which PayrollItem to fetch.
     */
    where?: PayrollItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollItems to fetch.
     */
    orderBy?: PayrollItemOrderByWithRelationInput | PayrollItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayrollItems.
     */
    cursor?: PayrollItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayrollItems.
     */
    distinct?: PayrollItemScalarFieldEnum | PayrollItemScalarFieldEnum[]
  }

  /**
   * PayrollItem findFirstOrThrow
   */
  export type PayrollItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * Filter, which PayrollItem to fetch.
     */
    where?: PayrollItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollItems to fetch.
     */
    orderBy?: PayrollItemOrderByWithRelationInput | PayrollItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayrollItems.
     */
    cursor?: PayrollItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayrollItems.
     */
    distinct?: PayrollItemScalarFieldEnum | PayrollItemScalarFieldEnum[]
  }

  /**
   * PayrollItem findMany
   */
  export type PayrollItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * Filter, which PayrollItems to fetch.
     */
    where?: PayrollItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollItems to fetch.
     */
    orderBy?: PayrollItemOrderByWithRelationInput | PayrollItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayrollItems.
     */
    cursor?: PayrollItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollItems.
     */
    skip?: number
    distinct?: PayrollItemScalarFieldEnum | PayrollItemScalarFieldEnum[]
  }

  /**
   * PayrollItem create
   */
  export type PayrollItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PayrollItem.
     */
    data: XOR<PayrollItemCreateInput, PayrollItemUncheckedCreateInput>
  }

  /**
   * PayrollItem createMany
   */
  export type PayrollItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayrollItems.
     */
    data: PayrollItemCreateManyInput | PayrollItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayrollItem createManyAndReturn
   */
  export type PayrollItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PayrollItems.
     */
    data: PayrollItemCreateManyInput | PayrollItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PayrollItem update
   */
  export type PayrollItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PayrollItem.
     */
    data: XOR<PayrollItemUpdateInput, PayrollItemUncheckedUpdateInput>
    /**
     * Choose, which PayrollItem to update.
     */
    where: PayrollItemWhereUniqueInput
  }

  /**
   * PayrollItem updateMany
   */
  export type PayrollItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayrollItems.
     */
    data: XOR<PayrollItemUpdateManyMutationInput, PayrollItemUncheckedUpdateManyInput>
    /**
     * Filter which PayrollItems to update
     */
    where?: PayrollItemWhereInput
  }

  /**
   * PayrollItem upsert
   */
  export type PayrollItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PayrollItem to update in case it exists.
     */
    where: PayrollItemWhereUniqueInput
    /**
     * In case the PayrollItem found by the `where` argument doesn't exist, create a new PayrollItem with this data.
     */
    create: XOR<PayrollItemCreateInput, PayrollItemUncheckedCreateInput>
    /**
     * In case the PayrollItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayrollItemUpdateInput, PayrollItemUncheckedUpdateInput>
  }

  /**
   * PayrollItem delete
   */
  export type PayrollItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
    /**
     * Filter which PayrollItem to delete.
     */
    where: PayrollItemWhereUniqueInput
  }

  /**
   * PayrollItem deleteMany
   */
  export type PayrollItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayrollItems to delete
     */
    where?: PayrollItemWhereInput
  }

  /**
   * PayrollItem without action
   */
  export type PayrollItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollItem
     */
    select?: PayrollItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollItemInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PayrollJobScalarFieldEnum: {
    id: 'id',
    employerAccountId: 'employerAccountId',
    status: 'status',
    totalItems: 'totalItems',
    processedItems: 'processedItems',
    failedItems: 'failedItems',
    checkpoint: 'checkpoint',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayrollJobScalarFieldEnum = (typeof PayrollJobScalarFieldEnum)[keyof typeof PayrollJobScalarFieldEnum]


  export const PayrollItemScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    employeeAccountId: 'employeeAccountId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    transactionId: 'transactionId',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type PayrollItemScalarFieldEnum = (typeof PayrollItemScalarFieldEnum)[keyof typeof PayrollItemScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'PayrollJobStatus'
   */
  export type EnumPayrollJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollJobStatus'>
    


  /**
   * Reference to a field of type 'PayrollJobStatus[]'
   */
  export type ListEnumPayrollJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollJobStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'PayrollItemStatus'
   */
  export type EnumPayrollItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollItemStatus'>
    


  /**
   * Reference to a field of type 'PayrollItemStatus[]'
   */
  export type ListEnumPayrollItemStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollItemStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PayrollJobWhereInput = {
    AND?: PayrollJobWhereInput | PayrollJobWhereInput[]
    OR?: PayrollJobWhereInput[]
    NOT?: PayrollJobWhereInput | PayrollJobWhereInput[]
    id?: UuidFilter<"PayrollJob"> | string
    employerAccountId?: UuidFilter<"PayrollJob"> | string
    status?: EnumPayrollJobStatusFilter<"PayrollJob"> | $Enums.PayrollJobStatus
    totalItems?: IntFilter<"PayrollJob"> | number
    processedItems?: IntFilter<"PayrollJob"> | number
    failedItems?: IntFilter<"PayrollJob"> | number
    checkpoint?: IntFilter<"PayrollJob"> | number
    createdAt?: DateTimeFilter<"PayrollJob"> | Date | string
    updatedAt?: DateTimeFilter<"PayrollJob"> | Date | string
    items?: PayrollItemListRelationFilter
  }

  export type PayrollJobOrderByWithRelationInput = {
    id?: SortOrder
    employerAccountId?: SortOrder
    status?: SortOrder
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    items?: PayrollItemOrderByRelationAggregateInput
  }

  export type PayrollJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PayrollJobWhereInput | PayrollJobWhereInput[]
    OR?: PayrollJobWhereInput[]
    NOT?: PayrollJobWhereInput | PayrollJobWhereInput[]
    employerAccountId?: UuidFilter<"PayrollJob"> | string
    status?: EnumPayrollJobStatusFilter<"PayrollJob"> | $Enums.PayrollJobStatus
    totalItems?: IntFilter<"PayrollJob"> | number
    processedItems?: IntFilter<"PayrollJob"> | number
    failedItems?: IntFilter<"PayrollJob"> | number
    checkpoint?: IntFilter<"PayrollJob"> | number
    createdAt?: DateTimeFilter<"PayrollJob"> | Date | string
    updatedAt?: DateTimeFilter<"PayrollJob"> | Date | string
    items?: PayrollItemListRelationFilter
  }, "id">

  export type PayrollJobOrderByWithAggregationInput = {
    id?: SortOrder
    employerAccountId?: SortOrder
    status?: SortOrder
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayrollJobCountOrderByAggregateInput
    _avg?: PayrollJobAvgOrderByAggregateInput
    _max?: PayrollJobMaxOrderByAggregateInput
    _min?: PayrollJobMinOrderByAggregateInput
    _sum?: PayrollJobSumOrderByAggregateInput
  }

  export type PayrollJobScalarWhereWithAggregatesInput = {
    AND?: PayrollJobScalarWhereWithAggregatesInput | PayrollJobScalarWhereWithAggregatesInput[]
    OR?: PayrollJobScalarWhereWithAggregatesInput[]
    NOT?: PayrollJobScalarWhereWithAggregatesInput | PayrollJobScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PayrollJob"> | string
    employerAccountId?: UuidWithAggregatesFilter<"PayrollJob"> | string
    status?: EnumPayrollJobStatusWithAggregatesFilter<"PayrollJob"> | $Enums.PayrollJobStatus
    totalItems?: IntWithAggregatesFilter<"PayrollJob"> | number
    processedItems?: IntWithAggregatesFilter<"PayrollJob"> | number
    failedItems?: IntWithAggregatesFilter<"PayrollJob"> | number
    checkpoint?: IntWithAggregatesFilter<"PayrollJob"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PayrollJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayrollJob"> | Date | string
  }

  export type PayrollItemWhereInput = {
    AND?: PayrollItemWhereInput | PayrollItemWhereInput[]
    OR?: PayrollItemWhereInput[]
    NOT?: PayrollItemWhereInput | PayrollItemWhereInput[]
    id?: UuidFilter<"PayrollItem"> | string
    jobId?: UuidFilter<"PayrollItem"> | string
    employeeAccountId?: UuidFilter<"PayrollItem"> | string
    amount?: DecimalFilter<"PayrollItem"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"PayrollItem"> | string
    status?: EnumPayrollItemStatusFilter<"PayrollItem"> | $Enums.PayrollItemStatus
    transactionId?: UuidNullableFilter<"PayrollItem"> | string | null
    error?: StringNullableFilter<"PayrollItem"> | string | null
    createdAt?: DateTimeFilter<"PayrollItem"> | Date | string
    job?: XOR<PayrollJobRelationFilter, PayrollJobWhereInput>
  }

  export type PayrollItemOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    employeeAccountId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    job?: PayrollJobOrderByWithRelationInput
  }

  export type PayrollItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PayrollItemWhereInput | PayrollItemWhereInput[]
    OR?: PayrollItemWhereInput[]
    NOT?: PayrollItemWhereInput | PayrollItemWhereInput[]
    jobId?: UuidFilter<"PayrollItem"> | string
    employeeAccountId?: UuidFilter<"PayrollItem"> | string
    amount?: DecimalFilter<"PayrollItem"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"PayrollItem"> | string
    status?: EnumPayrollItemStatusFilter<"PayrollItem"> | $Enums.PayrollItemStatus
    transactionId?: UuidNullableFilter<"PayrollItem"> | string | null
    error?: StringNullableFilter<"PayrollItem"> | string | null
    createdAt?: DateTimeFilter<"PayrollItem"> | Date | string
    job?: XOR<PayrollJobRelationFilter, PayrollJobWhereInput>
  }, "id">

  export type PayrollItemOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    employeeAccountId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PayrollItemCountOrderByAggregateInput
    _avg?: PayrollItemAvgOrderByAggregateInput
    _max?: PayrollItemMaxOrderByAggregateInput
    _min?: PayrollItemMinOrderByAggregateInput
    _sum?: PayrollItemSumOrderByAggregateInput
  }

  export type PayrollItemScalarWhereWithAggregatesInput = {
    AND?: PayrollItemScalarWhereWithAggregatesInput | PayrollItemScalarWhereWithAggregatesInput[]
    OR?: PayrollItemScalarWhereWithAggregatesInput[]
    NOT?: PayrollItemScalarWhereWithAggregatesInput | PayrollItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PayrollItem"> | string
    jobId?: UuidWithAggregatesFilter<"PayrollItem"> | string
    employeeAccountId?: UuidWithAggregatesFilter<"PayrollItem"> | string
    amount?: DecimalWithAggregatesFilter<"PayrollItem"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"PayrollItem"> | string
    status?: EnumPayrollItemStatusWithAggregatesFilter<"PayrollItem"> | $Enums.PayrollItemStatus
    transactionId?: UuidNullableWithAggregatesFilter<"PayrollItem"> | string | null
    error?: StringNullableWithAggregatesFilter<"PayrollItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayrollItem"> | Date | string
  }

  export type PayrollJobCreateInput = {
    id?: string
    employerAccountId: string
    status?: $Enums.PayrollJobStatus
    totalItems: number
    processedItems?: number
    failedItems?: number
    checkpoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PayrollItemCreateNestedManyWithoutJobInput
  }

  export type PayrollJobUncheckedCreateInput = {
    id?: string
    employerAccountId: string
    status?: $Enums.PayrollJobStatus
    totalItems: number
    processedItems?: number
    failedItems?: number
    checkpoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: PayrollItemUncheckedCreateNestedManyWithoutJobInput
  }

  export type PayrollJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employerAccountId?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollJobStatusFieldUpdateOperationsInput | $Enums.PayrollJobStatus
    totalItems?: IntFieldUpdateOperationsInput | number
    processedItems?: IntFieldUpdateOperationsInput | number
    failedItems?: IntFieldUpdateOperationsInput | number
    checkpoint?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PayrollItemUpdateManyWithoutJobNestedInput
  }

  export type PayrollJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employerAccountId?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollJobStatusFieldUpdateOperationsInput | $Enums.PayrollJobStatus
    totalItems?: IntFieldUpdateOperationsInput | number
    processedItems?: IntFieldUpdateOperationsInput | number
    failedItems?: IntFieldUpdateOperationsInput | number
    checkpoint?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: PayrollItemUncheckedUpdateManyWithoutJobNestedInput
  }

  export type PayrollJobCreateManyInput = {
    id?: string
    employerAccountId: string
    status?: $Enums.PayrollJobStatus
    totalItems: number
    processedItems?: number
    failedItems?: number
    checkpoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    employerAccountId?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollJobStatusFieldUpdateOperationsInput | $Enums.PayrollJobStatus
    totalItems?: IntFieldUpdateOperationsInput | number
    processedItems?: IntFieldUpdateOperationsInput | number
    failedItems?: IntFieldUpdateOperationsInput | number
    checkpoint?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employerAccountId?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollJobStatusFieldUpdateOperationsInput | $Enums.PayrollJobStatus
    totalItems?: IntFieldUpdateOperationsInput | number
    processedItems?: IntFieldUpdateOperationsInput | number
    failedItems?: IntFieldUpdateOperationsInput | number
    checkpoint?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollItemCreateInput = {
    id?: string
    employeeAccountId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.PayrollItemStatus
    transactionId?: string | null
    error?: string | null
    createdAt?: Date | string
    job: PayrollJobCreateNestedOneWithoutItemsInput
  }

  export type PayrollItemUncheckedCreateInput = {
    id?: string
    jobId: string
    employeeAccountId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.PayrollItemStatus
    transactionId?: string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type PayrollItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: PayrollJobUpdateOneRequiredWithoutItemsNestedInput
  }

  export type PayrollItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollItemCreateManyInput = {
    id?: string
    jobId: string
    employeeAccountId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.PayrollItemStatus
    transactionId?: string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type PayrollItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type EnumPayrollJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollJobStatus | EnumPayrollJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollJobStatusFilter<$PrismaModel> | $Enums.PayrollJobStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PayrollItemListRelationFilter = {
    every?: PayrollItemWhereInput
    some?: PayrollItemWhereInput
    none?: PayrollItemWhereInput
  }

  export type PayrollItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PayrollJobCountOrderByAggregateInput = {
    id?: SortOrder
    employerAccountId?: SortOrder
    status?: SortOrder
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollJobAvgOrderByAggregateInput = {
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
  }

  export type PayrollJobMaxOrderByAggregateInput = {
    id?: SortOrder
    employerAccountId?: SortOrder
    status?: SortOrder
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollJobMinOrderByAggregateInput = {
    id?: SortOrder
    employerAccountId?: SortOrder
    status?: SortOrder
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollJobSumOrderByAggregateInput = {
    totalItems?: SortOrder
    processedItems?: SortOrder
    failedItems?: SortOrder
    checkpoint?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumPayrollJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollJobStatus | EnumPayrollJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollJobStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollJobStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumPayrollItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollItemStatus | EnumPayrollItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollItemStatusFilter<$PrismaModel> | $Enums.PayrollItemStatus
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type PayrollJobRelationFilter = {
    is?: PayrollJobWhereInput
    isNot?: PayrollJobWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PayrollItemCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    employeeAccountId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    transactionId?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type PayrollItemAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PayrollItemMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    employeeAccountId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    transactionId?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type PayrollItemMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    employeeAccountId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    transactionId?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type PayrollItemSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumPayrollItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollItemStatus | EnumPayrollItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollItemStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollItemStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollItemStatusFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PayrollItemCreateNestedManyWithoutJobInput = {
    create?: XOR<PayrollItemCreateWithoutJobInput, PayrollItemUncheckedCreateWithoutJobInput> | PayrollItemCreateWithoutJobInput[] | PayrollItemUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PayrollItemCreateOrConnectWithoutJobInput | PayrollItemCreateOrConnectWithoutJobInput[]
    createMany?: PayrollItemCreateManyJobInputEnvelope
    connect?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
  }

  export type PayrollItemUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<PayrollItemCreateWithoutJobInput, PayrollItemUncheckedCreateWithoutJobInput> | PayrollItemCreateWithoutJobInput[] | PayrollItemUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PayrollItemCreateOrConnectWithoutJobInput | PayrollItemCreateOrConnectWithoutJobInput[]
    createMany?: PayrollItemCreateManyJobInputEnvelope
    connect?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumPayrollJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.PayrollJobStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PayrollItemUpdateManyWithoutJobNestedInput = {
    create?: XOR<PayrollItemCreateWithoutJobInput, PayrollItemUncheckedCreateWithoutJobInput> | PayrollItemCreateWithoutJobInput[] | PayrollItemUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PayrollItemCreateOrConnectWithoutJobInput | PayrollItemCreateOrConnectWithoutJobInput[]
    upsert?: PayrollItemUpsertWithWhereUniqueWithoutJobInput | PayrollItemUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: PayrollItemCreateManyJobInputEnvelope
    set?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    disconnect?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    delete?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    connect?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    update?: PayrollItemUpdateWithWhereUniqueWithoutJobInput | PayrollItemUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: PayrollItemUpdateManyWithWhereWithoutJobInput | PayrollItemUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: PayrollItemScalarWhereInput | PayrollItemScalarWhereInput[]
  }

  export type PayrollItemUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<PayrollItemCreateWithoutJobInput, PayrollItemUncheckedCreateWithoutJobInput> | PayrollItemCreateWithoutJobInput[] | PayrollItemUncheckedCreateWithoutJobInput[]
    connectOrCreate?: PayrollItemCreateOrConnectWithoutJobInput | PayrollItemCreateOrConnectWithoutJobInput[]
    upsert?: PayrollItemUpsertWithWhereUniqueWithoutJobInput | PayrollItemUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: PayrollItemCreateManyJobInputEnvelope
    set?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    disconnect?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    delete?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    connect?: PayrollItemWhereUniqueInput | PayrollItemWhereUniqueInput[]
    update?: PayrollItemUpdateWithWhereUniqueWithoutJobInput | PayrollItemUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: PayrollItemUpdateManyWithWhereWithoutJobInput | PayrollItemUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: PayrollItemScalarWhereInput | PayrollItemScalarWhereInput[]
  }

  export type PayrollJobCreateNestedOneWithoutItemsInput = {
    create?: XOR<PayrollJobCreateWithoutItemsInput, PayrollJobUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PayrollJobCreateOrConnectWithoutItemsInput
    connect?: PayrollJobWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPayrollItemStatusFieldUpdateOperationsInput = {
    set?: $Enums.PayrollItemStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PayrollJobUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<PayrollJobCreateWithoutItemsInput, PayrollJobUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PayrollJobCreateOrConnectWithoutItemsInput
    upsert?: PayrollJobUpsertWithoutItemsInput
    connect?: PayrollJobWhereUniqueInput
    update?: XOR<XOR<PayrollJobUpdateToOneWithWhereWithoutItemsInput, PayrollJobUpdateWithoutItemsInput>, PayrollJobUncheckedUpdateWithoutItemsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedEnumPayrollJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollJobStatus | EnumPayrollJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollJobStatusFilter<$PrismaModel> | $Enums.PayrollJobStatus
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumPayrollJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollJobStatus | EnumPayrollJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollJobStatus[] | ListEnumPayrollJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollJobStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollJobStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumPayrollItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollItemStatus | EnumPayrollItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollItemStatusFilter<$PrismaModel> | $Enums.PayrollItemStatus
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumPayrollItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollItemStatus | EnumPayrollItemStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollItemStatus[] | ListEnumPayrollItemStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollItemStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollItemStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollItemStatusFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type PayrollItemCreateWithoutJobInput = {
    id?: string
    employeeAccountId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.PayrollItemStatus
    transactionId?: string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type PayrollItemUncheckedCreateWithoutJobInput = {
    id?: string
    employeeAccountId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.PayrollItemStatus
    transactionId?: string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type PayrollItemCreateOrConnectWithoutJobInput = {
    where: PayrollItemWhereUniqueInput
    create: XOR<PayrollItemCreateWithoutJobInput, PayrollItemUncheckedCreateWithoutJobInput>
  }

  export type PayrollItemCreateManyJobInputEnvelope = {
    data: PayrollItemCreateManyJobInput | PayrollItemCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type PayrollItemUpsertWithWhereUniqueWithoutJobInput = {
    where: PayrollItemWhereUniqueInput
    update: XOR<PayrollItemUpdateWithoutJobInput, PayrollItemUncheckedUpdateWithoutJobInput>
    create: XOR<PayrollItemCreateWithoutJobInput, PayrollItemUncheckedCreateWithoutJobInput>
  }

  export type PayrollItemUpdateWithWhereUniqueWithoutJobInput = {
    where: PayrollItemWhereUniqueInput
    data: XOR<PayrollItemUpdateWithoutJobInput, PayrollItemUncheckedUpdateWithoutJobInput>
  }

  export type PayrollItemUpdateManyWithWhereWithoutJobInput = {
    where: PayrollItemScalarWhereInput
    data: XOR<PayrollItemUpdateManyMutationInput, PayrollItemUncheckedUpdateManyWithoutJobInput>
  }

  export type PayrollItemScalarWhereInput = {
    AND?: PayrollItemScalarWhereInput | PayrollItemScalarWhereInput[]
    OR?: PayrollItemScalarWhereInput[]
    NOT?: PayrollItemScalarWhereInput | PayrollItemScalarWhereInput[]
    id?: UuidFilter<"PayrollItem"> | string
    jobId?: UuidFilter<"PayrollItem"> | string
    employeeAccountId?: UuidFilter<"PayrollItem"> | string
    amount?: DecimalFilter<"PayrollItem"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"PayrollItem"> | string
    status?: EnumPayrollItemStatusFilter<"PayrollItem"> | $Enums.PayrollItemStatus
    transactionId?: UuidNullableFilter<"PayrollItem"> | string | null
    error?: StringNullableFilter<"PayrollItem"> | string | null
    createdAt?: DateTimeFilter<"PayrollItem"> | Date | string
  }

  export type PayrollJobCreateWithoutItemsInput = {
    id?: string
    employerAccountId: string
    status?: $Enums.PayrollJobStatus
    totalItems: number
    processedItems?: number
    failedItems?: number
    checkpoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollJobUncheckedCreateWithoutItemsInput = {
    id?: string
    employerAccountId: string
    status?: $Enums.PayrollJobStatus
    totalItems: number
    processedItems?: number
    failedItems?: number
    checkpoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollJobCreateOrConnectWithoutItemsInput = {
    where: PayrollJobWhereUniqueInput
    create: XOR<PayrollJobCreateWithoutItemsInput, PayrollJobUncheckedCreateWithoutItemsInput>
  }

  export type PayrollJobUpsertWithoutItemsInput = {
    update: XOR<PayrollJobUpdateWithoutItemsInput, PayrollJobUncheckedUpdateWithoutItemsInput>
    create: XOR<PayrollJobCreateWithoutItemsInput, PayrollJobUncheckedCreateWithoutItemsInput>
    where?: PayrollJobWhereInput
  }

  export type PayrollJobUpdateToOneWithWhereWithoutItemsInput = {
    where?: PayrollJobWhereInput
    data: XOR<PayrollJobUpdateWithoutItemsInput, PayrollJobUncheckedUpdateWithoutItemsInput>
  }

  export type PayrollJobUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employerAccountId?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollJobStatusFieldUpdateOperationsInput | $Enums.PayrollJobStatus
    totalItems?: IntFieldUpdateOperationsInput | number
    processedItems?: IntFieldUpdateOperationsInput | number
    failedItems?: IntFieldUpdateOperationsInput | number
    checkpoint?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollJobUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employerAccountId?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollJobStatusFieldUpdateOperationsInput | $Enums.PayrollJobStatus
    totalItems?: IntFieldUpdateOperationsInput | number
    processedItems?: IntFieldUpdateOperationsInput | number
    failedItems?: IntFieldUpdateOperationsInput | number
    checkpoint?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollItemCreateManyJobInput = {
    id?: string
    employeeAccountId: string
    amount: Decimal | DecimalJsLike | number | string
    currency: string
    status?: $Enums.PayrollItemStatus
    transactionId?: string | null
    error?: string | null
    createdAt?: Date | string
  }

  export type PayrollItemUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollItemUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollItemUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeAccountId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumPayrollItemStatusFieldUpdateOperationsInput | $Enums.PayrollItemStatus
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PayrollJobCountOutputTypeDefaultArgs instead
     */
    export type PayrollJobCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayrollJobCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PayrollJobDefaultArgs instead
     */
    export type PayrollJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayrollJobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PayrollItemDefaultArgs instead
     */
    export type PayrollItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayrollItemDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}