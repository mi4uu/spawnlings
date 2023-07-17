export let [ name1, name2 ] = [ 5, 8 ] // also var
// dprint-ignore
export const exportsToTest ={
    "file_0.ts": ["export let [name1, name2] = [5,8]; // also var", [
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      }, {
        name: "name2",
        typeOnly: false,
        isDefault: false
      }
    ] ],
    "file_1.ts": ["export const name1 = 1, name2 = 2; // also var, let", [
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      }, {
        name: "name2",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_2.ts": ["export function functionName() \n    {\n    console.log('aa');\n    return 2;\n    }\n    ",
    [
      {
        name: "functionName",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_3.ts": ["export class ClassName \n    {\n    console.log('aa');\n    return 2;\n    }\n    ",
    [
      {
        name: "ClassName",
        typeOnly: false,
        isDefault: false
      }
    ]
  ],
    "file_4.ts": ["export function* generatorFunctionName() \n    {\n    console.log('aa');\n    return 2;\n    }\n    ",
    [
      {
        name: "generatorFunctionName",
        typeOnly: false,
        isDefault: false
      }
    ]
  ],
    "file_5.ts": ["export const { name1, name2: bar } = o;",
    [
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      }, {
        name: "bar",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_6.ts": ["export const [ name1, name2 ] = array;",[
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      }, {
        name: "name2",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_7.ts": ["export { name1, /* …, */ nameN };", [
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      }, {
        name: "nameN",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_8.ts": ["export { variable1 as name1, variable2 as name2, /* …, */ nameN };", [
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      }, {
        name: "name2",
        typeOnly: false,
        isDefault: false
      },
      {
        name: "nameN",
        typeOnly: false,
        isDefault: false
      }
    ]],

    "file_10.ts": ["export { name1 as default  };", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_12.ts": ["export default expression;", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_13.ts": ["export default function functionName() \n    {\n    console.log('aa');\n    return 2;\n    }\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_14.ts": ["export default class ClassName \n    {\n    console.log('aa');\n    return 2;\n    }\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_15.ts": ["export default function* generatorFunctionName() \n    {\n    console.log('aa');\n    return 2;\n    }\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_16.ts": ["export default function () \n    {\n    console.log('aa');\n    return 2;\n    }\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_17.ts": ["export default class \n    {\n    console.log('aa');\n    return 2;\n    }\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_18.ts": ["export default function* () \n    {\n    console.log('aa');\n    return 2;\n    }\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    // "file_19.ts": ["export * from \"module-name\";", [
    //   {
    //     name: "module-name",
    //     typeOnly: false,
    //     isDefault: false
    //   }
    // ]],
    // "file_20.ts": "export * as name1 from \"module-name\";",
    // "file_21.ts": "export { name1, /* …, */ nameN } from \"module-name\";",
    // "file_22.ts": "export { import1 as name1, import2 as name2, /* …, */ nameN } from \"module-name\";",
    // "file_23.ts": "export { default, /* …, */ } from \"module-name\";",
    // "file_24.ts": "export { default as name1 } from \"module-name\";",
    "file_25.ts": ["\n    @SOmeDecorator()\n    export class ClassName {\n    constructor() {\n\n    }\n    }\n    ", [
      {
        name: "ClassName",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_26.ts": ["\n    import x from 'path/to/module';\n    const b = x+1\n    export default b\n    ", [
      {
        name: "default",
        typeOnly: false,
        isDefault: true
      }
    ]],
    "file_27.ts": [`
    console.log('aa')
    const name1 = 1
    const bb=4
    const cccc = "ssds fff"
    export {
  name1, bb, cccc       }  `, [
      {
        name: "name1",
        typeOnly: false,
        isDefault: false
      },
      {
        name: "bb",
        typeOnly: false,
        isDefault: false
      },
      {
        name: "cccc",
        typeOnly: false,
        isDefault: false
      }
    ]],
    "file_28.ts": ["\n        const rnd = ()=>Math.random()*100\n        export type Rnd = typeof rnd\n        export type RndReturn = ReturnType<typeof rnd>\n    ",[
      {
        name: "Rnd",
        typeOnly: true,
        isDefault: false
      },
      {
        name: "RndReturn",
        typeOnly: true,
        isDefault: false
      }
    ]]
  } as const
