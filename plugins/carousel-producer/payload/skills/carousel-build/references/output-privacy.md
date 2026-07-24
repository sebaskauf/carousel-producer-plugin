# Output-Privacy: niemals private Daten zeigen

In Outputs, die fuer Public oder Audience gehen (Carousels, Slides, Social-Posts, HTML), **niemals**:

- **Private E-Mail-Adressen** des Nutzers: nicht in Terminal-Mockups, Footer-Links oder Beispiel-Code
- **Interne private MCP-/Server-Namen** aus dem eigenen Setup (Kunden-Datenbanken, private Mail-Accounts): das sind private Account-Setups
- **Konkrete Kunden-Stack-Details** (Datenbank-Schemata, Pipeline-Strukturen, interne Page-IDs)

**Why:** Diese Infos sind interne Infrastruktur. In Public-Material erleichtern sie Spear-Phishing, Reverse-Engineering des Setups und koennen DSGVO-Probleme bei Kunden-Details erzeugen.

**How to apply:**
- Statt echter E-Mail: `you@example.com` oder einfach `→ Authenticated`
- Statt privater MCP-Namen: generische Namen (`supabase`, `gmail`) oder populaere oeffentliche MCPs zeigen
- Wenn Kunden-Cases gezeigt werden: nur was ohnehin schon oeffentlich erzaehlt wurde, niemals technische Interna
