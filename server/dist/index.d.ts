/// <reference types="node" />
import Options from "./options";
export default function ProjectManagerServer(...args: ConstructorParameters<typeof Options>): Promise<import("net").Server>;
