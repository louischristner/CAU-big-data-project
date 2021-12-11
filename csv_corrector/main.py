import csv

def isNumber(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

def replaceInStr(value: str):
    return value    \
        .replace("&#8211;", "-")    \
        .replace("&#8212;", "-")    \
        .replace("&#8216;", "'")    \
        .replace("&#8217;", "'")    \
        .replace("&#8220;", "\"")   \
        .replace("&#8221;", "\"")   \
        .replace("&#8230;", "...")  \
        .replace("&#9734;", "*")    \
        .replace("&#131;", "â")     \
        .replace("&#133;", "...")   \
        .replace("&#151;", "-")     \
        .replace("&#163;", "£")     \
        .replace("&#191;", "é")     \
        .replace("&#224;", "à")     \
        .replace("&#233;", "é")     \
        .replace("&#241;", "ñ")     \
        .replace("&#252;", "ü")     \
        .replace("&#65279;", "")    \
        .replace("&#x2013.", ".")   \
        .replace("&#x2013;", "")    \
        .replace("&#x2014;", "-")    \
        .replace("&#x2026;", "...")

with open("../metacritic_all_games_with_ign_reviews.csv", 'r', newline='') as file:
    with open("../metacritic_all_games_with_ign_reviews_corrected.csv", 'w') as wfile:
        reader = csv.DictReader(file)
        writer = csv.writer(wfile, lineterminator='\n')

        writer.writerow(reader.fieldnames)

        for row in reader:
            row["summary"] = replaceInStr(row["summary"])
            row["ign_review"] = replaceInStr(row["ign_review"])
            writer.writerow(row.values())
