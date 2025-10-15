type Macro = {
    name: string;
    params: string[];
    content: string;
};

type MacroMap = Map<string, Macro>;

const macros: MacroMap = new Map();

export function getMacro(name: string): Macro | undefined {
    return macros.get(name);
}

export function defineMacro(name: string, params: string[], content: string): void {
    macros.set(name, { name, params, content });
}