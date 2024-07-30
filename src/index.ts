import * as wasm from '../pkg/svg_converter_wasm';

export type SyncInitInput = BufferSource | WebAssembly.Module;

export function convertSvgToPng(svgData: string): Uint8Array {
  return wasm.convert_svg_to_png(svgData);
}

export function convertSvgToJpeg(svgData: string, quality: number): Uint8Array {
  return wasm.convert_svg_to_jpeg(svgData, quality);
}

export default function iniSync(module: SyncInitInput): wasm.InitOutput {
  return wasm.initSync(module);
}
