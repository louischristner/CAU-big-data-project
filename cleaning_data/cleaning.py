file = open('metacritic_all_games_with_ign_reviews.csv', "r", encoding="utf-8")
line = file.readlines() #get the line of the file in the tab line
tab = [i.split(",") for i in line] #we split to have the row of the csv file independantly

#we want only the critics - it's the 7th row of the csv files
critics = []
for i in tab:
  #we transform our text in lowercase directly
  critics.append(i[-1].lower())

#print(critics)

#Removing punctuation
#Removal of Stop Word (using predefined libraries)
#Common word removal (as the name of the game or the names of the characters) ?
#Using librairie to spelling corrections
#Lemmatization : convert word into its root word
#Tokenization : divide the text into a sequence of words