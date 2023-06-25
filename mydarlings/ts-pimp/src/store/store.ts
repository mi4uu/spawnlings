import { getAllFiles } from "@src/getters/get-all-files";

export const store: Map<
  ReturnType<typeof getWorkspaceName>,
  ReturnType<typeof genWorkspace>
> = new Map();

const WORKSPACE_NAME_SEPARATOR = "__" as const;
type WORKSPACE_NAME_SEPARATOR = typeof WORKSPACE_NAME_SEPARATOR;

export type WorkspaceName<
  DIR extends string,
  TSCONFIG extends string,
> = `${DIR}${WORKSPACE_NAME_SEPARATOR}${TSCONFIG}`;

export const getWorkspaceName = <DIR extends string, TSCONFIG extends string>(
  dir: DIR,
  tsconfig: TSCONFIG,
): WorkspaceName<DIR, TSCONFIG> =>
  `${dir}${WORKSPACE_NAME_SEPARATOR}${tsconfig}`;

export const getWorkspace = <DIR extends string, TSCONFIG extends string>(
  dir: DIR,
  tsconfig: TSCONFIG,
) => {
  const workspaceName = getWorkspaceName(dir, tsconfig);
  const workspace = store.get(workspaceName);
  if (!workspace) {
    const newWorkspace = store.set(workspaceName, genWorkspace(dir, tsconfig));
    return newWorkspace;
  }
  return workspace;
};

export const genWorkspace = <DIR extends string, TSCONFIG extends string>(
  dir: DIR,
  tsconfig: TSCONFIG,
) => ({
  baseDir: dir,
  tsConfigPath: tsconfig,
  allFiles: getAllFiles(dir),
});
