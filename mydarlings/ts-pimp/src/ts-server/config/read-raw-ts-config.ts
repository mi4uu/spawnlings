import ts from "typescript";

export const readRawTsConfig = async (
  override: TsConfigOverride,
  tsconfigPath: string | undefined = undefined,
) => {
  if (!tsconfigPath) {
    throw Error(`tsconfig not found. path: ${tsconfigPath}`);
  }
  try {
   const file =  Bun.file(tsconfigPath);
   if(file.size === 0) {
     throw Error(`File does not exist: ${tsconfigPath}`);
   }
   let  config: ts.CompilerOptions
   try{
    config = await Bun.file(tsconfigPath).json();
   } catch(error) {
     console.warn(error)
     console.warn(`tsconfig parsing failed . path: ${tsconfigPath}`);
     let fileContent:string ='--reading-didnt-went-well--'
     try {
      console.log('trying to read as text first')
      fileContent = await file.text();
      config = JSON.parse(fileContent)

     } catch(error){
       console.warn(error)
       console.log({fileContent})
       throw Error(`tsconfig parsing failed . path: ${tsconfigPath}`);
     }

   }


  config.compilerOptions = Object.assign(
    {},
    config.compilerOptions,
    override.compilerOptions,
  );
  if (override.include) {
    config.include = override.include;
  }
  if (override.exclude) {
    config.exclude = override.exclude;
  }
  if (override.files) {
    config.files = override.files;
  }
  if (override.extends) {
    config.files = override.extends;
  }

  return config;
  } catch(error){
    console.log(error)
  if (error instanceof Error) {
    console.log(error.stack)


  } else {
    console.log(`error of unknown instance: ${JSON.stringify(error)}`);
  }
  throw Error(`tsconfig parsing failed . path: ${tsconfigPath}`);
}
};

export interface TsConfigOverride {
  compilerOptions?: ts.CompilerOptions;
  include?: string[];
  exclude?: string[];
  files?: string[];
  extends?: string;
}
