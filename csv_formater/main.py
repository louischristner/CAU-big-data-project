import csv, sys



def getGamePlatform(game_platform: str):
    platform = game_platform.lower().replace(" ", "-")
    return platform[1:] if platform[0] == "-" else platform


def getGameUrlFromGameName(game_name: str):
    return game_name.lower()                    \
        .replace("/", "").replace("  ", " ")    \
        .replace("'", "").replace("  ", " ")    \
        .replace(":", "").replace("  ", " ")    \
        .replace("&", "").replace("  ", " ")    \
        .replace(".", "").replace("  ", " ")    \
        .replace(" ", "-")


def formatCsvResultFile(readfilepath, writefilepath, reviewfolderpath):
    with open(readfilepath, 'r', newline='') as csvfile:
        with open(writefilepath, 'w') as csvoutputfile:
            writer = csv.writer(csvoutputfile, lineterminator='\n')
            reader = csv.DictReader(csvfile)

            writer.writerow(reader.fieldnames + ['ign_review'])

            for row in reader:
                if row["user_review"] == "tbd":
                    print(row["name"], 'has not any user review')
                    continue

                game_name = getGameUrlFromGameName(row["name"])
                game_platform = getGamePlatform(row["platform"])
                review_path = "{0}/{1}-{2}.txt".format(reviewfolderpath, game_name, game_platform)

                try:
                    with open(review_path) as review_file:
                        lines = review_file.readlines()
                        row["ign_reviews"] = "".join(lines).replace("\n", " ")
                    writer.writerow(row.values())
                    print(review_path)
                except FileNotFoundError:
                    print(review_path, 'does not exist')


if __name__ == "__main__":
    if len(sys.argv) >= 4:
        formatCsvResultFile(sys.argv[1], sys.argv[2], sys.argv[3])
    else:
        print("\nERROR: invalid parameter(s)\n")
        print("Usage:\npython path/to/main.py path/to/metacritic_all_games_1999_2021.csv path/to/output_file.csv path/to/reviews_folder\n")
