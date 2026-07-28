"""
Re-export Mamabel picked images: EXIF rotate, mild enhance, optional deskew.
Run: python scripts/improve-mamabel-picked.py
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

SRC = Path("content/mamabel/better ones")
OUT = Path("public/demos/mamabel/picked")

# dest -> (source, max_edge, tilt_deg CW+, notes)
JOBS: list[tuple[str, str, int, float]] = [
    ("hero.jpg", "16423085_1247979501960237_6275321741240210923_o.jpg", 1920, 0.0),
    ("black-bows.jpg", "SANY0080.JPG", 1920, 0.0),
    ("black-elegant.jpg", "20140405_190202.jpg", 1600, -2.4),
    ("black-cars.jpg", "SANY0091.JPG", 1600, 0.0),
    ("black-maleficent.jpg", "IMG_20170421_092050558.jpg", 1600, 5.0),
    ("black-rock.jpg", "10626226_689149541176572_5720908616390328413_o.jpg", 1600, 1.5),
    ("black-ddm.jpg", "17966385_1325778770846976_1790103810812018808_o.jpg", 1600, 0.0),
    ("black-bluebow.jpg", "IMG-20140509-WA0041.jpg", 1200, 0.0),
    ("black-cupcakes-books.jpg", "SANY0074.JPG", 1600, 0.0),
    ("black-cupcakes-roses.jpg", "SANY0105.JPG", 1600, 0.0),
    ("black-cupcakes-close.jpg", "SANY0111.JPG", 1600, 0.0),
]


def compress_highlights(im: Image.Image, thresh: int = 205, amount: float = 0.4) -> Image.Image:
    """Pull down blown whites without crushing midtones."""
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
    """Slightly open crushed blacks (studio black bg stays dark)."""
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
        # keep studio black; only tiny shadow lift for subject
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
    # expand with black (studio) then crop back to original aspect content
    rotated = im.rotate(-deg, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(0, 0, 0))
    # crop center to remove rotation triangles while keeping most content
    w, h = im.size
    rw, rh = rotated.size
    # scale factor from expand
    # take center crop matching original aspect, as large as fits
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


def process(dest: str, src_name: str, max_edge: int, tilt: float) -> None:
    src = SRC / src_name
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im = deskew(im, tilt)
    im = fit_max(im, max_edge)
    im = enhance(im, hero=(dest == "hero.jpg"))
    out = OUT / dest
    im.save(out, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"ok {dest:28} {im.size[0]}x{im.size[1]} tilt={tilt:+.1f} from {src_name}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for dest, src_name, max_edge, tilt in JOBS:
        process(dest, src_name, max_edge, tilt)


if __name__ == "__main__":
    main()
