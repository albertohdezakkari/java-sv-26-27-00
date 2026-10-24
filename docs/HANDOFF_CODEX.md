# Handoff to Codex — JAVA II 26-27 / 1SI-JAVA
Updated: 2026-10-24. This is a project continuity record, not proof of live deployment.

## 1. Context and objectives
Teacher-led Spanish vocational education project for **1SI, Programación Java, academic year 2026–27**, built using patterns from a successful **2SI** correction workflow. ChatGPT project name is JAVA II 26-27, despite current 1SI activities.
Repository: https://github.com/albertohdezakkari/java-sv-26-27-00
Pages root: https://albertohdezakkari.github.io/java-sv-26-27-00/
1SI Drive folder: https://drive.google.com/drive/folders/1gtJ4FIhB1AH1YftG5t4U9Rcj2arPMP51
1SI Sheets: https://docs.google.com/spreadsheets/d/1-qPuyft2X55Wd1J7bpkbl7B51I9ZpjIiqTCdR_VlWdw/edit
Legacy central Sheets: https://docs.google.com/spreadsheets/d/1SNdLEmnBUlbXi6p8cpxKeAhr4zZIDtpSloupe1CWt6o/edit
Separate paper grading Sheet: https://docs.google.com/spreadsheets/d/1vD5qBWM8UBJ571ZpLq6Fe-q-2IEo2hdsWiOw9DrB82g/edit
Legacy Apps Script project (2SI): https://script.google.com/d/1D5BlnRaftDGv-DtPpCXkIGUoWlpD9AXKpdlvlEWBykWe8SK16nGC6QAg/edit
Legacy deployed endpoint: https://script.google.com/macros/s/AKfycbzX9MQXPhHhkcKA9idKifON05j1IbxJhKAvXIvdj_N3F7H1lsiTGbdzREomAnCnMn-l/exec
1SI Google Form editor: https://docs.google.com/forms/d/1_18a1Iwlqis3hZ7rWyI1r9kf_sr18yootATLnkbznCc/edit
1SI form published URL from execution log (may be restricted; verify): https://docs.google.com/forms/d/e/1FAIpQLSemsQ6PuvFSAAQDia9ExO7pLiuKYI1kmG5MIPhMu96atX1-wA/viewform

## 2. Pedagogical specification
Students are beginners. Explain **every instruction**; do not assume knowledge. Standard progression: ORIENTACIÓN → FUNDAMENTOS → REPRESENTACIÓN → PRÁCTICA GUIADA → COMPRUEBA → RETO → CIERRE. For each exercise: one combined panel for cuaderno/fundamentos/concepto nuevo; objective prominent; observe equivalent PSeInt and Java code in separate tabs, properly line-broken; example for understanding; independent variation exercise in its own deliverable folder; consolidation questions and checklist. Never duplicate titles/descriptions. Extensions titled **Ejercicio de ampliación**, not 'Amplía el recorrido'. Do not require a README.md in every exercise. Students create one repository with numbered exercise folders and separate extension folders. Distinguish solutions from scaffolding; challenge enunciados should not include completed code.

## 3. Current GitHub pages / routes
- `/cuestionario/`: 1SI-JAVA-BUCLES-01 quiz. 30-item bank, 20 random per attempt, 30s per question, feedback. Historical test variant `/cuestionario-test/`: 3 questions, 5s. Quiz was reportedly tested against legacy central Sheets; verify current live operation.
- `/challenge-enunciado/`: original Star Wars challenge. 10×10, Vader + Yoda + 5 walls (5 points), count elements (7), add 5 walls (10).
- `/challenge/entrega-star-wars/`: old Star Wars declaration. Preserve.
- `/challenge/`: Challenge 02 **Busca el tesoro**, 35 minutes. 5×5 char board, one T, three X, no overlap (5), count 1/3/21 (7), read and validate row/col 0..4 with Scanner (10).
- `/challenge/entrega/`: Challenge 02 self-declaration 0/5/7/10. Frontend code prepared; backend routing for this ID not confirmed deployed.
- `/challenge_papel/`: paper challenge **Homer only**, 5×5 filled with '*', one random 'H', no walls. Exactly 1 H + 24 stars.
- `/challenge_papel/entrega/`: self-rating 1..10; frontend prepared, backend route not confirmed deployed.
- `/integracion/17_CHALLENGES_JAVA_2026_27.gs`: prepared Apps Script routing functions for both challenges, must be added to correct Apps Script project and routed from doPost; not proof of activation.
- `/integracion/18_FORM_1SI_CHALLENGES.gs`: 1SI Form setup and onSubmit handler, updated to two code fields and paper self-rating.

## 4. Forms submission contract (definitive)
One Google Form submission:
1. `Alumno`: dropdown with official 1SI roster (29, held in private ALUMNOS sheet).
2. `CHALLENGE PAPEL · HOMER — Código Java`: paragraph (required).
3. `Nota que crees haber conseguido`: scale 1–10, applies ONLY to Homer.
4. `CHALLENGE NORMAL · BUSCA EL TESORO — Código Java`: paragraph (required).
5. `Declaración honesta`: required checkbox.
On submit, `F18_registrarEntrega_1SI` writes two distinct rows to `ENTREGAS_CODIGO`, idempotently using response ID suffixes `-PAPEL` and `-NORMAL`. Paper row: AUTOEVALUADO with declared note. Normal row: PENDIENTE_CORRECCION, no declared note. User reported successful receipt of both; a previous inspection showed two rows. Never conflate the two grades.

## 5. 1SI Google Sheets tabs
CONFIG, ALUMNOS, CUADERNOS, REGLAS_CORRECCION, RUBRICA, QUIZ_CONFIG, QUIZ_PREGUNTAS, QUIZ_RESULTADOS, QUIZ_RESPUESTAS, CHALLENGE_CONFIG, CHALLENGE_RESULTADOS, CHALLENGE_PAPEL_RESULTADOS, INSTRUCCIONES, ENTREGAS_CODIGO, CORRECCION_CODIGO, RUBRICA_CHALLENGES.
At last verified, ALUMNOS contained 29 students, QUIZ_PREGUNTAS contained 30 1SI questions, and CHALLENGE_CONFIG contained Star Wars and Treasure. Sheets were created separately from the legacy central spreadsheet; the existing live quiz/legacy challenge endpoints may still write to legacy Sheets.
Rubric in RUBRICA_CHALLENGES:
- Paper Homer: 2 pts char[5][5], 3 pts initialize all '*', 3 pts Random placement of exactly one H, 2 pts display matrix.
- Treasure: 5 pts create random 5×5 board with one T, three X and no overlaps; 2 pts count by actual traversal; 3 pts Scanner coordinate input, bounds check and correct feedback. Total 10.
Evaluation should be evidence-based and pedagogical. Do not infer execution from code alone.

## 6. OpenAI correction engine from 2SI
User supplied source of `07_OPENAI.gs` in conversation. It contains:
- `F60_archivosParaPrompt(archivos)` concatenates files with paths and content.
- `F61_corregirEntrega(datos)` creates detailed rubric-governed prompt, calls OpenAI Responses API (`/v1/responses`) with structured JSON schema, model `CONFIG_CORRECTOR.MODELO_OPENAI`, reasoning `CONFIG_CORRECTOR.OPENAI_REASONING`, API key from `F02_obtenerPropiedad('OPENAI_API_KEY')`.
- `F62_extraerOutputText(data)` extracts output_text.
- `F63_validarResultadoIA(resultado,cuaderno)` validates block scores and recomputes total/10.
Input expected: `datos.entrega` (nombre, grupo, observaciones, repoUrl), `datos.cuaderno` (nombre, notaMaxima), `datos.enunciado`, `datos.rubrica`, `datos.validacion`, `datos.estructura`, `datos.archivos` ({path,contenido}).
Engine originally expects GitHub repositories, not pasted code. Adapt `Main.java` from Form as a virtual file, supply accurate enunciado/rubrica and honest validation (not executed). **Missing dependencies**: `F02_obtenerPropiedad` and `CONFIG_CORRECTOR` definitions must be sourced from 2SI `02_CONFIG.gs` or implemented carefully in isolated 1SI project. No API key in repo.
**Outstanding**: create correction adapter for PENDIENTE_CORRECCION, call F61, write CORRECCION_CODIGO, update ENTREGAS_CODIGO note/status, guard against duplicate corrections and API errors; configure trigger after Form submit. Confirm actual live Apps Script project and permissions. Do not assert this already works.

## 7. Reliability lessons / incidents
- New GitHub folders and changed JS repeatedly appeared stale or 404 on Pages despite commits. Always verify public HTML and JS before asking users to test; use versioned assets and deployment status, not repeated blind commits.
- Legacy `13_QUIZ.gs` `doPost` initially routed every `action:'challenge'` to RN01 F14, causing 'Identificador de Challenge no válido' for Java F15. Preserve explicit legacy routing and add new routes ahead of catch-all.
- RN01 F14 expects level codes NC/C1/C2/C3, not numeric notes. Server determines 0/5/7/10.
- `CHALLENGE_RESULTADOS` historically had ERROR_EMAIL at column 11, OBSERVACIONES 12, COMPROMISO 13. Maintain alignment.
- Keep old data and URLs; distinguish new 1SI Sheet from legacy central Sheet and separate paper Sheet.
- Avoid false 'saved' messages: only mark success after confirmed server JSON and Sheets row verification.
- One test submission at a time; verify idempotence and no duplicates.
- Never publish real students' emails or full roster in new public docs. Review legacy public frontend for hard-coded roster and migrate to safer selection where feasible.

## 8. Next actions for Codex (priority)
1. Inspect entire repository and check current Pages build/deploy configuration. Do not overwrite existing files without diff.
2. Audit 1SI Form script for safe migration: `F18_configurarFormulario_1SI` currently modifies items, so preserve response history and test item ordering. Verify form live URL and permissions.
3. Obtain missing 2SI configuration definitions and corrector orchestration, or implement isolated safe equivalents. Keep 2SI untouched.
4. Implement `19_CORRECCION_1SI.gs` adapter: read pending normal code, call rubric-based OpenAI correction, store structured results, mark status; add retry/error/idempotency and test without modifying historical records.
5. Test with a dedicated synthetic submission, verify separate rows and actual Sheets notes, verify response correctness, then enable trigger.
6. Verify both challenge declarations and quizzes separately; legacy vs new destinations must be explicit.
7. Keep this handoff updated after every verified change.

## 9. Project source materials
ChatGPT project includes files named CUESTIONARIO.txt, PROMPT-CUADRNOS.txt, PROMPT-CUADRNOS-2.txt, RÚBRICA.txt, VISUAL.txt, visual-2.txt, ZIP.txt, CUESTIONARIO-Y-CHALLENGE.txt. They may not be present in the GitHub repo; request them or consult project attachments before changing pedagogical standards. This document summarizes the key requirements but does not replace those source files.

## 10. JV02 rubric page — verified 2026-10-24
- Published `/rubrica/` as a student-facing HTML page for **JV02 · Misión 03 · Rescate**; this is separate from the older Treasure/Homer challenges described above.
- The page preserves all 11 criteria and their exact conditions from `tablero/rubrica.json`: level totals 50 + 20 + 30 = 100. Includes cumulative levels, partial credit, evidence rules, /10 conversion, print styling, and links to the notebook, original rubric and existing central GitHub submission Form.
- Source commit: `49ccb4a119348dc99ad1ac6d618bff6fcc46b8c2`. Pages deployment [40112028947](https://github.com/albertohdezakkari/java-sv-26-27-00/actions/runs/40112028947) completed successfully. Public URL returned HTTP 200 and matched the source HTML byte for byte.
- Verified: original criterion text and points, level sums, local links and anchors; browser rendered 11 criteria / 100 points without document overflow at 386 px.
- No changes to grading criteria, Apps Script, Forms, historical grades or existing URLs. The student-facing page distinguishes JV02 /100 in Challenges from the independent quiz /10 in Cuadernos de trabajo.

## 11. Rubric reading and comprehension aids — 2026-10-24
- `/rubrica/` adds an Anticipate → Contrast → Explain and improve reading route, plus one optional reflection pause per level. Level 3 has an accessible diagram linking W/A/S/D to row/column changes.
- The 11 original criterion articles remain byte-identical; their points still total 100. Existing URLs, JSON/text rubrics and delivery integrations are unchanged.
- Native checkboxes are personal reading aids: no stored/transmitted review data, no new points or deliverables. Mobile verification at 390 px has no page overflow; the native reflection disclosure opens correctly.
- This records source and local checks; a Git commit alone is not proof of a Pages deployment.
- Public verification completed: the HTML at `https://albertohdezakkari.github.io/java-sv-26-27-00/rubrica/` returned HTTP 200 and matched the source from `2df378468b80ba3ba4246b0d10f84f7d7d85db51` byte for byte. Grading integrations were not exercised or changed in this presentation-only deployment.
