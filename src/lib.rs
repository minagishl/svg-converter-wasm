use wasm_bindgen::prelude::*;
use usvg::{Options, Tree, FitTo};
use resvg::render;
use tiny_skia::Pixmap;
use image::{DynamicImage, ImageOutputFormat};
use std::io::Cursor;

#[wasm_bindgen]
pub fn convert_svg_to_png(svg_data: &str) -> Vec<u8> {
    convert_svg(svg_data, ImageOutputFormat::Png)
}

#[wasm_bindgen]
pub fn convert_svg_to_jpeg(svg_data: &str, quality: u8) -> Vec<u8> {
    convert_svg_with_quality(svg_data, ImageOutputFormat::Jpeg(quality))
}

fn convert_svg(svg_data: &str, format: ImageOutputFormat) -> Vec<u8> {
    let opt = Options::default();
    let rtree = Tree::from_str(svg_data, &opt.to_ref()).unwrap();
    let fit_to = FitTo::Original;
    let pixmap_size = fit_to.fit_to(rtree.svg_node().size.to_screen_size()).unwrap();
    let mut pixmap = Pixmap::new(pixmap_size.width(), pixmap_size.height()).unwrap();
    render(&rtree, fit_to, pixmap.as_mut());

    let img = DynamicImage::ImageRgba8(image::RgbaImage::from_raw(pixmap.width(), pixmap.height(), pixmap.take()).unwrap());
    let mut buffer = Vec::new();
    img.write_to(&mut Cursor::new(&mut buffer), format).unwrap();

    buffer
}

fn convert_svg_with_quality(svg_data: &str, format: ImageOutputFormat) -> Vec<u8> {
    convert_svg(svg_data, format)
}
