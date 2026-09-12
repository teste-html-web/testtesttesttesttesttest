# 📚 Systém pro ověřování dostupnosti knih v knihovně

Webová aplikace pro ověřování dostupnosti knih v knihovně se jednou pobočkou. **Běží zcela offline - bez nutnosti serveru!**

## Struktura projektu

```
├── test.html              # Hlavní stránka (alternativa: frontend/index.html)
├── frontend/
│   ├── index.html         # Hlavní stránka (stejná jako test.html)
│   ├── style.css          # Styly
│   └── script.js          # JavaScriptová logika + data
└── README.md              # Dokumentace
```

## Funkce

✅ **Procházení knihami** - Zobrazení všech knih v knihovně  
✅ **Vyhledávání** - Hledání knih podle názvu nebo autora  
✅ **Filtrování** - Zobrazení dostupných/vypůjčených knih  
✅ **Správa dostupnosti** - Zapůjčení a vrácení knih  
✅ **Detaily knihy** - Autor, rok, žánr, popis, dostupnost  
✅ **Trvalé uložení** - Všechna data se ukládají v `localStorage`  

## Spuštění

### Možnost 1: Přímo otevřít soubor
Jednoduše otevřete [test.html](test.html) v prohlížeči (dvaklik nebo drag & drop).

### Možnost 2: Spustit pomocí HTTP serveru (doporučeno)
```bash
# Python 3
python -m http.server 8000

# Node.js (s http-server)
npx http-server
```
Pak otevřete: **http://localhost:8000/test.html**

## Jak funguje

- **Offline fungování** - Data se ukládají v `localStorage` prohlížeče
- **Změny se uchovávají** - Když zap\u016fjčíte/vrátíte knihu, změní se počet dostupných
- **Bez backendu** - Žádné připojení k serveru není potřebné
- **Jednoduchý deployment** - Stačí zkopírovat soubory na web

## Datový model knihy

```json
{
  "id": 1,
  "title": "Název knihy",
  "author": "Jméno autora",
  "year": 2020,
  "genre": "Žánr",
  "total": 3,
  "available": 2,
  "description": "Popis knihy"
}
```

## Výchozí data

Aplikace obsahuje 5 klasických děl:
- 📘 1984 (George Orwell)
- 📗 Sto let samoty (Gabriel García Márquez)
- 📕 Zločin a trest (Fjodor Dostojevskij)
- 📙 Pýcha a předsudek (Jane Austenová)
- 📔 Hlava XXII (Joseph Heller)

## Smazání/Reset dat

Chcete-li vymazat všechna data a vrátit se na výchozí stav:
```javascript
// V konzoli prohlížeče (F12 > Console)
localStorage.removeItem('knihovna_books');
location.reload();
```

## Rozšíření v budoucnu

Možné vylepšení:
- 🔐 Přihlášení uživatelů
- 📅 Správa vypůjčovacích lhůt (data návratu)
- 📧 Email notifikace
- 💾 Synchronizace s backendem
- 📊 Statistiky a analýzy
- 🔍 Pokročilé vyhledávání a filtry
- 📱 Mobilní aplikace

## Technologie

- HTML5
- CSS3 (s gradientními pozadími a animacemi)
- Vanilla JavaScript (bez frameworků)
- Browser localStorage API