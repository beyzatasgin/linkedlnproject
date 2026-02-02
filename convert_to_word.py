import os
from pathlib import Path
from markdown2docx import Markdown2Docx

# Mevcut script'in bulunduğu dizini al
script_dir = Path(__file__).parent.absolute()

# Masaüstü yolunu al
desktop = Path.home() / "Desktop"
input_file = script_dir / "docs" / "SDD.md"
output_file = desktop / "SDD.docx"

print(f"Giriş dosyası: {input_file}")
print(f"Çıkış dosyası: {output_file}")

# Markdown'ı Word'e dönüştür
project = Markdown2Docx(str(input_file))
project.eat_soup()
project.save(str(output_file))

print(f"\nSDD.md dosyası başarıyla Word formatına dönüştürüldü!")
print(f"Kayıt yeri: {output_file}")

