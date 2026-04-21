import { string_to_unicode_variant } from 'string-to-unicode-variant'

const variantMap: Record<string, string> = {
  'bold-serif': 'b',
  'bold-sans': 'bs',
  'italic-serif': 'i',
  'italic-sans': 'is',
  'bold-italic-serif': 'bi',
  'bold-italic-sans': 'bis',
  'monospace': 'm',
  'script': 'c',
  'bold-script': 'bc',
  'double-struck': 'd',
  'gothic': 'g',
  'gothic-bold': 'bg',
  'bubble': 'o',
  'square': 'q',
  'small-caps': 'u',
  'superscript': 'sup',
  'subscript': 'sub',
  'underline': 'u',
  'strikethrough': 's',
  'fraktur': 'g',
  'circled': 'o',
  'squared': 'q',
  'squared-negative': 'qn',
  'circled-negative': 'on',
}

export const styleNames: Record<string, string> = {
  'bold-serif': 'Bold Serif',
  'bold-sans': 'Bold Sans',
  'italic-serif': 'Italic Serif',
  'italic-sans': 'Italic Sans',
  'bold-italic-serif': 'Bold Italic Serif',
  'bold-italic-sans': 'Bold Italic Sans',
  'monospace': 'Monospace',
  'script': 'Script',
  'bold-script': 'Bold Script',
  'double-struck': 'Double Struck',
  'gothic': 'Gothic',
  'gothic-bold': 'Gothic Bold',
  'bubble': 'Bubble',
  'square': 'Square',
  'small-caps': 'Small Caps',
  'superscript': 'Superscript',
  'subscript': 'Subscript',
  'underline': 'Underline',
  'strikethrough': 'Strikethrough',
  'fraktur': 'Fraktur',
  'circled': 'Circled',
  'squared': 'Squared',
  'squared-negative': 'Squared Negative',
  'circled-negative': 'Circled Negative',
}

export function applyStyle(text: string, styleKey: string, combining: string = ''): string {
  const variant = variantMap[styleKey]
  if (!variant) return text

  try {
    return string_to_unicode_variant(text, variant, combining)
  } catch {
    return text
  }
}

export function countStyledChars(text: string, styleKey: string): number {
  const variant = variantMap[styleKey]
  if (!variant) return 0

  try {
    const styled = string_to_unicode_variant(text, variant)
    return text.split('').filter((char, i) => styled[i] !== char).length
  } catch {
    return 0
  }
}

export function applyStyleWithCombining(
  text: string,
  styleKey: string,
  combining: string
): string {
  return applyStyle(text, styleKey, combining)
}