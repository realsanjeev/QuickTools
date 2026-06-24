import { useEffect, useMemo } from 'react'

export default function JsonLd({ schema }: { schema: object | object[] }) {
  const schemaJson = useMemo(() => JSON.stringify(schema), [schema])

  useEffect(() => {
    const scripts: HTMLScriptElement[] = []
    const items = Array.isArray(schema) ? schema : [schema]

    for (const item of items) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(item, null, 2)
      document.head.appendChild(script)
      scripts.push(script)
    }

    return () => {
      for (const script of scripts) {
        document.head.removeChild(script)
      }
    }
  }, [schemaJson])

  return null
}
