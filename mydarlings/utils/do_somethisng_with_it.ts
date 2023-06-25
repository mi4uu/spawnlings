type Address = {
  postCode: string;
  street: [string, string | undefined]
}

type UserInfo = { address: Address previousAddress?: Address }

const data: UserInfo = {
  address: {
    postCode: "SW1P 3PA",
     street: ["20 Deans Yd", "undefined"],
    ]
  }
}


type Props = { user: UserInfo }
export const Address = ({ user }: Props) = (div{ get(user, 'address.street').filter(Boolean).join(', ') } / div)
type Address = { postCode: string street: { line1: string line2?: string } }
type IsDotSeparatedT extends string = T extends `${string}.${string}` ? true : false
type A = IsDotSeparated'address.street' // truetype B = IsDotSeparated'address' // false
type GetLeftT extends string = T extends `${infer Left
}.${ string }` ? Left : undefined
type A = GetLeft'address.street' // 'address'type B = GetLeft'address' // undefined
type GetFieldTypeObj, Path = Path extends `${infer Left }.${ string } ` ? Left extends keyof Obj ? Obj[Left] : undefined : Path extends keyof Obj ? Obj[Path] : undefined
type A = GetFieldTypeUserInfo, 'address.street' // Address, for now we only taking a left part of a pathtype B = GetFieldTypeUserInfo, 'address' // Addresstype C = GetFieldTypeUserInfo, 'street' // undefined
export type GetFieldTypeObj, Path = Path extends `${infer Left }.${infer Right } ` ? Left extends keyof Obj ? GetFieldTypeObj[Left], Right : undefined : Path extends keyof Obj ? Obj[Path] : undefined
type A = GetFieldTypeUserInfo, 'address.street' // { line1: string; line2?: string | undefined; }type B = GetFieldTypeUserInfo, 'address' // Addresstype C = GetFieldTypeUserInfo, 'street' // undefined
type A = GetFieldTypeUserInfo, 'previousAddress.street' // undefined
export type GetFieldTypeObj, Path = Path extends `${infer Left }.${infer Right } ` ? Left extends keyof Obj ? GetFieldTypeExcludeObj[Left], undefined, Right | ExtractObj[Left], undefined : undefined : Path extends keyof Obj ? Obj[Path] : undefined
// { line1: string; line2?: string | undefined; } | undefinedtype A = GetFieldTypeUserInfo, 'previousAddress.street'
export function getValue TData, TPath extends string, TDefault = GetFieldTypeTData, TPath( data: TData, path: TPath, defaultValue?: TDefault): GetFieldTypeTData, TPath | TDefault { const value = path .split('.') .reduceGetFieldTypeTData, TPath( (value, key) = (value as any)?.[key], data as any );
return value !== undefined ? value : (defaultValue as TDefault);}
type GetIndexedFieldT, K = K extends keyof T ? T[K] : K extends `${ number } ` ? '0' extends keyof T ? undefined : number extends keyof T ? T[number] : undefined : undefined
type FieldWithPossiblyUndefinedT, Key = | GetFieldTypeExcludeT, undefined, Key | ExtractT, undefined
type IndexedFieldWithPossiblyUndefinedT, Key = | GetIndexedFieldExcludeT, undefined, Key | ExtractT, undefined
export type GetFieldTypeT, P = P extends `${infer Left }.${infer Right } ` ? Left extends keyof T ? FieldWithPossiblyUndefinedT[Left], Right : Left extends `${infer FieldKey } [${ infer IndexKey }]` ? FieldKey extends keyof T ? FieldWithPossiblyUndefinedIndexedFieldWithPossiblyUndefinedT[FieldKey], IndexKey, Right : undefined : undefined : P extends keyof T ? T[P] : P extends `${infer FieldKey } [${ infer IndexKey }]` ? FieldKey extends keyof T ? IndexedFieldWithPossiblyUndefinedT[FieldKey], IndexKey : undefined : undefined
export function getValue TData, TPath extends string, TDefault = GetFieldTypeTData, TPath( data: TData, path: TPath, defaultValue?: TDefault): GetFieldTypeTData, TPath | TDefault { const value = path .split(/[.[\\]]/) .filter(Boolean) .reduceGetFieldTypeTData, TPath( (value, key) = (value as any)?.[key], data as any );
return value !== undefined ? value : (defaultValue as TDefault);}