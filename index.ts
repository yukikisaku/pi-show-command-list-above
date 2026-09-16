import { CustomEditor, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

const PATCH_KEY = Symbol.for("pi-extension.command-list-above.patch");

type RenderFn = (this: CustomEditor, width: number) => string[];

type PatchState = {
	originalRender: RenderFn;
	patchedRender: RenderFn;
};

type AutocompleteListLike = {
	render(width: number): string[];
};

type EditorInternals = {
	autocompleteState?: unknown;
	autocompleteList?: AutocompleteListLike;
	paddingX?: number;
};

type PatchablePrototype = {
	render: RenderFn;
} & Record<PropertyKey, unknown>;

function getPatchState(proto: PatchablePrototype): PatchState | undefined {
	return proto[PATCH_KEY] as PatchState | undefined;
}

function getEditorContentWidth(editor: CustomEditor, width: number): number {
	const internals = editor as unknown as EditorInternals;
	const rawPadding = typeof internals.paddingX === "number" && Number.isFinite(internals.paddingX)
		? Math.max(0, Math.floor(internals.paddingX))
		: 0;
	const maxPadding = Math.max(0, Math.floor((width - 1) / 2));
	const paddingX = Math.min(rawPadding, maxPadding);
	return Math.max(1, width - paddingX * 2);
}

function getAutocompleteLineCount(editor: CustomEditor, width: number): number {
	const internals = editor as unknown as EditorInternals;
	if (!internals.autocompleteState || !internals.autocompleteList) return 0;

	try {
		return internals.autocompleteList.render(getEditorContentWidth(editor, width)).length;
	} catch {
		// pi内部の実装が変わった場合は、表示を壊さず標準位置のままにする。
		return 0;
	}
}

function moveCommandListAbove(editor: CustomEditor, renderedLines: string[], width: number): string[] {
	const autocompleteLineCount = getAutocompleteLineCount(editor, width);
	if (autocompleteLineCount <= 0 || autocompleteLineCount >= renderedLines.length) {
		return renderedLines;
	}

	const autocompleteStart = renderedLines.length - autocompleteLineCount;
	const editorLines = renderedLines.slice(0, autocompleteStart);
	const autocompleteLines = renderedLines.slice(autocompleteStart);
	return [...autocompleteLines, ...editorLines];
}

function installCommandListAbovePatch(): void {
	const proto = CustomEditor.prototype as unknown as PatchablePrototype;
	if (getPatchState(proto)) return;

	const originalRender = proto.render;
	const patchedRender: RenderFn = function renderCommandListAbove(this: CustomEditor, width: number): string[] {
		return moveCommandListAbove(this, originalRender.call(this, width), width);
	};

	proto.render = patchedRender;
	proto[PATCH_KEY] = { originalRender, patchedRender } satisfies PatchState;
}

function uninstallCommandListAbovePatch(): void {
	const proto = CustomEditor.prototype as unknown as PatchablePrototype;
	const state = getPatchState(proto);
	if (!state) return;

	if (proto.render === state.patchedRender) {
		proto.render = state.originalRender;
	}
	delete proto[PATCH_KEY];
}

export default function commandListAboveExtension(pi: ExtensionAPI): void {
	installCommandListAbovePatch();

	pi.on("session_shutdown", async () => {
		uninstallCommandListAbovePatch();
	});
}
