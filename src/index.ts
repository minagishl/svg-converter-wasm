import * as wasm from '../pkg/svg_converter_wasm';

export function convertSvgToPng(svgData: string): Uint8Array {
  return wasm.convert_svg_to_png(svgData);
}

export function convertSvgToJpeg(svgData: string, quality: number): Uint8Array {
  return wasm.convert_svg_to_jpeg(svgData, quality);
}
