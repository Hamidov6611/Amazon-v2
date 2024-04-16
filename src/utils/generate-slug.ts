export function generateSlug(text: string): string {
    const cyrillic = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
    const latin = ['a', 'b', 'v', 'g', 'd', 'e', 'e', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'ts', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'yu', 'ya'];
  
    let slug = text.toLowerCase();
  
    // Kirill harflarini Lotin harflariga o'zgartirish
    for (let i = 0; i < cyrillic.length; i++) {
      let regex = new RegExp(cyrillic[i], 'g');
      slug = slug.replace(regex, latin[i]);
    }
  
    // Nojo'ya belgilarni olib tashlash va bo'shliqlarni '-' bilan almashtirish
    slug = slug.replace(/[^a-z0-9 -]/g, '')  // faqat lotin harflari, raqamlar va bo'shliq/chiziqchalarni qoldiring
              .replace(/\s+/g, '-')         // bo'shliqlarni chiziqchalar bilan almashtirish
              .replace(/-+/g, '-');          // ketma-ket keladigan chiziqchalarni bittaga qisqartirish
  
    return slug;
}
