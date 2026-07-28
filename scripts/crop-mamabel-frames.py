"""Aggressive iterative white/near-white frame crop for IG square pads."""
from __future__ import annotations

from pathlib import Path
from PIL import Image

DEST = Path("public/demos/mamabel")
THRESH = 228


def edge_white_ratio(im: Image.Image, side: str) -> float:
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    if side == "top":
        return sum(1 for x in range(w) if min(px[x, 0]) >= THRESH) / w
    if side == "bottom":
        return sum(1 for x in range(w) if min(px[x, h - 1]) >= THRESH) / w
    if side == "left":
        return sum(1 for y in range(h) if min(px[0, y]) >= THRESH) / h
    return sum(1 for y in range(h) if min(px[w - 1, y]) >= THRESH) / h


def content_box(im: Image.Image, ratio: float = 0.92) -> tuple[int, int, int, int] | None:
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()

    def row_white(y: int) -> bool:
        return sum(1 for x in range(w) if min(px[x, y]) >= THRESH) / w >= ratio

    def col_white(x: int) -> bool:
        return sum(1 for y in range(h) if min(px[x, y]) >= THRESH) / h >= ratio

    top, bottom, left, right = 0, h - 1, 0, w - 1
    while top < bottom and row_white(top):
        top += 1
    while bottom > top and row_white(bottom):
        bottom -= 1
    while left < right and col_white(left):
        left += 1
    while right > left and col_white(right):
        right -= 1

    if top == 0 and bottom == h - 1 and left == 0 and right == w - 1:
        return None
    bw, bh = right - left + 1, bottom - top + 1
    if bw < 64 or bh < 64:
        return None
    return left, top, right + 1, bottom + 1


def crop_until_stable(path: Path, max_passes: int = 6) -> int:
    passes = 0
    for _ in range(max_passes):
        im = Image.open(path)
        box = content_box(im, ratio=0.90)
        if not box:
            box = content_box(im, ratio=0.85)
        if not box:
            break
        cropped = im.crop(box).convert("RGB")
        if cropped.size == im.size:
            break
        cropped.save(path, "JPEG", quality=90, optimize=True)
        passes += 1
        print(f"  pass {passes} {path.name} {im.size} -> {cropped.size}")
    return passes


def main() -> None:
    patterns = ["top-*.jpg", "rank-*.jpg", "ig-*.jpg", "torta-*.jpg", "galletas*.jpg",
                "lemon-pie.jpg", "selva-negra.jpg", "balcarce.jpg", "bombones.jpg",
                "hero.jpg", "fb-gallery-*.jpg"]
    # ponytail: never crop curso-* — text-in-image (flyer/IG) gets clipped
    files: list[Path] = []
    for pat in patterns:
        files.extend(DEST.glob(pat))
    files = sorted(set(files))
    total = 0
    for path in files:
        if path.name.startswith("logo"):
            continue
        print(path.name)
        total += crop_until_stable(path)
    print(f"done passes={total}")


if __name__ == "__main__":
    main()
