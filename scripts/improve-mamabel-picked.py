"""
Re-export Mamabel picked images: EXIF rotate, enhance, deskew, center on black.
Run: python scripts/improve-mamabel-picked.py
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

SRC = Path("content/mamabel/better ones")
OUT = Path("public/demos/mamabel/picked")

# dest -> (source, max_edge, tilt_deg CW+, center_on_black)
JOBS: list[tuple[str, str, int, float, bool]] = [
    ("hero.jpg", "16423085_1247979501960237_6275321741240210923_o.jpg", 1920, 0.0, False),
    ("black-bows.jpg", "SANY0080.JPG", 1920, 0.0, True),
    ("black-elegant.jpg", "20140405_190202.jpg", 1600, -2.4, True),
    ("black-cars.jpg", "SANY0091.JPG", 1600, 0.0, True),
    ("black-maleficent.jpg", "IMG_20170421_092050558.jpg", 1600, 0.0, True),
    ("black-rock.jpg", "10626226_689149541176572_5720908616390328413_o.jpg", 1600, 0.0, True),
    ("black-ddm.jpg", "17966385_1325778770846976_1790103810812018808_o.jpg", 1600, 0.0, True),
    ("black-bluebow.jpg", "IMG-20140509-WA0041.jpg", 1200, 0.0, True),
    ("black-cupcakes-books.jpg", "SANY0074.JPG", 1600, 0.0, True),
    ("black-cupcakes-roses.jpg", "SANY0105.JPG", 1600, 0.0, True),
    ("black-cupcakes-close.jpg", "SANY0111.JPG", 1600, 0.0, True),
]


def compress_highlights(im: Image.Image, thresh: int = 205, amount: float = 0.4) -> Image.Image:
    channels = []
    for ch in im.split():
        lut = []
        for v in range(256):
            if v <= thresh:
                lut.append(v)
            else:
                t = (v - thresh) / (255 - thresh)
                lut.append(int(thresh + (255 - thresh) * (t * (1.0 - amount))))
        channels.append(ch.point(lut))
    return Image.merge("RGB", channels)


def lift_shadows(im: Image.Image, floor: int = 12, amount: float = 0.18) -> Image.Image:
    channels = []
    for ch in im.split():
        lut = []
        for v in range(256):
            if v >= 80:
                lut.append(v)
            else:
                lut.append(int(v + (80 - v) * amount + floor * amount * 0.15))
        channels.append(ch.point(lut))
    return Image.merge("RGB", channels)


def enhance(im: Image.Image, *, hero: bool = False) -> Image.Image:
    im = compress_highlights(im, thresh=200 if hero else 210, amount=0.45 if hero else 0.35)
    if not hero:
        im = lift_shadows(im, floor=8, amount=0.12)
    else:
        im = lift_shadows(im, floor=10, amount=0.22)
    im = ImageEnhance.Contrast(im).enhance(1.06 if hero else 1.04)
    im = ImageEnhance.Color(im).enhance(1.04 if hero else 1.03)
    im = ImageEnhance.Sharpness(im).enhance(1.12)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=3))
    return im


def fit_max(im: Image.Image, max_edge: int) -> Image.Image:
    w, h = im.size
    scale = min(1.0, max_edge / max(w, h))
    if scale >= 1:
        return im
    return im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def deskew(im: Image.Image, deg: float) -> Image.Image:
    if abs(deg) < 0.05:
        return im
    rotated = im.rotate(-deg, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(0, 0, 0))
    w, h = im.size
    rw, rh = rotated.size
    aspect = w / h
    if rw / rh > aspect:
        nh = rh
        nw = int(nh * aspect)
    else:
        nw = rw
        nh = int(nw / aspect)
    left = (rw - nw) // 2
    top = (rh - nh) // 2
    return rotated.crop((left, top, left + nw, top + nh))


def content_bbox(im: Image.Image, thresh: int = 36) -> tuple[int, int, int, int] | None:
    """BBox of non-black pixels (studio subject)."""
    gray = im.convert("L")
    mask = gray.point(lambda v: 255 if v > thresh else 0)
    return mask.getbbox()


def center_on_black(
    im: Image.Image,
    *,
    aspect: float = 0.8,
    margin: float = 0.1,
    max_edge: int = 1600,
) -> Image.Image:
    """
    Place subject centered on a black canvas (symmetric L/R, balanced T/B).
    aspect = width/height (0.8 → 4:5 gallery).
    """
    box = content_bbox(im)
    if not box:
        return im
    l, t, r, b = box
    # trim to content then add uniform margin in content space
    subject = im.crop((l, t, r, b))
    sw, sh = subject.size
    pad = int(max(sw, sh) * margin)
    inner_w, inner_h = sw + 2 * pad, sh + 2 * pad

    # canvas: fit inner box into target aspect, then scale to max_edge
    if inner_w / inner_h > aspect:
        cw = inner_w
        ch = int(cw / aspect)
    else:
        ch = inner_h
        cw = int(ch * aspect)

    scale = min(1.0, max_edge / max(cw, ch))
    cw, ch = max(1, int(cw * scale)), max(1, int(ch * scale))
    sub = subject.resize(
        (max(1, int(sw * scale)), max(1, int(sh * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGB", (cw, ch), (0, 0, 0))
    x = (cw - sub.size[0]) // 2
    y = (ch - sub.size[1]) // 2
    canvas.paste(sub, (x, y))
    return canvas


def process(dest: str, src_name: str, max_edge: int, tilt: float, do_center: bool) -> None:
    src = SRC / src_name
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im = deskew(im, tilt)
    if do_center:
        im = center_on_black(im, aspect=0.8, margin=0.09, max_edge=max_edge)
    else:
        im = fit_max(im, max_edge)
    im = enhance(im, hero=(dest == "hero.jpg"))
    out = OUT / dest
    im.save(out, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"ok {dest:28} {im.size[0]}x{im.size[1]} center={do_center} from {src_name}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for dest, src_name, max_edge, tilt, do_center in JOBS:
        process(dest, src_name, max_edge, tilt, do_center)


if __name__ == "__main__":
    main()
