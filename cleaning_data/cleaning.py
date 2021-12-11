file = open('metacritic_all_games_with_ign_reviews.csv', "r", encoding="utf-8")
line = file.readlines() #get the line of the file
tab = [i.split(",") for i in line] 

#we want only the critics - it's the 7th row of the csv files
critics = []
for i in tab:
  critics.append(i[6])