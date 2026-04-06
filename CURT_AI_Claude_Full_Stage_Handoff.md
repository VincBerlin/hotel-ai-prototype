# CURT AI — Claude Handoff / Full Stage Summary
_Last updated: 2026-04-02_

## Ziel des Projekts
Wir arbeiten am **Curt AI Hospitality Prototype**.

Curt AI soll:
- **kein Chatbot** sein
- wie ein **intelligenter Hotel-Concierge** wirken
- **kurz, natürlich, kontextbasiert** antworten
- **mehrsprachig** sein
- **Eskalationen** sauber erkennen
- langfristig mit **Supabase**, Hotelwissen, Buchungen und Gesprächsverlauf arbeiten

---

## Aktiver Projektpfad

### Lokaler aktiver Worktree
`~/Documents/AI/hotel-ai-prototype/.worktrees/feature/initial-build`

### GitHub Repository
`https://github.com/VincBerlin/hotel-ai-prototype`

### Aktiver Branch
`feature/initial-build`

---

## Bisherige Stages / was bereits gemacht wurde

## Stage 1 — Projektstand und Architektur eingeordnet
Es wurden ältere Projektdateien und Briefings übernommen und eingeordnet.

Wichtige Erkenntnisse:
- Curt AI Hospitality ist der aktuelle Fokus
- Zielarchitektur:
  `Context Builder -> Claude API -> Post-Processor -> Response`
- **keine** vorgelagerte Keyword-/Intent-Logik vor Claude
- Claude soll Sprache, Intent und Eskalation selbst erkennen
- TypeScript übernimmt Orchestrierung, Prompt-Aufbau, Routing, Post-Processing

Identifizierte zentrale Dateien:
- `app/api/chat/route.ts`
- `lib/system-prompt.ts`
- `lib/post-processor.ts`
- `app/hotel/[hotelId]/ChatInterface.tsx`
- `lib/hotels/grand-hotel.ts`
- `lib/knowledge-base/`
- `supabase/migrations/001_initial_schema.sql`

---

## Stage 2 — Richtigen laufbaren Projektordner gefunden
Es wurde festgestellt:
- der eigentliche lauffähige App-Ordner ist **nicht** der Repo-Root
- sondern der Worktree:
  `~/Documents/AI/hotel-ai-prototype/.worktrees/feature/initial-build`

Dort wurden später auch:
- `.env.local`
- `package.json`
- die lauffähige Next.js-App
sauber gefunden.

---

## Stage 3 — Lokales Environment und App-Start
Es wurde:
- `.env.local` im aktiven Worktree angelegt / genutzt
- die nötige lokale App-Struktur bestätigt
- `npm install` erfolgreich ausgeführt
- `npm run dev` erfolgreich gestartet

Lokaler Status:
- App läuft unter `http://localhost:3000`

Wichtig:
- Secrets/API-Keys wurden während der Session einmal sichtbar
- diese wurden anschließend **rotiert**
- ab jetzt dürfen Secrets **nie wieder** ausgegeben werden

---

## Stage 4 — Supabase-Keys und Integrationseinordnung
Es wurde geklärt:
- Supabase-Keys sind vorhanden
- sie gehören in `.env.local`
- Supabase war zu diesem Zeitpunkt noch **nicht aktiv in allen Codepfaden angebunden**
- zuerst ging es nur um Setup und saubere Basis, nicht um vollständige DB-Nutzung

---

## Stage 5 — SQL-Migration lokal gefunden
Die Initial-Migration wurde im Projekt lokalisiert:

`supabase/migrations/001_initial_schema.sql`

Wichtig:
- Die Datei lag im Worktree
- Es wurde zusätzlich eine sichtbare Kopie in einen sauberen Dokument-/SQL-Ordner gelegt, damit sie leichter geöffnet und geprüft werden kann

---

## Stage 6 — Supabase Initial Schema debuggt und erfolgreich ausgeführt

### Bug 1 — `accounts` wurde zu früh referenziert
Fehler:
- `relation "public.accounts" does not exist`

Ursache:
- Hilfsfunktion referenzierte `public.accounts`, bevor die Tabelle sicher existierte

Fix:
- `auth_account_id()` wurde im SQL-Schema **nach** die `accounts`-Erstellung verschoben
- bestätigte Position ungefähr bei Zeile `165`

### Bug 2 — nicht immutable generated column
Fehler:
- `ERROR: 42P17: generation expression is not immutable`

Ursache:
- `deadline_at` nutzte eine `generated always as (...) stored`-Definition auf Basis von:
  `received_at + interval '30 days'`

Fix:
- `deadline_at` wurde auf normale `timestamptz`-Spalte geändert
- Funktion `set_privacy_request_deadline()` hinzugefügt
- Trigger `privacy_requests_set_deadline` hinzugefügt
- Deadline wird jetzt bei Insert automatisch gesetzt

### Ergebnis
Die komplette SQL-Datei wurde danach in Supabase erfolgreich ausgeführt.

Finales Ergebnis in Supabase:
- `Success. No rows returned`

Das bedeutet:
- die Initial-Migration lief erfolgreich durch

---

## Stage 7 — Erwartete Datenbanktabellen
Nach der erfolgreichen Migration sollten u. a. diese Tabellen existieren:
- `accounts`
- `staff`
- `knowledge_bases`
- `bookings`
- `conversations`
- `messages`
- `usage`
- `knowledge_gaps`
- `guest_profiles`
- `analytics_daily`
- `consent_records`
- `privacy_requests`
- `audit_log`
- `knowledge_embeddings`

Supabase-Projektname im Verlauf:
- `ConciergeAI`

---

## Stage 8 — GitHub-Repository erstellt und verbunden
Es wurde ein GitHub-Repository erstellt für den **gesamten Hotel-AI-Prototype**, nicht nur für das Backend.

Git-Status:
- Repo mit GitHub verbunden
- Remote korrekt gesetzt auf:
  `https://github.com/VincBerlin/hotel-ai-prototype.git`
- Branch `feature/initial-build` erfolgreich gepusht

Wichtige Schritte:
- lokales Git geprüft
- `.gitignore` geprüft
- initialer Commit erstellt
- Authentifizierung mit `gh auth login` sauber gelöst
- Push erfolgreich durchgeführt

---

## Stage 9 — Repo-Cleanup gemacht
Nach dem ersten Push wurde das Repo noch bereinigt.

Bereinigt wurde:
- `.DS_Store` aus dem Git-Index entfernt
- `supabase/.temp/` ignoriert
- Research-Dateien nach `docs/` verschoben

Beispiel betroffener Dateien:
- `Hospitality-Research-Interview.pdf`
- `Hospitality-Intelligence-Knowledge-Base.md`

Das Repo ist jetzt sauberer strukturiert und weniger anfällig für lokale Artefakte.

---

## Stage 10 — Remote-Änderungen erfolgreich gepullt
Es wurde ein `git pull` auf dem aktiven Branch ausgeführt.

Ergebnis:
- Pull erfolgreich
- Fast-forward erfolgreich
- neue Dateien/Änderungen wurden übernommen

Dabei kamen u. a. hinzu:
- `lib/api/chat.ts`
- Tests unter `lib/__tests__/...`
- `.github/workflows/ci.yml`
- Architektur-/Review-Dokumente in `docs/reviews/...`

Das bedeutet:
- der lokale Stand ist auf dem neuesten Remote-Stand

---

## Stage 11 — Agent Deck global installiert
Agent Deck wurde erfolgreich global installiert.

Installationsweg:
- Homebrew

Verifikation:
- `agent-deck --version`
- bestätigte Version: `v0.27.5`

Einordnung:
- Agent Deck ist ein **Terminal Session Manager für AI Coding Agents**
- nützlich für:
  - Session-Organisation
  - parallele Arbeitsstränge
  - Claude-/Agent-Sessions
  - tmux-basierte Verwaltung
  - besseren Überblick über laufende Entwicklungs-Sessions

---

## Stage 12 — Agent Deck mit Claude Code verbunden
Während des Setups wurde zusätzlich die optionale Claude-Code-Hook-Integration betrachtet und aktiviert.

Wichtig:
- Agent Deck selbst war bereits installiert
- der spätere Wizard betraf **nicht** die Hauptinstallation
- sondern die **Zusatz-Integration für Claude Code**

---

## Stage 13 — Agent Deck aktueller Status
Aktueller beobachteter Agent-Deck-Status:
- Projekt `hotel-ai-prototype` wurde in Agent Deck registriert
- Agent Deck zeigt aktuell:
  - Session vorhanden
  - aber zeitweise `No tmux session running`
  - Status: `Not connected`

Bedeutung:
- die Session ist angelegt
- aber die tmux-Session lief in diesem Moment noch nicht / war nicht verbunden

Die empfohlene Interaktion war:
- in Agent Deck den Session-Eintrag wählen
- `Enter` drücken oder `R` zum Starten
- damit die tmux-Session aktiv wird

---

## Aktueller Stand jetzt
Wir sind **nicht mehr** im Setup-Chaos.

Wir haben bereits geschafft:
- richtigen Worktree gefunden
- lokale App gestartet
- Keys/Env sauberer eingeordnet
- SQL-Migration gefixt
- Supabase-Schema erfolgreich eingespielt
- GitHub-Repo erstellt und gepusht
- Repo bereinigt
- neuen Remote-Stand gepullt
- Agent Deck global installiert
- Agent Deck für das Projekt registriert

---

## Wo wir jetzt gerade stehen
Der nächste sinnvolle Fokus ist **nicht** mehr:
- Git
- Repo-Erstellung
- Supabase-Initialschema
- Agent-Deck-Installation

Sondern jetzt:

# Nächster technischer Fokus
**Erste echte Supabase-Integration in den laufenden Hospitality-Prototyp**

Ziel:
1. identifizieren, welche Daten aktuell noch **in-memory oder hardcoded** sind
2. den **kleinsten sicheren ersten Integrationspunkt** wählen
3. Supabase **schrittweise** einführen
4. den existierenden Chat-Flow **nicht kaputtmachen**

Wahrscheinlich relevante erste Kandidaten:
- Hotelwissen / Knowledge Base
- Conversations
- Messages
- booking-related guest context

Keine breite Komplett-Umbauaktion.

---

## Wichtige Arbeitsregeln für Claude
Bitte weiterhin so arbeiten:
- kurz antworten
- exakt den nächsten sinnvollen Schritt nennen
- terminal-first
- keine Secrets ausgeben
- keine unnötigen riesigen Refactorings
- nur kleine, kontrollierte Schritte
- Fakten, Annahmen und Empfehlungen klar trennen

Prioritäten:
1. Blocker
2. architekturkritische Themen
3. kleinster sicherer Integrationsschritt
4. Cleanup
5. Nice-to-have

---

## Sofort nutzbarer Prompt für Claude Code — aktueller Stand

```text
Wir arbeiten am Curt AI Hospitality Prototype.

Aktiver lokaler Worktree:
~/Documents/AI/hotel-ai-prototype/.worktrees/feature/initial-build

GitHub-Repo:
https://github.com/VincBerlin/hotel-ai-prototype

Aktiver Branch:
feature/initial-build

Was bereits erledigt ist:
- lokaler Worktree korrekt identifiziert
- App läuft lokal auf localhost:3000
- .env.local liegt im aktiven Worktree
- Secrets wurden rotiert und dürfen nicht ausgegeben werden
- Supabase Initial Schema wurde erfolgreich ausgeführt
- SQL-Bugs bei auth_account_id() und privacy_requests.deadline_at wurden gefixt
- GitHub-Repo wurde erstellt, verbunden und gepusht
- Repo-Cleanup wurde gemacht
- Remote-Änderungen wurden erfolgreich gepullt
- Agent Deck wurde global installiert und für das Projekt registriert

Deine Aufgabe jetzt:
1. untersuche den aktuellen Code und finde, welche Daten noch in-memory oder hardcoded sind
2. bestimme den kleinsten sinnvollen ersten Supabase-Integrationspunkt
3. ändere noch keinen Code
4. halte den aktuellen Chat-Flow intakt
5. gib keine Secrets aus

Gib nur zurück:
- aktuelle relevante Datenquellen
- besten ersten Supabase-Integrationspunkt
- warum das der richtige nächste Schritt ist
- die exakten Dateien, die wir als Nächstes prüfen oder ändern sollten
```

---

## Optionaler Prompt für Claude Code — Agent Deck / Session-Status

```text
Prüfe kurz den aktuellen Agent-Deck-Status für das Curt-AI-Projekt.

Ziel:
1. kläre, warum die registrierte Session aktuell ggf. als not connected / no tmux session running erscheint
2. nenne nur den kleinsten sicheren Schritt, um die Session korrekt zu starten oder zu verbinden
3. keine Projektdateien ändern
4. keine Secrets ausgeben

Gib nur zurück:
- Ursache
- kleinster Fix
- exakten Befehl oder exakte Tastenaktion
```

---

## Kurzfazit
Der Projektstatus ist jetzt solide.

Wir sind von:
- Ordnersuche
- .env-/Key-Chaos
- SQL-Migrationsfehlern
- GitHub-Setup
- Repo-Struktur
- Tool-Installation

zu diesem Punkt gekommen:

# Der Prototyp ist lokal, remote und datenbankseitig vorbereitet.
# Der nächste echte Entwicklungsschritt ist die erste kleine, saubere Supabase-Integration.
