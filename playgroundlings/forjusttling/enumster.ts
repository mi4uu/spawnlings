
enum AcroStatus {
  FullDataProvided = 1,
  ReadyForReview = 2,
  ReadyToSendToPsp = 3,
  SentToPsp = 4,
  DidNotFight = 9,
  WaitingForData = 10,
  BeingReviewed = 12,
  BuildingEvidence = 13,
  ReadyForPeerReview = 14,
  CheckNeeded = 15,
}
const ac =AcroStatus
//    ^?

type avt = keyof typeof  ac
//    ^?

type acv = typeof  ac[avt]
//    ^?
// console.log(AvStatus[avt])
type typet = typeof AcroStatus.BeingReviewed
//   ^?
const testv1 = AcroStatus[AcroStatus.BeingReviewed]
//    ^?

let t:any = AcroStatus.BeingReviewed

        const aaaa=String(AcroStatus)
//             ^?

const bbbb = `${AcroStatus}`
//      ^?
for (const key in AcroStatus) {
  console.log(key)
          //  ^?
}



interface AnyObject extends Object {
    [key: string]: any;
  }

  type Sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  type StringToPath<StringPath extends string> = StringToPath_<StringPath>;



  type StringToPath_<
    StringPath extends string,
    Path extends string[] = []
  > = StringPath extends `${infer Key}.${infer Rest}`
    ? StringToPath_<Rest, AppendPath<Path, Key>>
    : AppendPath<Path, StringPath>;

  type AppendPath<
    Path extends string[],
    Item extends string
  > = Item extends '' ? Path : [...Path, Item];

  const stringToPath = <T extends string>(path: T) =>
    path.split('.').filter(Boolean) as StringToPath<T>;

  type Get<
    Value extends AnyObject,
    StringPath extends string,
    Default = undefined
  > =
    StringPath extends unknown
      ? Get_<Value, StringToPath<StringPath>, Default>
      : never;

  type Get_<
    Value,
    Path extends string[],
    Default = undefined,
    Index extends number = 0
  > = {
    0: Value extends AnyObject // 1
      ? GetKey<Value, Path, Default, Index> // 2
      : Default;
    1: Value extends undefined ? Default : Value; // 5
  }[Index extends Path['length'] ? 1 : 0];

  type GetArrayValue<T extends readonly unknown[]> = T extends ReadonlyArray<
    infer U
  >
    ? U
    : never;

  type IsTuple<T extends readonly unknown[]> = number extends T['length'] // 2
    ? false
    : true;

  type IsNumericKey<T extends string> = T extends `${number}` ? true : false;

  type GetKey<
    Value extends AnyObject,
    Path extends string[],
    Default,
    Index extends number
  > = Path[Index] extends keyof Value
    ? Get_<Value[Path[Index]], Path, Default, Sequence[Index]>
    : Value extends readonly unknown[] // 1
    ? IsNumericKey<Path[Index]> extends false // 2
      ? Default
      : IsTuple<Value> extends true // 3
      ? Default
      : Get_<
          GetArrayValue<Value> | undefined, // 4
          Path,
          Default,
          Sequence[Index]
        >
    : Default; // 5

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  const hasOwn = <T extends AnyObject>(
    obj: T,
    key: PropertyKey
  ): key is keyof T => hasOwnProperty.call(obj, key);

  const isObject = (value: unknown): value is AnyObject =>
    typeof value === 'object' && value !== null;

  const isUndefined = (value: unknown): value is undefined =>
    typeof value === 'undefined';

  interface GetFunction {
    <Obj extends AnyObject, Path extends string, Default = undefined>(
      object: Obj,
      path: Path,
      defaultValue?: Default
    ): Get<Obj, Path, Default>;
  }

  const get: GetFunction = (object, stringPath, defaultValue) => {
    const path = stringToPath(stringPath);
    let index = -1;
    const lastIndex = path.length - 1;
    while (++index <= lastIndex) {
      const key = path[index]!;
      if (hasOwn(object, key)) {
        if (lastIndex === index) {
          return isUndefined(object[key]) ? defaultValue : object[key];
        }
        if (isObject(object[key])) {
          object = object[key];
        }
      } else {
        return defaultValue;
      }
    }
    return object;
  };

 type dfsfsdfsdf =  GetKey<AcroStatus, ["FullDataProvided"], undefined, 0>

  type AcroStatusKey = keyof typeof AcroStatus; // "FullDataProvided" | "ReadyForReview" | ...

  function getStatusName(status: AcroStatusKey): AcroStatus {
    return AcroStatus[status];
  }

  const statusName = getStatusName("ReadyToSendToPsp"); // "ReadyToSendToPsp"

   const AcroStatusList = Object.values(AcroStatus).filter(Number) as AcroStatus[];
////        ^?
   const editableStatuses: AcroStatus[] = [
      AcroStatus.FullDataProvided,
      AcroStatus.BuildingEvidence,
      AcroStatus.ReadyForReview,
      AcroStatus.ReadyToSendToPsp,
      AcroStatus.DidNotFight,
      AcroStatus.ReadyForPeerReview,
      AcroStatus.BeingReviewed,
      AcroStatus.CheckNeeded,
  ];
   const acroStatusLabels = {
      [AcroStatus.FullDataProvided]: 'Full data provided',
      [AcroStatus.ReadyForReview]: 'Ready for review',
      [AcroStatus.ReadyToSendToPsp]: 'Ready to send to PSP',
      [AcroStatus.BeingReviewed]: 'Being reviewed',
      [AcroStatus.SentToPsp]: 'Sent to PSP',
      [AcroStatus.DidNotFight]: 'Did not fight',
      [AcroStatus.WaitingForData]: 'Waiting for data',
      [AcroStatus.BuildingEvidence]: 'Building evidence',
      [AcroStatus.ReadyForPeerReview]: 'Ready for peer review',
      [AcroStatus.CheckNeeded]: 'Check needed',
  } as const;



  const isobj = isObject(AcroStatus)
  //     ^?
  console.log(isobj)
/// get all keys

const allKeys = Object.keys(AcroStatus)

console.log({allKeys})



function getEnumKeys<T extends Record<string, unknown>>(enumObj: T) {
  const keys = Object.keys(enumObj) as Array<keyof T>;
  return keys
}


const dfsfsdfdf = getEnumKeys(AcroStatus)


function enumToObject<E extends Record<string, unknown>>(enumObj: E): {[K in keyof E]: E[K]} {
  const obj: {[K in keyof E]: E[K]} = {} as {[K in keyof E]: E[K]};
  for (const key in enumObj) {
    if (isNaN(Number(key))) {
      obj[key as keyof E] = enumObj[key as keyof E];
    }
  }
  return obj;
}
const aaadsdfdsa = enumToObject(AcroStatus)
    //  ^?
// how TS se this: mad :()
// const test: {
//     id: string;
//     value: any;
//     disable: boolean;
// }[]



  console.log('--------------------')

