#!/usr/bin/env python3
"""Gera as imagens de Open Graph em assets/og-*.png. Rode de novo se o nome ou a marca mudar."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets"
W, H = 1200, 630
REGULAR = "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"
MEDIUM = "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"
SEMIBOLD = "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def vertical_gradient(top, bottom):
    image = Image.new("RGB", (W, H))
    pixels = image.load()
    for y in range(H):
        blend = y / (H - 1)
        color = tuple(int(top[channel] + (bottom[channel] - top[channel]) * blend) for channel in range(3))
        for x in range(W):
            pixels[x, y] = color
    return image.convert("RGBA")


def draw_centered(draw, text, y, face, fill):
    box = draw.textbbox((0, 0), text, font=face)
    width = box[2] - box[0]
    draw.text(((W - width) / 2, y), text, font=face, fill=fill)


def card(filename, eyebrow, title, subtitle, tagline, accent):
    image = vertical_gradient((74, 12, 122), (22, 4, 48))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((140, -180, 1060, 460), fill=(150, 80, 230, 78))
    image = Image.alpha_composite(image, glow)
    draw = ImageDraw.Draw(image)

    label = font(MEDIUM, 28)
    name = font(SEMIBOLD, 68)
    body = font(REGULAR, 36)
    small = font(REGULAR, 28)

    draw_centered(draw, eyebrow, 150, label, (255, 255, 255, 210))
    label_box = draw.textbbox((0, 0), eyebrow, font=label)
    label_width = label_box[2] - label_box[0]
    bar_x = (W - 72) / 2
    draw.rounded_rectangle((bar_x, 204, bar_x + 72, 212), radius=4, fill=accent)
    draw_centered(draw, title, 250, name, (255, 255, 255, 255))
    draw_centered(draw, subtitle, 350, body, (255, 255, 255, 230))
    draw_centered(draw, tagline, 430, small, (255, 255, 255, 190))

    image.convert("RGB").save(OUT / filename, "PNG", optimize=True)
    print(f"escreveu assets/{filename}")


def espanhol_favicon():
    logo = Image.open(OUT / "espanhol" / "logo.png").convert("RGBA")
    size = 512
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    fitted = logo.copy()
    fitted.thumbnail((size - 48, size - 48), Image.Resampling.LANCZOS)
    canvas.paste(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2), fitted)
    canvas.convert("RGB").save(OUT / "espanhol" / "favicon.png", "PNG", optimize=True)
    print("escreveu assets/espanhol/favicon.png")


def espanhol_card():
    navy = (3, 18, 40, 255)
    image = Image.new("RGBA", (W, H), navy)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, W, 14), fill=(253, 186, 1, 255))
    draw.rectangle((0, H - 14, W, H), fill=(3, 123, 39, 255))

    logo = Image.open(OUT / "espanhol" / "logo.png").convert("RGBA")
    card_w, card_h = 760, 470
    card_x, card_y = (W - card_w) // 2, (H - card_h) // 2
    plate = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 255))
    fitted = logo.copy()
    fitted.thumbnail((card_w - 48, card_h - 48), Image.Resampling.LANCZOS)
    plate.paste(fitted, ((card_w - fitted.width) // 2, (card_h - fitted.height) // 2), fitted)
    image.paste(plate, (card_x, card_y))
    image.convert("RGB").save(OUT / "og-espanhol.png", "PNG", optimize=True)
    print("escreveu assets/og-espanhol.png")


def main():
    card(
        "og-home.png",
        "LINKS",
        "Douglas Ribeiro",
        "IA, automação e espanhol",
        "Escolha o perfil da bio",
        (255, 255, 255, 255),
    )
    card(
        "og-douglasdev.png",
        "LINKS",
        "Douglas Ribeiro",
        "@o.douglas.dev",
        "IA e automação",
        (255, 255, 255, 255),
    )
    espanhol_favicon()
    espanhol_card()


if __name__ == "__main__":
    main()
