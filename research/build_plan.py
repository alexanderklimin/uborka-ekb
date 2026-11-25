# Builds research/content_plan.csv — organic page plan for the Yekaterinburg cleaning site.
# Run: python3 -I research/build_plan.py  (from /opt/uborka-ekb). Volumes come later from Wordstat (research/wordstat_ekb.csv).
import csv, os

DIR = os.path.dirname(os.path.abspath(__file__))
rows = []
def add(wave, ptype, url, h1, query, gate, note=""):
    rows.append({"wave": wave, "type": ptype, "url": url, "h1": h1, "main_query": query, "gate": gate, "note": note})

CITY = "в Екатеринбурге"

# 1. Core service pages (money pages)
SERVICES = [
    ("uborka-kvartir", "Уборка квартир", "уборка квартир екатеринбург"),
    ("generalnaya-uborka", "Генеральная уборка квартиры", "генеральная уборка екатеринбург"),
    ("podderzhivayushchaya-uborka", "Поддерживающая уборка", "поддерживающая уборка екатеринбург"),
    ("uborka-posle-remonta", "Уборка после ремонта", "уборка после ремонта екатеринбург"),
    ("myte-okon", "Мытьё окон", "мытье окон екатеринбург"),
    ("uborka-ofisov", "Уборка офисов", "уборка офисов екатеринбург"),
    ("uborka-kottedzhey", "Уборка коттеджей и частных домов", "уборка коттеджа екатеринбург"),
    ("uborka-dlya-arendodateley", "Уборка посуточных квартир", "уборка посуточной квартиры екатеринбург"),
]
for slug, h1, q in SERVICES:
    add(1, "услуга", f"/{slug}/", f"{h1} {CITY}", q, "услугу оказываем, есть прайс")

# 2. Sub-services by flat size / object (strong commercial intent, «уборка 2 комнатной квартиры цена»)
SIZES = [("studiya", "студии"), ("1-komnatnaya", "однокомнатной квартиры"), ("2-komnatnaya", "двухкомнатной квартиры"), ("3-komnatnaya", "трёхкомнатной квартиры")]
for base, h, q in [("uborka-kvartir", "Уборка", "уборка"), ("generalnaya-uborka", "Генеральная уборка", "генеральная уборка"), ("uborka-posle-remonta", "Уборка после ремонта", "уборка после ремонта")]:
    for s, name in SIZES:
        add(2, "услуга×размер", f"/{base}/{s}/", f"{h} {name} — фиксированная цена", f"{q} {name.split()[0]} квартиры цена", "Wordstat ≥ 50/мес и своя фикс-цена", "фикс-цена, время, состав работ для этой площади")

# 3. Occasion pages
OCC = [
    ("uborka-posle-pereezda", "Уборка после переезда / перед заселением"), ("uborka-pered-prodazhey", "Уборка перед продажей или сдачей квартиры"),
    ("uborka-posle-zhilcov", "Уборка квартиры после жильцов"), ("uborka-posle-prazdnika", "Уборка после праздника"),
    ("uborka-novostroyki", "Уборка в новостройке после ремонта и приёмки"), ("udalenie-zapahov", "Удаление запахов, озонирование"),
    ("uborka-posle-zatopleniya", "Уборка после затопления"), ("uborka-posle-pozhara", "Уборка после пожара"),
    ("myte-balkonov", "Мытьё балконов и лоджий"), ("myte-panoramnyh-okon", "Мытьё панорамных окон"),
]
for slug, h1 in OCC:
    add(2, "повод/подуслуга", f"/{slug}/", f"{h1} {CITY}", h1.lower().split(" /")[0].split(",")[0], "услугу оказываем + Wordstat ≥ 30/мес", "после пожара/затопления — только если компания реально это делает")

# 4. B2B segments
B2B = [("uborka-magazinov", "магазинов"), ("uborka-skladov", "складов и производств"), ("uborka-kafe-restoranov", "кафе и ресторанов"),
       ("uborka-salonov-krasoty", "салонов красоты"), ("uborka-medicinskih-pomeshcheniy", "медицинских кабинетов и клиник"), ("uborka-podezdov", "подъездов для УК и ТСЖ"),
       ("uborka-dlya-zastroyshchikov", "квартир для застройщиков перед сдачей")]
for slug, name in B2B:
    add(3, "B2B", f"/{slug}/", f"Уборка {name} {CITY}", f"уборка {name.split()[0]} екатеринбург", "есть опыт/кейс + Wordstat ≥ 20/мес", "договор, безнал, акты, КП в PDF; медицина — СанПиН")

# 5. Districts — hub + one page per district ONLY with unique facts
DISTRICTS = [
    ("akademicheskiy", "Академический", "новостройки — после ремонта, первая уборка"), ("solnechnyy", "Солнечный", "новостройки"),
    ("novokolcovskiy", "Новокольцовский", "новостройки"), ("viz", "ВИЗ", "новостройки + старый фонд, офисы"),
    ("centr", "Центр", "офисы, БЦ, сталинки, посуточные квартиры"), ("uralmash", "Уралмаш", "старый фонд"), ("elmash", "Эльмаш", "старый фонд"),
    ("yugo-zapadnyy", "Юго-Западный", "панель + новостройки"), ("botanika", "Ботаника", "панель + новостройки"), ("uktus", "Уктус", "смешанный, частный сектор"),
    ("himmash", "Химмаш", "окраина — стоимость выезда"), ("vtorchermet", "Вторчермет", ""), ("pionerskiy", "Пионерский", ""), ("zhbi", "ЖБИ", ""),
    ("vtuzgorodok", "Втузгородок", ""), ("sortirovka", "Сортировка", ""), ("shirokaya-rechka", "Широкая Речка", "коттеджи + новостройки"),
    ("sinie-kamni", "Синие Камни", ""), ("zarechnyy", "Заречный", ""), ("kompressornyy", "Компрессорный", "окраина"),
]
add(2, "хаб районов", "/rayony/", f"Районы выезда {CITY}", "клининг екатеринбург районы", "есть карта зон и время выезда", "все районы списком, карта, единая цена или зоны")
for slug, name, note in DISTRICTS:
    add(3, "район", f"/rayony/{slug}/", f"Уборка квартир — {name}, Екатеринбург", f"уборка квартир {name.lower()}", "≥3 реальных заказа в районе (фото/отзыв) ИЛИ Wordstat ≥ 20/мес", note)

# 6. Suburbs — separate pages (people search «клининг верхняя пышма»)
SUBURBS = [("verhnyaya-pyshma", "Верхняя Пышма"), ("berezovskiy", "Берёзовский"), ("aramil", "Арамиль"), ("sredneuralsk", "Среднеуральск"),
           ("sysert", "Сысерть"), ("kolcovo", "Кольцово"), ("pervouralsk", "Первоуральск"), ("revda", "Ревда")]
for slug, name in SUBURBS:
    add(2, "пригород", f"/vyezd/{slug}/", f"Клининг и уборка — {name}", f"клининг {name.lower()}", "выезжаем туда + своя цена выезда", "конкурентов в выдаче мало — быстрый выход в топ")

# 7. Price / tool pages
for slug, h1, q in [("ceny", "Цены на уборку в Екатеринбурге", "цены на уборку квартиры екатеринбург"),
                    ("kalkulyator", "Калькулятор стоимости уборки", "калькулятор уборки квартиры"),
                    ("ceny/uborka-ofisa-za-m2", "Стоимость уборки офиса за м²", "стоимость уборки офиса за м2"),
                    ("chek-list-priemki-uborki", "Чек-лист приёмки уборки (PDF)", "чек лист уборки квартиры")]:
    add(1, "цены/инструмент", f"/{slug}/", h1, q, "реальный прайс заказчика")

# 8. Blog — informational, national demand in Yandex; brings audience for Метрика retargeting + links to services
BLOG = [
    ("chto-vhodit-v-generalnuyu-uborku", "Что входит в генеральную уборку квартиры", "generalnaya-uborka"),
    ("chto-vhodit-v-uborku-posle-remonta", "Что входит в уборку после ремонта", "uborka-posle-remonta"),
    ("skolko-stoit-uborka-kvartiry", "Сколько стоит уборка квартиры в Екатеринбурге в 2026 году", "ceny"),
    ("kak-vybrat-kliningovuyu-kompaniyu", "Как выбрать клининговую компанию и не попасть на мошенников", "uborka-kvartir"),
    ("kak-otmyt-stroitelnuyu-pyl", "Как отмыть строительную пыль после ремонта", "uborka-posle-remonta"),
    ("kak-otmyt-zatirku-i-kley-s-plitki", "Как отмыть затирку и клей с плитки", "uborka-posle-remonta"),
    ("kak-otmyt-kraski-s-plastikovyh-okon", "Как отмыть краску и монтажную пену с пластиковых окон", "myte-okon"),
    ("kak-pomyt-okna-bez-razvodov", "Как помыть окна без разводов", "myte-okon"),
    ("kak-chasto-myt-okna", "Как часто мыть окна и когда лучше это делать на Урале", "myte-okon"),
    ("kak-ubrat-zapah-v-kvartire", "Как убрать запах в квартире: табак, животные, сырость", "udalenie-zapahov"),
    ("kak-otmyt-duhovku", "Как отмыть духовку от жира", "ceny"),
    ("kak-otmyt-vytyazhku", "Как отмыть вытяжку и фильтр", "ceny"),
    ("kak-otmyt-izvestkovyy-nalet", "Как убрать известковый налёт (жёсткая вода в Екатеринбурге)", "generalnaya-uborka"),
    ("kak-ubrat-plesen-v-vannoy", "Как убрать плесень в ванной и швах плитки", "generalnaya-uborka"),
    ("grafik-uborki-kvartiry", "График уборки квартиры на неделю и месяц (PDF)", "podderzhivayushchaya-uborka"),
    ("uborka-pered-sdachey-kvartiry", "Как подготовить квартиру к сдаче или продаже", "uborka-pered-prodazhey"),
    ("priemka-kvartiry-v-novostroyke-uborka", "Приёмка квартиры в новостройке: когда звать клининг", "uborka-novostroyki"),
    ("normy-uborki-ofisa", "Как часто убирать офис: нормы и график", "uborka-ofisov"),
    ("kliningovyy-dogovor-dlya-yurlic", "Договор на уборку офиса: что проверить", "uborka-ofisov"),
    ("opasnye-smesi-bytovoy-himii", "Какую бытовую химию нельзя смешивать", "uborka-kvartir"),
]
for slug, h1, link in BLOG:
    add(2 if "skolko" in slug or "chto-vhodit" in slug else 3, "статья", f"/blog/{slug}/", h1, h1.lower(), "Wordstat ≥ 100/мес (по России)", f"ссылка на /{link}/ + калькулятор")

# 9. Trust pages
for slug, h1 in [("otzyvy", "Отзывы"), ("garantii", "Гарантии"), ("o-kompanii", "О компании"), ("kontakty", "Контакты"), ("vakansii", "Вакансии клинеров")]:
    add(1, "доверие", f"/{slug}/", h1, "", "данные заказчика", "вакансии — отдельно забирают запросы «клининг вакансии», чтобы они не шли на страницы услуг")

with open(os.path.join(DIR, "content_plan.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)

from collections import Counter
c = Counter((r["wave"], r["type"]) for r in rows)
lines = [f"Всего страниц: {len(rows)}"] + [f"волна {k[0]} | {k[1]}: {v}" for k, v in sorted(c.items())]
open(os.path.join(DIR, "plan_summary.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("\n".join(lines))
