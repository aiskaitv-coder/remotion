# DATA STORY — ΑΝΕΡΓΙΑ — PRODUCTION DOCUMENT

**Τίτλος εργασίας:** Ανεργία στην Ελλάδα, Ιούλιος 2026 και θέση στην ΕΕ-27  
**Θέση:** Η ανεργία έπεσε στο 7,9% τον Ιούλιο 2026, αλλά η Ελλάδα παραμένει πάνω από τον μέσο όρο της ΕΕ-27, τρίτη υψηλότερη στο ετήσιο 2025, με χαμηλότερη απασχόληση και την υψηλότερη μακροχρόνια ανεργία στα τελευταία πλήρως συγκρίσιμα στοιχεία.  
**Ημερομηνία παραγωγής / research cut-off:** 2026-09-05  
**Έγκριση άξονα και δεδομένων:** approved_2026-09-05 (angle + data, user: 'ναι')  
**Γλώσσα:** el · **Καμβάς:** 1080×1920 @ 25 fps · **Σχήμα:** 2.0 · **Design system:** DATA_STORY_3D_BRIGHT_V1 (engine 1.1, browser port)  
**Διάρκεια timeline:** 71.08 s (1777 καρέ) · **VO:** 144 εκτεταμένες λέξεις @ 145 WPM = 59.6 s θεωρητικός χρόνος · **Σκηνές:** 9  
**Mode:** publication · **Runtime templates:** ranking_horizontal, before_after_columns, donut_parts (visual_demo, ported) · **Ήχος:** off, VO alignment NOT_RUN

**Αιτιολόγηση διάρκειας άνω των 60 s:** 9 σκηνές, μία ιδέα ανά σκηνή, όλες οι μεταβλητές ΕΠΙΒΕΒΑΙΩΜΕΝΟ/ΜΕ ΠΕΡΙΟΡΙΣΜΟ, ίδια οικογένεια πηγών (EU-LFS). Εναλλακτικά χωρίζεται σε Μέρος 1 (S01–S05) και Μέρος 2 (S06–S09).

## 1. Πηγές

| ID | Φορέας | Τίτλος | Dataset | Περίοδος αναφοράς | Δημοσίευση | Πρόσβαση | Περιορισμός |
|---|---|---|---|---|---|---|---|
| SRC01 | ΕΛΣΤΑΤ | [Έρευνα Εργατικού Δυναμικού, μηνιαίες εκτιμήσεις, Ιούλιος 2026](https://www.statistics.gr/documents/20181/c74980f5-58a4-b4e1-b689-2aa5cf610b70) | SJO02 (μηνιαίες εκτιμήσεις ΕΕΔ) | 2026-07 | 2026-08-31 | 2026-09-05 | Μηνιαία εκτίμηση, αναθεωρήσιμη· ο Ιούνιος 2026 αναθεωρήθηκε σε 8,1% |
| SRC02 | Eurostat | [Euro area unemployment at 6.4% — euro indicators, July 2026](https://ec.europa.eu/eurostat/web/products-euro-indicators/w/3-01092026-bp) | une_rt_m | 2026-07 | 2026-09-01 | 2026-09-05 | Μηνιαίες σειρές αναθεωρούνται με νέα EU-LFS δεδομένα |
| SRC03 | Eurostat | [EU unemployment rate in 2025: 6.0%](https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260610-3) | une_rt_a | 2025 | 2026-06-10 | 2026-09-05 | Ετήσια μέτρηση, όχι εναλλάξιμη με μεμονωμένο μήνα |
| SRC04 | Eurostat | [Key figures on Europe — 2026 edition](https://ec.europa.eu/eurostat/documents/15216629/23964567/KS-01-26-035-EN-N.pdf) | une_rt_a | 2024–2025 | 2026 | 2026-09-05 | Η μεταβολή −1,2 π.μ. αναφέρεται από την έκδοση· η τιμή 2024 προκύπτει με υπολογισμό |
| SRC05 | Eurostat | [New lows for EU unemployment in 2024](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250523-1) | une_ltu_a | 2024 | 2025-05-23 | 2026-09-05 | Έτος 2024· νεότερη τιμή 2025 δεν επιβεβαιώθηκε στο audit |
| SRC06 | Eurostat | [EU's employment rate grew above 76% in 2025](https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260417-1) | lfsi_emp_a | 2025 | 2026-04-17 | 2026-09-05 | Άλλος παρονομαστής από την ανεργία |
| SRC07 | Eurostat | [Metadata, monthly unemployment (une_rt_m ESMS)](https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm) | une_rt_m | — | — | 2026-09-05 | — |
| SRC08 | ΕΛΣΤΑΤ | [Ημερολόγιο ανακοινώσεων](https://www.statistics.gr/calendar) | — | — | — | 2026-09-05 | Επόμενη μηνιαία ΕΕΔ (Αύγουστος 2026): 30/09/2026 |

## 2. Εγκεκριμένο audit (facts)

| ID | Δείκτης | Τιμή οθόνης | Μονάδα | Παρονομαστής | Γεωγραφία | Περίοδος | Πηγές | Αναφερόμενο/Υπολογισμός | Τύπος | Κατάσταση | Περιορισμός |
|---|---|---|---|---|---|---|---|---|---|---|---|
| U01 | Ποσοστό ανεργίας, SA | 7,9% | % | εργατικό δυναμικό 15–74 | Ελλάδα | 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Μηνιαία SA εκτίμηση, αναθεωρήσιμη |
| U02 | Άνεργοι, SA | 376.508 | άτομα | — | Ελλάδα | 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U03 | Απασχολούμενοι, SA | 4.379.823 | άτομα | — | Ελλάδα | 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U04 | Εκτός εργατικού δυναμικού (κάτω των 75) | 2.951.948 | άτομα | — | Ελλάδα | 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Δεν είναι άνεργοι· χωριστή κατηγορία |
| U05a | Ποσοστό ανεργίας, SA, έναν χρόνο πριν | 8,9% | % | εργατικό δυναμικό 15–74 | Ελλάδα | 2025-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U05 | Ετήσια μεταβολή ποσοστού ανεργίας | −1,0 | ποσοστιαίες μονάδες | — | Ελλάδα | 2025-07 → 2026-07 | SRC01 | reported | 7,9 − 8,9 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U06 | Ετήσια μεταβολή αριθμού ανέργων | −45.192 | άτομα | — | Ελλάδα | 2025-07 → 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | −10,7% |
| U06b | Ετήσια μεταβολή αριθμού ανέργων, σχετική | −10,7% | % | άνεργοι Ιουλίου 2025 | Ελλάδα | 2025-07 → 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Σχετική μεταβολή (τοις εκατό), όχι ποσοστιαίες μονάδες |
| U07 | Ετήσια μεταβολή απασχολουμένων | +41.365 | άτομα | — | Ελλάδα | 2025-07 → 2026-07 | SRC01 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | +1,0% |
| U08 | Ποσοστό ανεργίας ΕΕ-27, SA | 6,1% | % | εργατικό δυναμικό 15–74 | ΕΕ-27 | 2026-07 | SRC02 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U10 | Ανεργία νέων <25 | 16,8% | % | εργατικό δυναμικό 15–24 | Ελλάδα | 2026-07 | SRC02 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Παρονομαστής το νεανικό εργατικό δυναμικό, όχι όλοι οι νέοι |
| U11 | Ανεργία νέων <25 ΕΕ-27 | 15,1% | % | εργατικό δυναμικό 15–24 | ΕΕ-27 | 2026-07 | SRC02 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U12 | Ετήσιο ποσοστό ανεργίας | 8,9% | % | εργατικό δυναμικό 15–74 | Ελλάδα | 2025 | SRC03 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U13 | Ετήσιο ποσοστό ανεργίας ΕΕ-27 | 6,0% | % | εργατικό δυναμικό 15–74 | ΕΕ-27 | 2025 | SRC03 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U14 | Θέση Ελλάδας στην ετήσια ανεργία ΕΕ-27 | 3η | κατάταξη (υψηλότερη=1) | 27 κράτη-μέλη | ΕΕ-27 | 2025 | SRC03 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Ισπανία 10,5 · Φινλανδία 9,7 · Ελλάδα 8,9 |
| U15 | Ετήσιο ποσοστό ανεργίας Ισπανίας | 10,5% | % | εργατικό δυναμικό 15–74 | Ισπανία | 2025 | SRC03 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U15b | Ετήσιο ποσοστό ανεργίας Φινλανδίας | 9,7% | % | εργατικό δυναμικό 15–74 | Φινλανδία | 2025 | SRC03 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U16 | Χαμηλότερο ετήσιο ποσοστό ΕΕ-27 (Τσεχία) | 2,8% | % | εργατικό δυναμικό 15–74 | Τσεχία | 2025 | SRC03 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Πολωνία, Μάλτα 3,1 |
| U17 | Μεταβολή ετήσιας ανεργίας 2024→2025 | −1,2 | ποσοστιαίες μονάδες | — | Ελλάδα | 2024 → 2025 | SRC04 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Μεγαλύτερη πτώση μεταξύ κρατών-μελών κατά την έκδοση |
| U18 | Μακροχρόνια ανεργία (≥12 μήνες) | 5,4% | % | εργατικό δυναμικό | Ελλάδα | 2024 | SRC05 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ | Έτος 2024· δεν παρουσιάζεται ως τρέχουσα τιμή |
| U19 | Θέση Ελλάδας στη μακροχρόνια ανεργία ΕΕ-27 | υψηλότερη | κατάταξη (υψηλότερη=1) | 27 κράτη-μέλη | ΕΕ-27 | 2024 | SRC05 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ | Ισχύει για το 2024 |
| U20 | Ποσοστό απασχόλησης 20–64 | 71,0% | % | πληθυσμός 20–64 | Ελλάδα | 2025 | SRC06 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| U21 | Ποσοστό απασχόλησης 20–64 ΕΕ-27 | 76,1% | % | πληθυσμός 20–64 | ΕΕ-27 | 2025 | SRC06 | reported | — | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | — |
| C01 | Άνεργοι Ιούλιος 2025, SA | 421.700 | άτομα | — | Ελλάδα | 2025-07 | SRC01 | calculated | 376.508 − (−45.192) = 421.700 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ |
| C02 | Πληθυσμός 15–74 (απασχολούμενοι + άνεργοι + εκτός) | 7.708.279 | άτομα | — | Ελλάδα | 2026-07 | SRC01 | calculated | 4.379.823 + 376.508 + 2.951.948 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ |
| C03 | Μερίδιο απασχολουμένων στον πληθυσμό 15–74 | 56,8% | % | πληθυσμός 15–74 (C02) | Ελλάδα | 2026-07 | SRC01 | calculated | 4.379.823 ÷ 7.708.279 × 100 = 56,82 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ |
| C04 | Μερίδιο ανέργων στον πληθυσμό 15–74 | 4,9% | % | πληθυσμός 15–74 (C02) | Ελλάδα | 2026-07 | SRC01 | calculated | 376.508 ÷ 7.708.279 × 100 = 4,88 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Διαφέρει από το ποσοστό ανεργίας (παρονομαστής πληθυσμός, όχι εργατικό δυναμικό) |
| C05 | Μερίδιο εκτός εργατικού δυναμικού στον πληθυσμό 15–74 | 38,3% | % | πληθυσμός 15–74 (C02) | Ελλάδα | 2026-07 | SRC01 | calculated | 2.951.948 ÷ 7.708.279 × 100 = 38,30 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | 56,8 + 4,9 + 38,3 = 100,0 |
| C06 | Ετήσιο ποσοστό ανεργίας 2024 | 10,1% | % | εργατικό δυναμικό 15–74 | Ελλάδα | 2024 | SRC03, SRC04 | calculated | 8,9 + 1,2 = 10,1 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ | Υπολογισμός DATA STORY βάσει Eurostat· να επαληθευτεί έναντι une_rt_a 2024 πριν τη δημοσίευση |
| C07 | Διαφορά Ελλάδας από ΕΕ-27, Ιούλιος 2026 | +1,8 | ποσοστιαίες μονάδες | — | Ελλάδα/ΕΕ-27 | 2026-07 | SRC01, SRC02 | calculated | 7,9 − 6,1 | ΕΠΙΒΕΒΑΙΩΜΕΝΟ | Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ και Eurostat |

## 3. Voice-over

### VO A (ElevenLabs v3, αραιά tags)

**S01** [calm] Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.  
**S02** Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.  
**S03** Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.  
**S04** Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.  
**S05** Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.  
**S06** Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.  
**S07** [warm] Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.  
**S08** Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.  
**S09** Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. [pause] Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.  

### VO B (καθαρό)

**S01** Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.  
**S02** Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.  
**S03** Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.  
**S04** Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.  
**S05** Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.  
**S06** Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.  
**S07** Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.  
**S08** Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.  
**S09** Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.  

Λέξεις ανά σκηνή: S01 20, S02 9, S03 11, S04 19, S05 13, S06 15, S07 13, S08 16, S09 28 · Σύνολο 144 · Θεωρητικός χρόνος 59.6 s · Παύσεις/handoffs εντός ορίων σκηνών · Μετρημένος ήχος: δεν υπάρχει αρχείο (NOT_RUN). Τα κείμενα δεν συνεπάγονται ότι υπάρχει ηχητικό αρχείο.

## 4. Master matrix

| Σκηνή | start–end | Ρόλος | VO λέξεις | data_ids | template_id | source_ids | Transition |
|---|---|---|---|---|---|---|---|
| S01 | 0–9920 ms | cover | 20 | U01, U08, C07 | ranking_horizontal | SRC01, SRC02 | crossfade 400 ms |
| S02 | 9920–16320 ms | chart | 9 | U05a, U01, U05 | before_after_columns | SRC01 | crossfade 400 ms |
| S03 | 16320–22720 ms | chart | 11 | C01, U02, U06, U06b | before_after_columns | SRC01 | crossfade 400 ms |
| S04 | 22720–31400 ms | chart | 19 | C03, C04, C05, C02 | donut_parts | SRC01 | crossfade 400 ms |
| S05 | 31400–37800 ms | chart | 13 | U10, U11 | ranking_horizontal | SRC02 | crossfade 400 ms |
| S06 | 37800–44840 ms | chart | 15 | U15, U15b, U12, U13, U14 | ranking_horizontal | SRC03 | crossfade 400 ms |
| S07 | 44840–51240 ms | chart | 13 | C06, U12, U17 | before_after_columns | SRC03, SRC04 | crossfade 400 ms |
| S08 | 51240–58680 ms | chart | 16 | U21, U20 | ranking_horizontal | SRC06 | crossfade 400 ms |
| S09 | 58680–71080 ms | outro | 28 | U18, U19 | ranking_horizontal | SRC05 | crossfade 400 ms |

## 5. Σκηνές

### S01 · cover · ranking_horizontal (visual_demo, browser port 1.1)

- **Χρόνος:** start 0 ms · duration 9920 ms · end 9920 ms · static_cover True · cover_hold 800 ms · transition crossfade 400 ms
- **VO:** «Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.» (20 λέξεις)
- **Οθόνη:** τίτλος «Η ΑΝΕΡΓΙΑ / ΣΤΟ 7,9%» · context «ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 15–74, ΙΟΥΛΙΟΣ 2026» · hero «7,9%» + «ΕΛΛΑΔΑ» / «ΙΟΥΛΙΟΣ 2026 · ΕΕ-27: 6,1%» · end note «ΙΔΙΟΣ ΜΗΝΑΣ, ΙΔΙΟΣ ΟΡΙΣΜΟΣ (ILO), ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ»
- **Footer:** «ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08 & 01/09/2026» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** ΕΛΛΑΔΑ (GR) = 7,9% [U01], material 1; ΕΕ-27 (EU) = 6,1% [U08], material 0 · sort descending · highlighted 0 · value_scale 0.55 world units/τιμή · decimals 1
- **Frame 0:** Πλήρες στατικό εξώφυλλο: badge, τίτλος, context, hero στην τελική τιμή, footer· γεωμετρία ξεκινά μετά το hold.
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 800 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 1300 | πρώτη λέξη | label/flag i | enter (stagger 280 ms) | 0→1 | 400 | easeOutCubic | — |
| 1700 | αριθμός | bar i | grow from x=0 (stagger 280 ms) | 0→value | 2500 | easeOutCubic | — |
| 1700 | αριθμός | value label i | count, anchored to bar tip | 0→value | 2500 | easeOutCubic | — |
| 5100 | — | end_note | enter | 0→1 | 500 | easeOutCubic | — |

- **Reading hold:** ≈3920 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S02 · chart · before_after_columns (visual_demo, browser port 1.1)

- **Χρόνος:** start 9920 ms · duration 6400 ms · end 16320 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.» (9 λέξεις)
- **Οθόνη:** τίτλος «ΕΝΑΝ ΧΡΟΝΟ / ΠΡΙΝ» · context «ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026» · hero «−1,0» + «ΜΟΝΑΔΑ» / «ΠΟΣΟΣΤΙΑΙΑ, ΣΕ 12 ΜΗΝΕΣ» · captions «ΙΟΥΛΙΟΣ 2025» / «ΙΟΥΛΙΟΣ 2026»
- **Footer:** «ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2025 ΚΑΙ ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08/2026» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** from 2025 = 8,9% [U05a] → to 2026 = 7,9% [U01] · delta −1,0 [U05] · value_scale 0.55 · decimals 1 · κοινή βάση 0, ίδια κλίμακα στις δύο στήλες
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 450 | — | captions | enter (stagger 200 ms) | 0→1 | 450 | easeOutCubic | — |
| 900 | πρώτη τιμή | column from | grow from baseline | 0→from | 2200 | easeOutCubic | — |
| 1450 | δεύτερη τιμή | column to | grow from baseline | 0→to | 2200 | easeOutCubic | — |
| 3650 | μεταβολή | hero delta | count | 0→delta | 800 | easeOutCubic | — |

- **Reading hold:** ≈1200 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S03 · chart · before_after_columns (visual_demo, browser port 1.1)

- **Χρόνος:** start 16320 ms · duration 6400 ms · end 22720 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.» (11 λέξεις)
- **Οθόνη:** τίτλος «376.508 / ΑΝΕΡΓΟΙ» · context «ΑΡΙΘΜΟΣ ΑΝΕΡΓΩΝ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026» · hero «−10,7%» + «ΑΝΕΡΓΟΙ» / «−45.192 ΑΤΟΜΑ» · captions «ΙΟΥΛΙΟΣ 2025» / «ΙΟΥΛΙΟΣ 2026»
- **Footer:** «ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · 2025: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΑΠΟ ΤΗ ΜΕΤΑΒΟΛΗ» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** from 2025 = 421.700 [C01] → to 2026 = 376.508 [U02] · delta −10,7% [U06b] · value_scale 1.16e-05 · decimals 0 · κοινή βάση 0, ίδια κλίμακα στις δύο στήλες
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 450 | — | captions | enter (stagger 200 ms) | 0→1 | 450 | easeOutCubic | — |
| 900 | πρώτη τιμή | column from | grow from baseline | 0→from | 2200 | easeOutCubic | — |
| 1450 | δεύτερη τιμή | column to | grow from baseline | 0→to | 2200 | easeOutCubic | — |
| 3650 | μεταβολή | hero delta | count | 0→delta | 800 | easeOutCubic | — |

- **Reading hold:** ≈1200 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S04 · chart · donut_parts (visual_demo, browser port 1.1)

- **Χρόνος:** start 22720 ms · duration 8680 ms · end 31400 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.» (19 λέξεις)
- **Οθόνη:** τίτλος «100 ΑΤΟΜΑ / 15–74 ΕΤΩΝ» · context «ΚΑΤΑΝΟΜΗ ΠΛΗΘΥΣΜΟΥ 15–74, ΙΟΥΛΙΟΣ 2026» · hero «4,9%» + «ΑΝΕΡΓΟΙ» / «ΤΟΥ ΠΛΗΘΥΣΜΟΥ 15–74»
- **Footer:** «ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΜΕΡΙΔΙΑ: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΒΑΣΕΙ ΕΛΣΤΑΤ» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ = 56,8% [C03], material 0, legend #7895ff; ΑΝΕΡΓΟΙ = 4,9% [C04], material 1, legend #ff315c; ΕΚΤΟΣ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ = 38,3% [C05], material 3, legend #95b0d4 · άθροισμα 100.0 · highlighted 1
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 900 | — | arc | draw clockwise, parts in order | 0→360° | 3600 | easeOutCubic | — |
| 900 | μερίδιο | legend item i | enter when its arc starts | 0→1 | 125 | linear | — |
| 900 | μερίδιο | hero | count while highlighted arc draws | 0→share | (arc) | easeOutCubic | — |

- **Reading hold:** ≈3680 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S05 · chart · ranking_horizontal (visual_demo, browser port 1.1)

- **Χρόνος:** start 31400 ms · duration 6400 ms · end 37800 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.» (13 λέξεις)
- **Οθόνη:** τίτλος «ΝΕΟΙ / ΚΑΤΩ ΤΩΝ 25» · context «ΑΝΕΡΓΙΑ 15–24, ΙΟΥΛΙΟΣ 2026» · hero «16,8%» + «ΕΛΛΑΔΑ» / «ΕΕ-27: 15,1%» · end note «% ΤΟΥ ΕΡΓΑΤΙΚΟΥ ΔΥΝΑΜΙΚΟΥ 15–24, ΟΧΙ ΟΛΩΝ ΤΩΝ ΝΕΩΝ»
- **Footer:** «ΠΗΓΗ: EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 (ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ) · ΔΗΜΟΣΙΕΥΣΗ 01/09/2026» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** ΕΛΛΑΔΑ (GR) = 16,8% [U10], material 1; ΕΕ-27 (EU) = 15,1% [U11], material 0 · sort descending · highlighted 0 · value_scale 0.3 world units/τιμή · decimals 1
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 500 | πρώτη λέξη | label/flag i | enter (stagger 280 ms) | 0→1 | 400 | easeOutCubic | — |
| 900 | αριθμός | bar i | grow from x=0 (stagger 280 ms) | 0→value | 2500 | easeOutCubic | — |
| 900 | αριθμός | value label i | count, anchored to bar tip | 0→value | 2500 | easeOutCubic | — |
| 4300 | — | end_note | enter | 0→1 | 500 | easeOutCubic | — |

- **Reading hold:** ≈1200 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S06 · chart · ranking_horizontal (visual_demo, browser port 1.1)

- **Χρόνος:** start 37800 ms · duration 7040 ms · end 44840 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.» (15 λέξεις)
- **Οθόνη:** τίτλος «ΤΡΙΤΗ / ΥΨΗΛΟΤΕΡΗ» · context «ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 2025, ΕΕ-27» · hero «8,9%» + «ΕΛΛΑΔΑ» / «ΕΤΟΣ 2025 · ΕΕ-27: 6,0%» · end note «ΕΤΗΣΙΟΣ ΜΕΣΟΣ 2025, ΚΟΙΝΟΣ ΟΡΙΣΜΟΣ EU-LFS»
- **Footer:** «ΠΗΓΗ: EUROSTAT une_rt_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 10/06/2026» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** ΙΣΠΑΝΙΑ (ES) = 10,5% [U15], material 2; ΦΙΝΛΑΝΔΙΑ (FI) = 9,7% [U15b], material 3; ΕΛΛΑΔΑ (GR) = 8,9% [U12], material 1; ΕΕ-27 (EU) = 6,0% [U13], material 0 · sort descending · highlighted 2 · value_scale 0.55 world units/τιμή · decimals 1
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 500 | πρώτη λέξη | label/flag i | enter (stagger 280 ms) | 0→1 | 400 | easeOutCubic | — |
| 900 | αριθμός | bar i | grow from x=0 (stagger 280 ms) | 0→value | 2500 | easeOutCubic | — |
| 900 | αριθμός | value label i | count, anchored to bar tip | 0→value | 2500 | easeOutCubic | — |
| 4300 | — | end_note | enter | 0→1 | 500 | easeOutCubic | — |

- **Reading hold:** ≈1840 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S07 · chart · before_after_columns (visual_demo, browser port 1.1)

- **Χρόνος:** start 44840 ms · duration 6400 ms · end 51240 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.» (13 λέξεις)
- **Οθόνη:** τίτλος «Η ΜΕΓΑΛΥΤΕΡΗ / ΠΤΩΣΗ ΣΤΗΝ ΕΕ» · context «ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, 2024 → 2025» · hero «−1,2» + «ΜΟΝΑΔΕΣ» / «ΠΟΣΟΣΤΙΑΙΕΣ, 2024 → 2025» · captions «ΕΤΟΣ 2024» / «ΕΤΟΣ 2025»
- **Footer:** «ΠΗΓΗ: EUROSTAT · KEY FIGURES ON EUROPE 2026 · une_rt_a · ΔΕΔΟΜΕΝΑ: 2024 ΚΑΙ 2025» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** from 2024 = 10,1% [C06] → to 2025 = 8,9% [U12] · delta −1,2 [U17] · value_scale 0.48 · decimals 1 · κοινή βάση 0, ίδια κλίμακα στις δύο στήλες
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 450 | — | captions | enter (stagger 200 ms) | 0→1 | 450 | easeOutCubic | — |
| 900 | πρώτη τιμή | column from | grow from baseline | 0→from | 2200 | easeOutCubic | — |
| 1450 | δεύτερη τιμή | column to | grow from baseline | 0→to | 2200 | easeOutCubic | — |
| 3650 | μεταβολή | hero delta | count | 0→delta | 800 | easeOutCubic | — |

- **Reading hold:** ≈1200 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S08 · chart · ranking_horizontal (visual_demo, browser port 1.1)

- **Χρόνος:** start 51240 ms · duration 7440 ms · end 58680 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.» (16 λέξεις)
- **Οθόνη:** τίτλος «ΑΠΑΣΧΟΛΗΣΗ / 20–64 ΕΤΩΝ» · context «ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ ΩΣ % ΤΟΥ ΠΛΗΘΥΣΜΟΥ 20–64, 2025» · hero «71,0%» + «ΕΛΛΑΔΑ» / «ΕΕ-27: 76,1%» · end note «ΑΛΛΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ ΑΠΟ ΤΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ»
- **Footer:** «ΠΗΓΗ: EUROSTAT lfsi_emp_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 17/04/2026» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** ΕΕ-27 (EU) = 76,1% [U21], material 0; ΕΛΛΑΔΑ (GR) = 71,0% [U20], material 1 · sort descending · highlighted 1 · value_scale 0.08 world units/τιμή · decimals 1
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 500 | πρώτη λέξη | label/flag i | enter (stagger 280 ms) | 0→1 | 400 | easeOutCubic | — |
| 900 | αριθμός | bar i | grow from x=0 (stagger 280 ms) | 0→value | 2500 | easeOutCubic | — |
| 900 | αριθμός | value label i | count, anchored to bar tip | 0→value | 2500 | easeOutCubic | — |
| 4300 | — | end_note | enter | 0→1 | 500 | easeOutCubic | — |

- **Reading hold:** ≈2240 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

### S09 · outro · ranking_horizontal (visual_demo, browser port 1.1)

- **Χρόνος:** start 58680 ms · duration 12400 ms · end 71080 ms · static_cover False · cover_hold 0 ms · transition crossfade 400 ms
- **VO:** «Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.» (28 λέξεις)
- **Οθόνη:** τίτλος «ΜΑΚΡΟΧΡΟΝΙΑ / ΑΝΕΡΓΙΑ» · context «ΑΝΕΡΓΟΙ 12+ ΜΗΝΕΣ ΩΣ % ΤΟΥ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ, ΕΤΟΣ 2024» · hero «5,4%» + «ΕΛΛΑΔΑ» / «ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ 2024» · end note «Η ΥΨΗΛΟΤΕΡΗ ΣΤΗΝ ΕΕ-27 ΤΟ 2024 · ΓΡΑΨΕ ΜΑΣ ΤΗ ΓΝΩΜΗ ΣΟΥ»
- **Footer:** «ΠΗΓΗ: EUROSTAT une_ltu_a · ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ: 2024 · ΔΗΜΟΣΙΕΥΣΗ 23/05/2025» (≥30 px, ≤2 γραμμές, ελέγχθηκε με μετρικές γραμματοσειράς)
- **Inputs:** ΕΛΛΑΔΑ (GR) = 5,4% [U18], material 1 · sort descending · highlighted 0 · value_scale 0.55 world units/τιμή · decimals 1
- **Frame 0:** Φόντο + header σε fade-in (crossfade από την προηγούμενη σκηνή)· γεωμετρία απούσα (χτίζει από 0,9 s).
- **Materials/roles:** Ελλάδα κόκκινο (1), ΕΕ-27 μπλε (0), Ισπανία μωβ (2), Φινλανδία steel (3), εκτός εργ. δυναμικού steel (3). Φόντο locked gradient. Κάμερα orthographic, σταθερή.
- **Events (local ms | trigger | target | operation | from→to | duration | easing | sound):**

| start_ms | trigger | target | operation | from→to | duration_ms | easing | sound |
|---|---|---|---|---|---|---|---|
| 0 | — | header | enter: opacity+18px settle | 0→1 | 650 | easeOutCubic | — |
| 500 | πρώτη λέξη | label/flag i | enter (stagger 280 ms) | 0→1 | 400 | easeOutCubic | — |
| 900 | αριθμός | bar i | grow from x=0 (stagger 280 ms) | 0→value | 2500 | easeOutCubic | — |
| 900 | αριθμός | value label i | count, anchored to bar tip | 0→value | 2500 | easeOutCubic | — |
| 4300 | — | end_note | enter | 0→1 | 500 | easeOutCubic | — |

- **Reading hold:** ≈7200 ms μετά το settle · **Handoff:** crossfade 400 ms, η επόμενη σκηνή εμφανίζεται πάνω από το τελικό καρέ.
- **Audio:** VO κείμενο μόνο, χωρίς asset · **Runtime:** web/dist/DATA_STORY_ANERGIA.html · **QA:** βλ. §9.

## 6. Κεντρικό Production JSON

Το πλήρες αντικείμενο είναι το αρχείο `DATA_STORY_ANERGIA_PRODUCTION.json` (ταυτόσημο με το ενσωματωμένο στο HTML). Ενσωματώνεται εδώ αυτούσιο:

```json
{
 "schema_version": "2.0",
 "design_system": "DATA_STORY_3D_BRIGHT_V1",
 "mode": "publication",
 "topic": "Ανεργία στην Ελλάδα, Ιούλιος 2026 και θέση στην ΕΕ-27",
 "language": "el",
 "research_cutoff": "2026-09-05",
 "canvas": {
  "width": 1080,
  "height": 1920,
  "fps": 25
 },
 "editorial": {
  "approval_status": "approved_2026-09-05 (angle + data, user: 'ναι')",
  "thesis": "Η ανεργία έπεσε στο 7,9% τον Ιούλιο 2026, αλλά η Ελλάδα παραμένει πάνω από τον μέσο όρο της ΕΕ-27, τρίτη υψηλότερη στο ετήσιο 2025, με χαμηλότερη απασχόληση και την υψηλότερη μακροχρόνια ανεργία στα τελευταία πλήρως συγκρίσιμα στοιχεία.",
  "limitations": [
   "Μηνιαία SA εκτιμήσεις αναθεωρούνται",
   "Μακροχρόνια ανεργία: έτος 2024· τιμή 2025 δεν επιβεβαιώθηκε",
   "Τιμή 2024 ετήσιας ανεργίας (10,1%) υπολογισμένη, προς επαλήθευση",
   "Καμία αιτιώδης ερμηνεία",
   "Διάρκεια 67 s: εξαίρεση από το όριο 60 s, δικαιολογημένη από 9 επιβεβαιωμένες μεταβλητές μίας οικογένειας πηγών"
  ],
  "duration_justification": "9 σκηνές, μία ιδέα ανά σκηνή, όλες οι μεταβλητές ΕΠΙΒΕΒΑΙΩΜΕΝΟ/ΜΕ ΠΕΡΙΟΡΙΣΜΟ, ίδια οικογένεια πηγών (EU-LFS). Εναλλακτικά χωρίζεται σε Μέρος 1 (S01–S05) και Μέρος 2 (S06–S09)."
 },
 "narration": {
  "wpm": 145,
  "expanded_word_count": 144,
  "theoretical_seconds": 59.6,
  "vo_a": "[calm] Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα. Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω. Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι. Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού. Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση. Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία. [warm] Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο. Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι. Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. [pause] Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.",
  "vo_b": "Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα. Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω. Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι. Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού. Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση. Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία. Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο. Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι. Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.",
  "audio_asset": null,
  "audio_duration_ms": null,
  "alignment_status": "NOT_RUN",
  "music": "off",
  "sfx": "none"
 },
 "sources": [
  {
   "id": "SRC01",
   "organization": "ΕΛΣΤΑΤ",
   "title": "Έρευνα Εργατικού Δυναμικού, μηνιαίες εκτιμήσεις, Ιούλιος 2026",
   "url": "https://www.statistics.gr/documents/20181/c74980f5-58a4-b4e1-b689-2aa5cf610b70",
   "dataset_code": "SJO02 (μηνιαίες εκτιμήσεις ΕΕΔ)",
   "page": "δελτίο τύπου",
   "reference_period": "2026-07",
   "fieldwork_period": "Ιούλιος 2026 (ΕΕΔ, εβδομάδες αναφοράς)",
   "release_date": "2026-08-31",
   "access_date": "2026-09-05",
   "methodology": "EU-LFS/ILO, εποχικά διορθωμένες εκτιμήσεις, 15–74, επανασταθμισμένο δείγμα βάσει Απογραφής 2021",
   "sample": null,
   "limitation": "Μηνιαία εκτίμηση, αναθεωρήσιμη· ο Ιούνιος 2026 αναθεωρήθηκε σε 8,1%"
  },
  {
   "id": "SRC02",
   "organization": "Eurostat",
   "title": "Euro area unemployment at 6.4% — euro indicators, July 2026",
   "url": "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/3-01092026-bp",
   "dataset_code": "une_rt_m",
   "page": "news release 3-01092026-BP",
   "reference_period": "2026-07",
   "fieldwork_period": null,
   "release_date": "2026-09-01",
   "access_date": "2026-09-05",
   "methodology": "Εναρμονισμένη μηνιαία ανεργία, SA, ILO",
   "sample": null,
   "limitation": "Μηνιαίες σειρές αναθεωρούνται με νέα EU-LFS δεδομένα"
  },
  {
   "id": "SRC03",
   "organization": "Eurostat",
   "title": "EU unemployment rate in 2025: 6.0%",
   "url": "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260610-3",
   "dataset_code": "une_rt_a",
   "page": "news article DDN-20260610-3",
   "reference_period": "2025",
   "fieldwork_period": null,
   "release_date": "2026-06-10",
   "access_date": "2026-09-05",
   "methodology": "Ετήσιος μέσος, 15–74, EU-LFS",
   "sample": null,
   "limitation": "Ετήσια μέτρηση, όχι εναλλάξιμη με μεμονωμένο μήνα"
  },
  {
   "id": "SRC04",
   "organization": "Eurostat",
   "title": "Key figures on Europe — 2026 edition",
   "url": "https://ec.europa.eu/eurostat/documents/15216629/23964567/KS-01-26-035-EN-N.pdf",
   "dataset_code": "une_rt_a",
   "page": "labour market chapter",
   "reference_period": "2024–2025",
   "fieldwork_period": null,
   "release_date": "2026",
   "access_date": "2026-09-05",
   "methodology": "Ετήσιος μέσος, EU-LFS",
   "sample": null,
   "limitation": "Η μεταβολή −1,2 π.μ. αναφέρεται από την έκδοση· η τιμή 2024 προκύπτει με υπολογισμό"
  },
  {
   "id": "SRC05",
   "organization": "Eurostat",
   "title": "New lows for EU unemployment in 2024",
   "url": "https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250523-1",
   "dataset_code": "une_ltu_a",
   "page": "news article DDN-20250523-1",
   "reference_period": "2024",
   "fieldwork_period": null,
   "release_date": "2025-05-23",
   "access_date": "2026-09-05",
   "methodology": "Άνεργοι ≥12 μήνες ως % εργατικού δυναμικού, EU-LFS",
   "sample": null,
   "limitation": "Έτος 2024· νεότερη τιμή 2025 δεν επιβεβαιώθηκε στο audit"
  },
  {
   "id": "SRC06",
   "organization": "Eurostat",
   "title": "EU's employment rate grew above 76% in 2025",
   "url": "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260417-1",
   "dataset_code": "lfsi_emp_a",
   "page": "news article DDN-20260417-1",
   "reference_period": "2025",
   "fieldwork_period": null,
   "release_date": "2026-04-17",
   "access_date": "2026-09-05",
   "methodology": "Απασχολούμενοι ως % πληθυσμού 20–64, EU-LFS",
   "sample": null,
   "limitation": "Άλλος παρονομαστής από την ανεργία"
  },
  {
   "id": "SRC07",
   "organization": "Eurostat",
   "title": "Metadata, monthly unemployment (une_rt_m ESMS)",
   "url": "https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm",
   "dataset_code": "une_rt_m",
   "page": "ESMS",
   "reference_period": null,
   "fieldwork_period": null,
   "release_date": null,
   "access_date": "2026-09-05",
   "methodology": "Ορισμοί και αναθεωρήσεις",
   "sample": null,
   "limitation": null
  },
  {
   "id": "SRC08",
   "organization": "ΕΛΣΤΑΤ",
   "title": "Ημερολόγιο ανακοινώσεων",
   "url": "https://www.statistics.gr/calendar",
   "dataset_code": null,
   "page": null,
   "reference_period": null,
   "fieldwork_period": null,
   "release_date": null,
   "access_date": "2026-09-05",
   "methodology": null,
   "sample": null,
   "limitation": "Επόμενη μηνιαία ΕΕΔ (Αύγουστος 2026): 30/09/2026"
  }
 ],
 "facts": [
  {
   "id": "U01",
   "indicator": "Ποσοστό ανεργίας, SA",
   "value": 7.9,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Μηνιαία SA εκτίμηση, αναθεωρήσιμη",
   "display_value": "7,9%"
  },
  {
   "id": "U02",
   "indicator": "Άνεργοι, SA",
   "value": 376508,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "376.508"
  },
  {
   "id": "U03",
   "indicator": "Απασχολούμενοι, SA",
   "value": 4379823,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "4.379.823"
  },
  {
   "id": "U04",
   "indicator": "Εκτός εργατικού δυναμικού (κάτω των 75)",
   "value": 2951948,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Δεν είναι άνεργοι· χωριστή κατηγορία",
   "display_value": "2.951.948"
  },
  {
   "id": "U05a",
   "indicator": "Ποσοστό ανεργίας, SA, έναν χρόνο πριν",
   "value": 8.9,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Ελλάδα",
   "reference_period": "2025-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "8,9%"
  },
  {
   "id": "U05",
   "indicator": "Ετήσια μεταβολή ποσοστού ανεργίας",
   "value": -1.0,
   "unit": "ποσοστιαίες μονάδες",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2025-07 → 2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": "7,9 − 8,9",
   "input_fact_ids": [
    "U01",
    "U05a"
   ],
   "limitation": null,
   "display_value": "−1,0"
  },
  {
   "id": "U06",
   "indicator": "Ετήσια μεταβολή αριθμού ανέργων",
   "value": -45192,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2025-07 → 2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "−10,7%",
   "display_value": "−45.192"
  },
  {
   "id": "U06b",
   "indicator": "Ετήσια μεταβολή αριθμού ανέργων, σχετική",
   "value": -10.7,
   "unit": "%",
   "denominator": "άνεργοι Ιουλίου 2025",
   "geography": "Ελλάδα",
   "reference_period": "2025-07 → 2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Σχετική μεταβολή (τοις εκατό), όχι ποσοστιαίες μονάδες",
   "display_value": "−10,7%"
  },
  {
   "id": "U07",
   "indicator": "Ετήσια μεταβολή απασχολουμένων",
   "value": 41365,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2025-07 → 2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "+1,0%",
   "display_value": "+41.365"
  },
  {
   "id": "U08",
   "indicator": "Ποσοστό ανεργίας ΕΕ-27, SA",
   "value": 6.1,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "ΕΕ-27",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC02"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "6,1%"
  },
  {
   "id": "U10",
   "indicator": "Ανεργία νέων <25",
   "value": 16.8,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–24",
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC02"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Παρονομαστής το νεανικό εργατικό δυναμικό, όχι όλοι οι νέοι",
   "display_value": "16,8%"
  },
  {
   "id": "U11",
   "indicator": "Ανεργία νέων <25 ΕΕ-27",
   "value": 15.1,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–24",
   "geography": "ΕΕ-27",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC02"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "15,1%"
  },
  {
   "id": "U12",
   "indicator": "Ετήσιο ποσοστό ανεργίας",
   "value": 8.9,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Ελλάδα",
   "reference_period": "2025",
   "source_ids": [
    "SRC03"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "8,9%"
  },
  {
   "id": "U13",
   "indicator": "Ετήσιο ποσοστό ανεργίας ΕΕ-27",
   "value": 6.0,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "ΕΕ-27",
   "reference_period": "2025",
   "source_ids": [
    "SRC03"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "6,0%"
  },
  {
   "id": "U14",
   "indicator": "Θέση Ελλάδας στην ετήσια ανεργία ΕΕ-27",
   "value": 3,
   "unit": "κατάταξη (υψηλότερη=1)",
   "denominator": "27 κράτη-μέλη",
   "geography": "ΕΕ-27",
   "reference_period": "2025",
   "source_ids": [
    "SRC03"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Ισπανία 10,5 · Φινλανδία 9,7 · Ελλάδα 8,9",
   "display_value": "3η"
  },
  {
   "id": "U15",
   "indicator": "Ετήσιο ποσοστό ανεργίας Ισπανίας",
   "value": 10.5,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Ισπανία",
   "reference_period": "2025",
   "source_ids": [
    "SRC03"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "10,5%"
  },
  {
   "id": "U15b",
   "indicator": "Ετήσιο ποσοστό ανεργίας Φινλανδίας",
   "value": 9.7,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Φινλανδία",
   "reference_period": "2025",
   "source_ids": [
    "SRC03"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "9,7%"
  },
  {
   "id": "U16",
   "indicator": "Χαμηλότερο ετήσιο ποσοστό ΕΕ-27 (Τσεχία)",
   "value": 2.8,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Τσεχία",
   "reference_period": "2025",
   "source_ids": [
    "SRC03"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Πολωνία, Μάλτα 3,1",
   "display_value": "2,8%"
  },
  {
   "id": "U17",
   "indicator": "Μεταβολή ετήσιας ανεργίας 2024→2025",
   "value": -1.2,
   "unit": "ποσοστιαίες μονάδες",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2024 → 2025",
   "source_ids": [
    "SRC04"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Μεγαλύτερη πτώση μεταξύ κρατών-μελών κατά την έκδοση",
   "display_value": "−1,2"
  },
  {
   "id": "U18",
   "indicator": "Μακροχρόνια ανεργία (≥12 μήνες)",
   "value": 5.4,
   "unit": "%",
   "denominator": "εργατικό δυναμικό",
   "geography": "Ελλάδα",
   "reference_period": "2024",
   "source_ids": [
    "SRC05"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Έτος 2024· δεν παρουσιάζεται ως τρέχουσα τιμή",
   "display_value": "5,4%"
  },
  {
   "id": "U19",
   "indicator": "Θέση Ελλάδας στη μακροχρόνια ανεργία ΕΕ-27",
   "value": 1,
   "unit": "κατάταξη (υψηλότερη=1)",
   "denominator": "27 κράτη-μέλη",
   "geography": "ΕΕ-27",
   "reference_period": "2024",
   "source_ids": [
    "SRC05"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": "Ισχύει για το 2024",
   "display_value": "υψηλότερη"
  },
  {
   "id": "U20",
   "indicator": "Ποσοστό απασχόλησης 20–64",
   "value": 71.0,
   "unit": "%",
   "denominator": "πληθυσμός 20–64",
   "geography": "Ελλάδα",
   "reference_period": "2025",
   "source_ids": [
    "SRC06"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "71,0%"
  },
  {
   "id": "U21",
   "indicator": "Ποσοστό απασχόλησης 20–64 ΕΕ-27",
   "value": 76.1,
   "unit": "%",
   "denominator": "πληθυσμός 20–64",
   "geography": "ΕΕ-27",
   "reference_period": "2025",
   "source_ids": [
    "SRC06"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "reported",
   "formula": null,
   "input_fact_ids": [],
   "limitation": null,
   "display_value": "76,1%"
  },
  {
   "id": "C01",
   "indicator": "Άνεργοι Ιούλιος 2025, SA",
   "value": 421700,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2025-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "calculated",
   "formula": "376.508 − (−45.192) = 421.700",
   "input_fact_ids": [
    "U02",
    "U06"
   ],
   "limitation": "Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ",
   "display_value": "421.700"
  },
  {
   "id": "C02",
   "indicator": "Πληθυσμός 15–74 (απασχολούμενοι + άνεργοι + εκτός)",
   "value": 7708279,
   "unit": "άτομα",
   "denominator": null,
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "calculated",
   "formula": "4.379.823 + 376.508 + 2.951.948",
   "input_fact_ids": [
    "U03",
    "U02",
    "U04"
   ],
   "limitation": "Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ",
   "display_value": "7.708.279"
  },
  {
   "id": "C03",
   "indicator": "Μερίδιο απασχολουμένων στον πληθυσμό 15–74",
   "value": 56.8,
   "unit": "%",
   "denominator": "πληθυσμός 15–74 (C02)",
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "calculated",
   "formula": "4.379.823 ÷ 7.708.279 × 100 = 56,82",
   "input_fact_ids": [
    "U03",
    "C02"
   ],
   "limitation": "Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ",
   "display_value": "56,8%"
  },
  {
   "id": "C04",
   "indicator": "Μερίδιο ανέργων στον πληθυσμό 15–74",
   "value": 4.9,
   "unit": "%",
   "denominator": "πληθυσμός 15–74 (C02)",
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "calculated",
   "formula": "376.508 ÷ 7.708.279 × 100 = 4,88",
   "input_fact_ids": [
    "U02",
    "C02"
   ],
   "limitation": "Διαφέρει από το ποσοστό ανεργίας (παρονομαστής πληθυσμός, όχι εργατικό δυναμικό)",
   "display_value": "4,9%"
  },
  {
   "id": "C05",
   "indicator": "Μερίδιο εκτός εργατικού δυναμικού στον πληθυσμό 15–74",
   "value": 38.3,
   "unit": "%",
   "denominator": "πληθυσμός 15–74 (C02)",
   "geography": "Ελλάδα",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "calculated",
   "formula": "2.951.948 ÷ 7.708.279 × 100 = 38,30",
   "input_fact_ids": [
    "U04",
    "C02"
   ],
   "limitation": "56,8 + 4,9 + 38,3 = 100,0",
   "display_value": "38,3%"
  },
  {
   "id": "C06",
   "indicator": "Ετήσιο ποσοστό ανεργίας 2024",
   "value": 10.1,
   "unit": "%",
   "denominator": "εργατικό δυναμικό 15–74",
   "geography": "Ελλάδα",
   "reference_period": "2024",
   "source_ids": [
    "SRC03",
    "SRC04"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ",
   "reported_or_calculated": "calculated",
   "formula": "8,9 + 1,2 = 10,1",
   "input_fact_ids": [
    "U12",
    "U17"
   ],
   "limitation": "Υπολογισμός DATA STORY βάσει Eurostat· να επαληθευτεί έναντι une_rt_a 2024 πριν τη δημοσίευση",
   "display_value": "10,1%"
  },
  {
   "id": "C07",
   "indicator": "Διαφορά Ελλάδας από ΕΕ-27, Ιούλιος 2026",
   "value": 1.8,
   "unit": "ποσοστιαίες μονάδες",
   "denominator": null,
   "geography": "Ελλάδα/ΕΕ-27",
   "reference_period": "2026-07",
   "source_ids": [
    "SRC01",
    "SRC02"
   ],
   "status": "ΕΠΙΒΕΒΑΙΩΜΕΝΟ",
   "reported_or_calculated": "calculated",
   "formula": "7,9 − 6,1",
   "input_fact_ids": [
    "U01",
    "U08"
   ],
   "limitation": "Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ και Eurostat",
   "display_value": "+1,8"
  }
 ],
 "scenes": [
  {
   "id": "S01",
   "role": "cover",
   "template_id": "ranking_horizontal",
   "start_ms": 0,
   "duration_ms": 9920,
   "static_cover": true,
   "cover_hold_ms": 800,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "Η ΑΝΕΡΓΙΑ",
    "title_line_2": "ΣΤΟ 7,9%",
    "subtitle": "ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 15–74, ΙΟΥΛΙΟΣ 2026",
    "hero_final": "7,9%",
    "hero_label": "ΕΛΛΑΔΑ",
    "hero_sub": "ΙΟΥΛΙΟΣ 2026 · ΕΕ-27: 6,1%",
    "end_note": "ΙΔΙΟΣ ΜΗΝΑΣ, ΙΔΙΟΣ ΟΡΙΣΜΟΣ (ILO), ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ"
   },
   "inputs": {
    "bars": [
     {
      "fact_id": "U01",
      "label": "ΕΛΛΑΔΑ",
      "country_code": "GR",
      "value": 7.9,
      "material_id": 1
     },
     {
      "fact_id": "U08",
      "label": "ΕΕ-27",
      "country_code": "EU",
      "value": 6.1,
      "material_id": 0
     }
    ],
    "highlighted_index": 0,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.55
   },
   "source_footer": "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08 & 01/09/2026",
   "data_ids": [
    "U01",
    "U08",
    "C07"
   ],
   "source_ids": [
    "SRC01",
    "SRC02"
   ],
   "voiceover_clean": "Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.",
   "voiceover_tagged": "[calm] Επτά κόμμα εννέα τοις εκατό η ανεργία στην Ελλάδα τον Ιούλιο του είκοσι έξι. Στην Ευρωπαϊκή Ένωση, έξι κόμμα ένα.",
   "words": 20
  },
  {
   "id": "S02",
   "role": "chart",
   "template_id": "before_after_columns",
   "start_ms": 9920,
   "duration_ms": 6400,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "ΕΝΑΝ ΧΡΟΝΟ",
    "title_line_2": "ΠΡΙΝ",
    "subtitle": "ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026",
    "hero_final": "−1,0",
    "hero_label": "ΜΟΝΑΔΑ",
    "hero_sub": "ΠΟΣΟΣΤΙΑΙΑ, ΣΕ 12 ΜΗΝΕΣ",
    "from_caption": "ΙΟΥΛΙΟΣ 2025",
    "to_caption": "ΙΟΥΛΙΟΣ 2026"
   },
   "inputs": {
    "from": {
     "fact_id": "U05a",
     "time_label": "2025",
     "value": 8.9
    },
    "to": {
     "fact_id": "U01",
     "time_label": "2026",
     "value": 7.9
    },
    "delta_fact_id": "U05",
    "delta_value": -1.0,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.55
   },
   "source_footer": "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2025 ΚΑΙ ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08/2026",
   "data_ids": [
    "U05a",
    "U01",
    "U05"
   ],
   "source_ids": [
    "SRC01"
   ],
   "voiceover_clean": "Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.",
   "voiceover_tagged": "Πέρσι ήταν οκτώ κόμμα εννέα. Μία ποσοστιαία μονάδα κάτω.",
   "words": 9
  },
  {
   "id": "S03",
   "role": "chart",
   "template_id": "before_after_columns",
   "start_ms": 16320,
   "duration_ms": 6400,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "376.508",
    "title_line_2": "ΑΝΕΡΓΟΙ",
    "subtitle": "ΑΡΙΘΜΟΣ ΑΝΕΡΓΩΝ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026",
    "hero_final": "−10,7%",
    "hero_label": "ΑΝΕΡΓΟΙ",
    "hero_sub": "−45.192 ΑΤΟΜΑ",
    "from_caption": "ΙΟΥΛΙΟΣ 2025",
    "to_caption": "ΙΟΥΛΙΟΣ 2026"
   },
   "inputs": {
    "from": {
     "fact_id": "C01",
     "time_label": "2025",
     "value": 421700
    },
    "to": {
     "fact_id": "U02",
     "time_label": "2026",
     "value": 376508
    },
    "delta_fact_id": "U06b",
    "delta_kind": "relative",
    "delta_value": -10.7,
    "delta_suffix": "%",
    "delta_decimals": 1,
    "value_suffix": "",
    "value_decimals": 0,
    "value_scale": 1.16e-05
   },
   "source_footer": "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · 2025: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΑΠΟ ΤΗ ΜΕΤΑΒΟΛΗ",
   "data_ids": [
    "C01",
    "U02",
    "U06",
    "U06b"
   ],
   "source_ids": [
    "SRC01"
   ],
   "voiceover_clean": "Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.",
   "voiceover_tagged": "Τριακόσιες εβδομήντα έξι χιλιάδες πεντακόσιοι οκτώ άνεργοι. Σαράντα πέντε χιλιάδες λιγότεροι.",
   "words": 11
  },
  {
   "id": "S04",
   "role": "chart",
   "template_id": "donut_parts",
   "start_ms": 22720,
   "duration_ms": 8680,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "100 ΑΤΟΜΑ",
    "title_line_2": "15–74 ΕΤΩΝ",
    "subtitle": "ΚΑΤΑΝΟΜΗ ΠΛΗΘΥΣΜΟΥ 15–74, ΙΟΥΛΙΟΣ 2026",
    "hero_final": "4,9%",
    "hero_label": "ΑΝΕΡΓΟΙ",
    "hero_sub": "ΤΟΥ ΠΛΗΘΥΣΜΟΥ 15–74"
   },
   "inputs": {
    "parts": [
     {
      "fact_id": "C03",
      "label": "ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ",
      "share": 56.8,
      "material_id": 0,
      "label_color": "#7895ff"
     },
     {
      "fact_id": "C04",
      "label": "ΑΝΕΡΓΟΙ",
      "share": 4.9,
      "material_id": 1,
      "label_color": "#ff315c"
     },
     {
      "fact_id": "C05",
      "label": "ΕΚΤΟΣ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ",
      "share": 38.3,
      "material_id": 3,
      "label_color": "#95b0d4"
     }
    ],
    "highlighted_index": 1,
    "value_decimals": 1
   },
   "source_footer": "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΜΕΡΙΔΙΑ: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΒΑΣΕΙ ΕΛΣΤΑΤ",
   "data_ids": [
    "C03",
    "C04",
    "C05",
    "C02"
   ],
   "source_ids": [
    "SRC01"
   ],
   "voiceover_clean": "Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.",
   "voiceover_tagged": "Στα εκατό άτομα δεκαπέντε έως εβδομήντα τεσσάρων, περίπου πενήντα επτά εργάζονται, πέντε είναι άνεργοι, τριάντα οκτώ εκτός εργατικού δυναμικού.",
   "words": 19
  },
  {
   "id": "S05",
   "role": "chart",
   "template_id": "ranking_horizontal",
   "start_ms": 31400,
   "duration_ms": 6400,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "ΝΕΟΙ",
    "title_line_2": "ΚΑΤΩ ΤΩΝ 25",
    "subtitle": "ΑΝΕΡΓΙΑ 15–24, ΙΟΥΛΙΟΣ 2026",
    "hero_final": "16,8%",
    "hero_label": "ΕΛΛΑΔΑ",
    "hero_sub": "ΕΕ-27: 15,1%",
    "end_note": "% ΤΟΥ ΕΡΓΑΤΙΚΟΥ ΔΥΝΑΜΙΚΟΥ 15–24, ΟΧΙ ΟΛΩΝ ΤΩΝ ΝΕΩΝ"
   },
   "inputs": {
    "bars": [
     {
      "fact_id": "U10",
      "label": "ΕΛΛΑΔΑ",
      "country_code": "GR",
      "value": 16.8,
      "material_id": 1
     },
     {
      "fact_id": "U11",
      "label": "ΕΕ-27",
      "country_code": "EU",
      "value": 15.1,
      "material_id": 0
     }
    ],
    "highlighted_index": 0,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.3
   },
   "source_footer": "ΠΗΓΗ: EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 (ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ) · ΔΗΜΟΣΙΕΥΣΗ 01/09/2026",
   "data_ids": [
    "U10",
    "U11"
   ],
   "source_ids": [
    "SRC02"
   ],
   "voiceover_clean": "Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.",
   "voiceover_tagged": "Στους νέους, δεκαέξι κόμμα οκτώ τοις εκατό, έναντι δεκαπέντε κόμμα ένα στην Ένωση.",
   "words": 13
  },
  {
   "id": "S06",
   "role": "chart",
   "template_id": "ranking_horizontal",
   "start_ms": 37800,
   "duration_ms": 7040,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "ΤΡΙΤΗ",
    "title_line_2": "ΥΨΗΛΟΤΕΡΗ",
    "subtitle": "ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 2025, ΕΕ-27",
    "hero_final": "8,9%",
    "hero_label": "ΕΛΛΑΔΑ",
    "hero_sub": "ΕΤΟΣ 2025 · ΕΕ-27: 6,0%",
    "end_note": "ΕΤΗΣΙΟΣ ΜΕΣΟΣ 2025, ΚΟΙΝΟΣ ΟΡΙΣΜΟΣ EU-LFS"
   },
   "inputs": {
    "bars": [
     {
      "fact_id": "U15",
      "label": "ΙΣΠΑΝΙΑ",
      "country_code": "ES",
      "value": 10.5,
      "material_id": 2
     },
     {
      "fact_id": "U15b",
      "label": "ΦΙΝΛΑΝΔΙΑ",
      "country_code": "FI",
      "value": 9.7,
      "material_id": 3
     },
     {
      "fact_id": "U12",
      "label": "ΕΛΛΑΔΑ",
      "country_code": "GR",
      "value": 8.9,
      "material_id": 1
     },
     {
      "fact_id": "U13",
      "label": "ΕΕ-27",
      "country_code": "EU",
      "value": 6.0,
      "material_id": 0
     }
    ],
    "highlighted_index": 2,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.55
   },
   "source_footer": "ΠΗΓΗ: EUROSTAT une_rt_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 10/06/2026",
   "data_ids": [
    "U15",
    "U15b",
    "U12",
    "U13",
    "U14"
   ],
   "source_ids": [
    "SRC03"
   ],
   "voiceover_clean": "Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.",
   "voiceover_tagged": "Για όλο το είκοσι πέντε, τρίτο υψηλότερο ποσοστό στην Ένωση, πίσω από Ισπανία και Φινλανδία.",
   "words": 15
  },
  {
   "id": "S07",
   "role": "chart",
   "template_id": "before_after_columns",
   "start_ms": 44840,
   "duration_ms": 6400,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "Η ΜΕΓΑΛΥΤΕΡΗ",
    "title_line_2": "ΠΤΩΣΗ ΣΤΗΝ ΕΕ",
    "subtitle": "ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, 2024 → 2025",
    "hero_final": "−1,2",
    "hero_label": "ΜΟΝΑΔΕΣ",
    "hero_sub": "ΠΟΣΟΣΤΙΑΙΕΣ, 2024 → 2025",
    "from_caption": "ΕΤΟΣ 2024",
    "to_caption": "ΕΤΟΣ 2025"
   },
   "inputs": {
    "from": {
     "fact_id": "C06",
     "time_label": "2024",
     "value": 10.1
    },
    "to": {
     "fact_id": "U12",
     "time_label": "2025",
     "value": 8.9
    },
    "delta_fact_id": "U17",
    "delta_value": -1.2,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.48
   },
   "source_footer": "ΠΗΓΗ: EUROSTAT · KEY FIGURES ON EUROPE 2026 · une_rt_a · ΔΕΔΟΜΕΝΑ: 2024 ΚΑΙ 2025",
   "data_ids": [
    "C06",
    "U12",
    "U17"
   ],
   "source_ids": [
    "SRC03",
    "SRC04"
   ],
   "voiceover_clean": "Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.",
   "voiceover_tagged": "[warm] Αλλά και η μεγαλύτερη πτώση: μία κόμμα δύο ποσοστιαίες μονάδες σε έναν χρόνο.",
   "words": 13
  },
  {
   "id": "S08",
   "role": "chart",
   "template_id": "ranking_horizontal",
   "start_ms": 51240,
   "duration_ms": 7440,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "ΑΠΑΣΧΟΛΗΣΗ",
    "title_line_2": "20–64 ΕΤΩΝ",
    "subtitle": "ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ ΩΣ % ΤΟΥ ΠΛΗΘΥΣΜΟΥ 20–64, 2025",
    "hero_final": "71,0%",
    "hero_label": "ΕΛΛΑΔΑ",
    "hero_sub": "ΕΕ-27: 76,1%",
    "end_note": "ΑΛΛΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ ΑΠΟ ΤΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ"
   },
   "inputs": {
    "bars": [
     {
      "fact_id": "U21",
      "label": "ΕΕ-27",
      "country_code": "EU",
      "value": 76.1,
      "material_id": 0
     },
     {
      "fact_id": "U20",
      "label": "ΕΛΛΑΔΑ",
      "country_code": "GR",
      "value": 71.0,
      "material_id": 1
     }
    ],
    "highlighted_index": 1,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.08
   },
   "source_footer": "ΠΗΓΗ: EUROSTAT lfsi_emp_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 17/04/2026",
   "data_ids": [
    "U21",
    "U20"
   ],
   "source_ids": [
    "SRC06"
   ],
   "voiceover_clean": "Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.",
   "voiceover_tagged": "Στην απασχόληση, εβδομήντα ένα τοις εκατό των είκοσι έως εξήντα τεσσάρων εργάζονται. Στην Ένωση, εβδομήντα έξι.",
   "words": 16
  },
  {
   "id": "S09",
   "role": "outro",
   "template_id": "ranking_horizontal",
   "start_ms": 58680,
   "duration_ms": 12400,
   "static_cover": false,
   "cover_hold_ms": 0,
   "transition": {
    "type": "crossfade",
    "duration_ms": 400
   },
   "copy": {
    "title_line_1": "ΜΑΚΡΟΧΡΟΝΙΑ",
    "title_line_2": "ΑΝΕΡΓΙΑ",
    "subtitle": "ΑΝΕΡΓΟΙ 12+ ΜΗΝΕΣ ΩΣ % ΤΟΥ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ, ΕΤΟΣ 2024",
    "hero_final": "5,4%",
    "hero_label": "ΕΛΛΑΔΑ",
    "hero_sub": "ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ 2024",
    "end_note": "Η ΥΨΗΛΟΤΕΡΗ ΣΤΗΝ ΕΕ-27 ΤΟ 2024 · ΓΡΑΨΕ ΜΑΣ ΤΗ ΓΝΩΜΗ ΣΟΥ"
   },
   "inputs": {
    "bars": [
     {
      "fact_id": "U18",
      "label": "ΕΛΛΑΔΑ",
      "country_code": "GR",
      "value": 5.4,
      "material_id": 1
     }
    ],
    "highlighted_index": 0,
    "value_suffix": "%",
    "value_decimals": 1,
    "value_scale": 0.55
   },
   "source_footer": "ΠΗΓΗ: EUROSTAT une_ltu_a · ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ: 2024 · ΔΗΜΟΣΙΕΥΣΗ 23/05/2025",
   "data_ids": [
    "U18",
    "U19"
   ],
   "source_ids": [
    "SRC05"
   ],
   "voiceover_clean": "Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.",
   "voiceover_tagged": "Και το είκοσι τέσσερα, η υψηλότερη μακροχρόνια ανεργία στην Ένωση: πέντε κόμμα τέσσερα τοις εκατό. [pause] Η ανεργία πέφτει. Λύθηκε το πρόβλημα; Γράψε μας τη γνώμη σου στα σχόλια.",
   "words": 28
  }
 ],
 "total_duration_ms": 71080,
 "render_options": {
  "source_px": 30
 },
 "assets": {
  "engine": "web/src/engine.js v1.1 (DATA_STORY_3D_BRIGHT_V1 browser port)",
  "fonts": "DejaVu Sans Bold/Regular subset (embedded)",
  "flags": "DE FR IT GR EU ES FI CZ PL PT",
  "availability": "available in repo aiskaitv-coder/remotion, branch claude/data-story-reels-shorts-2spn51"
 },
 "visual_review": {
  "version": "v1",
  "preview_status": "pending",
  "asset_paths": [],
  "scene_timestamps": [],
  "renderer_version": "engine 1.1",
  "data_version": "anergia_2026 v1",
  "approval_status": "pending",
  "approved_version": null
 },
 "execution": {
  "specification_status": "specification_complete",
  "preview_status": "pending",
  "render_status": "not_run",
  "visual_qa_status": "pending",
  "blockers": [
   "C06 (10,1% έτος 2024) προς επαλήθευση στο une_rt_a",
   "U18/U19 έτος 2024· 2025 προς επαλήθευση στο une_ltu_a"
  ]
 }
}
```

## 7. Assets

| Asset | Έκδοση | Διαθεσιμότητα |
|---|---|---|
| engine | web/src/engine.js v1.1 (DATA_STORY_3D_BRIGHT_V1 browser port) | ναι |
| fonts | DejaVu Sans Bold/Regular subset (embedded) | ναι |
| flags | DE FR IT GR EU ES FI CZ PL PT | ναι |
| availability | available in repo aiskaitv-coder/remotion, branch claude/data-story-reels-shorts-2spn51 | ναι |
| Built page | web/dist/DATA_STORY_ANERGIA.html · sha256 aa3b176a3ee606d8 | ναι |
| Review package | web/dist/review_anergia/ (cover, 9 stills, contact sheet) | ναι |
| MP4 | — | όχι ακόμη (μετά την οπτική έγκριση) |
| Audio | — | όχι |

## 8. Οδηγία Claude Design / renderer

Implement the specified story with DATA_STORY_3D_BRIGHT_V1. Use the exact approved template geometry, materials, fonts, light fields and camera from the provided source package. Populate the centralized facts and template inputs. Do not redesign the charts from prose or replace true-3D marks with a flat SVG/CSS approximation. Preserve sources, flags, Greek text, timing and scales.

The reference engine is C++ ray marching + Python/Pillow + FFmpeg. First inspect whether the target environment has this runtime or an approved compatible port. Parameterize the demo values and scene lengths through one adapter, preserving the visual constants. Implement the static publication cover, larger source footers, actual VO alignment and any requested layouts, then verify them.

If single-file HTML/CSS/JS is explicitly required, use an available validated browser implementation or perform a one-time port of the geometry/shading to WebGL with centralized uniforms/data and HTML typography. Porting is engineering work, not already delivered support. Bundle required assets/dependencies for the requested single-file/offline behavior and test in Chromium. Do not claim identical results from an untested reconstruction. A player containing the MP4 is not an editable graphics template.

Render a complete static cover at frame zero. Animate only after its hold. Autoplay without visible playback UI. Respect reduced-motion in interactive preview without changing the explicitly selected export timeline. Implement declared shared morphs or use the declared clean cut. Export only after the requested actual checks run, and report failures or unrun checks truthfully.

**Εφαρμογή σε αυτή την ιστορία:** η validated browser implementation υπάρχει (web/src/engine.js 1.1, ελεγμένη έναντι των native stills). Η σελίδα `DATA_STORY_ANERGIA.html` είναι το timeline· εισάγεται στο Claude Design ως component και εξάγεται MP4, ή γίνεται render με `web/tools/render_mp4.mjs`.

## 9. QA

| # | Έλεγχος | Αποτέλεσμα | Τεκμήριο |
|---|---|---|---|
| Q1 | Μόνο εγκεκριμένα facts στην οθόνη· κάθε τιμή με fact id | PASS | §2 και inputs ανά σκηνή· validator PASS |
| Q2 | Audit πηγών/ημερομηνιών/μεθόδου πλήρες | PASS | §1, από την έρευνα 05/09/2026 (πρωτογενείς σελίδες ανοιγμένες στο GPT) |
| Q3 | Διαχωρισμός ελληνικού snapshot (Ιούλ. 2026) από ετήσια ΕΕ σύγκριση (2025) και μακροχρόνια (2024) | PASS | Κάθε σκηνή φέρει την περίοδό της στο context και στο footer |
| Q4 | Καμία επινοημένη τιμή, καμία αιτιότητα, κανένα averaging ranks, καμία κάρτα data-gap | PASS | VO και copy περιγραφικά |
| Q5 | Ταύτιση τιμών οθόνης / VO / JSON | PASS | VO αριθμοί: 7,9 · 6,1 · 8,9 · 376.508 · 45 χιλ. (στρογγυλοποίηση του 45.192, ακριβές στην οθόνη) · 57/5/38 (στρογγυλοποίηση των 56,8/4,9/38,3 με «περίπου») · 16,8 · 15,1 · τρίτη · 1,2 · 71 · 76 · 5,4 |
| Q6 | Donut μέρη αθροίζουν 100,0· ranking φθίνουσα· delta σε ποσοστιαίες μονάδες | PASS | C03+C04+C05 = 100,0 · validator |
| Q7 | Ποσοστό vs ποσοστιαίες μονάδες vs σχετική μεταβολή | PASS | U05/U17 π.μ. · U06b −10,7% σχετική |
| Q8 | VO A/B ίδιες λέξεις· μέτρηση | PASS | 144 λέξεις, 59.6 s |
| Q9 | Template IDs υπάρχουν· planned δεν χρησιμοποιούνται | PASS | 3 templates, όλα ported |
| Q10 | Timeline συνεχές, όρια σε 40 ms, transitions 280–450 ms, cover hold 800 ms | PASS | validator · total 71.080 ms = 1.777 καρέ |
| Q11 | Footer ≥30 px ≤2 γραμμές· τίτλοι ≥84 px· hero row εντός 998 px | PASS | validator με μετρικές DejaVu + render χωρίς σφάλμα |
| Q12 | Στατικό εξώφυλλο frame 0 με τελικό KPI | PASS | review_anergia/cover_frame0.png |
| Q13 | Ένα settled still ανά σκηνή, τιμές/σημαίες/πηγή ορατές | PASS | review_anergia/scene_01…09 + contact_sheet.png (οπτικός έλεγχος) |
| Q14 | MP4 1080×1920 25 fps, full decode, καρέ = 1.777 | NOT_RUN | Εκκρεμεί οπτική έγκριση |
| Q15 | Ήχος/VO alignment | NOT_RUN | Δεν υπάρχει ηχητικό αρχείο |
| Q16 | Επαλήθευση C06 (10,1% έτος 2024) στο une_rt_a | NOT_RUN | Υπολογισμός από U12+U17· ζητήθηκε επαλήθευση στο GPT |
| Q17 | Νεότερη μακροχρόνια ανεργία 2025 (une_ltu_a) | NOT_RUN | Χρησιμοποιείται 2024 με ορατή χρονοσήμανση |

**Κατάσταση:** specification_complete · preview_complete (stills) · render_status: not_run · visual approval: pending.
