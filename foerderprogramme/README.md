# Förderprogramme

Unterprojekt neben der Website: Wissensbasis und Grundlage für den geplanten **Förderberater**.

## Inhalt

| Datei | Zweck |
|---|---|
| [`FOERDERPROGRAMME.md`](./FOERDERPROGRAMME.md) | Exakte Beschreibung aller Förderwege (BAFA, KfW 261/308/358/359/458, § 35c EStG) inkl. Entscheidungslogik |

Quellen: `../input/foerderprogramme/`

## Förderberater (Website)

- Seite: `/foerderung.html` (Nav: **Förderung**)
- API: `/api/foerder-chat`
- Grounding: eingebettete Kopie dieser Wissensbasis in `server/foerder-knowledge-text.ts`
- Zahlen-Guardrail: `server/foerder-facts.ts` + `server/foerder-validate.ts`

Nach Änderungen an `FOERDERPROGRAMME.md` die eingebettete Kopie aktualisieren:

```bash
node -e "const fs=require('fs');const md=fs.readFileSync('foerderprogramme/FOERDERPROGRAMME.md','utf8');fs.writeFileSync('server/foerder-knowledge-text.ts','/** Eingebettete Wissensbasis – Abbild von foerderprogramme/FOERDERPROGRAMME.md */\\nexport const FOERDER_KNOWLEDGE_MD: string = '+JSON.stringify(md)+'\\n')"
```
