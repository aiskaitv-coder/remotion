"""Generates DATA_STORY_ANERGIA_PRODUCTION.json (schema 2.0) from the approved audit (U01–U21), the VO and
the approved scene plan. Facts are the single numeric source of truth; scene inputs reference them."""
import json, math
from vo import rows
ACCESS = "2026-09-05"
SOURCES = [
 {"id":"SRC01","organization":"ΕΛΣΤΑΤ","title":"Έρευνα Εργατικού Δυναμικού, μηνιαίες εκτιμήσεις, Ιούλιος 2026","url":"https://www.statistics.gr/documents/20181/c74980f5-58a4-b4e1-b689-2aa5cf610b70","dataset_code":"SJO02 (μηνιαίες εκτιμήσεις ΕΕΔ)","page":"δελτίο τύπου","reference_period":"2026-07","fieldwork_period":"Ιούλιος 2026 (ΕΕΔ, εβδομάδες αναφοράς)","release_date":"2026-08-31","access_date":ACCESS,"methodology":"EU-LFS/ILO, εποχικά διορθωμένες εκτιμήσεις, 15–74, επανασταθμισμένο δείγμα βάσει Απογραφής 2021","sample":None,"limitation":"Μηνιαία εκτίμηση, αναθεωρήσιμη· ο Ιούνιος 2026 αναθεωρήθηκε σε 8,1%"},
 {"id":"SRC02","organization":"Eurostat","title":"Euro area unemployment at 6.4% — euro indicators, July 2026","url":"https://ec.europa.eu/eurostat/web/products-euro-indicators/w/3-01092026-bp","dataset_code":"une_rt_m","page":"news release 3-01092026-BP","reference_period":"2026-07","fieldwork_period":None,"release_date":"2026-09-01","access_date":ACCESS,"methodology":"Εναρμονισμένη μηνιαία ανεργία, SA, ILO","sample":None,"limitation":"Μηνιαίες σειρές αναθεωρούνται με νέα EU-LFS δεδομένα"},
 {"id":"SRC03","organization":"Eurostat","title":"EU unemployment rate in 2025: 6.0%","url":"https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260610-3","dataset_code":"une_rt_a","page":"news article DDN-20260610-3","reference_period":"2025","fieldwork_period":None,"release_date":"2026-06-10","access_date":ACCESS,"methodology":"Ετήσιος μέσος, 15–74, EU-LFS","sample":None,"limitation":"Ετήσια μέτρηση, όχι εναλλάξιμη με μεμονωμένο μήνα"},
 {"id":"SRC04","organization":"Eurostat","title":"Key figures on Europe — 2026 edition","url":"https://ec.europa.eu/eurostat/documents/15216629/23964567/KS-01-26-035-EN-N.pdf","dataset_code":"une_rt_a","page":"labour market chapter","reference_period":"2024–2025","fieldwork_period":None,"release_date":"2026","access_date":ACCESS,"methodology":"Ετήσιος μέσος, EU-LFS","sample":None,"limitation":"Η μεταβολή −1,2 π.μ. αναφέρεται από την έκδοση· η τιμή 2024 προκύπτει με υπολογισμό"},
 {"id":"SRC05","organization":"Eurostat","title":"New lows for EU unemployment in 2024","url":"https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250523-1","dataset_code":"une_ltu_a","page":"news article DDN-20250523-1","reference_period":"2024","fieldwork_period":None,"release_date":"2025-05-23","access_date":ACCESS,"methodology":"Άνεργοι ≥12 μήνες ως % εργατικού δυναμικού, EU-LFS","sample":None,"limitation":"Έτος 2024· νεότερη τιμή 2025 δεν επιβεβαιώθηκε στο audit"},
 {"id":"SRC06","organization":"Eurostat","title":"EU's employment rate grew above 76% in 2025","url":"https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260417-1","dataset_code":"lfsi_emp_a","page":"news article DDN-20260417-1","reference_period":"2025","fieldwork_period":None,"release_date":"2026-04-17","access_date":ACCESS,"methodology":"Απασχολούμενοι ως % πληθυσμού 20–64, EU-LFS","sample":None,"limitation":"Άλλος παρονομαστής από την ανεργία"},
 {"id":"SRC07","organization":"Eurostat","title":"Metadata, monthly unemployment (une_rt_m ESMS)","url":"https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm","dataset_code":"une_rt_m","page":"ESMS","reference_period":None,"fieldwork_period":None,"release_date":None,"access_date":ACCESS,"methodology":"Ορισμοί και αναθεωρήσεις","sample":None,"limitation":None},
 {"id":"SRC08","organization":"ΕΛΣΤΑΤ","title":"Ημερολόγιο ανακοινώσεων","url":"https://www.statistics.gr/calendar","dataset_code":None,"page":None,"reference_period":None,"fieldwork_period":None,"release_date":None,"access_date":ACCESS,"methodology":None,"sample":None,"limitation":"Επόμενη μηνιαία ΕΕΔ (Αύγουστος 2026): 30/09/2026"},
]
def F(id, ind, v, unit, den, geo, per, src, status, rc="reported", formula=None, inputs=None, lim=None, disp=None):
    return {"id":id,"indicator":ind,"value":v,"unit":unit,"denominator":den,"geography":geo,"reference_period":per,"source_ids":src,"status":status,"reported_or_calculated":rc,"formula":formula,"input_fact_ids":inputs or [],"limitation":lim,"display_value":disp}
V, VL = "ΕΠΙΒΕΒΑΙΩΜΕΝΟ", "ΕΠΙΒΕΒΑΙΩΜΕΝΟ ΜΕ ΠΕΡΙΟΡΙΣΜΟ"
FACTS = [
 F("U01","Ποσοστό ανεργίας, SA",7.9,"%","εργατικό δυναμικό 15–74","Ελλάδα","2026-07",["SRC01"],V,lim="Μηνιαία SA εκτίμηση, αναθεωρήσιμη",disp="7,9%"),
 F("U02","Άνεργοι, SA",376508,"άτομα",None,"Ελλάδα","2026-07",["SRC01"],V,disp="376.508"),
 F("U03","Απασχολούμενοι, SA",4379823,"άτομα",None,"Ελλάδα","2026-07",["SRC01"],V,disp="4.379.823"),
 F("U04","Εκτός εργατικού δυναμικού (κάτω των 75)",2951948,"άτομα",None,"Ελλάδα","2026-07",["SRC01"],V,lim="Δεν είναι άνεργοι· χωριστή κατηγορία",disp="2.951.948"),
 F("U05a","Ποσοστό ανεργίας, SA, έναν χρόνο πριν",8.9,"%","εργατικό δυναμικό 15–74","Ελλάδα","2025-07",["SRC01"],V,disp="8,9%"),
 F("U05","Ετήσια μεταβολή ποσοστού ανεργίας",-1.0,"ποσοστιαίες μονάδες",None,"Ελλάδα","2025-07 → 2026-07",["SRC01"],V,rc="reported",formula="7,9 − 8,9",inputs=["U01","U05a"],disp="−1,0"),
 F("U06","Ετήσια μεταβολή αριθμού ανέργων",-45192,"άτομα",None,"Ελλάδα","2025-07 → 2026-07",["SRC01"],V,lim="−10,7%",disp="−45.192"),
 F("U06b","Ετήσια μεταβολή αριθμού ανέργων, σχετική",-10.7,"%","άνεργοι Ιουλίου 2025","Ελλάδα","2025-07 → 2026-07",["SRC01"],V,lim="Σχετική μεταβολή (τοις εκατό), όχι ποσοστιαίες μονάδες",disp="−10,7%"),
 F("U07","Ετήσια μεταβολή απασχολουμένων",41365,"άτομα",None,"Ελλάδα","2025-07 → 2026-07",["SRC01"],V,lim="+1,0%",disp="+41.365"),
 F("U08","Ποσοστό ανεργίας ΕΕ-27, SA",6.1,"%","εργατικό δυναμικό 15–74","ΕΕ-27","2026-07",["SRC02"],V,disp="6,1%"),
 F("U10","Ανεργία νέων <25",16.8,"%","εργατικό δυναμικό 15–24","Ελλάδα","2026-07",["SRC02"],V,lim="Παρονομαστής το νεανικό εργατικό δυναμικό, όχι όλοι οι νέοι",disp="16,8%"),
 F("U11","Ανεργία νέων <25 ΕΕ-27",15.1,"%","εργατικό δυναμικό 15–24","ΕΕ-27","2026-07",["SRC02"],V,disp="15,1%"),
 F("U12","Ετήσιο ποσοστό ανεργίας",8.9,"%","εργατικό δυναμικό 15–74","Ελλάδα","2025",["SRC03"],V,disp="8,9%"),
 F("U13","Ετήσιο ποσοστό ανεργίας ΕΕ-27",6.0,"%","εργατικό δυναμικό 15–74","ΕΕ-27","2025",["SRC03"],V,disp="6,0%"),
 F("U14","Θέση Ελλάδας στην ετήσια ανεργία ΕΕ-27",3,"κατάταξη (υψηλότερη=1)","27 κράτη-μέλη","ΕΕ-27","2025",["SRC03"],V,lim="Ισπανία 10,5 · Φινλανδία 9,7 · Ελλάδα 8,9",disp="3η"),
 F("U15","Ετήσιο ποσοστό ανεργίας Ισπανίας",10.5,"%","εργατικό δυναμικό 15–74","Ισπανία","2025",["SRC03"],V,disp="10,5%"),
 F("U15b","Ετήσιο ποσοστό ανεργίας Φινλανδίας",9.7,"%","εργατικό δυναμικό 15–74","Φινλανδία","2025",["SRC03"],V,disp="9,7%"),
 F("U16","Χαμηλότερο ετήσιο ποσοστό ΕΕ-27 (Τσεχία)",2.8,"%","εργατικό δυναμικό 15–74","Τσεχία","2025",["SRC03"],V,lim="Πολωνία, Μάλτα 3,1",disp="2,8%"),
 F("U17","Μεταβολή ετήσιας ανεργίας 2024→2025",-1.2,"ποσοστιαίες μονάδες",None,"Ελλάδα","2024 → 2025",["SRC04"],V,lim="Μεγαλύτερη πτώση μεταξύ κρατών-μελών κατά την έκδοση",disp="−1,2"),
 F("U18","Μακροχρόνια ανεργία (≥12 μήνες)",5.4,"%","εργατικό δυναμικό","Ελλάδα","2024",["SRC05"],VL,lim="Έτος 2024· δεν παρουσιάζεται ως τρέχουσα τιμή",disp="5,4%"),
 F("U19","Θέση Ελλάδας στη μακροχρόνια ανεργία ΕΕ-27",1,"κατάταξη (υψηλότερη=1)","27 κράτη-μέλη","ΕΕ-27","2024",["SRC05"],VL,lim="Ισχύει για το 2024",disp="υψηλότερη"),
 F("U20","Ποσοστό απασχόλησης 20–64",71.0,"%","πληθυσμός 20–64","Ελλάδα","2025",["SRC06"],V,disp="71,0%"),
 F("U21","Ποσοστό απασχόλησης 20–64 ΕΕ-27",76.1,"%","πληθυσμός 20–64","ΕΕ-27","2025",["SRC06"],V,disp="76,1%"),
 # DATA STORY calculations (all inputs verified, same release)
 F("C01","Άνεργοι Ιούλιος 2025, SA",421700,"άτομα",None,"Ελλάδα","2025-07",["SRC01"],V,rc="calculated",formula="376.508 − (−45.192) = 421.700",inputs=["U02","U06"],lim="Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ",disp="421.700"),
 F("C02","Πληθυσμός 15–74 (απασχολούμενοι + άνεργοι + εκτός)",7708279,"άτομα",None,"Ελλάδα","2026-07",["SRC01"],V,rc="calculated",formula="4.379.823 + 376.508 + 2.951.948",inputs=["U03","U02","U04"],lim="Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ",disp="7.708.279"),
 F("C03","Μερίδιο απασχολουμένων στον πληθυσμό 15–74",56.8,"%","πληθυσμός 15–74 (C02)","Ελλάδα","2026-07",["SRC01"],V,rc="calculated",formula="4.379.823 ÷ 7.708.279 × 100 = 56,82",inputs=["U03","C02"],lim="Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ",disp="56,8%"),
 F("C04","Μερίδιο ανέργων στον πληθυσμό 15–74",4.9,"%","πληθυσμός 15–74 (C02)","Ελλάδα","2026-07",["SRC01"],V,rc="calculated",formula="376.508 ÷ 7.708.279 × 100 = 4,88",inputs=["U02","C02"],lim="Διαφέρει από το ποσοστό ανεργίας (παρονομαστής πληθυσμός, όχι εργατικό δυναμικό)",disp="4,9%"),
 F("C05","Μερίδιο εκτός εργατικού δυναμικού στον πληθυσμό 15–74",38.3,"%","πληθυσμός 15–74 (C02)","Ελλάδα","2026-07",["SRC01"],V,rc="calculated",formula="2.951.948 ÷ 7.708.279 × 100 = 38,30",inputs=["U04","C02"],lim="56,8 + 4,9 + 38,3 = 100,0",disp="38,3%"),
 F("C06","Ετήσιο ποσοστό ανεργίας 2024",10.1,"%","εργατικό δυναμικό 15–74","Ελλάδα","2024",["SRC03","SRC04"],VL,rc="calculated",formula="8,9 + 1,2 = 10,1",inputs=["U12","U17"],lim="Υπολογισμός DATA STORY βάσει Eurostat· να επαληθευτεί έναντι une_rt_a 2024 πριν τη δημοσίευση",disp="10,1%"),
 F("C07","Διαφορά Ελλάδας από ΕΕ-27, Ιούλιος 2026",1.8,"ποσοστιαίες μονάδες",None,"Ελλάδα/ΕΕ-27","2026-07",["SRC01","SRC02"],V,rc="calculated",formula="7,9 − 6,1",inputs=["U01","U08"],lim="Υπολογισμός DATA STORY βάσει ΕΛΣΤΑΤ και Eurostat",disp="+1,8"),
]
vo = {r["scene"]: r for r in rows()}
MIN = {"ranking_horizontal": 6.4, "before_after_columns": 6.4, "donut_parts": 7.2}
def dur(sid, tpl, extra=0.0):
    need = vo[sid]["vo_seconds"] + 0.8 + extra            # VO + reading/handoff allowance (+ cover hold)
    return int(math.ceil(max(need, MIN[tpl] + extra) / 0.04) * 40)
TR = {"type": "crossfade", "duration_ms": 400}
SC = []
def scene(sid, role, tpl, copy, inputs, footer, data_ids, src, extra=0.0, cover=False):
    SC.append({"id": sid, "role": role, "template_id": tpl, "start_ms": 0, "duration_ms": dur(sid, tpl, extra),
               "static_cover": cover, "cover_hold_ms": 800 if cover else 0, "transition": dict(TR),
               "copy": copy, "inputs": inputs, "source_footer": footer, "data_ids": data_ids, "source_ids": src,
               "voiceover_clean": vo[sid]["vo_b"], "voiceover_tagged": vo[sid]["vo_a"], "words": vo[sid]["words"]})
GR, EU = "ΕΛΛΑΔΑ", "ΕΥΡΩΠΑΪΚΗ ΕΝΩΣΗ"
scene("S01","cover","ranking_horizontal",
 {"title_line_1":"Η ΑΝΕΡΓΙΑ","title_line_2":"ΣΤΟ 7,9%","subtitle":"ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 15–74, ΙΟΥΛΙΟΣ 2026","hero_final":"7,9%","hero_label":GR,"hero_sub":"ΙΟΥΛΙΟΣ 2026 · ΕΕ-27: 6,1%","end_note":"ΙΔΙΟΣ ΜΗΝΑΣ, ΙΔΙΟΣ ΟΡΙΣΜΟΣ (ILO), ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ"},
 {"bars":[{"fact_id":"U01","label":GR,"country_code":"GR","value":7.9,"material_id":1},{"fact_id":"U08","label":"ΕΕ-27","country_code":"EU","value":6.1,"material_id":0}],"highlighted_index":0,"value_suffix":"%","value_decimals":1,"value_scale":0.55},
 "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08 & 01/09/2026",["U01","U08","C07"],["SRC01","SRC02"],extra=0.8,cover=True)
scene("S02","chart","before_after_columns",
 {"title_line_1":"ΕΝΑΝ ΧΡΟΝΟ","title_line_2":"ΠΡΙΝ","subtitle":"ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026","hero_final":"−1,0","hero_label":"ΜΟΝΑΔΑ","hero_sub":"ΠΟΣΟΣΤΙΑΙΑ, ΣΕ 12 ΜΗΝΕΣ","from_caption":"ΙΟΥΛΙΟΣ 2025","to_caption":"ΙΟΥΛΙΟΣ 2026"},
 {"from":{"fact_id":"U05a","time_label":"2025","value":8.9},"to":{"fact_id":"U01","time_label":"2026","value":7.9},"delta_fact_id":"U05","delta_value":-1.0,"value_suffix":"%","value_decimals":1,"value_scale":0.55},
 "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2025 ΚΑΙ ΙΟΥΛΙΟΣ 2026 · ΔΗΜΟΣΙΕΥΣΗ 31/08/2026",["U05a","U01","U05"],["SRC01"])
scene("S03","chart","before_after_columns",
 {"title_line_1":"376.508","title_line_2":"ΑΝΕΡΓΟΙ","subtitle":"ΑΡΙΘΜΟΣ ΑΝΕΡΓΩΝ, ΙΟΥΛΙΟΣ 2025 → ΙΟΥΛΙΟΣ 2026","hero_final":"−10,7%","hero_label":"ΑΝΕΡΓΟΙ","hero_sub":"−45.192 ΑΤΟΜΑ","from_caption":"ΙΟΥΛΙΟΣ 2025","to_caption":"ΙΟΥΛΙΟΣ 2026"},
 {"from":{"fact_id":"C01","time_label":"2025","value":421700},"to":{"fact_id":"U02","time_label":"2026","value":376508},"delta_fact_id":"U06b","delta_kind":"relative","delta_value":-10.7,"delta_suffix":"%","delta_decimals":1,"value_suffix":"","value_decimals":0,"value_scale":0.0000116},
 "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · 2025: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΑΠΟ ΤΗ ΜΕΤΑΒΟΛΗ",["C01","U02","U06","U06b"],["SRC01"])
scene("S04","chart","donut_parts",
 {"title_line_1":"100 ΑΤΟΜΑ","title_line_2":"15–74 ΕΤΩΝ","subtitle":"ΚΑΤΑΝΟΜΗ ΠΛΗΘΥΣΜΟΥ 15–74, ΙΟΥΛΙΟΣ 2026","hero_final":"4,9%","hero_label":"ΑΝΕΡΓΟΙ","hero_sub":"ΤΟΥ ΠΛΗΘΥΣΜΟΥ 15–74"},
 {"parts":[{"fact_id":"C03","label":"ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ","share":56.8,"material_id":0,"label_color":"#7895ff"},{"fact_id":"C04","label":"ΑΝΕΡΓΟΙ","share":4.9,"material_id":1,"label_color":"#ff315c"},{"fact_id":"C05","label":"ΕΚΤΟΣ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ","share":38.3,"material_id":3,"label_color":"#95b0d4"}],"highlighted_index":1,"value_decimals":1},
 "ΠΗΓΗ: ΕΛΣΤΑΤ ΕΕΔ · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 · ΜΕΡΙΔΙΑ: ΥΠΟΛΟΓΙΣΜΟΣ DATA STORY ΒΑΣΕΙ ΕΛΣΤΑΤ",["C03","C04","C05","C02"],["SRC01"])
scene("S05","chart","ranking_horizontal",
 {"title_line_1":"ΝΕΟΙ","title_line_2":"ΚΑΤΩ ΤΩΝ 25","subtitle":"ΑΝΕΡΓΙΑ 15–24, ΙΟΥΛΙΟΣ 2026","hero_final":"16,8%","hero_label":GR,"hero_sub":"ΕΕ-27: 15,1%","end_note":"% ΤΟΥ ΕΡΓΑΤΙΚΟΥ ΔΥΝΑΜΙΚΟΥ 15–24, ΟΧΙ ΟΛΩΝ ΤΩΝ ΝΕΩΝ"},
 {"bars":[{"fact_id":"U10","label":GR,"country_code":"GR","value":16.8,"material_id":1},{"fact_id":"U11","label":"ΕΕ-27","country_code":"EU","value":15.1,"material_id":0}],"highlighted_index":0,"value_suffix":"%","value_decimals":1,"value_scale":0.30},
 "ΠΗΓΗ: EUROSTAT une_rt_m · ΔΕΔΟΜΕΝΑ: ΙΟΥΛΙΟΣ 2026 (ΕΠΟΧΙΚΑ ΔΙΟΡΘΩΜΕΝΑ) · ΔΗΜΟΣΙΕΥΣΗ 01/09/2026",["U10","U11"],["SRC02"])
scene("S06","chart","ranking_horizontal",
 {"title_line_1":"ΤΡΙΤΗ","title_line_2":"ΥΨΗΛΟΤΕΡΗ","subtitle":"ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ 2025, ΕΕ-27","hero_final":"8,9%","hero_label":GR,"hero_sub":"ΕΤΟΣ 2025 · ΕΕ-27: 6,0%","end_note":"ΕΤΗΣΙΟΣ ΜΕΣΟΣ 2025, ΚΟΙΝΟΣ ΟΡΙΣΜΟΣ EU-LFS"},
 {"bars":[{"fact_id":"U15","label":"ΙΣΠΑΝΙΑ","country_code":"ES","value":10.5,"material_id":2},{"fact_id":"U15b","label":"ΦΙΝΛΑΝΔΙΑ","country_code":"FI","value":9.7,"material_id":3},{"fact_id":"U12","label":GR,"country_code":"GR","value":8.9,"material_id":1},{"fact_id":"U13","label":"ΕΕ-27","country_code":"EU","value":6.0,"material_id":0}],"highlighted_index":2,"value_suffix":"%","value_decimals":1,"value_scale":0.55},
 "ΠΗΓΗ: EUROSTAT une_rt_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 10/06/2026",["U15","U15b","U12","U13","U14"],["SRC03"])
scene("S07","chart","before_after_columns",
 {"title_line_1":"Η ΜΕΓΑΛΥΤΕΡΗ","title_line_2":"ΠΤΩΣΗ ΣΤΗΝ ΕΕ","subtitle":"ΕΤΗΣΙΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ, 2024 → 2025","hero_final":"−1,2","hero_label":"ΜΟΝΑΔΕΣ","hero_sub":"ΠΟΣΟΣΤΙΑΙΕΣ, 2024 → 2025","from_caption":"ΕΤΟΣ 2024","to_caption":"ΕΤΟΣ 2025"},
 {"from":{"fact_id":"C06","time_label":"2024","value":10.1},"to":{"fact_id":"U12","time_label":"2025","value":8.9},"delta_fact_id":"U17","delta_value":-1.2,"value_suffix":"%","value_decimals":1,"value_scale":0.48},
 "ΠΗΓΗ: EUROSTAT · KEY FIGURES ON EUROPE 2026 · une_rt_a · ΔΕΔΟΜΕΝΑ: 2024 ΚΑΙ 2025",["C06","U12","U17"],["SRC03","SRC04"])
scene("S08","chart","ranking_horizontal",
 {"title_line_1":"ΑΠΑΣΧΟΛΗΣΗ","title_line_2":"20–64 ΕΤΩΝ","subtitle":"ΑΠΑΣΧΟΛΟΥΜΕΝΟΙ ΩΣ % ΤΟΥ ΠΛΗΘΥΣΜΟΥ 20–64, 2025","hero_final":"71,0%","hero_label":GR,"hero_sub":"ΕΕ-27: 76,1%","end_note":"ΑΛΛΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ ΑΠΟ ΤΟ ΠΟΣΟΣΤΟ ΑΝΕΡΓΙΑΣ"},
 {"bars":[{"fact_id":"U21","label":"ΕΕ-27","country_code":"EU","value":76.1,"material_id":0},{"fact_id":"U20","label":GR,"country_code":"GR","value":71.0,"material_id":1}],"highlighted_index":1,"value_suffix":"%","value_decimals":1,"value_scale":0.080},
 "ΠΗΓΗ: EUROSTAT lfsi_emp_a · ΔΕΔΟΜΕΝΑ: ΕΤΟΣ 2025 · ΔΗΜΟΣΙΕΥΣΗ 17/04/2026",["U21","U20"],["SRC06"])
scene("S09","outro","ranking_horizontal",
 {"title_line_1":"ΜΑΚΡΟΧΡΟΝΙΑ","title_line_2":"ΑΝΕΡΓΙΑ","subtitle":"ΑΝΕΡΓΟΙ 12+ ΜΗΝΕΣ ΩΣ % ΤΟΥ ΕΡΓ. ΔΥΝΑΜΙΚΟΥ, ΕΤΟΣ 2024","hero_final":"5,4%","hero_label":GR,"hero_sub":"ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ 2024","end_note":"Η ΥΨΗΛΟΤΕΡΗ ΣΤΗΝ ΕΕ-27 ΤΟ 2024 · ΓΡΑΨΕ ΜΑΣ ΤΗ ΓΝΩΜΗ ΣΟΥ"},
 {"bars":[{"fact_id":"U18","label":GR,"country_code":"GR","value":5.4,"material_id":1}],"highlighted_index":0,"value_suffix":"%","value_decimals":1,"value_scale":0.55},
 "ΠΗΓΗ: EUROSTAT une_ltu_a · ΕΤΟΣ ΔΕΔΟΜΕΝΩΝ: 2024 · ΔΗΜΟΣΙΕΥΣΗ 23/05/2025",["U18","U19"],["SRC05"])
t = 0
for s in SC: s["start_ms"] = t; t += s["duration_ms"]
total_words = sum(s["words"] for s in SC)
PROD = {
 "schema_version":"2.0","design_system":"DATA_STORY_3D_BRIGHT_V1","mode":"publication",
 "topic":"Ανεργία στην Ελλάδα, Ιούλιος 2026 και θέση στην ΕΕ-27","language":"el","research_cutoff":ACCESS,
 "canvas":{"width":1080,"height":1920,"fps":25},
 "editorial":{"approval_status":"approved_2026-09-05 (angle + data, user: 'ναι')",
   "thesis":"Η ανεργία έπεσε στο 7,9% τον Ιούλιο 2026, αλλά η Ελλάδα παραμένει πάνω από τον μέσο όρο της ΕΕ-27, τρίτη υψηλότερη στο ετήσιο 2025, με χαμηλότερη απασχόληση και την υψηλότερη μακροχρόνια ανεργία στα τελευταία πλήρως συγκρίσιμα στοιχεία.",
   "limitations":["Μηνιαία SA εκτιμήσεις αναθεωρούνται","Μακροχρόνια ανεργία: έτος 2024· τιμή 2025 δεν επιβεβαιώθηκε","Τιμή 2024 ετήσιας ανεργίας (10,1%) υπολογισμένη, προς επαλήθευση","Καμία αιτιώδης ερμηνεία","Διάρκεια 67 s: εξαίρεση από το όριο 60 s, δικαιολογημένη από 9 επιβεβαιωμένες μεταβλητές μίας οικογένειας πηγών"],
   "duration_justification":"9 σκηνές, μία ιδέα ανά σκηνή, όλες οι μεταβλητές ΕΠΙΒΕΒΑΙΩΜΕΝΟ/ΜΕ ΠΕΡΙΟΡΙΣΜΟ, ίδια οικογένεια πηγών (EU-LFS). Εναλλακτικά χωρίζεται σε Μέρος 1 (S01–S05) και Μέρος 2 (S06–S09)."},
 "narration":{"wpm":145,"expanded_word_count":total_words,"theoretical_seconds":round(total_words/145*60,1),
   "vo_a":" ".join(s["voiceover_tagged"] for s in SC),"vo_b":" ".join(s["voiceover_clean"] for s in SC),
   "audio_asset":None,"audio_duration_ms":None,"alignment_status":"NOT_RUN","music":"off","sfx":"none"},
 "sources":SOURCES,"facts":FACTS,"scenes":SC,"total_duration_ms":t,
 "render_options":{"source_px":30},
 "assets":{"engine":"web/src/engine.js v1.1 (DATA_STORY_3D_BRIGHT_V1 browser port)","fonts":"DejaVu Sans Bold/Regular subset (embedded)","flags":"DE FR IT GR EU ES FI CZ PL PT","availability":"available in repo aiskaitv-coder/remotion, branch claude/data-story-reels-shorts-2spn51"},
 "visual_review":{"version":"v1","preview_status":"pending","asset_paths":[],"scene_timestamps":[],"renderer_version":"engine 1.1","data_version":"anergia_2026 v1","approval_status":"pending","approved_version":None},
 "execution":{"specification_status":"specification_complete","preview_status":"pending","render_status":"not_run","visual_qa_status":"pending","blockers":["C06 (10,1% έτος 2024) προς επαλήθευση στο une_rt_a","U18/U19 έτος 2024· 2025 προς επαλήθευση στο une_ltu_a"]},
}
json.dump(PROD, open("DATA_STORY_ANERGIA_PRODUCTION.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("scenes:", [(s["id"], s["template_id"], s["start_ms"], s["duration_ms"]) for s in SC])
print("total_ms:", t, "words:", total_words, "theoretical VO s:", round(total_words/145*60,1))
